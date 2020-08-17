<?php

include_once("db.config.php");

$data = json_decode(file_get_contents('php://input'), true);

DB::delete('annotations', 'fecha=%s', $data["fecha"]);

print("ok");
