<!DOCTYPE html>
<head>
	<meta charset="utf-8">
	<style>
		body {
			font-family: "Arial";
		}
		#lastCheck {
			padding-left: 3%;
			font-size: 0.8em;
		}
	</style>
</head>
<body>

<div id="myDiv"></div>
<div id="lastCheck">Last Check: <span></span></div>

<script src="//d3js.org/d3.v4.min.js"></script>
<script src="//cdn.plot.ly/plotly-latest.min.js"></script>
<script>
	var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
	var lastValue = {};

	d3.tsv("getLast.php", type, function(error, tsvData) {
	  	if (error) throw error;

		data = [];
		deviceIDs = [];

		for(row of tsvData) {
			lastValue[ row.deviceID ] = row.value;
		};

		console.log(lastValue);
	});

	function type(d) {
		d.date = parseTime(d.createdb);
	    d.value = +d.value;
	    return d;
	}

	d3.tsv("get.php", type, function(error, tsvData) {
	  	if (error) throw error;

		data = [];
		deviceIDs = [];

		for(row of tsvData) {
			if ( deviceIDs.indexOf(row.deviceID) == -1 ) {
				deviceIDs.push(row.deviceID);
			}
		};

		for( deviceID of deviceIDs ) {
			var dataByDeviceID = tsvData.filter(function(d) { return d.deviceID == deviceID });
			data.push({
				name : deviceID,
				x : dataByDeviceID.map( function(d) { return d.date } ),
				y : dataByDeviceID.map( function(d) { return d.value } ),
				type : "scatter"
			});
		}

		Plotly.newPlot('myDiv', data);

		divLastCheck = document.querySelector("#lastCheck span");
		divLastCheck.innerHTML = data[0].x[ data[0].x.length - 1 ];
	});

	function type(d) {
		d.date = parseTime(d.createdb);
	    d.value = +d.value;
	    return d;
	}
</script>

</body>


<!-- <!DOCTYPE html>
<meta charset="utf-8">
<style>

.axis--x path {
  display: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}

</style>
<svg width="960" height="500"></svg>
<script src="//d3js.org/d3.v4.min.js"></script>
<script src="plotly-latest.min.js"></script>
<script>

var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });


var data;

d3.tsv("get.php", type, function(error, tsvData) {
  	if (error) throw error;

	data = [];
	deviceIDs = [];

	for(row of tsvData) {
		if ( deviceIDs.indexOf(row.deviceID) == -1 ) {
			deviceIDs.push(row.deviceID);
		}
	};

	for( deviceID of deviceIDs ) {
		var dataByDeviceID = tsvData.filter(function(d) { return d.deviceID == deviceID });
		data.push({
			id : deviceID,
			values : dataByDeviceID
		});
	}

	x.domain(d3.extent(tsvData, function(d) { return d.date; }));

	// data = data.filter( function(d) {
	// 	return d.id == "temperaturaAdentro" ;
	// } );

	y.domain([
	d3.min(data, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
	d3.max(data, function(c) { return d3.max(c.values, function(d) { return d.value; }); })
	]);

	z.domain(data.map(function(c) { return c.id; }));

	g.append("g")
	  .attr("class", "axis axis--x")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x));

	g.append("g")
	  .attr("class", "axis axis--y")
	  .call(d3.axisLeft(y))
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", "0.71em")
	  .attr("fill", "#000")
	  .text("Temperature, ºF");

	var sensor = g.selectAll(".sensor")
	.data(data)
	.enter().append("g")
	  .attr("class", "sensor");

	sensor.append("path")
	  .attr("class", "line")
	  .attr("d", function(d) { return line(d.values); })
	  .style("stroke", function(d) { return z(d.id); });

	sensor.append("text")
	  .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
	  .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
	  .attr("x", 3)
	  .attr("dy", "0.35em")
	  .style("font", "10px sans-serif")
	  .text(function(d) { return d.id; });
});

function type(d) {
	d.date = parseTime(d.created);
    d.value = +d.value;
    return d;
}

</script> -->
<!--









<!DOCTYPE html>
<svg width="960" height="500"></svg>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script>

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

d3.tsv("get.php", function(d) {
  d.date = parseTime(d.created);
  d.value = +d.value;
  return d;
}, function(error, data) {
  if (error) throw error;

	console.log(data);

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.value; }));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .select(".domain")
      .remove();

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Value");

  g.data(data)
	  .enter()
	//   .filter(function(d) { return d.deviceID == "temperaturaAfuera" })
	  .append("path")
	      .attr("fill", "none")
	      .attr("stroke", "steelblue")
	      .attr("stroke-linejoin", "round")
	      .attr("stroke-linecap", "round")
	      .attr("stroke-width", 1.5)
		  .attr("d", function(d) { console.log("asd"); return d.value; } )
});

</script>





 -->
