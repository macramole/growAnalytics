var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var lastValue = {};

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

    Plotly.newPlot('graphTemperaturas', data);

    divLastCheck = document.querySelector("#lastCheck span");
    divLastCheck.innerHTML = data[0].x[ data[0].x.length - 1 ];
});

function type(d) {
    d.date = parseTime(d.createdb);
    d.value = +d.value;
    return d;
}
