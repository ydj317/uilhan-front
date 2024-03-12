<template>
  <loading
    :active="show"
    @update:active="$emit('update:show', $event)"
    :can-cancel="false"
    :is-full-page="true"
  />
</template>

<script setup>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

defineProps(['show'])
defineEmits(['update:show'])
</script>
