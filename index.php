<!DOCTYPE html>
<head>
	<meta charset="utf-8">
	<style>
		body {
			font-family: "Arial";
			margin: 0;
		}
		#lastCheck {
			padding-left: 3%;
			font-size: 0.8em;
		}
		#loading {
			background-color: #FFCBD2;
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: 1900;
			text-align: center;
		}
		#loading h4 {
			margin-top: -4em;
		}
		#loading.hide {
			visibility: hidden;
		}
	</style>
</head>
<body>

<div id="loading">
	<img src="https://media.giphy.com/media/3oEjHOUcNRKgpqTHiM/giphy.gif"  />
	<h4>Loading data...</h4>
</div>

<!-- <div id="graphTemperaturas"></div>
<div id="graphHumedades"></div>
<div id="graphTierras"></div> -->

<div id="chart"></div>

<div id="lastCheck">Last Check: <span></span></div>

<script src="//d3js.org/d3.v4.min.js"></script>
<script src="js/plotly-latest.min.js"></script>
<script src="js/main.js" charset="utf-8"></script>

</body>
