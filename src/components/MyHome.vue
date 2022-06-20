<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-main>
      <h1>
        <span class="title"
          >Classroom Dandelions: Visualising Participant Position, Trajectory
          and Body Orientation Augments Teachers’ Sensemaking</span
        >
        <br />
        <div class="pubInfo">
          <p>
            DOI:
            <a href="https://doi.org/10.1145/3491102.3517736" target="_blank"
              >https://doi.org/10.1145/3491102.3517736</a
            >
            <br />CHI '22:
            <a href="https://doi.org/10.1145/3491102" target="_blank"
              >CHI Conference on Human Factors in Computing Systems</a
            >, New Orleans, LA, USA, April 2022
          </p>
        </div>
        <p>
          Despite the digital revolution, physical space remains the site for
          teaching and learning embodied knowledge and skills. Both teachers and
          students must develop spatial competencies to effectively use
          classroom spaces, enabling fluid verbal and non-verbal interaction.
          While video permits rich activity capture, it provides no support for
          quickly seeing activity patterns that can assist learning. In
          contrast, position tracking systems permit the automated modelling of
          spatial behaviour, opening new possibilities for feedback. This paper
          introduces the design rationale for ”Dandelion Diagrams” that
          integrate participant location, trajectory and body orientation over a
          variable period. Applied in two authentic teaching contexts (a science
          laboratory, and a nursing simulation) we show how heatmaps showing
          only teacher/student location led to misinterpretations that were
          resolved by overlaying Dandelion Diagrams. Teachers also identified a
          variety of ways they could aid professional development. We conclude
          Dandelion Diagrams assisted sensemaking, but discuss the ethical risks
          of over-interpretation.
        </p>
      </h1>
    </el-main>
    <el-aside width="400px" style="background-color: rgb(238, 241, 246)">
      <el-tree
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-aside>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
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
.title {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: proximanova, Verdana, Helvetica, sans;
  word-break: break-word;
  font-size: 2em !important;
  line-height: 1.1;
  font-style: normal;
  text-transform: none;
  font-weight: 700 !important;
  box-sizing: border-box;
  color: #5c9aa0 !important;
}
p {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-family: stix, Georgia, serif;
  color: #333;
  line-height: 1.5;
  font-size: 19px;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  margin: 0 0 10px;
  margin-bottom: 1.5em;
  text-align: left;
  font-weight: 700;
}
.pubInfo {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-family: stix, Georgia, serif;
  font-weight: 400;
  color: #333;
  line-height: 1.5;
  font-size: 19px;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
</style>
