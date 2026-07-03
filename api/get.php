<?php
require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT id, text, locations, appear6to10, appear11to15, image_path FROM packs");
    $rawPacks = $stmt->fetchAll();

    $packs = [];
    foreach ($rawPacks as $row) {
        // locations (文字列 "1,2") を配列 [1, 2] に変換
        $locations = array_map('intval', array_filter(explode(',', $row['locations']), 'strlen'));

        $packs[] = [
            'id' => (int)$row['id'],
            'text' => $row['text'],
            'locations' => $locations,
            'appear6to10' => (bool)$row['appear6to10'],
            'appear11to15' => (bool)$row['appear11to15'],
            'imagePath' => $row['image_path'],
            'isActive' => true // フロントエンドでの初期選択状態
        ];
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($packs, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    header('Content-Type: application/json; charset=utf-8', true, 500);
    echo json_encode(['error' => $e->getMessage()]);
}
