<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-main>
      <div
        style="margin: 0 auto; border: 1px solid #f03838; border-radius: 34px"
      >
        <div id="c1"></div>
        <div>
          <el-slider
            v-model="theYear"
            :min="1800"
            :max="2019"
            @change="this.countUp"
          ></el-slider>
        </div>
        <div style="border-radius: 4px">
          <el-switch
            v-model="start"
            active-text="播放"
            inactive-text="暂停"
            @change="this.switch"
          >
          </el-switch>
        </div>
      </div>
    </el-main>
    <el-aside width="400px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-message"></i>导航一</template
          >
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>导航二</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"
            ><i class="el-icon-setting"></i>导航三</template
          >
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="3-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="3-4">
            <template slot="title">选项4</template>
            <el-menu-item index="3-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>
  </el-container>
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
      // console.log(1, typeof this.data[year]);
      if (!this.init) {
        this.init = true;
        this.chart = new Chart({
          container: "c1",
          // autoFit: true,
          width: 1000,
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
          .shape("circle")
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

<style>
.el-header {
  background-color: #1966cb;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: rgb(131, 18, 18);
}
</style>
