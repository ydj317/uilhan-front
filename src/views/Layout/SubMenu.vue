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
