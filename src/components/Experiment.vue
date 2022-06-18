<template>
  <div>
    <div id="c1" :style="backgroundDiv" class="middle"></div>
    <div>
      <el-slider
        v-model="theTime"
        :min="113203"
        :max="113233"
        @change="this.countUp"
      ></el-slider>
    </div>
    <div>
      <el-switch
        v-model="start"
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

export default {
  mounted() {
    this.initComponent();
  },
  data() {
    return {
      theTime: 113203,
      init: false,
      start: false,
      chart: null,
      years: [],
      data: [],
      colorsMap: {
        person1: "#f49d37",
        person2: "#f03838",
        person3: "#35d1d1",
      },
      interval: [],
      backgroundDiv: {
        backgroundImage: "url(" + require("/static/img/1200+520.jpg") + ")",
      },
    };
  },
  methods: {
    initComponent() {
      /**
       * 111
       */
      // console.log(typeof location);
      // let loc = location.json();
      this.years = Object.keys(location);
      this.data = location;
      this.register();
      this.countUp();
    },
    countUp() {
      // const year = this.years[this.count];
      const time = this.theTime;
      if (!this.init) {
        // console.log(456, this.data[time]);

        this.init = true;
        this.chart = new Chart({
          container: "c1",
          // autoFit: true,
          width: 1200,
          height: 520,
        });
        this.chart.data(this.data[time]);
        // 图表框架
        this.chart.scale({
          x: {
            min: -5300,
            max: 13700,
            // tickInterval: 10,
            alias: "X",
          },
          y: {
            max: 8150,
            min: 0,
            alias: "Y",
          },
          id: {
            key: true, // 自定义每条数据的 id
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
          interpolated: {
            type: "linear",
          },
          phase: {
            type: "linear",
          },
          quartiles: {
            type: "linear",
          },
          person: {
            values: ["person1", "person2", "person3"],
          },
        });

        // 配置 tooltip
        this.chart.tooltip({
          // showMarkers: false,
          title: "person",
          position: "left",
        });

        // 配置图例
        // this.chart.legend(false)
        this.chart.legend("CI", false);
        this.chart.legend("person", {
          // flipPage: false,
          position: "left-top",
        });

        // 坐标轴配置
        this.chart.axis(false);

        // 绘制散点图
        this.chart
          .interval()
          // .point()
          .position("x*y")
          .color("person", (val) => this.colorsMap[val])
          // .size("population", [4, 25])
          .size(60)
          .shape("triangle")
          .animate({
            update: {
              duration: 200,
              easing: "easeLinear",
            },
          })
          .tooltip("CI*session*phase")
          .style({
            stroke: "#000",
          });

        // 绘制标注文本
        this.chart.annotation().text({
          position: ["5%", "10%"],
          content: time,
          style: {
            fontSize: 30,
            fill: "#999",
            textAlign: "center",
            fillOpacity: 0.5,
          },
          top: false,
          animate: false,
        });
        this.chart.render();
      } else if (this.theTime < 113233) {
        // console.log(123, this.data[time]);
        this.chart.annotation().clear(true);
        this.chart.annotation().text({
          position: ["5%", "10%"],
          content: time,
          style: {
            fontSize: 30,
            fill: "#999",
            textAlign: "center",
            fillOpacity: 0.5,
          },
          top: false,
          animate: false,
        });
        this.chart.changeData(this.data[time]);
      }
    },
    play() {
      this.theTime++;
      this.countUp();
    },
    switch() {
      // console.log(this.theTime, this.start);
      if (this.start) {
        this.interval = setInterval(this.play, 300);
      } else {
        clearInterval(this.interval);
      }
    },
    register() {
      registerShape("interval", "triangle", {
        // 1. 定义关键点
        getPoints(cfg) {
          console.log(123, cfg);

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

          let cosT = Math.cos((cfg.data.angle * Math.PI) / 360);
          let sinT = Math.sin((cfg.data.angle * Math.PI) / 360);

          var dx0 = points[0].x - points[1].x,
            dy0 = points[0].y - points[1].y,
            dx2 = points[2].x - points[1].x,
            dy2 = points[2].y - points[1].y;
          console.log(dx0, dy0);
          console.log(dx2, dy2);
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
          console.log(polygon.attrs.path);
          return polygon;
        },
      });
    },
  },
};
</script>
<style>
.middle {
  height: 0.8;
  width: 0.8;
  background: no-repeat center;
  background-size: contain 10px auto;
}
</style>
>
