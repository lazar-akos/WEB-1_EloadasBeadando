<?php
$host = 'ftp.nethely.hu';
$dbname = 'adatb1234';
$user = 'felhasznGAMF';
$pass = 'weui2478zrfh2i3ur78g87e';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Hiba a csatlakozáskor: " . $e->getMessage());
}
?>