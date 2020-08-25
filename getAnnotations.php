<?php

include_once("db.config.php");

$from = $to = null;
if ( isset($_GET["from"]) ) {
	$from = $_GET["from"];
}
if ( isset($_GET["to"]) ) {
	$to = $_GET["to"];
}

$queryWhere = "fecha >= DATE_SUB(NOW(), INTERVAL 5 DAY)";
if ( $from != null ) {
	$queryWhere = "fecha BETWEEN %s AND %s";
}

$sql = "
SELECT
	*
FROM
	annotations
WHERE
	idProject = '2'
	AND $queryWhere
";

$annotations = DB::query($sql, $from, $to);

foreach( $annotations[0] as $fieldName => $field ) {
	echo "$fieldName\t";
}
echo "\r\n";

foreach ($annotations as $row) {
	foreach( $row as $field ) {
		echo "$field\t";
	}
	echo "\r\n";
}
