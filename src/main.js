import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import "ant-design-vue/dist/antd.css";
import "./assets/css/global.css";
import {
  Button,
  Layout,
  Drawer,
  Radio,
  Menu,
  List,
  Input,
  InputNumber,
  // DatePicker,
  Select,
  Table,
  Descriptions,
  Upload,
  Image,
  Tag,
  Popconfirm,
  Tooltip,
  Divider,
  Modal,
  Space,
  Avatar,
  Checkbox,
  Form,
  Typography,
  Spin,
  Affix,
  Switch,
  Alert,
  Card,
  Collapse,
  Pagination,
  Cascader,
} from "ant-design-vue";

import DatePicker from "ant-design-vue/es/date-picker/moment";

createApp(App)
  .use(store)
  .use(router)
  .use(Button)
  .use(Layout)
  .use(Drawer)
  .use(Radio)
  .use(Menu)
  .use(List)
  .use(Input)
  .use(InputNumber)
  .use(DatePicker)
  .use(Select)
  .use(moment)
  .use(Descriptions)
  .use(Upload)
  .use(Image)
  .use(Table)
  .use(Popconfirm)
  .use(Tag)
  .use(Tooltip)
  .use(Divider)
  .use(Modal)
  .use(Space)
  .use(Avatar)
  .use(Checkbox)
  .use(Form)
  .use(Typography)
  .use(Spin)
  .use(Affix)
  .use(Switch)
  .use(Alert)
  .use(Card)
  .use(Collapse)
  .use(Pagination)
  .use(Cascader)
  .mount("#app");
