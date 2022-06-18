<template>
  <div class="home">
    <Experiment msg="Dandelions" />
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
