<template>
  <a-layout style="min-height: 1080px;">
    <a-layout-sider v-model:collapsed="collapsed" collapsible breakpoint="lg" :trigger="null">
      <div class="logo">
        <router-link to="/product">
          <img src="@/assets/logo_wight.svg" style="width: 100%;">
        </router-link>
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
import {ref} from 'vue';
import Sider from "@/views/Template/Sider.vue";
import Header from "@/views/Template/Header.vue";
import Content from "@/views/Template/Content.vue";

const collapsed = ref(false)

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

.site-layout .site-layout-background {
  background: #fff;
}
</style>