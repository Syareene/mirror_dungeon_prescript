<?php
// デバッグ用のエラー表示（本番環境では非表示にすることを推奨します）
ini_set('display_errors', 1);
error_reporting(E_ALL);

// データベースの接続情報
$host = 'localhost';
$dbname = 'mirror_dungeon';
$username = 'root'; // 実際の環境に合わせて書き換えてください
$password = '';     // 実際の環境に合わせて書き換えてください

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json; charset=utf-8', true, 500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
