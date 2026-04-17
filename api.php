<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

header('Content-Type: application/json');

define('DATA_FILE', __DIR__ . '/data.json');
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('ADMIN_PASSWORD', 'rotary2025'); // CHANGE THIS

// Create uploads folder if missing
if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

// Initialize data file
if (!file_exists(DATA_FILE)) {
    file_put_contents(DATA_FILE, json_encode(['events' => [], 'news' => []]));
}

$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents(DATA_FILE), true);

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
        $body     = json_decode(file_get_contents('php://input'), true);
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
            $filename = uniqid('img_', true) . '.' . strtolower($ext);
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
    $body     = json_decode(file_get_contents('php://input'), true);
    $password = $body['password'] ?? '';
    $type     = $body['type']     ?? '';
    $id       = $body['id']       ?? '';

    if ($password !== ADMIN_PASSWORD) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    foreach ($data[$type] as $item) {
        if ($item['id'] === $id) {
            // Delete all images (new format)
            if (!empty($item['images']) && is_array($item['images'])) {
                foreach ($item['images'] as $imageUrl) {
                    $filename = basename($imageUrl);
                    $path = UPLOAD_DIR . $filename;
                    if (file_exists($path)) unlink($path);
                }
            }
            // Backward compatibility: delete single image_url if present
            if (!empty($item['image_url'])) {
                $filename = basename($item['image_url']);
                $path = UPLOAD_DIR . $filename;
                if (file_exists($path)) unlink($path);
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