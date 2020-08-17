<?php

include_once("db.config.php");

$data = json_decode(file_get_contents('php://input'), true);

DB::insert('annotations', array(
  'idProject' => 2,
  'fecha' => $data["fecha"],
  'descripcion' => $data["descripcion"]
));

print("ok");
