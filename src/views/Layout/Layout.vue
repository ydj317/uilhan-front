<template>
  <a-layout class="wrap">
    <a-layout-sider>
      <div class="logo-wrap fl-cc">
        <img src="@/assets/logo_icon.png">
      </div>
      <sider/>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header-wrap">
        <Header/>
      </a-layout-header>
      <a-layout-content>
        <Content/>
      </a-layout-content>
      <a-layout-footer class="layout-footer-wrap">
        <Footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import {onMounted} from 'vue';
import Sider from "@/views/Layout/Sider.vue";
import Header from "@/views/Layout/Header.vue";
import Content from "@/views/Layout/Content.vue";
import Footer from "@/views/Layout/Footer.vue";
import {lib} from "@/util/lib";
import {useRouter} from "vue-router";

const router = useRouter();
router.afterEach((to, from) => {
  const site = lib.isWorldLink() ? `월드링크` : '유일';
  const title = !to.meta.title ? '' : to.meta.title;
  document.title = site + ' - ' + title;
})

onMounted(() => {
  // window title
  const site = lib.isWorldLink() ? `월드링크` : '유일';
  document.title = site + ' - ' + router.currentRoute.value.meta.title;
})
</script>
<style scoped>
.wrap .logo-wrap{
  width: 100%;
  height: 60px;
}
.wrap .logo-wrap img{
  height: 30px;
  display: none;
}
.wrap .layout-header-wrap{
  background: #fff;
  height: 60px;
  padding: 0;
  line-height: 60px;
}
.wrap .ant-layout-content{
  background: #fff;
  min-height: calc(100vh - 160px);
  padding: 20px;
}
.wrap .layout-footer-wrap{
  background: #fff;
  height: 100px;
}
:deep(.wrap .ant-menu-item-selected) {
  font-weight: bold;
  color: #001529;
}
</style>