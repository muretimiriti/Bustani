<?php
// ── Security headers ─────────────────────────────────────────────────────────
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Security-Policy: default-src \'none\'');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

// ── CORS ─────────────────────────────────────────────────────────────────────
$allowedOrigins = array_filter(array_map('trim', explode(',',
    $_ENV['ALLOWED_ORIGINS'] ?? getenv('ALLOWED_ORIGINS') ?: 'http://localhost:5173,http://localhost:3000'
)));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: ' . $allowedOrigins[0]);
}
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

header('Content-Type: application/json');

// ── Block direct access to data.json ─────────────────────────────────────────
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('/data\.json/i', $requestUri)) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

define('DATA_FILE', __DIR__ . '/data.json');
define('UPLOAD_DIR', __DIR__ . '/uploads/');

// Load password from environment variable or .env.local file
$envFile = __DIR__ . '/.env.local';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (str_contains($line, '=')) {
            [$key, $val] = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($val);
        }
    }
}
define('ADMIN_PASSWORD', $_ENV['ADMIN_PASSWORD'] ?? getenv('ADMIN_PASSWORD') ?: '');

// Create uploads folder if missing
if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

// Initialize data file
if (!file_exists(DATA_FILE)) {
    file_put_contents(DATA_FILE, json_encode(['events' => [], 'news' => []]));
}

$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents(DATA_FILE), true);

// ── Reject oversized request bodies (max 1 MB JSON, files handled separately) ─
$rawInput = file_get_contents('php://input');
if ($method !== 'GET' && strlen($rawInput) > 1024 * 1024) {
    http_response_code(413);
    echo json_encode(['error' => 'Request body too large']);
    exit;
}

// ── GET: return all data ─────────────────────────────────────────────────────
if ($method === 'GET') {
    echo json_encode($data);
    exit;
}

// ── POST: create item (with optional image upload) ───────────────────────────
if ($method === 'POST') {
    // Multipart form (with file) comes via $_POST; JSON-only comes via php://input
    if (!empty($_FILES)) {
        $password = $_POST['password'] ?? '';
        $type     = $_POST['type']     ?? '';
        $item     = json_decode($_POST['item'] ?? '{}', true);
    } else {
        $body     = json_decode($rawInput, true);
        $password = $body['password'] ?? '';
        $type     = $body['type']     ?? '';
        $item     = $body['item']     ?? [];
    }

    if ($password !== ADMIN_PASSWORD) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    if (!in_array($type, ['events', 'news'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type']);
        exit;
    }

    // Sanitize text fields — strip tags to prevent stored XSS
    $textFields = ['title', 'description', 'body', 'location', 'date'];
    foreach ($textFields as $field) {
        if (isset($item[$field]) && is_string($item[$field])) {
            $item[$field] = strip_tags($item[$field]);
            // Enforce max length per field (title: 200, others: 10000)
            $maxLen = ($field === 'title') ? 200 : 10000;
            if (strlen($item[$field]) > $maxLen) {
                $item[$field] = substr($item[$field], 0, $maxLen);
            }
        }
    }

    // Handle multiple image uploads (5MB total limit per item)
    $item['images'] = []; // Start with empty images array
    $totalSize = 0;
    
    if (!empty($_FILES['images'])) {
        $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $imageCount = is_array($_FILES['images']['name']) ? count($_FILES['images']['name']) : 1;
        
        for ($i = 0; $i < $imageCount; $i++) {
            if ($_FILES['images']['error'][$i] !== UPLOAD_ERR_OK) continue;
            
            $size = $_FILES['images']['size'][$i];
            $totalSize += $size;
            
            if ($totalSize > 5 * 1024 * 1024) {
                http_response_code(400);
                echo json_encode(['error' => 'Total image size must be under 5 MB']);
                exit;
            }
            
            $mime = mime_content_type($_FILES['images']['tmp_name'][$i]);
            if (!in_array($mime, $allowed)) {
                http_response_code(400);
                echo json_encode(['error' => 'Only JPG, PNG, GIF and WEBP images are allowed']);
                exit;
            }
            
            $ext = pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION);
            // Path traversal protection: only allow safe extensions
            $allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            $ext = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $ext));
            if (!in_array($ext, $allowedExt)) $ext = 'jpg';
            $filename = uniqid('img_', true) . '.' . $ext;
            move_uploaded_file($_FILES['images']['tmp_name'][$i], UPLOAD_DIR . $filename);
            
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'];
            $imageUrl = $protocol . '://' . $host . '/uploads/' . $filename;
            $item['images'][] = $imageUrl;
        }
    }
    
    // Backward compatibility: if no images, set empty array
    if (empty($item['images'])) {
        $item['images'] = [];
    }

    $item['id']         = uniqid();
    $item['created_at'] = date('c');
    array_unshift($data[$type], $item);
    file_put_contents(DATA_FILE, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'item' => $item]);
    exit;
}

// ── DELETE: remove item (and its image) ─────────────────────────────────────
if ($method === 'DELETE') {
    $body     = json_decode($rawInput, true);
    $password = $body['password'] ?? '';
    $type     = $body['type']     ?? '';
    $id       = $body['id']       ?? '';

    if ($password !== ADMIN_PASSWORD) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    if (!in_array($type, ['events', 'news'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type']);
        exit;
    }

    foreach ($data[$type] as $item) {
        if ($item['id'] === $id) {
            // Delete all images (new format)
            if (!empty($item['images']) && is_array($item['images'])) {
                foreach ($item['images'] as $imageUrl) {
                    $filename = basename($imageUrl);
                    $path = realpath(UPLOAD_DIR . $filename);
                    if ($path && str_starts_with($path, realpath(UPLOAD_DIR)) && file_exists($path)) unlink($path);
                }
            }
            // Backward compatibility: delete single image_url if present
            if (!empty($item['image_url'])) {
                $filename = basename($item['image_url']);
                $path = realpath(UPLOAD_DIR . $filename);
                if ($path && str_starts_with($path, realpath(UPLOAD_DIR)) && file_exists($path)) unlink($path);
            }
        }
    }

    $data[$type] = array_values(array_filter($data[$type], fn($i) => $i['id'] !== $id));
    file_put_contents(DATA_FILE, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);