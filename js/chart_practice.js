function chartGen() {
    var chart = "<svg height='500' width='500'>";
    chart += "<line x1='0' y1='500' x2='0' y1='0' style='stroke:#84857E;stroke-width:2' />";
    chart += "<line x1='0' y1='500' x2='500' y2='500' style='stroke:#84857E;stroke-width:2' />";
    // generating y-axis scale lines
    for (var i=450; i>-1; i-=50) {
        chart += "<line x1='0' y1='" + i + "' x2='10' y2='" + i + "' style='stroke:#84857E;stroke-width:2' />";
    }
    // generating x-axis scale lines
    for (var i=50; i<501; i+=50) {
        chart += "<line x1='"+ i +"' y1='500' x2='"+ i +"' y2='490' style='stroke:#84857E;stroke-width:2' />";
    }

    var linepoints = [50,450,100,425,150,450,200,250,250,225,300,200,350,150,400,125,450,50];

    chart += "<polyline points='"
    // plotting line
    for (var i=0; i<18; i++) {
        chart += linepoints[i]+",";
        i++;
        chart +=linepoints[i]+" ";
    };
    chart += "' style='fill:none;stroke:#70A288;stroke-width:3' /></svg>";
    console.log(chart);
    document.getElementById('chart').innerHTML = chart;
};