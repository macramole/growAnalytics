<?php

include_once("db.config.php");

$sql = "
SELECT
	*
FROM
	annotations
WHERE
	idProject = '2'
";

$annotations = DB::query($sql);

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
