<?php
// Router script for PHP built-in server
// Blocks direct access to sensitive files and routes all API requests to api.php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Block access to sensitive files
$blocked = ['/data.json', '/.env', '/.env.local', '/.env.production', '/.gitignore'];
foreach ($blocked as $path) {
    if (strcasecmp($uri, $path) === 0) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Forbidden']);
        return true;
    }
}

// Serve uploaded images
if (str_starts_with($uri, '/uploads/') && is_file(__DIR__ . $uri)) {
    return false; // let built-in server handle static file
}

// Route API requests
if ($uri === '/api.php' || $uri === '/') {
    require __DIR__ . '/api.php';
    return true;
}

// 404 for everything else
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not found']);
return true;
