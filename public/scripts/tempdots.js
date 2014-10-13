margin = {top: 20, right: 20, bottom: 30, left: 40}
var view = {}
view.width = document.getElementsByClassName('visuals')[0].offsetWidth - margin.left - margin.right
view.height = document.getElementsByClassName('visuals')[0].offsetHeight - margin.top - margin.bottom

console.log("margin", margin);
console.log("view", view);

var data_url = '/sensors/1/readings/temp';

var jsonCircles = [
  { "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
  { "x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
  { "x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}];

var x = d3.time.scale()
    .range([0, view.width]);

var y = d3.scale.linear()
    .range([view.height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.temp); });

var svg = d3.select(".visuals").append("svg")
    .attr("width", view.width + margin.left + margin.right)
    .attr("height", view.height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(data_url, function(error, data) {
  data.forEach(function(d) {
    d.time = Date.parse(d.time);
  });

  x.domain(d3.extent(data, function(d) { return d.time; }));
  y.domain(d3.extent(data, function(d) { return d.temp; }));
  r = d3.scale.linear().domain(d3.extent(data, function(d) { return d.temp; })).range([5,10]),
  c = d3.scale.linear().domain(d3.extent(data, function(d) { return d.temp; })).range(["rgb(0, 0, 255)", "rgb(255, 0, 0)"]).interpolate(d3.interpolateRgb)

  //the x axis is transformed to the bottom of the view
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + view.height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temp (°C)");

  var circles = 
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle");

  var circleAttributes = 
    circles
       .attr("cx", function (d) { return x(d.time); })
       .attr("cy", function (d) { return y(d.temp); })
       .attr("r", function (d) { return r(d.temp); })
       .style("fill", function (d) { return c(d.temp); })
});