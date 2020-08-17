<?php

include_once("db.config.php");

$sensorData = DB::query("
	SELECT
		created,
		deviceID,
		value
	FROM
		sensors
	WHERE
		created = ( SELECT MAX(created) FROM sensors ) AND
		idProject = '2'");

foreach( $sensorData[0] as $fieldName => $field ) {
	echo "$fieldName\t";
}
echo "\r\n";

foreach ($sensorData as $row) {
	foreach( $row as $field ) {
		echo "$field\t";
	}
	echo "\r\n";
}
