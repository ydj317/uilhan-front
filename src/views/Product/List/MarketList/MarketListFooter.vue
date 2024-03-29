<template>
  <div style="text-align: center">
    <a-button type="primary" @click="$emit('send')">마켓연동</a-button>
    <a-button type="primary" @click="$emit('close')">닫기</a-button>
  </div>
</template>

<script setup>
defineEmits(['send', 'close'])
</script>
