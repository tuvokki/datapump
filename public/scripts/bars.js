
var width = 420,
    barHeight = 20;
var data_url = '/sensors/1/readings/temp';

var x = d3.scale.linear()
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width);

d3.json(data_url, function(error, data) {
  // console.log('data', data);
  x.domain([0, d3.max(data, function(d) {
    return d.temp;
  })]);
  console.log('x.domain', x.domain);
  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.temp); })
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return x(d.temp) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.temp; });
});
