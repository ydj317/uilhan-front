<template>
  <img src="../../../../assets/img/edit_icon.png" style="width: 15px;height: 15px;"/>
  <a href="javascript:void(0)" @click="$emit('click')" style="color: white;font-weight: bold;">
    편집
  </a>
</template>
<script setup>
defineEmits(['click'])
</script>
