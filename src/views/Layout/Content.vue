<template>
 <div>
   <router-view v-slot="{ Component }">
     <template v-if="Component">
     <Transition name="slide-right" mode="out-in">
         <div :key="route.fullPath">
         <component :is="Component" />
         </div>
     </Transition>
     </template>
   </router-view>
 </div>
</template>
<script setup>
import {useRoute} from "vue-router";
const route = useRoute();
</script>
<style scoped>
</style>
