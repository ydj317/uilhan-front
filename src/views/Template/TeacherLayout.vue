<template>
  <a-layout class="wrap">
    <a-layout-sider class="menu-wrap">
      <div class="logo-wrap fl-cc">
        <img src="@/assets/logo_icon.png">
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        v-model:selectedKeys="state.selectedKeys"
        v-model:openKeys="state.openKeys"
        @openChange="onOpenChange"
      >
        <template v-for="(menu, index) in menuList" :key="index">
          <template v-if="!menu.children && !menu.meta.isHide">
            <a-menu-item :key="!menu.path.startsWith('http') ? menu.path : menu.name">
              <template #icon>
                <component :is="menu.meta.icon" />
              </template>
              <router-link :to="menu.path" v-if="!menu.path.startsWith('http')">
                <span>{{menu.meta.title}}</span>
              </router-link>
              <a :href="menu.path" target="_blank" v-else>
                <span>{{menu.meta.title}}</span>
              </a>
            </a-menu-item>
          </template>
          <template v-else-if="!menu.meta.isHide">
            <a-sub-menu :key="menu.path">
              <template #icon>
                <component :is="menu.meta.icon" />
              </template>
              <template #title>{{ menu.meta.title }}</template>
              <template v-for="item in menu.children" :key="item.path">
                <template v-if="!item.children && !item.meta.isHide">
                  <a-menu-item :key="!item.path.startsWith('http') ? item.path : item.name">
                    <router-link :to="item.path" v-if="!item.path.startsWith('http')">
                      <span>{{item.meta.title}}</span>
                    </router-link>
                    <a :href="item.path" target="_blank" v-else>
                      <span>{{item.meta.title}}</span>
                    </a>
                  </a-menu-item>
                </template>
                <template v-else-if="!item.meta.isHide">
                  <sub-menu :menu-info="item" :key="item.path"/>
                </template>
              </template>
            </a-sub-menu>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header-wrap"></a-layout-header>
      <a-layout-content>
        <router-view v-slot="{ Component }">
          <template v-if="Component">
            <Transition name="slide-right" mode="out-in">
              <div :key="route.fullPath">
                <component :is="Component" />
              </div>
            </Transition>
          </template>
        </router-view>
      </a-layout-content>
      <a-layout-footer class="layout-footer-wrap"></a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { computed, onBeforeMount, reactive } from "vue";
import { otherMenus } from "@/router/route";
import { useRoute } from "vue-router";
const route = useRoute()
const menuList = otherMenus[0].children;
const state = reactive({
  openKeys:[''],
  selectedKeys:[''],
});
const onOpenChange = (openKeys) => {
  const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key));
  state.openKeys = latestOpenKey ? [latestOpenKey] : [];
};
const selectActive = computed(() => {
  const {meta,path} = route
  if (meta.active) {
    return meta.active
  }
  return path
})
state.selectedKeys = [selectActive.value];
onBeforeMount(() => {
  state.openKeys = ['/'+route.path.split('/').filter(Boolean)[0]]
});
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