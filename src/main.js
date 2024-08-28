import { createApp } from "vue";
import router from "./router";
import store from "./store";
import antDV from "ant-design-vue";
import moment from "moment";
import App from "./App.vue";
import "moment/dist/locale/zh-cn";
import 'ant-design-vue/dist/reset.css';
import "./assets/css/global.css";
import "./assets/css/custom.css";
import "./assets/css/common.css";
import 'echarts';
import DatePicker from "ant-design-vue/es/date-picker/moment";
import VConsole from 'vconsole';
if(location.hostname.indexOf('192.168.51.111') != -1 || location.hostname.indexOf('qa-') != -1){
  // const vConsole = new VConsole();
}
const app = createApp(App);
app.use(router);
app.use(store);
app.use(antDV);
app.use(moment);
app.use(DatePicker);

app.mount("#app");
