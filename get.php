<?php

include_once("db.config.php");

$from = $to = null;
if ( isset($_GET["from"]) ) {
	$from = $_GET["from"];
}
if ( isset($_GET["to"]) ) {
	$to = $_GET["to"];
}

//$queryWhere = '1' esto es lo que estaba para que funcione la demo
$queryWhere = "created >= DATE_SUB(NOW(), INTERVAL 5 DAY)";
if ( $from != null ) {
	$queryWhere = "created BETWEEN %s AND %s";
}

// $sql = "
// SELECT
// 	created,
// 	deviceID,
// 	value
// FROM
// 	sensors
// WHERE
// 	$queryWhere AND
// 	SECOND(created) BETWEEN 0 AND 3
// ORDER BY
// 	id";

$sql = "
SELECT
	created,
	deviceID,
	value
FROM
	sensors
WHERE
	$queryWhere AND
	idProject = '2'
ORDER BY
	id";

$sensorData = DB::query($sql, $from, $to);

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
