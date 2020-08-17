var parseTime = d3.utcParse("%Y-%m-%d %H:%M:%S");
var parseTimeLocal = d3.timeParse("%Y-%m-%d %H:%M:%S");
var lastValue = {};
var lastChecked = false;
var firstDate = null;

let $btnRegar = document.querySelector("#btnRegar")
let $btnNoRegar = document.querySelector("#btnNoRegar")

let layout = null;

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

var deviceIDs = [
    "temperaturaAdentro",
    "temperaturaAfuera",
    "humedadAdentro",
    "humedadAfuera",
    "humedadTierra1",
    "humedadTierra2",
    "humedadTierra3"
];

$btnRegar.addEventListener('click', () => {
    fetch('regar.php?v=1')
        .then(function(response) {
            $btnRegar.textContent = "Regando..."
        })
})
$btnNoRegar.addEventListener('click', () => {
    fetch('regar.php?v=0')
        .then(function(response) {
            $btnRegar.textContent = "Regar"
        })
})

function getLastData() {
    d3.tsv("getLast.php", type, function(error, tsvData) {
        if (error) throw error;

        for(row of tsvData) {
            lastValue[ row.deviceID ] = row.value;

            var $span = document.getElementById("dataLast_" + row.deviceID);
            $span.innerHTML = row.value;
        };

        // console.log(lastValue);
    });
}
getLastData();
setInterval( getLastData, 10000 );

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

function parseAnnotations() {
    return function(error, tsvData) {
        console.log(tsvData);
        annotations = layout.annotations || [];
        for ( row of tsvData ) {
            annotations.push({
              x: row.x,
              y: 0,
              xref: 'x1',
              yref: 'paper',
              text: row.descripcion,
              showarrow: true,
              arrowhead: 0,
              ax: 0,
              ay: -700,
              captureevents: true
            });
        }
        Plotly.relayout('chart',{annotations: annotations})
    }
}

function parseData() {
    return function(error, tsvData) {
        if (error) throw error;

        var data = [];

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
                yaxis : yAxis,
                // line : {
                //     shape: "spline"
                // }
            });
        }

        // console.log(data);

        layout = {
            shapes : shapes,
            yaxis : {
                domain : [ 0, 0.25 ]
            },
            yaxis2 : {
                domain : [ 0.35, 0.60 ]
            },
            yaxis3 : {
                domain : [ 0.70, 0.95 ],
            },
            xaxis : {
                anchor : "y",
                showspikes : true,
                spikecolor : "#000000",
                spikethickness : 1,
                spikemode: "across",
                spikedash: "solid",

                showgrid: true,
                gridcolor: "#848484",
                tick0: "2000-01-15",
                dtick: "D1"

            },
            height: 800,
            margin : {
                l : 40,
                // r : 0,
                t : 20,
                // b : 80
            },
            annotations : [
                {
                    xref: "paper",
                    yref: "paper",
                    x : 0.5,
                    y : 1,
                    text : "Temperatura",
                    showarrow: false,
                    font : {
                        size: 17
                    }
                },
                {
                    xref: "paper",
                    yref: "paper",
                    x : 0.5,
                    y : 0.63,
                    text : "Humedad",
                    showarrow: false,
                    font : {
                        size: 17
                    }
                },
                {
                    xref: "paper",
                    yref: "paper",
                    x : 0.5,
                    y : 0.26,
                    text : "Tierra",
                    showarrow: false,
                    font : {
                        size: 17
                    }
                },
                // {
                //     x: new Date("2020-08-17T18:30:00").getTime(), //"2020-17-08 18:30:00",
                //     y: 0,
                //     xref: 'x1',
                //     yref: 'paper',
                //     text: 'Annotation Text',
                //     showarrow: true,
                //     arrowhead: 0,
                //     ax: 0,
                //     ay: -700,
                //     captureevents : true
                // }
            ]
        };

        Plotly.newPlot("chart", data, layout);

        d3.tsv("getAnnotations.php", typeAnnotations, parseAnnotations() );

        firstDate = data[0].x[0];

        var $graph = document.getElementById("chart");
        $graph.on("plotly_relayout", function(info) {
            // console.log(info);
            if ( info["xaxis.range[0]"] ) {
                getMoreData( info["xaxis.range[0]"].substr(0, 19) );
            }
        });
        $graph.on("plotly_click", function(info) {
            console.log(info)
            if ( info.event.ctrlKey ) {
                let descripcion = prompt("Descripcion")
                if ( descripcion != "" ) {
                    let sendData = {
                        "fecha" : info.points[0].x,
                        "descripcion" : descripcion
                    }

                    fetch("addAnnotation.php", {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(sendData), // data can be `string` or {object}!
                        headers: { 'Content-Type': 'application/json' }
                    })
                    // .then(res => res.text() )
                    .catch(error => console.error('Error:', error))

                    annotation = {
                      x: info.points[0].x,
                      y: 0,
                      xref: 'x1',
                      yref: 'paper',
                      text: descripcion,
                      showarrow: true,
                      arrowhead: 0,
                      ax: 0,
                      ay: -700,
                      captureevents: true
                    }

                    annotations = layout.annotations || [];
                    annotations.push(annotation);
                    Plotly.relayout('chart',{annotations: annotations})
                }
            }
        });
        $graph.on("plotly_clickannotation", function(info) {
            if ( confirm("Delete?") ) {
                console.log(info)
                fecha = { "fecha" : info.fullAnnotation.x }

                fetch("removeAnnotation.php", {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(fecha), // data can be `string` or {object}!
                    headers: { 'Content-Type': 'application/json' }
                })
                // .then(res => res.text() )
                .catch(error => console.error('Error:', error))

                annotations = layout.annotations || [];
                annotations.splice( info.index, 1 )
                Plotly.relayout('chart',{annotations: annotations})
            }
        })

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
function typeAnnotations(d) {
    d.x = parseTimeLocal(d.fecha).getTime();
    return d;
}

document.body.onload = function() {
    $loading = document.getElementById("loading");
    $loading.className += "hide";
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
