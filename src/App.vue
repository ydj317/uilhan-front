<template>
  <a-config-provider :theme="{
      token: {
        colorPrimary: '#ffd117',
      }
    }">
    <router-view/>
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue';
import {onMounted} from "vue";
onMounted(() => {
  console.log(theme);
})
</script>

<style scoped>

</style>
