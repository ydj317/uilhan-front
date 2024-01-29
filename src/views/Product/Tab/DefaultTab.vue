<template>
  <div>
    <CustomsInfo />
  </div>
</template>

<script setup>
import {defineAsyncComponent} from "vue";

const CustomsInfo = defineAsyncComponent(() => import('@/components/Detail/customsInfo'))

</script>