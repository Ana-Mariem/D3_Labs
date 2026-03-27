var margin = {
  left: 100,
  right: 10,
  top: 10,
  bottom: 100
};

var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

// SVG
var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

// Group
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data
d3.json("data/revenues.json").then(function(data) {

  // Parse numbers
  data.forEach(function(d) {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  console.log(data);

  // X scale
  var x = d3.scaleBand()
    .domain(data.map(function(d) {
      return d.month;
    }))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  // Y scale
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d.revenue;
    })])
    .range([height, 0]);

  // Bottom axis
  var xAxis = d3.axisBottom(x);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Left axis with money format
  var yAxis = d3.axisLeft(y)
    .ticks(10)
    .tickFormat(function(d) {
      return "$" + (d / 1000) + "K";
    });

  g.append("g")
    .call(yAxis);

  // Bars
  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return x(d.month);
    })
    .attr("y", function(d) {
      return y(d.revenue);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(d) {
      return height - y(d.revenue);
    })
    .attr("fill", "#c9cc00");

  // X label
  g.append("text")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("text-anchor", "middle")
    .attr("font-size", "35px")
    .text("Month");

  // Y label
  g.append("text")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("font-size", "35px")
    .text("Revenue (dlls)");

}).catch(function(error) {
  console.error("Error loading data:", error);
});