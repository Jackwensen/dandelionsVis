<template>
  <div>
    <div id="timeline-container"></div>
  </div>
</template>

<script>
const d3 = {
  ...require("d3"),
  ...require("d3-geo"),
  ...require("d3-tile"),
};

export default {
  mounted() {
    this.initComponent();
  },
  data() {
    return {};
  },
  methods: {
    initComponent() {
      makeMap();

      function makeMap() {
        console.log(1, "makeMap");

        getCrimeData();
      }

      // Loads and munges NYC crime data.
      // Calls updateMapPoints()
      function getCrimeData() {
        console.log(2, "getCrimeData");
        d3.csv(
          "NYC_crime_sampled-with-random-days_n10000 (4).csv",
          function (error, dataForMap) {
            if (error) return console.error(error);
            console.log(dataForMap);
            var parseMonthDayYear = d3.time.format("%m/%d/%Y").parse;

            var dataForTimeline = [],
              dateToCrimeCount = {};

            dataForMap.forEach((d) => {
              d.TIME = parseMonthDayYear(d.TIME);
              d.TOT = +d.TOT;
              d.latitude = +d.latitude;
              d.longitude = +d.longitude;

              if (!dateToCrimeCount[d.TIME]) {
                dateToCrimeCount[d.TIME] = d.TOT;
              } else {
                dateToCrimeCount[d.TIME] += d.TOT;
              }
            });
            Object.keys(dateToCrimeCount).forEach(function (time) {
              dataForTimeline.push({
                TIME: new Date(time),
                TOT: dateToCrimeCount[time],
              });
            });
            dataForTimeline.sort(function (a, b) {
              return a.TIME - b.TIME;
            });

            console.log("dataForTimeline", dataForTimeline);
            makeTimeline(dataForMap, dataForTimeline);
          }
        );
      }

      // Creates the event timeline and sets up callbacks for brush changes
      function makeTimeline(dataForMap, dataForTimeline) {
        var margin = { top: 10, right: 10, bottom: 20, left: 25 },
          width = 600 - margin.left - margin.right,
          height = 80 - margin.top - margin.bottom;

        var timelineSvg = d3
          .select("#timeline-container")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        var timeline = timelineSvg
          .append("g")
          .attr("class", "timeline")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        var x = d3.time
          .scale()
          .domain(
            d3.extent(
              dataForTimeline.map(function (d) {
                return d.TIME;
              })
            )
          )
          .range([0, width]);

        var y = d3.scale
          .linear()
          .domain(
            d3.extent(
              dataForTimeline.map(function (d) {
                return d.TOT;
              })
            )
          )
          .range([height, 0]);

        var xAxis = d3.svg.axis().scale(x).orient("bottom");

        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(2);

        var area = d3.svg
          .area()
          .interpolate("linear")
          .x(function (d) {
            return x(d.TIME);
          })
          .y0(height)
          .y1(function (d) {
            return y(d.TOT);
          });

        timeline
          .append("path")
          .datum(dataForTimeline)
          .attr("class", "area")
          .attr("d", area);

        timeline
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        timeline.append("g").attr("class", "y axis").call(yAxis);

        timeline
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("dy", "1em")
          .style("text-anchor", "end")
          .text("# Crimes");

        // Add brush to timeline, hook up to callback
        var brush = d3.svg
          .brush()
          .x(x)
          .on("brush", function () {
            brushCallback(brush, dataForMap);
          })
          .extent([new Date("12/1/2013"), new Date("1/1/2014")]);

        timeline
          .append("g")
          .attr("class", "x brush")
          .call(brush)
          .selectAll("rect")
          .attr("y", -6)
          .attr("height", height + 7);

        brush.event(timeline.select("g.x.brush")); // dispatches a single brush event
      }

      // Called whenever the timeline brush range (extent) is updated
      // Filters the map data to those points that fall within the selected timeline range
      function brushCallback(brush, dataForMap) {
        console.log(brush.extent());
        if (brush.empty()) {
          updateMapPoints([]);
        } else {
          var newDateRange = brush.extent(),
            filteredData = [];

          dataForMap.forEach(function (d) {
            if (d.TIME >= newDateRange[0] && d.TIME <= newDateRange[1]) {
              filteredData.push(d);
            }
          });
          updateMapPoints(filteredData);
        }
      }

      // Updates the points displayed on the map, to those in the passed data array
      function updateMapPoints(data) {
        console.log("updateMapPoints", data);
      }
    },
  },
};
</script>

<style>
svg {
  font: 10px sans-serif;
}

.vis-title {
  font: 14px sans-serif;
  font-weight: bold;
  fill: #777;
}

.boroughs {
  fill: rgb(222, 235, 247);
  stroke: #000;
  stroke-width: 0.5px;
}

.tooltip {
  position: absolute;
  font-size: 12px;
  width: auto;
  height: auto;
  pointer-events: none;
  background-color: white;
}

.circle-hover {
  stroke: #000;
  stroke-width: 1px;
}

.area {
  fill: steelblue;
  fill-opacity: 0.7;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.brush .extent {
  stroke: #fff;
  fill: #000;
  fill-opacity: 0.25;
  shape-rendering: crispEdges;
}
</style>
