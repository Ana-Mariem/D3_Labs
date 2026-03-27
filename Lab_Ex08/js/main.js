var margin = { left: 100, right: 100, top: 10, bottom: 100 };

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var yearIndex = 0;
var running = true;
var interval;
var filteredContinent = "all";
var formattedData = [];

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
    "#f4a6a6", // Africa
    "#bcd7f5", // Americas
    "#c7ddb5", // Asia
    "#d8c3e6"  // Europe
  ]);

var g = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Tooltip
var tip = d3.tip()
  .attr("class", "d3-tip")
  .html(function(d) {
    return "<strong>Country:</strong> " + d.country + "<br>" +
           "<strong>Continent:</strong> " + d.continent + "<br>" +
           "<strong>Income:</strong> $" + d.income + "<br>" +
           "<strong>Life Exp:</strong> " + d.life_exp + "<br>" +
           "<strong>Population:</strong> " + d.population;
  });

g.call(tip);

// Axis groups
var xAxisGroup = g.append("g")
  .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g");

// X label
g.append("text")
  .attr("x", width / 2)
  .attr("y", height + 60)
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

// Load data
d3.json("data/data.json").then(function(data) {
  formattedData = data.map(function(year) {
    return {
      year: +year.year,
      countries: year.countries
        .filter(function(country) {
          return country.income && country.life_exp && country.population;
        })
        .map(function(country) {
          country.income = +country.income;
          country.life_exp = +country.life_exp;
          country.population = +country.population;
          return country;
        })
    };
  });

  update(formattedData[yearIndex]);
  initSlider();
  startInterval();

}).catch(function(error) {
  console.log(error);
});

function update(yearData) {
  var data = yearData.countries;

  if (filteredContinent !== "all") {
    data = data.filter(function(d) {
      return d.continent === filteredContinent;
    });
  }

  // Axes
  var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(function(d) {
      return "$" + d;
    });

  xAxisGroup.call(xAxisCall);

  var yAxisCall = d3.axisLeft(y);
  yAxisGroup.call(yAxisCall);

  // Data join
  var circles = g.selectAll("circle.country-circle")
    .data(data, function(d) {
      return d.country;
    });

  // Exit
  circles.exit()
    .transition()
    .duration(500)
    .attr("r", 0)
    .remove();

  // Update
  circles
    .transition()
    .duration(500)
    .attr("cx", function(d) {
      return x(d.income);
    })
    .attr("cy", function(d) {
      return y(d.life_exp);
    })
    .attr("r", function(d) {
      return Math.sqrt(area(d.population) / Math.PI);
    })
    .attr("fill", function(d) {
      return color(d.continent);
    });

  // Enter
  circles.enter()
    .append("circle")
    .attr("class", "country-circle")
    .attr("cx", function(d) {
      return x(d.income);
    })
    .attr("cy", function(d) {
      return y(d.life_exp);
    })
    .attr("r", 0)
    .attr("fill", function(d) {
      return color(d.continent);
    })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .transition()
    .duration(500)
    .attr("r", function(d) {
      return Math.sqrt(area(d.population) / Math.PI);
    });

  yearLabel.text(yearData.year);
  d3.select("#year-text").text("Year: " + yearData.year);

  if ($("#date-slider").hasClass("ui-slider")) {
    $("#date-slider").slider("value", yearIndex);
  }
}

function startInterval() {
  stopInterval();

  interval = d3.interval(function() {
    yearIndex++;

    if (yearIndex >= formattedData.length) {
      yearIndex = 0;
    }

    update(formattedData[yearIndex]);
  }, 1000);
}

function stopInterval() {
  if (interval) {
    interval.stop();
  }
}

function initSlider() {
  $("#date-slider").slider({
    min: 0,
    max: formattedData.length - 1,
    step: 1,
    value: yearIndex,
    slide: function(event, ui) {
      yearIndex = ui.value;
      update(formattedData[yearIndex]);
    }
  });
}

// Play / Pause
$("#play-button").on("click", function() {
  if (running) {
    stopInterval();
    $(this).text("Play");
  } else {
    startInterval();
    $(this).text("Pause");
  }
  running = !running;
});

// Reset
$("#reset-button").on("click", function() {
  stopInterval();
  running = false;
  $("#play-button").text("Play");
  yearIndex = 0;
  update(formattedData[yearIndex]);
});

// Dropdown filter
$("#continent-select").on("change", function() {
  filteredContinent = $(this).val();
  update(formattedData[yearIndex]);
});