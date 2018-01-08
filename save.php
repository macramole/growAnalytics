<?php
	include_once("db.config.php");

	$data = json_decode(file_get_contents('php://input'), true);
	// print_r($data);
	// print($data["temperaturaAfuera"]);

	foreach ($data as $deviceID => $value) {
		DB::insert('sensors', array(
		  'deviceID' => $deviceID,
		  'value' => $value
		));
	}

	print("ok");
?>
