<template>
  <div style="position: sticky;top: 0;">
    <a-menu v-model:selectedKeys="state.selectedKeys"
            v-model:openKeys = "state.openKeys"
            mode="inline"
            theme="dark"
            @openChange="onOpenChange"
    >
      <template v-for="(menu, index) in state.menuList" :key="index">
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
          <sub-menu :key="menu.path" :menuInfo="menu" />
        </template>

      </template>
    </a-menu>
  </div>
</template>

<script setup>
import {ref, reactive, onBeforeMount, computed, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

import { setFilterRouteList } from "@/router"
import SubMenu from "@/views/Template/SubMenu.vue";
import {lib} from "@/util/lib";

const router = useRouter()
const route = useRoute()

const state = reactive({
  menuList: [],
  rootSubmenuKeys: ['/board', '/setting', '/user'],
  selectedKeys: ['/main'],
  openKeys: [],
});

const onOpenChange = (openKeys) => {
  const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key));

  if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    state.openKeys = openKeys;
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : [];
  }
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
  if(lib.isWorldLink()) {
    state.menuList = setFilterRouteList()[0].children
  } else {
    // delete blog menu
    state.menuList = setFilterRouteList()[0].children.filter(item => item.path !== '/blog')
  }

  state.openKeys = ['/'+route.path.split('/').filter(Boolean)[0]]
});

</script>

<style scoped>
.ant-menu .ant-menu-submenu {
  font-weight: 600;
  color: #e3e3e3;
}
.ant-menu-item .ant-menu-title-content a {
  font-weight: 600;
  color: #e3e3e3;
}
</style>
<style>
.ant-menu .ant-menu-submenu {
  font-weight: 600;
  color: #e3e3e3;
}
</style>
