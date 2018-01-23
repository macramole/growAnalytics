<?php

include_once("db.config.php");

$from = $to = null;
if ( isset($_GET["from"]) ) {
	$from = $_GET["from"];
}
if ( isset($_GET["to"]) ) {
	$to = $_GET["to"];
}

$queryWhere = "created >= DATE_SUB(NOW(), INTERVAL 1 DAY)";
if ( $from != null ) {
	$queryWhere = "created BETWEEN %s AND %s";
}

// $sql = "
// SELECT
// 	*,
// 	CONVERT_TZ(created,'+00:00','-03:00') as createdb
// FROM
// 	sensors
// WHERE
// 	" . $queryTypes[ $_GET["t"] ];
$sql = "
SELECT
	created,
	deviceID,
	value
FROM
	sensors
WHERE
	$queryWhere";

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
