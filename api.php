<?php
require_once 'db_config.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->query("SELECT fkod, nev, szul, meghal FROM kutato ORDER BY nev");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action']) ? $data['action'] : '';

    try {
        if ($action === 'delete') {
            $stmt = $conn->prepare("DELETE FROM kutato WHERE fkod = ?");
            $stmt->execute([$data['fkod']]);
            echo json_encode(["message" => "Sikeres törlés"]);
            exit;
        }

        if ($action === 'update') {
            $stmt = $conn->prepare("UPDATE kutato SET nev=?, szul=?, meghal=? WHERE fkod=?");
            $stmt->execute([
                $data['nev'], 
                (int)$data['szul'], 
                !empty($data['meghal']) ? (int)$data['meghal'] : null, 
                (int)$data['fkod']
            ]);
            echo json_encode(["message" => "Sikeres frissítés"]);
            exit;
        }

        if ($action === 'create') {
            $maxIdRes = $conn->query("SELECT MAX(fkod) as maxid FROM kutato");
            $nextId = $maxIdRes->fetch()['maxid'] + 1;
            
            $stmt = $conn->prepare("INSERT INTO kutato (fkod, nev, szul, meghal) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $nextId, 
                $data['nev'], 
                (int)$data['szul'], 
                !empty($data['meghal']) ? (int)$data['meghal'] : null
            ]);
            echo json_encode(["message" => "Sikeres hozzáadás"]);
            exit;
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
        exit;
    }
}
?>