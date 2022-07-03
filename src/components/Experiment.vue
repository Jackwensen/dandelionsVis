<template>
  <div>
    <div id="c1" :style="backgroundDiv" class="middle"></div>
    <div style="margin: 0 auto; height: 50px; width: 1000px">
      <el-slider
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
      <el-switch
        v-model="startPlay"
        active-text="播放"
        inactive-text="暂停"
        @change="this.switch"
      >
      </el-switch>
    </div>
  </div>
</template>

<script>
import { Chart } from "@antv/g2";
import { registerShape } from "@antv/g2";
import location from "/static/json/loc.json";
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
      years: [],
      data: [],
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
        113202: "11:32:02",
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
      this.register();
      this.countUp();
    },
    countUp() {
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
          marker: (name, index, item) => {
            console.log(item);
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
        // console.log(123, this.data[time]);
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
        console.log("start:", this.leftSilder);
        console.log("end", time);
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
      this.leftSilder = this.theTime[0];
      this.countUp();
    },
    play() {
      if (this.theTime[0] < this.theTime[1]) {
        this.theTime[0]++;
        var num1 = this.theTime[0].toString();
        var num2 = this.theTime[1].toString();
        this.theTime = [num1, num2];

        // console.log(this.theTime);
        this.countUp();
      }
    },
    switch() {
      // console.log(this.theTime, this.start);
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
</style>
>
