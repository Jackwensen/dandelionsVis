<template>
  <div>
    <div id="c1"></div>
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
// import country from "/static/json/test.json";
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
        26675: "#f49d37",
        26679: "#f03838",
        28166: "#35d1d1",
      },
      interval: [],
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
          autoFit: true,
          width: 600,
          height: 400,
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
          tracker: {
            values: ["26675", "26679", "28166"],
          },
        });

        // 配置 tooltip
        this.chart.tooltip({
          // showMarkers: false,
          title: "CI",
          position: "left",
        });

        // 配置图例
        // this.chart.legend(false)
        this.chart.legend("CI", false);
        this.chart.legend("tracker", {
          // flipPage: false,
          position: "bottom-left",
        });

        // 坐标轴配置
        this.chart.axis("x", {
          title: {
            style: {
              fill: "#8C8C8C",
              fontSize: 14,
            },
          },
          line: {
            style: {
              stroke: "#D9D9D9",
            },
          },
        });
        this.chart.axis("y", {
          title: {
            style: {
              fill: "#8C8C8C",
              fontSize: 14,
            },
          },
          grid: {
            line: {
              style: {
                stroke: "#D9D9D9",
              },
            },
          },
        });

        // 绘制散点图
        this.chart
          .interval()
          // .point()
          // .path()
          .position("x*y")
          .color("tracker", (val) => this.colorsMap[val])
          // .size("population", [4, 25])
          .size(40)
          .shape("triangle")
          .animate({
            update: {
              duration: 200,
              easing: "easeLinear",
            },
          })
          .tooltip("CI*session*phase*id")
          .style({
            stroke: "#000",
          });

        // 绘制标注文本
        this.chart.annotation().text({
          position: ["50%", "50%"],
          content: time,
          style: {
            fontSize: 200,
            fill: "#999",
            textAlign: "center",
            fillOpacity: 0.3,
          },
          top: false,
          animate: false,
        });
        this.chart.render();
      } else if (this.theTime < 113233) {
        // console.log(123, this.data[time]);

        this.chart.annotation().clear(true);
        this.chart.annotation().text({
          position: ["50%", "50%"],
          content: time,
          style: {
            fontSize: 200,
            fill: "#999",
            textAlign: "center",
            fillOpacity: 0.3,
          },
          top: false,
          animate: false,
        });
        this.chart.changeData(this.data[time]);
      }
    },
    play() {
      this.theTime++;
      // console.log(this.theTime)
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
            { x: x - width, y: y + 0.08 },
            { x: x, y: y },
            { x: x - width, y: y - 0.08 },
          ];
        },
        // 2. 绘制
        draw(cfg, group) {
          const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
          console.log(456, cfg.points);
          console.log(789, cfg);

          cfg.defaultStyle.fill = cfg.color;
          const polygon = group.addShape("path", {
            attrs: {
              path: [
                ["M", points[0].x, points[0].y],
                ["L", points[1].x, points[1].y],
                ["L", points[2].x, points[2].y],
              ],
              ...cfg.defaultStyle,
            },
          });
          return polygon;
        },
      });
    },
  },
};
</script>
