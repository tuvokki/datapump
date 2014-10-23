var svg = dimple.newSvg("#chartContainer", 590, 400);
  d3.json("/sensors/doors", function (data) {
    data = dimple.filterData(data, "Date", "01/12/2012");
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(60, 30, 500, 330)
    myChart.addMeasureAxis("x", "Unit Sales");
    myChart.addMeasureAxis("y", "Operating Profit");
    myChart.addSeries(["Band member", "Album"], dimple.plot.bubble);
    myChart.addLegend(200, 10, 360, 20, "right");
    myChart.draw();
  });
