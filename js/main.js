var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var lastValue = {};
var lastChecked = false;

// d3.tsv("getLast.php", type, function(error, tsvData) {
//     if (error) throw error;
//
//     data = [];
//     deviceIDs = [];
//
//     for(row of tsvData) {
//         lastValue[ row.deviceID ] = row.value;
//     };
//
//     console.log(lastValue);
// });
//
// function type(d) {
//     d.date = parseTime(d.createdb);
//     d.value = +d.value;
//     return d;
// }

function parseData( divGraph ) {
    return function(error, tsvData) {
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

        var layout = {
            title : divGraph.substr(5)
        };

        Plotly.newPlot(divGraph, data, layout);

        if ( !lastChecked ) {
            divLastCheck = document.querySelector("#lastCheck span");
            divLastCheck.innerHTML = data[0].x[ data[0].x.length - 1 ];
            lastChecked = true;
        }
    }
}

d3.tsv("get.php?t=0", type, parseData("graphTemperaturas") );
d3.tsv("get.php?t=1", type, parseData("graphHumedades") );
d3.tsv("get.php?t=2", type, parseData("graphTierras") );


function type(d) {
    d.date = parseTime(d.createdb);
    d.value = +d.value;
    return d;
}
