<?php
	$regar = false;

	if ( $_GET["v"] == "1" ) {
		$regar = true;
	}

	$response = array( "regar" => $regar, "ventilador" => false  );

	$fp = fopen('recepcion.json', 'w');
	fwrite($fp, json_encode($response));
	fclose($fp);
?>
