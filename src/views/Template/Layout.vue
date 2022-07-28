<template>
  <a-layout class="layoutWrap q">
    <a-layout-sider width="250" class="sideBar">
      <Sider />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="contentHeader">
        <Header />
      </a-layout-header>
      <a-layout-content class="contentContent">
        <Content />
      </a-layout-content>
      <a-layout-footer class="contentFooter">
        <Footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import '../../assets/css/global.css'
import { Layout } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import Sider from 'views/Template/Sider.vue';
import Header from 'views/Template/Header.vue';
import Content from 'views/Template/Content.vue';
import Footer from 'views/Template/Footer.vue';

export default {
  components: {
    Layout,
    Sider,
    Header,
    Content,
    Footer
  },
};

</script>

<style scoped>
.layoutWrap {
  min-height: 100vh
}

.sideBar {
  background-color: #fff
}

.contentHeader {
  padding: 0;
  width: 100%;
  height: 70px;
  background-color: #3051d3;
}

.contentContent {
  height: 100%;
}

.contentFooter {
  padding: 0;
}

</style>