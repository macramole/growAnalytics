var parseTime = d3.utcParse("%Y-%m-%d %H:%M:%S");
var parseTimeLocal = d3.timeParse("%Y-%m-%d %H:%M:%S");
var lastValue = {};
var lastChecked = false;
var firstDate = null;

var shapes = [
    { //tierra
        type : 'rect',
        xref : 'paper',
        yref : 'y',
        x0 : 0,
        x1 : 1,
        y0 : 500,
        y1 : 530,
        fillcolor : "#FF0000",
        opacity : 0.3,
        line : {
            width : 0
        }
    },
    { //humedad
        type : 'rect',
        xref : 'paper',
        yref : 'y2',
        x0 : 0,
        x1 : 1,
        y0 : 40,
        y1 : 50,
        fillcolor : "#00FF00",
        opacity : 0.3,
        line : {
            width : 0
        }
    },
    { //temperatura
        type : 'rect',
        xref : 'paper',
        yref : 'y3',
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
];

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

function getMoreData( dateFrom ) {
    var dateTo = firstDate.toMysqlFormat();

    dateFrom = parseTimeLocal(dateFrom);
    dateFrom = dateFrom.toMysqlFormat();


    // console.log("dateFrom");
    // console.log(dateFrom);
    // console.log("dateTo");
    // console.log(dateTo);

    d3.tsv("get.php?from=" + dateFrom + "&to=" + dateTo, type, updateData() );
}

function updateData() {
    return function(error, tsvData) {
        if (error) throw error;

        var deviceIDs = [];

        for(row of tsvData) {
            if ( deviceIDs.indexOf(row.deviceID) == -1 ) {
                deviceIDs.push(row.deviceID);
            }
        };

        for( deviceIDi in deviceIDs ) {
            var deviceID = deviceIDs[deviceIDi]
            var dataByDeviceID = tsvData.filter(function(d) { return d.deviceID == deviceID });
            var newData = {
                x : [dataByDeviceID.map( function(d) { return d.date } )],
                y : [dataByDeviceID.map( function(d) { return d.value } )]
            };

            Plotly.prependTraces("chart", newData, [ Number(deviceIDi) ]);

            firstDate = newData.x[0][0];
        }
    }
}

function parseData() {
    return function(error, tsvData) {
        if (error) throw error;

        var data = [];
        var deviceIDs = [];

        for(row of tsvData) {
            if ( deviceIDs.indexOf(row.deviceID) == -1 ) {
                deviceIDs.push(row.deviceID);
            }
        };

        for( deviceID of deviceIDs ) {
            var dataByDeviceID = tsvData.filter(function(d) { return d.deviceID == deviceID });
            var yAxis = "y";

            if ( deviceID == "temperaturaAdentro" || deviceID == "temperaturaAfuera" ) {
                yAxis = "y3";
            } else if ( deviceID == "humedadAdentro" || deviceID == "humedadAfuera" ) {
                yAxis = "y2";
            }

            data.push({
                name : deviceID,
                x : dataByDeviceID.map( function(d) { return d.date } ),
                y : dataByDeviceID.map( function(d) { return d.value } ),
                type : "scatter",
                yaxis : yAxis
            });
        }

        var layout = {
            title : "Series de tiempo",
            shapes : shapes,
            yaxis : {
                domain : [ 0, 0.3 ]
            },
            yaxis2 : {
                domain : [ 0.4, 0.6 ]
            },
            yaxis3 : {
                domain : [ 0.7, 1 ],
            },
            xaxis : {
                anchor : "y"
            },
            height: 800,
        };

        Plotly.newPlot("chart", data, layout);

        firstDate = data[0].x[0];

        var $graph = document.getElementById("chart");
        $graph.on("plotly_relayout", function(info) {
            console.log(info);
            if ( info["xaxis.range[0]"] ) {
                getMoreData( info["xaxis.range[0]"].substr(0, 19) );
            }
        });

        if ( !lastChecked ) {
            divLastCheck = document.querySelector("#lastCheck span");
            divLastCheck.innerHTML = data[0].x[ data[0].x.length - 1 ];
            lastChecked = true;
        }
    }
}

// Construyo los gráficos
d3.tsv("get.php", type, parseData());

function type(d) {
    d.date = parseTime(d.created);
    d.value = +d.value;
    return d;
}

document.body.onload = function() {
    $loading = document.getElementById("loading");
    $loading.className += "hide";
}

/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
