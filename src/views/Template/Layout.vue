<template>
  <notice-popup />

  <a-layout style="min-height: 100vh;">
    <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" collapsible :trigger="null" style="border-right: 1px solid #eeeeee">
      <div class="logo" v-if="collapsed">
          <img src="@/assets/logo_icon.png" style="height:35px;">
      </div>
      <div class="logo" v-if="!collapsed">
          <img src="@/assets/logo_width.png" key="logo_width" style="height:35px;" @click="goDashboard">
      </div>
      <div
          style="position: absolute;top: 18px;border-radius: 50%;padding: 4px 5px 5px 5px;background-color: white;"
          :style="collapsed ? 'right: -16px;' : 'right: 25px;'"
      >
        <img src="@/assets/img/collapsed_open.png" alt="열기" @click="() => (collapsed = !collapsed)" v-if="collapsed">
        <img src="@/assets/img/collapsed_close.png" alt="닫기" @click="() => (collapsed = !collapsed)" v-else>
      </div>
      <Sider/>
    </a-layout-sider>
    <a-layout style="background-color: white;min-width: 1248px">
      <a-layout-header style="background: #fff; padding: 0;display: flex; width: 100%;" id="components-layout-custom-trigger">
        <Header style="flex: 1; justify-content: end;"/>
      </a-layout-header>
      <a-layout-content :style="{ margin: '0 20px', minHeight: '280px' }">
        <Content/>
      </a-layout-content>

    </a-layout>
    </a-layout>
    <a-layout-footer>
      <Footer />
    </a-layout-footer>
  </a-layout>

</template>

<script setup>
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons-vue';
import {onMounted, ref} from 'vue';
import Sider from "@/views/Template/Sider.vue";
import Header from "@/views/Template/Header.vue";
import Content from "@/views/Template/Content.vue";
import NoticePopup from "@/views/Template/NoticePopup.vue";
import {lib} from "@/util/lib";
import {useRouter} from "vue-router";
import Footer from "@/views/Template/Footer.vue";

const router = useRouter();
const collapsed = ref(false)
const goDashboard = () => {
  window.location.href = '/dashboard'
}

// watch currentRoute
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
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 18px;
  animation: logoAnimation 0.3s ease-in-out;
}

@keyframes logoAnimation {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

#components-layout-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-custom-trigger .trigger:hover {
  color: #1890ff;
}

.ant-layout-sider {
  background: #fff;
}

</style>