<template>
  <div>
    <div id="c1" :style="backgroundDiv" class="middle"></div>
    <div id="timeline-container"></div>
    <div style="margin: 0 auto; height: 50px; width: 985px; padding-left: 15px">
      <b-progress height="30px" :max="31">
        <b-progress-bar
          :value="leftSilder - 113202"
          variant="secondary"
        ></b-progress-bar>
        <b-progress-bar
          :value="theTime[0] - leftSilder"
          variant="info"
          animated
        ></b-progress-bar>
        <b-progress-bar
          :value="theTime[1] - theTime[0]"
          variant="warning"
        ></b-progress-bar>
        <b-progress-bar
          :value="31 + 113202 - theTime[1]"
          variant="secondary"
        ></b-progress-bar>
      </b-progress>
      <el-slider
        v-show="false"
        v-model="theTime"
        :min="113202"
        :max="113233"
        range
        @change="this.moveSlider"
        :format-tooltip="formatTooltip"
        :marks="marks"
      ></el-slider>
    </div>
    <div>
      <button type="button">
        <i class="el-icon-d-arrow-left" @click="oneStep('back')"></i>
      </button>
      <button type="button">
        <i
          class="el-icon-video-play"
          v-if="!startPlay"
          @click="this.switch"
        ></i>
        <i
          class="el-icon-video-pause"
          v-if="startPlay"
          @click="this.switch"
        ></i>
      </button>
      <button type="button">
        <i class="el-icon-d-arrow-right" @click="oneStep('front')"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { Chart } from "@antv/g2";
import { registerShape } from "@antv/g2";
import location from "/static/json/loc.json";
let d3 = {
  ...require("d3"),
};
// import data123 from "/static/json/data123.json";

export default {
  mounted() {
    this.initComponent();
  },
  data() {
    return {
      theTime: [113206, 113230],
      init: false,
      leftSilder: 113206,
      startPlay: false,
      chart: null,
      brush: null,
      timeline: null,
      x: null,
      brushHandle: null,
      years: [],
      data: [],
      dataForTimeline: [],
      colorsMap: [
        "#ff0000",
        "#ffbf00",
        "#ffff00",
        "#40ff00",
        "#00ffff",
        "#007fff",
        "#7f00ff",
      ],
      colorsMap1: {
        person1: "0:#ff0000 0.85:#ffffff",
        person1old: "0:#ff9999 0.85:#ffffff",
        person2: "0:#ffbf00 0.85:#ffffff",
        person2old: "0:#ffe599 0.85:#ffffff",
        person3: "0:#ffff00 0.85:#ffffff",
        person3old: "0:#ffff99 0.85:#ffffff",
        person4: "0:#40ff00 0.85:#ffffff",
        person4old: "0:#b3ff99 0.85:#ffffff",
        person5: "0:#00ffff 0.85:#ffffff",
        person5old: "0:#99ffff 0.85:#ffffff",
        person6: "0:#007fff 0.85:#ffffff",
        person6old: "0:#99ccff 0.85:#ffffff",
        person7: "0:#7f00ff 0.85:#ffffff",
        person7old: "0:#cc99ff 0.85:#ffffff",
      },
      interval: [],
      backgroundDiv: {
        backgroundImage: "url(" + require("/static/img/1200+520.jpg") + ")",
      },
      marks: {
        113203: "11:32:03",
        113233: "11:32:33",
      },
    };
  },
  methods: {
    initComponent() {
      /**
       * 111
       */
      // let loc = location.json();
      this.years = Object.keys(location);
      //register dandelion shape
      this.register();
      this.makeDandelion();
      this.timeLine();
    },
    makeDandelion() {
      // const year = this.years[this.count];
      this.data = JSON.parse(JSON.stringify(location));
      const time = this.theTime[0];
      if (!this.init) {
        this.init = true;
        this.chart = new Chart({
          container: "c1",
          // autoFit: true,
          width: 1200,
          height: 600,
          padding: [0, 0, 90],
        });
        this.chart.data(this.data[time]);
        // 图表框架
        this.chart.scale({
          x: {
            min: -5339, //-5300
            max: 13800, //13700
            // tickInterval: 10,
            alias: "X",
          },
          y: {
            max: 8250, //8150
            min: 0,
            alias: "Y",
          },
          tracker: {
            key: true, // 自定义每条数据的 id
          },
          id: {
            values: ["one", "two", "three", "four", "five", "six", "seven"],
          },
          CI: {
            type: "cat",
          },
          session: {
            type: "cat",
          },
          rotation: {
            nice: true,
          },
          person: {
            values: [
              "person1",
              "person2",
              "person3",
              "person4",
              "person5",
              "person6",
              "person7",
            ],
          },
        });

        // 配置 tooltip
        this.chart.tooltip({
          // showMarkers: false,
          title: "person",
          position: "right",
        });

        // 配置图例
        // this.chart.legend(false);
        this.chart.legend("id", {
          flipPage: false,
          offsetY: -45, //控制legend位置
          position: "bottom-left",
          // background: {
          //   style: {
          //     fill: "#00cc33",
          //   },
          // },
          marker: (name, index) => {
            // console.log(typeof item);
            return {
              symbol: "triangle",
              style: {
                fill: this.colorsMap[index],
                stroke: "#363636",
                lineWidth: 0.1,
                r: 9,
              },
            };
          },
        });

        /**
         * 复写 图例筛选 交互。1、点击图例名称 进行 unchecked 状态的切换 2、点击图例 marker，进行 checked 状态的切换（进行聚焦）3、双击 重置状态
         *
         */
        this.chart.interaction("element-highlight");
        this.chart.interaction("legend-filter", {
          start: [
            {
              trigger: "legend-item-name:click",
              action: ["list-unchecked:toggle", "data-filter:filter"],
            },
            {
              trigger: "legend-item-marker:click",
              action: ["list-checked:checked", "data-filter:filter"],
            },
          ],
          end: [
            {
              trigger: "legend-item-marker:dblclick",
              action: ["list-checked:reset", "data-filter:filter"],
            },
          ],
        });

        /**
         * 坐标轴配置
         */
        this.chart.axis(false);

        // 绘制
        this.chart
          .interval()
          // .point()
          .position("x*y")
          .color("id*person*angle", (val1, val2, val3) => {
            var radius = Math.round(val3 ? val3 : 0);
            var angle = 360 - radius > 360 ? -radius : 360 - radius;
            return (`l(${angle}) ` + this.colorsMap1[(val1, val2)]).toString();
          })
          .size(60)
          .shape("triangle")
          // .animate(false)
          .animate({
            update: {
              duration: 200,
              easing: "easeLinear",
            },
          })
          .tooltip("CI*session*phase*angle")
          .style({
            stroke: "#000",
          });

        // 绘制标注文本
        this.chart.annotation().text({
          position: ["5%", "10%"],
          content:
            time.toString().substring(0, 2) +
            ":" +
            time.toString().substring(2, 4) +
            ":" +
            time.toString().substring(4, 6),
          style: {
            fontSize: 30,
            fill: "#999",
            textAlign: "center",
            fillOpacity: 0.5,
          },
          top: false,
          animate: false,
        });
        // 绘制
        this.chart.render();
      } else if (this.theTime[0] < 113233) {
        /**
         * annotation and animate
         */
        this.chart.annotation().clear(true);
        this.chart.annotation().text({
          position: ["5%", "10%"],
          content:
            time.toString().substring(0, 2) +
            ":" +
            time.toString().substring(2, 4) +
            ":" +
            time.toString().substring(4, 6),
          style: {
            fontSize: 30,
            fill: "#999",
            textAlign: "center",
            fillOpacity: 0.5,
          },
          top: false,
          animate: false,
        });
        this.chart.animate(false);
        /**
         * append
         */
        // console.log("start:", this.leftSilder);
        // console.log("end", time);
        let finalData = Object.values(this.data[Number(this.leftSilder)]);
        if (time !== this.leftSilder) {
          // append the previous data
          for (let i = this.leftSilder; i < time; i++) {
            var appendData = Object.values(this.data[Number(i)]);
            finalData = finalData.concat(appendData);
          }
          /**
           * change the color of previous data
           */
          for (let j = 0; j < finalData.length; j++) {
            var personNum = finalData[j].person + "old";
            if (!finalData[j].person.includes("old"))
              finalData[j].person = personNum;
          }
          /**
           * concat current data
           */
          finalData = finalData.concat(Object.values(this.data[Number(time)]));
        }
        this.chart.changeData(finalData);
      }
    },
    moveSlider() {
      console.log(this.theTime);
      this.leftSilder = this.theTime[0];

      this.renderBrush();
      this.makeDandelion();
    },
    play() {
      if (this.theTime[0] < this.theTime[1]) {
        this.theTime[0]++;
        var num1 = this.theTime[0].toString();
        var num2 = this.theTime[1].toString();
        this.theTime = [num1, num2];
        this.makeDandelion();
      }
    },
    oneStep(type) {
      if (type === "back") {
        this.theTime[0]--;
        var num1 = this.theTime[0].toString();
        var num2 = this.theTime[1].toString();
        this.theTime = [num1, num2];
        this.leftSilder = this.theTime[0];
        this.renderBrush();
      } else {
        this.theTime[0]++;
        var num3 = this.theTime[0].toString();
        var num4 = this.theTime[1].toString();
        this.theTime = [num3, num4];
      }
      this.makeDandelion();
    },
    switch() {
      this.startPlay = !this.startPlay;
      if (this.startPlay) {
        this.interval = setInterval(this.play, 300);
      } else {
        clearInterval(this.interval);
      }
    },
    register() {
      registerShape("interval", "triangle", {
        // 1. 定义关键点
        getPoints(cfg) {
          // console.log(123, cfg);

          const x = cfg.x;
          const y = cfg.y;
          // const y0 = cfg.y0;
          const width = cfg.size;
          return [
            { x: x + width, y: y + 0.05 },
            { x: x, y: y },
            { x: x + width, y: y - 0.05 },
          ];
        },
        // 2. 绘制
        draw(cfg, group) {
          const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标

          let cosT = Math.cos((-cfg.data.angle * Math.PI) / 180);
          let sinT = Math.sin((-cfg.data.angle * Math.PI) / 180);

          var dx0 = points[0].x - points[1].x,
            dy0 = points[0].y - points[1].y,
            dx2 = points[2].x - points[1].x,
            dy2 = points[2].y - points[1].y;
          // console.log(dx0, dy0);
          // console.log(dx2, dy2);
          var x0 = dx0 * cosT - dy0 * sinT + points[1].x,
            y0 = dx0 * sinT + dy0 * cosT + points[1].y,
            x2 = dx2 * cosT - dy2 * sinT + points[1].x,
            y2 = dx2 * sinT + dy2 * cosT + points[1].y;

          cfg.defaultStyle.fill = cfg.color;
          const polygon = group.addShape("path", {
            attrs: {
              path: [
                ["M", x2, y2],
                ["L", points[1].x, points[1].y],
                ["L", x0, y0],
              ],
              ...cfg.defaultStyle,
            },
          });
          // console.log(polygon.attrs.path);
          return polygon;
        },
      });
    },
    formatTooltip(val) {
      if (val) {
        return (
          val.toString().substring(0, 2) +
          ":" +
          val.toString().substring(2, 4) +
          ":" +
          val.toString().substring(4, 6)
        );
      }
    },
    timeLine() {
      console.log(1, "timeLine");
      var dateToCrimeCount = this.years;

      Object.keys(dateToCrimeCount).forEach((time) => {
        this.dataForTimeline.push({
          TIME: dateToCrimeCount[time],
          TOT: Math.floor(Math.random() * 101),
        });
      });
      this.dataForTimeline.sort(function (a, b) {
        return a.TIME - b.TIME;
      });
      this.makeTimeline();
      // Calls updateMapPoints()
    },
    // Creates the event timeline and sets up callbacks for brush changes
    makeTimeline() {
      var margin = { top: 10, right: 10, bottom: 20, left: 20 },
        width = 1000 - margin.left - margin.right,
        height = 80 - margin.top - margin.bottom;

      var timelineSvg = d3
        .select("#timeline-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      var timeline = timelineSvg
        .append("g")
        .attr("class", "timeline")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      /**
       * config timeline
       * x, y, xAxis, yAxis
       * area, path, text
       */
      {
        var x = d3
          .scaleLinear()
          .domain(
            d3.extent(
              this.dataForTimeline.map(function (d) {
                return d.TIME;
              })
            )
          )
          .range([0, width]);
        this.x = x;
        var y = d3
          .scaleLinear()
          .domain(
            d3.extent(
              this.dataForTimeline.map(function (d) {
                return d.TOT;
              })
            )
          )
          .range([height, 0]);

        var xAxis = d3
          .axisBottom()
          .scale(x)
          .ticks(31)
          .tickFormat((d) => {
            return d % 100;
          });

        var yAxis = d3.axisLeft().scale(y).ticks(3);
        // the area of timeline
        var area = d3
          .area()
          .curve(d3.curveLinear)
          .x(function (d) {
            return x(d.TIME);
          })
          .y0(height)
          .y1(function (d) {
            return y(d.TOT);
          });

        timeline
          .append("path")
          .datum(this.dataForTimeline)
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
          .text("#Random");
      }
      // var arc = d3
      //   .arc()
      //   .innerRadius(0)
      //   .outerRadius(25)
      //   .startAngle(0)
      //   .endAngle((d, i) => (i ? Math.PI : -Math.PI));

      // var brushHandle = (g, s) =>
      //   g
      //     .selectAll(".handle--custom")
      //     .data([{ type: "w" }, { type: "e" }])
      //     .join((enter) =>
      //       enter
      //         .append("path")
      //         .attr("class", "handle--custom")
      //         .attr("fill", "#666")
      //         .attr("fill-opacity", 0.8)
      //         .attr("stroke", "#000")
      //         .attr("stroke-width", 1.5)
      //         .attr("cursor", "ew-resize")
      //         .attr("d", arc)
      //     )
      //     .attr("display", s === null ? "none" : null)
      //     .attr(
      //       "transform",
      //       s === null ? null : (d, i) => `translate(${s[i]},${25})`
      //     );

      // this.brushHandle = brushHandle;
      // Add brush to timeline, hook up to callback
      var brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, 50],
        ])
        .on("end", this.brushCallback);
      this.brush = brush;

      timeline.append("g").transition();

      this.timeline = timeline;
      this.renderBrush();
    },
    // Called whenever the timeline brush range (extent) is updated
    // Filters the map data to those points that fall within the selected timeline range
    brushCallback(event) {
      console.log("brushCallback");

      const selection = event.selection;
      // console.log(event.sourceEvent);
      if (!selection) {
        // const dx = this.x(1) - this.x(0);
        // const [[cx]] = d3.pointers(event);
        // var [x0, x1] = [cx - dx / 2, cx + dx / 2].map(this.x.invert);
        // var [x0, x1] = this.x.range();

        var [X0, X1] = [0, 100].map(this.x.invert);
        console.log(X0, X1);
        var newDateRange1 = [Math.round(X0), Math.round(X1)];
        this.theTime = newDateRange1;
        this.leftSilder = this.theTime[0];

        this.renderBrush();
        this.makeDandelion();
      } else if (event.sourceEvent) {
        var [x2, x3] = selection.map((d) => Math.round(this.x.invert(d)));
        var newDateRange2 = [x2, x3];
        console.log(selection);
        // console.log("else", newDateRange2);
        this.theTime = newDateRange2;
        this.leftSilder = this.theTime[0];
        this.renderBrush();
        this.makeDandelion();
      }
      // this.timeline.call(this.brushHandle, selection);
    },
    renderBrush() {
      this.timeline
        .call(this.brush)
        .call(this.brush.move, this.theTime.map(this.x));
    },
  },
};
</script>
<style>
.middle {
  /* height: 550px;
  width: 1300px; */
  background: no-repeat top;
  background-size: contain 10px auto;
}
button {
  -webkit-text-size-adjust: 100%;
  vertical-align: baseline;
  /* font-weight: 300; */
  display: inline-block;
  appearance: none;
  cursor: pointer;
  border: none;
  box-sizing: border-box;
  transition-property: all;
  transition-duration: 0.3s;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border-radius: 100%;
  padding: 0 !important;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  font-size: 42px;
  height: 60px;
  line-height: 60px;
  /* margin: 5px; */
  width: 60px;
  animation-name: glowing-action;
}
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
  fill: rgb(18, 112, 188);
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
>
