<template>
  <div class="home">
    <MyHome msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import MyHome from "@/components/MyHome.vue";

export default {
  name: "Home",
  components: {
    MyHome,
  },
};
</script>
