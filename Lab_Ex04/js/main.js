var width = 500;
var height = 500;

// Canvas 
var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// data
d3.json("data/buildings.json")
  .then(function(data) {
    
    data.forEach(function(d) {
      d.height = +d.height;
    });

    console.log(data);

    //  X: building names
    var x = d3.scaleBand()
      .domain(data.map(function(d) {
        return d.name;
      }))
      .range([0, 400])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    //  Y: building heights
    var y = d3.scaleLinear()
      .domain([0, 828])
      .range([0, 400]);

    //  Color scale
    var color = d3.scaleOrdinal()
      .domain(data.map(function(d) {
        return d.name;
      }))
      .range(d3.schemeSet3);

    //  Create bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.name);
      })
      .attr("y", function(d) {
        return height - y(d.height);
      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return y(d.height);
      })
      .attr("fill", function(d) {
        return color(d.name);
      });
  })
  .catch(function(error) {
    console.error("Error loading data:", error);
  });
