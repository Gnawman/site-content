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

    var point0 = [50,450];
    var point1 = [100,425];
    var point2 = [150,350];
    var point3 = [200,300];
    var point4 = [250,225];
    var point5 = [300,200];
    var point6 = [350,150];
    var point7 = [400,125];
    var point8 = [450,50];

    var linepoints = [point0,point1,point2,point3,point4,point5,point6,point7,point8];

    chart += "<polyline points='"
    // plotting line
    for (var i=0; i<9; i++) {
        chart += linepoints[i][0]+","+linepoints[i][1]+" ";
    };
    chart += "' style='fill:none;stroke:#70A288;stroke-width:3' /></svg>";
    console.log(chart);
    document.getElementById('chart').innerHTML = chart;
};