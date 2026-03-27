//Exercise 2: Creating elements with parameters

var width = 400;
var height = 400;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var data = [25, 20, 15, 10, 5];

svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return i * 45;
    })
    .attr("y", function(d) {
        return height - d;
    })
    .attr("width", 40)
    .attr("height", function(d) {
        return d;
    })
    .attr("fill", "steelblue");
