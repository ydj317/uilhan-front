<template>
  <a-config-provider :getPopupContainer="getPopupContainer">
    <router-view/>
  </a-config-provider>
</template>

<script>
  export default {
    methods: {
      getPopupContainer(el, dialogContext) {
        console.log('==0==')
        console.log(el)
        console.log(dialogContext)
        return document.body;
      },
    },
  };
</script>

<style scoped>

</style>
