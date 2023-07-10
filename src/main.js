import { createApp } from "vue";
import router from "./router";
import store from "./store";
import antDV from "ant-design-vue";
import moment from "moment";
import App from "./App.vue";
import "moment/dist/locale/zh-cn";
import "ant-design-vue/dist/antd.css";
import "./assets/css/global.css";
import 'echarts';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(antDV);
app.use(moment);

app.mount("#app");
