// Exercise 3: Loading data from file

var width = 400;
var height = 400;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height);



d3.csv("data/ages.csv")
    .then(function(data) {
        console.log("CSV:", data);
    })
    .catch(function(err) {
        console.error("CSV error:", err);
    });    

d3.tsv("data/ages.tsv")
    .then(function(data) {
        console.log("TSV:", data);
    })
    .catch(function(err) {
        console.error("TSV error:", err);
    });     
    
d3.json("data/ages.json")
    .then(function(data) {
        data.forEach(function(d) {
            d.age = +d.age;
        });
        
        console.log("JSON parsed:", data);


    
svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) {
        return 60 + i * 70;   
    })
    .attr("cy", height / 2)
    .attr("r", function(d) {
        return d.age * 2;
    })
    .attr("fill", function(d) {
        return d.age > 10 ? "orange" : "blue";
    });
    })
    .catch(function(err) {
        console.error("JSON error:", err);
    });
