var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var lastValue = {};
var lastChecked = false;

var graphs = {
    "graphTemperaturas" : {
        "data" : [],
        "shapes" : [
            {
                type : 'rect',
                xref : 'paper',
                yref : 'y',
                x0 : 0,
                x1 : 1,
                y0 : 18,
                y1 : 26,
                fillcolor : "#00FF00",
                opacity : 0.3,
                line : {
                    width : 0
                }
            }
        ]
    },
    "graphHumedades" : {
        "data" : [],
        "shapes" : [
            {
                type : 'rect',
                xref : 'paper',
                yref : 'y',
                x0 : 0,
                x1 : 1,
                y0 : 40,
                y1 : 50,
                fillcolor : "#00FF00",
                opacity : 0.3,
                line : {
                    width : 0
                }
            }
        ]
    },
    "graphTierras" : {
        "data" : [],
        "shapes" : [
            {
                type : 'rect',
                xref : 'paper',
                yref : 'y',
                x0 : 0,
                x1 : 1,
                y0 : 500,
                y1 : 520,
                fillcolor : "#FF0000",
                opacity : 0.4,
                line : {
                    width : 0
                }
            }
        ]
    }
};

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
            title : divGraph.substr(5),
            shapes : graphs[divGraph].shapes
        };

        Plotly.newPlot(divGraph, data, layout);

        if ( !lastChecked ) {
            divLastCheck = document.querySelector("#lastCheck span");
            divLastCheck.innerHTML = data[0].x[ data[0].x.length - 1 ];
            lastChecked = true;
        }
    }
}

// Construyo los gráficos
var i = 0;
for ( var graph in graphs ) {
    d3.tsv("get.php?t=" + i, type, parseData( graph ) );
    i++;
}

function type(d) {
    d.date = parseTime(d.createdb);
    d.value = +d.value;
    return d;
}

document.body.onload = function() {
    $loading = document.getElementById("loading");
    $loading.className += "hide";
}
