var margin = { left: 100, right: 10, top: 10, bottom: 100 };

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

// SVG + group
var g = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scales
var x = d3.scaleBand()
  .range([0, width])
  .padding(0.2);

var y = d3.scaleLinear()
  .range([height, 0]);

// Axis groups
var xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g")
  .attr("class", "y axis");

// X label
g.append("text")
  .attr("x", width / 2)
  .attr("y", height + 60)
  .attr("text-anchor", "middle")
  .attr("font-size", "35px")
  .text("Month");

// Y label
var yLabel = g.append("text")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .attr("font-size", "35px")
  .text("Revenue");

// data
d3.json("data/revenues.json").then(function(data) {
  data.forEach(function(d) {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  update(data);

  d3.interval(function() {
    update(data);
    flag = !flag;
  }, 1000);

}).catch(function(error) {
  console.log(error);
});

function update(data) {
  var value = flag ? "revenue" : "profit";
  var label = flag ? "Revenue" : "Profit";

  // Update domains
  x.domain(data.map(function(d) {
    return d.month;
  }));

  y.domain([0, d3.max(data, function(d) {
    return d[value];
  })]);

  // Axes
  var xAxisCall = d3.axisBottom(x);
  xAxisGroup.call(xAxisCall);

  var yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat(function(d) {
      return "$" + (d / 1000) + "K";
    });

  yAxisGroup.call(yAxisCall);

  // Update y label
  yLabel.text(label);

  // Join 
  var rects = g.selectAll("rect")
    .data(data);

  // Exit
  rects.exit().remove();

  // Update
  rects
    .attr("x", function(d) {
      return x(d.month);
    })
    .attr("y", function(d) {
      return y(d[value]);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(d) {
      return height - y(d[value]);
    })
    .attr("fill", "#c9cc00");

  // Enter
  rects.enter()
    .append("rect")
    .attr("x", function(d) {
      return x(d.month);
    })
    .attr("y", function(d) {
      return y(d[value]);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(d) {
      return height - y(d[value]);
    })
    .attr("fill", "#c9cc00");
}