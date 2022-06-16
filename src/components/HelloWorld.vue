<template>
  <div>
    <div id="c1"></div>
    <div>
      <el-slider
        v-model="theYear"
        :min="1800"
        :max="2019"
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
import country from "/static/json/test.json";
// import location from "/static/json/loc.json";

export default {
  mounted() {
    this.initComponent();
  },
  data() {
    return {
      theYear: 1800,
      start: false,
      chart: null,
      years: [],
      data: [],
      colorsMap: {
        "Europe & Central Asia": "#f49d37",
        "East Asia & Pacific": "#f03838",
        "South Asia": "#35d1d1",
        "Middle East & North Africa": "#5be56b",
        "Sub-Saharan Africa": "#4e7af0",
        America: "#ebcc21",
      },
      // count: 0,
      interval: [],
      init: false,
    };
  },
  methods: {
    initComponent() {
      // 111
      // console.log(typeof location);
      this.years = Object.keys(country);
      this.data = country;
      this.countUp();
      // 222
      // fetch(
      //   "https://raw.githubusercontent.com/antvis/G2/master/examples/data/life.json"
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log(typeof data);
      //     this.years = Object.keys(data);
      //     this.data = data;
      //     this.countUp();
      //   });
    },
    countUp() {
      // let chart;
      // const year = this.years[this.count];
      const year = this.theYear;
      console.log(1, typeof this.data[year]);
      if (!this.init) {
        this.init = true;
        this.chart = new Chart({
          container: "c1",
          autoFit: true,
          width: 600,
          height: 400,
        });
        this.chart.data(this.data[year]);
        // 图表框架
        this.chart.scale({
          life: {
            min: 0,
            max: 90,
            tickInterval: 10,
            alias: "Y",
          },
          income: {
            type: "log",
            max: 150000,
            min: 100,
            alias: "X",
          },
          country: {
            key: true, // 自定义每条数据的 id
          },
          population: {
            type: "pow",
            base: 2,
            alias: "Z",
          },
          continent: {
            values: [
              "East Asia & Pacific",
              "South Asia",
              "Sub-Saharan Africa",
              "Middle East & North Africa",
              "Europe & Central Asia",
              "America",
            ],
          },
        });

        // 配置 tooltip
        this.chart.tooltip({
          // showMarkers: false,
          title: "country",
          // position: "left",
        });

        // 配置图例
        // this.chart.legend(false)
        this.chart.legend("population", false);
        this.chart.legend("continent", {
          flipPage: false,
          position: "bottom-left",
        });

        // 坐标轴配置
        this.chart.axis("life", {
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
        this.chart.axis("income", {
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
          .point()
          // .path()
          .position("income*life")
          .color("continent", (val) => this.colorsMap[val])
          .size("population", [4, 25])
          .shape("triangle")
          .animate({
            update: {
              duration: 200,
              easing: "easeLinear",
            },
          })
          .tooltip("life*income*population")
          .style({
            stroke: "#000",
          });

        // 绘制标注文本
        this.chart.annotation().text({
          position: ["50%", "50%"],
          content: year,
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
      } else if (this.theYear < 2020) {
        console.log(123, this.data[year]);

        this.chart.annotation().clear(true);
        this.chart.annotation().text({
          position: ["50%", "50%"],
          content: year,
          style: {
            fontSize: 200,
            fill: "#999",
            textAlign: "center",
            fillOpacity: 0.3,
          },
          top: false,
          animate: false,
        });
        this.chart.changeData(this.data[year]);
      }

      // ++this.count;
    },
    play() {
      this.theYear++;
      // console.log(this.theYear)
      this.countUp();
    },
    switch() {
      console.log(this.theYear, this.start);
      if (this.start) {
        this.interval = setInterval(this.play, 300);
      } else {
        clearInterval(this.interval);
      }
    },
  },
};
</script>
