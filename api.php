<?php
header('Content-Type: application/json');
require_once 'db_config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $conn->query("SELECT fkod, nev, szul, meghal FROM kutato ORDER BY nev");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;

    case 'POST':
        $adat = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("INSERT INTO kutato (nev, szul, meghal) VALUES (?, ?, ?)");
        $stmt->execute([$adat['nev'], $adat['szul'], $adat['meghal']]);
        echo json_encode(['status' => 'success']);
        break;

    case 'PUT':
        $adat = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("UPDATE kutato SET nev=?, szul=?, meghal=? WHERE fkod=?");
        $stmt->execute([$adat['nev'], $adat['szul'], $adat['meghal'], $adat['fkod']]);
        echo json_encode(['status' => 'updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM kutato WHERE fkod = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'deleted']);
        break;
}
?>