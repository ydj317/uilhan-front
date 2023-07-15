<script setup>
import { ref } from 'vue';
const open = ref(true);

const showModal = () => {
  open.value = true;
};

const handleOk = (e) => {
  console.log(e);
  open.value = false;
};
</script>

<template>

  <a-modal v-model:visible="open" title="" @ok="handleOk" :mask="false" :footer="null" >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>

</template>

<style scoped>

</style>