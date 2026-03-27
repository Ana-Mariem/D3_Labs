var margin = { left: 100, right: 10, top: 10, bottom: 100 };

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var continents = ["Africa", "Americas", "Asia", "Europe"];

var x = d3.scaleLog()
  .domain([142, 150000])
  .range([0, width]);

var y = d3.scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

var area = d3.scaleLinear()
  .domain([2000, 1400000000])
  .range([25 * Math.PI, 1500 * Math.PI]);

var color = d3.scaleOrdinal()
  .domain(continents)
  .range([
    "#f4a6a6",
    "#bcd7f5",
    "#c7ddb5",
    "#d8c3e6"
  ]);

var xAxisGroup = g.append("g")
  .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g");

// X label
g.append("text")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)");

// Y label
g.append("text")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .text("Life Expectancy (Years)");

// Year label
var yearLabel = g.append("text")
  .attr("x", width - 10)
  .attr("y", height - 10)
  .attr("text-anchor", "end")
  .attr("font-size", "40px")
  .attr("fill", "gray")
  .text("");

// Legend
var legend = g.selectAll(".legend")
  .data(continents)
  .enter()
  .append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) {
    return "translate(" + (width - 80) + "," + (i * 20) + ")";
  });

legend.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", function(d) {
    return color(d);
  });

legend.append("text")
  .attr("x", 15)
  .attr("y", 10)
  .text(function(d) {
    return d;
  });

d3.json("data/data.json").then(function(data) {
  const formattedData = data.map(year => {
    return {
      year: +year.year,
      countries: year.countries
        .filter(country => {
          return country.income && country.life_exp;
        })
        .map(country => {
          country.income = +country.income;
          country.life_exp = +country.life_exp;
          country.population = +country.population;
          return country;
        })
    };
  });

  console.log(formattedData);

  var yearIndex = 0;

  update(formattedData[0]);

  d3.interval(function() {
    update(formattedData[yearIndex]);
    yearIndex++;

    if (yearIndex >= formattedData.length) {
      yearIndex = 0;
    }
  }, 1000);

}).catch(function(error) {
  console.log(error);
});

function update(yearData) {
  var data = yearData.countries;

  var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d => "$" + d);

  xAxisGroup.call(xAxisCall);

  var yAxisCall = d3.axisLeft(y);
  yAxisGroup.call(yAxisCall);

  var circles = g.selectAll("circle")
    .data(data, d => d.country);

  circles.exit().remove();

  circles
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp))
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
    .attr("fill", d => color(d.continent));

  circles.enter()
    .append("circle")
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp))
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
    .attr("fill", d => color(d.continent));

  yearLabel.text(yearData.year);
}