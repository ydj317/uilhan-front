<template>
  <div style="position: sticky;top: 0;">
    <a-menu v-model:selectedKeys="state.selectedKeys"
            v-model:openKeys = "state.openKeys"
            mode="inline"
            theme="dark"
            @openChange="onOpenChange"
    >
      <template v-for="(menu, index) in menus[0].children" :key="index">
        <template v-if="!menu.children && !menu.meta.isHide">
          <a-menu-item :key="menu.path">
            <template #icon>
              <component :is="menu.meta.icon" />
            </template>
            <router-link :to="menu.path">
              <span>{{menu.meta.title}}</span>
            </router-link>
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
import {ref, reactive, onBeforeMount, computed} from "vue";
import Cookie from "js-cookie";
import {useRoute, useRouter} from "vue-router";

import { menus } from "@/router/menu";
import SubMenu from "@/views/Template/SubMenu.vue";

const router = useRouter()
const route = useRoute()

const isAdmin = ref(false);
const state = reactive({
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

onBeforeMount(() => {
  const roles = Cookie.get("member_roles");
  if (roles.indexOf("ROLE_ADMIN") > -1) {
    isAdmin.value = true;
  }

  state.openKeys = ['/'+route.path.split('/').filter(Boolean)[0]]
  state.selectedKeys = [route.path]
});

</script>

<style scoped>

</style>
