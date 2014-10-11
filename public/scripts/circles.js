var view = {}
view.width = document.getElementsByClassName('visuals')[0].offsetWidth;
view.height = document.getElementsByClassName('visuals')[0].offsetHeight


var data_url = '/sensors/1/readings/temp';
var data = [],
bata = []
bata.push({"x": Math.random(), "y": Math.random()})
for (i=0; i < 500; i++) {
    data.push({"x": Math.random(), "y": Math.random()})
}
var h = view.height
var vis = d3.select(".visuals")
    .append("svg:svg")
    .attr("width", view.width)
    .attr("height", view.height)
var 
x = d3.scale.linear().domain([0,1]).range([view.width / 2 - 400,view.width / 2 + 400]),
y = d3.scale.linear().domain([0,1]).range([0,h]),
r = d3.scale.linear().domain([0,1]).range([5,10]),
c = d3.scale.linear().domain([0,1]).range(["hsl(250, 50%, 50%)", "hsl(350, 100%, 50%)"]).interpolate(d3.interpolateHsl)
 
vis.selectAll("circle")
    .data(bata)
    .enter().append("svg:circle")
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
    .attr("visibility", "hidden")
    .attr("r", function() { return r(Math.random()) })
  
var y2 = d3.scale.linear().domain([0,1]).range([h/2 - 20, h/2 + 20])
var del = d3.scale.linear().domain([0,1]).range([0,1])
 
d3.selectAll("circle").transition()
    .attr("cx", function() { return x(Math.random()) })
    .attr("cy", function() { return y2(Math.random()) })
    .attr("visibility", "visible")
    .delay(function(d,i) { return i * del(Math.random()) })
    .duration(1000)
    .ease("elastic", 10, .45)
vis.selectAll("circle")
    .data(data)
    .enter().append("svg:circle")
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
    // .attr("visibility", "hidden")
    .attr("r", function() { return r(Math.random()) })
    .on("mouseover", function() {
        d3.select(this).transition()
        .attr("cy", function() { return y2(Math.random()) })
        .delay(0)
        .duration(2000)
        .ease("elastic", 10, .3)
    })

