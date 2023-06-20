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
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

</style>
