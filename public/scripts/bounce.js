var view = {}
view.width = document.getElementsByClassName('visuals')[0].offsetWidth;
view.height = document.getElementsByClassName('visuals')[0].offsetHeight


var data_url = '/sensors/1/readings/temp';
var data = []
for (i=0; i < 250; i++) {
    data.push({"x": Math.random(), "y": Math.random()})
}
var h = view.height
var vis = d3.select(".visuals")
    .append("svg:svg")
    .attr("width", view.width)
    .attr("height", view.height)
var 
x = d3.scale.linear().domain([0,1]).range([view.width / 2 - 500,view.width / 2 + 500]),
y = d3.scale.linear().domain([0,1]).range([0,h]),
r = d3.scale.linear().domain([0,1]).range([5,10]),
c = d3.scale.linear().domain([0,1]).range(["hsl(100, 40%, 40%)", "hsl(150, 80%, 70%)"]).interpolate(d3.interpolateHsl)
 
vis.selectAll("circle")
    .data(data)
    .enter().append("svg:circle")
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
    .attr("visibility", "hidden")
    .attr("r", function() { return r(Math.random()) })
var cnum = 100;
var y2 = d3.scale.linear().domain([0,1]).range([h/2 - cnum, h/2 + cnum])
var del = d3.scale.linear().domain([0,1]).range([0,1])
 
d3.selectAll("circle").transition()
    .attr("cx", function() { return x(Math.random()) })
    .attr("cy", function() { return y2(Math.random()) })
    .attr("visibility", "visible")
    .delay(function(d,i) { return i * del(Math.random()) })
    .duration(10000)
    .ease("elastic", 10, .45)

