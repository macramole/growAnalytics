<?php
	include_once("db.config.php");

	$data = json_decode(file_get_contents('php://input'), true);
	// print_r($data);
	// print($data["temperaturaAfuera"]);

	$projectID = $data["idProject"];

	foreach ($data as $deviceID => $value) {
		if ( $deviceID == "idProject" ) {
			continue;
		}

		DB::insert('sensors', array(
		  'deviceID' => $deviceID,
		  'value' => $value,
		  'idProject' => $projectID
		));
	}

	print("ok");
?>
