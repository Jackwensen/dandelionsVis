import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import { BootstrapVue } from "bootstrap-vue";
import * as d3 from "d3";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// import axios from "axios";

Vue.config.productionTip = false;

const G2 = require("@antv/g2");
Vue.prototype.$G2 = G2;

// Vue.prototype.$ajax = axios;
Vue.use(ElementUI);
Vue.use(BootstrapVue);
Vue.prototype.$d3 = d3;

window.d3 = d3;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
