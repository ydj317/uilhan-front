<template>
  <a-menu
    theme="dark"
    mode="inline"
    v-model:selectedKeys="state.selectedKeys"
    v-model:openKeys="state.openKeys"
    @openChange="onOpenChange"
    class="layout-left-menu"
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
</template>

<script setup>
import { reactive, onBeforeMount, computed} from "vue";
import {useRoute, useRouter} from "vue-router";

import SubMenu from "@/views/Template/SubMenu.vue";
import { otherMenus } from "@/router/route";

const router = useRouter()
const route = useRoute()

const state = reactive({
  menuList: otherMenus[0].children,
  selectedKeys: [],
  openKeys: [],
});

const onOpenChange = (openKeys) => {
  state.openKeys = openKeys.length ? [openKeys[openKeys.length-1]] : [];
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
</style>
