var width = 500;
var height = 500;

// Create SVG
var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Load buildings data
d3.json("data/buildings.json")
  .then(function(data) {
   
    data.forEach(function(d) {
      d.height = +d.height;
    });

    console.log(data);

    // one rectangle per building
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return i * 30;   
      })
      .attr("y", function(d) {
        return height - d.height; 
      })
      .attr("width", 20)
      .attr("height", function(d) {
        return d.height;
      })
      .attr("fill", "steelblue");
  })
  .catch(function(err) {
    console.error("Error loading buildings data:", err);
  });
