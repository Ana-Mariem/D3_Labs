var outerWidth = 600;
var outerHeight = 400;

var margin = {
  left: 100,
  right: 10,
  top: 10,
  bottom: 100
};

var width = outerWidth - margin.left - margin.right;
var height = outerHeight - margin.top - margin.bottom;

// SVG
var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", outerWidth)
  .attr("height", outerHeight);

// Group shifted by margins
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// data
d3.json("data/buildings.json")
  .then(function(data) {
    
    data.forEach(function(d) {
      d.height = +d.height;
    });

    console.log(data);

    // X scale
    var x = d3.scaleBand()
      .domain(data.map(function(d) {
        return d.name;
      }))
      .range([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.3);

  
    var y = d3.scaleLinear()
      .domain([0, 828])
      .range([height, 0]);

  
    var rects = g.selectAll("rect")
      .data(data);

    rects.enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.name);
      })
      .attr("y", function(d) {
        return y(d.height);
      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return height - y(d.height);
      })
      .attr("fill", "grey");

    // Bottom axis
    var xAxis = d3.axisBottom(x);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 10)
      .attr("x", -5)
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");

    // Left axis
    var yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(function(d) {
        return d + "m";
      });

    g.append("g")
      .call(yAxis);

    // X-axis label
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 140)
      .attr("text-anchor", "middle")
      .attr("font-size", "25px")
      .text("The word's tallest buildings");

    // Y-axis label
    g.append("text")
      .attr("x", -(height / 2))
      .attr("y", -60)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("font-size", "25px")
      .text("Height (m)");
  })
  .catch(function(error) {
    console.error("Error loading data:", error);
  });