<script setup>
const props = defineProps({
  menuInfo : Object
});

</script>

<template>
  <a-sub-menu :key="menuInfo.path">
    <template #icon>
      <component :is="menuInfo.meta.icon" />
    </template>
    <template #title>{{ menuInfo.meta.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.path">
      <template v-if="!item.children && !item.meta.isHide">
        <a-menu-item :key="item.path">
          <RouterLink :to="item.path">
          <span>{{ item.meta.title }}</span>
          </RouterLink>
        </a-menu-item>
      </template>
      <template v-else-if="!item.meta.isHide">
        <sub-menu :menu-info="item" :key="item.path"/>
      </template>
    </template>
  </a-sub-menu>
</template>

<style scoped>

</style>