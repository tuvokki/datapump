var svg = dimple.newSvg("#chartContainer", 590, 400);
  d3.json("/sensors/bell/500", function (data) {
  // data = dimple.filterData(data, "Owner", ["Aperture", "Black Mesa"])
  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(60, 30, 505, 305);
    myChart.addMeasureAxis("y", "Number");
  // x.addOrderRule("Date");
    myChart.addMeasureAxis("x", "Value");
    // myChart.addMeasureAxis("z", "Size");
  var s = myChart.addSeries(["Side"], dimple.plot.bubble);
  myChart.draw();
});
