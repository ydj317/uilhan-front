<template>
  <notice-popup />

  <a-layout style="min-height: 1080px;">
    <a-layout-sider v-model:collapsed="collapsed" collapsible :trigger="null">
      <div class="logo" v-if="collapsed">
          <img src="@/assets/logo.png" style="height:35px;">
      </div>
      <div class="logo" v-if="!collapsed">
          <img src="@/assets/logo_width.png" v-if="!lib.isWorldLink()" key="logo_width" @click="goDashboard">
          <img src="@/assets/world_link_logo_width.png" v-else key="world_link_logo_width"  @click="goDashboard">
      </div>
      <Sider/>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0;display: flex; width: 100%;" id="components-layout-custom-trigger">
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)"/>

        <Header style="flex: 1; justify-content: end;"/>
      </a-layout-header>
      <a-layout-content :style="{ margin: '20px', minHeight: '280px' }">
        <Content/>
      </a-layout-content>
    </a-layout>
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

const router = useRouter();
const collapsed = ref(false)
const goDashboard = () => {
  window.location.href = '/dashboard'
}

// watch currentRoute
router.afterEach((to, from) => {
  const site = lib.isWorldLink() ? `월드링크` : 'X-PLAN';

  const title = !to.meta.title ? '' : to.meta.title;
  document.title = site + ' - ' + title;
})

onMounted(() => {
  // window title
  const site = lib.isWorldLink() ? `월드링크` : 'X-PLAN';
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

</style>