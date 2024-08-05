<template>
  <a-layout class="wrap">
    <a-layout-sider class="menu-wrap">
      <div class="logo-wrap fl-cc">
        <img src="@/assets/logo_icon.png">
      </div>
<!--      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" v-model:openKeys="openKeys">-->
<!--        <template v-for="v in otherMenus[0].children">-->
<!--          <template v-if="v.children">-->
<!--            <a-sub-menu :key="!v.path.startsWith('http') ? v.path : v.name">-->
<!--              <template #title>-->
<!--                <span>-->
<!--                  <template #icon>-->
<!--                <component :is="v.meta.icon" />-->
<!--              </template>-->
<!--                  <span>{{ v.meta.title }}</span>-->
<!--                </span>-->
<!--              </template>-->
<!--              <a-menu-item :key="v2.path" v-for="v2 in v.children">{{ v2.meta.title }}</a-menu-item>-->
<!--            </a-sub-menu>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <a-menu-item :key="v.path">-->
<!--              <template #icon>-->
<!--                <component :is="v.meta.icon" />-->
<!--              </template>-->
<!--              <a :href="v.path">-->
<!--                <span class="nav-text">{{ v.meta.title }}</span>-->
<!--              </a>-->
<!--            </a-menu-item>-->
<!--          </template>-->
<!--        </template>-->
<!--      </a-menu>-->
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header-wrap"></a-layout-header>
      <a-layout-content>
        <div class="layout-content-wrap">
        </div>
      </a-layout-content>
      <a-layout-footer class="layout-footer-wrap"></a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<!--讲师管理 -> 아카데미-->
<!--讲师列表 -》 강사리스트-->
<script setup>
import { UserOutlined } from "@ant-design/icons-vue";
import {onMounted, ref} from 'vue';
import { otherMenus } from "@/router/route";
const selectedKeys = ref(['1']);
const openKeys = ref(['sub1']);
console.log('otherMenus',otherMenus);
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
.wrap .layout-content-wrap{
  background: #fff;
  min-height: calc(100vh - 160px);
  padding: 20px;
}
.wrap .layout-footer-wrap{
  background: #fff;
  height: 100px;
}
:deep(.ant-menu-item-selected) {
  font-weight: bold;
  color: #001529;
}
</style>