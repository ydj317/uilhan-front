<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>

</template>

<script setup>
import Loading from "vue-loading-overlay";
import {onMounted, ref} from "vue";
import {useUserApi} from "@/api/user";
import {message} from "ant-design-vue";
const indicator = ref(false)

async function getUserInfoData() {
  try {
    await useUserApi().getUserInfoData({}).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
      this.userinfo = res.data;
      if (['jwli', 'irunkorea_02', 'haeju'].includes(res.data['username'])) {
        this.haveDownloadProductPermission = true;
      }

    });
  } catch (error) {
    message.error(error.message);
    return false;
  }
}

onMounted(() => {
  Promise.all([
    this.getUserInfoData(),
    // this.getMarketList(),
    // this.getMarketDetailUrls(),
    // this.getList("reload"),
    // this.getSmartstoreCategory()
  ]);
})

</script>

<style lang="scss" scoped>

</style>