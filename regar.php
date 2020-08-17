<?php
	$regar = 0;

	if ( $_GET["v"] == "1" ) {
		$regar = 1
	}

	$response = array( "regar" => $regar, "ventilador" => 0  );

	$fp = fopen('recepcion.json', 'w');
	fwrite($fp, json_encode($response));
	fclose($fp);
?>
