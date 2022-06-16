<template>
  <div class="home">
    <Experiment msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Experiment from "@/components/Experiment.vue";

export default {
  name: "Home",
  components: {
    Experiment,
  },
};
</script>
