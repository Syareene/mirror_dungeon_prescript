<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json; charset=utf-8', true, 405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // 1. パラメータの取得と検証
    $text = $_POST['text'] ?? '';
    $locations = $_POST['locations'] ?? ''; // 例: "1,2"
    $appear6to10 = isset($_POST['appear6to10']) ? (int)$_POST['appear6to10'] : 0;
    $appear11to15 = isset($_POST['appear11to15']) ? (int)$_POST['appear11to15'] : 0;

    if (empty($text)) {
        throw new Exception('パック名は必須です。');
    }

    // 2. 画像ファイルのアップロード処理
    $imagePath = 'images/secret/wip.png'; // 画像未指定時のデフォルト
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = $_FILES['image']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // 許可する拡張子
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($fileExtension, $allowedExtensions)) {
            throw new Exception('許可されていないファイル形式です。');
        }

        // ユニークなファイル名を生成して保存先のパスを決定
        $newFileName = md5(uniqid(microtime(), true)) . '.' . $fileExtension;
        
        // uploads ディレクトリは api/ の親ディレクトリ（プロジェクトルート）の下にある想定
        $uploadFileDir = '../uploads/';
        
        // uploads ディレクトリが存在しない場合は作成
        if (!is_dir($uploadFileDir)) {
            mkdir($uploadFileDir, 0777, true);
        }

        $dest_path = $uploadFileDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            // Webページ（md_prescript.html）から見た相対パスをDBに保存
            $imagePath = 'uploads/' . $newFileName;
        } else {
            throw new Exception('画像の保存に失敗しました。');
        }
    }

    // 3. データベースへの登録
    $sql = "INSERT INTO packs (text, locations, appear6to10, appear11to15, image_path) VALUES (:text, :locations, :appear6to10, :appear11to15, :image_path)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':text' => $text,
        ':locations' => $locations,
        ':appear6to10' => $appear6to10,
        ':appear11to15' => $appear11to15,
        ':image_path' => $imagePath
    ]);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => true, 'message' => 'パックを追加しました。']);
} catch (Exception $e) {
    header('Content-Type: application/json; charset=utf-8', true, 400);
    echo json_encode(['error' => $e->getMessage()]);
}
