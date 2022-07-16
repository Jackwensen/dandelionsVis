<template>
  <div>
    <div id="map-container"></div>
    <div id="timeline-container"></div>
  </div>
</template>

<script>
// import * as d3 from "d3";
import boroughs from "/static/json/boroughs.geo.json";

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
    return {
      dataForMap: {},
    };
  },
  methods: {
    initComponent() {
      var marginTitle = { top: 20, left: 50 },
        mapWidth = 600,
        mapHeight = 300;

      var mapSvg = d3
        .select("#map-container")
        .append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight);

      var title = mapSvg
        .append("text")
        .attr("class", "vis-title")
        .attr(
          "transform",
          "translate(" + marginTitle.left + "," + marginTitle.top + ")"
        )
        .text("NYC Crimes (select a time range)");

      var projection = d3
        .geoMercator() // mercator makes it easy to center on specific lat/long
        .scale(30000)
        .center([-73.8, 40.56]); // long, lat of NYC

      var pathGenerator = d3.geoPath().projection(projection);

      var colorScale = d3.scale.category10();

      var radiusScale = d3.scale.sqrt().range([2, 15]);

      // Add the tooltip container to the vis container
      // it's invisible and its position/contents are defined during mouseover
      // var tooltip = d3
      //   .select("#map-container")
      //   .append("div")
      //   .attr("class", "tooltip")
      //   .style("opacity", 0);

      // tooltip mouseover event handler
      // function tipMouseover(d) {
      //   // var pageX = d.latitude;
      //   // var pageY = d.longitude;
      //   this.setAttribute("class", "circle-hover"); // add hover class to emphasize

      //   var color = colorScale(d.CR);

      //   var html =
      //     "<span style='color:" +
      //     color +
      //     ";'>" +
      //     d.CR +
      //     "</span><br/>" +
      //     "Count: " +
      //     d.TOT +
      //     "<br/>Date: " +
      //     d.MO +
      //     "/" +
      //     d.YR;

      //   tooltip
      //     .html(html)
      //     // .style("left", pageX + 15 + "px")
      //     // .style("top", pageY - 28 + "px")
      //     .transition()
      //     .duration(200) // ms
      //     .style("opacity", 0.9); // started as 0!
      // }

      // // tooltip mouseout event handler
      // function tipMouseout() {
      //   this.classList.remove("circle-hover"); // remove hover class

      //   tooltip
      //     .transition()
      //     .duration(500) // ms
      //     .style("opacity", 0); // don't care about position!
      // }

      makeMap();

      function makeMap() {
        // const newBoroughs = JSON.stringify(boroughs);
        console.log(1, "makeMap");

        mapSvg
          .selectAll("path")
          .data(boroughs.features)
          .enter()
          .append("path")
          .attr("class", "boroughs")
          .attr("d", pathGenerator);

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

            var parseMonthDayYear = d3.time.format("%m/%d/%Y").parse;

            var dataForTimeline = [],
              dateToCrimeCount = {};

            dataForMap.forEach((d) => {
              d.TIME = parseMonthDayYear(d.TIME);
              d.TOT = +d.TOT;
              d.latitude = +d.latitude;
              d.longitude = +d.longitude;
              colorScale(d.CR);

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

            radiusScale.domain(
              d3.extent(dataForMap, function (crime) {
                return +crime.TOT;
              })
            );
            console.log("dataForTimeline", dataForTimeline);
            makeTimeline(dataForMap, dataForTimeline);
          }
        );
      }

      // Creates the event timeline and sets up callbacks for brush changes
      function makeTimeline(dataForMap, dataForTimeline) {
        var margin = { top: 10, right: 10, bottom: 20, left: 25 },
          width = mapWidth - margin.left - margin.right,
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
          updateTitleText();
        } else {
          var newDateRange = brush.extent(),
            filteredData = [];

          dataForMap.forEach(function (d) {
            if (d.TIME >= newDateRange[0] && d.TIME <= newDateRange[1]) {
              filteredData.push(d);
            }
          });
          updateTitleText(newDateRange);
          updateMapPoints(filteredData);
        }
      }

      // Updates the vis title text to include the passed date array: [start Date, end Date]
      function updateTitleText(newDateArray) {
        // console.log("updateTitleText", newDateArray);
        if (!newDateArray) {
          title.text("NYC Crimes (select a time range)");
        } else {
          var from =
              newDateArray[0].getMonth() +
              1 +
              "/" +
              (newDateArray[0].getDay() + 1) +
              "/" +
              newDateArray[0].getFullYear(),
            to =
              newDateArray[1].getMonth() +
              1 +
              "/" +
              (newDateArray[1].getDay() + 1) +
              "/" +
              newDateArray[1].getFullYear();
          title.text("NYC Crimes " + from + " - " + to);
        }
      }

      // Updates the points displayed on the map, to those in the passed data array
      function updateMapPoints(data) {
        // console.log("updateMapPoints", data);
        var circles = mapSvg.selectAll("circle").data(data, function (d) {
          return d.TIME + d.TOT;
        });

        circles // update existing points
          // .on("mouseover", tipMouseover)
          // .on("mouseout", tipMouseout)
          .attr("fill", function (d) {
            return colorScale(d.CR);
          })
          .attr("cx", function (d) {
            return projection([+d.longitude, +d.latitude])[0];
          })
          .attr("cy", function (d) {
            return projection([+d.longitude, +d.latitude])[1];
          })
          .attr("r", function (d) {
            return radiusScale(+d.TOT);
          });

        circles
          .enter()
          .append("circle") // new entering points
          // .on("mouseover", tipMouseover)
          // .on("mouseout", tipMouseout)
          .attr("fill", function (d) {
            return colorScale(d.CR);
          })
          .attr("cx", function (d) {
            return projection([+d.longitude, +d.latitude])[0];
          })
          .attr("cy", function (d) {
            return projection([+d.longitude, +d.latitude])[1];
          })
          .attr("r", 0)
          .transition()
          .duration(500)
          .attr("r", function (d) {
            return radiusScale(+d.TOT);
          });

        circles
          .exit() // exiting points
          .attr("r", function (d) {
            return radiusScale(+d.TOT);
          })
          .transition()
          .duration(500)
          .attr("r", 0)
          .remove();
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
