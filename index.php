<!DOCTYPE html>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="css/growAnalytics.css">
</head>
<body>

<div id="loading">
	<img src="https://media.giphy.com/media/3oEjHOUcNRKgpqTHiM/giphy.gif"  />
	<h4>Loading data...</h4>
</div>

<ul id="dataLast">
	<li id="botones">
		<button id="btnRegar">Regar</button> <br>
		<button id="btnNoRegar">Dejar de regar</button>
	<li>
	<li id="dataLast_temperaturas">
		<div class="title">Temperatura</div>
		<ul>
			<li class="value">
				<label>Adentro: </label>
				<span id="dataLast_temperaturaAdentro"></span>
			</li>
			<li class="value">
				<label>Afuera: </label>
				<span id="dataLast_temperaturaAfuera"></span>
			</li>
		</ul>
	</li>
	<li id="dataLast_humedades">
		<div class="title">Humedad</div>
		<ul>
			<li class="value">
				<label>Adentro: </label>
				<span id="dataLast_humedadAdentro"></span>
			</li>
			<li class="value">
				<label>Afuera: </label>
				<span id="dataLast_humedadAfuera"></span>
			</li>
		</ul>
	</li>
	<li id="dataLast_tierras">
		<div class="title">Tierra</div>
		<ul>
			<li class="value">
				<label>Planta 1: </label>
				<span id="dataLast_humedadTierra1"></span>
			</li>
			<li class="value">
				<label>Planta 2: </label>
				<span id="dataLast_humedadTierra2"></span>
			</li>
			<li class="value">
				<label>Planta 3: </label>
				<span id="dataLast_humedadTierra3"></span>
			</li>

		</ul>
	</li>
</ul>

<div id="chart"></div>

<div id="lastCheck">Last Check: <span></span></div>

<script src="//d3js.org/d3.v4.min.js"></script>
<script src="js/plotly-latest.min.js"></script>
<script src="js/main.js" charset="utf-8"></script>

</body>
