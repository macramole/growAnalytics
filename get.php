<?php

include_once("db.config.php");

$queryTypes = []
$queryTypes[0] = "created >= DATE_SUB(NOW(), INTERVAL 2 DAY) AND ( deviceID = 'temperaturaAfuera' OR deviceID = 'temperaturaAdentro' )";
$queryTypes[1] = "created >= DATE_SUB(NOW(), INTERVAL 2 DAY) AND ( deviceID = 'humedadAfuera' OR deviceID = 'humedadAdentro' )";
$queryTypes[2] = "created >= DATE_SUB(NOW(), INTERVAL 2 DAY) AND ( deviceID = 'humedadTierra1' OR deviceID = 'humedadTierra2' OR deviceID = 'humedadTierra3' )";

$sensorData = DB::query("
SELECT
	*,
	CONVERT_TZ(created,'+00:00','-03:00') as createdb
FROM
	sensors
WHERE
	" . $queryTypes[ $_GET["t"] ] );

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
