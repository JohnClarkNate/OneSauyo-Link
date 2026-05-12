<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'sauyo');
define('DB_PORT', 3306);

if (PHP_SAPI !== 'cli') {
    header('Access-Control-Allow-Origin: http://localhost:8080');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json');
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (PHP_SAPI !== 'cli' && session_status() === PHP_SESSION_NONE && !headers_sent()) {
    session_start();
}

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    if ($conn->connect_error) {
        throw new Exception('Connection failed: ' . $conn->connect_error);
    }

    $conn->set_charset('utf8mb4');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit();
}

function sendResponse($status, $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode(array_merge(['status' => $status], $data));
    exit();
}
?>
