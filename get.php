<?php

include_once("db.config.php");

$sensorData = DB::query("SELECT *, CONVERT_TZ(created,'+00:00','-03:00') as createdb FROM sensors");

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
