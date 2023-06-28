<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="유료플랜" class="setting-page-margin">
    111
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import {
  // UploadOutlined
} from "@ant-design/icons-vue";
import { onMounted, ref } from "vue";

// loading
const indicator = ref(false);
const cartLoading = ref(true);

function getRecharge() {
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/list').then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      console.log('==0==')
      console.log(res)

      cartLoading.value = false;
    }
  );
}

function getUser() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user", {}).then(
    (res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      console.log('==0==')
      console.log(res)

      cartLoading.value = false;
    }
  );
}

onMounted(() => {
  getUser();
  // getRecharge();
});
</script>

<style scoped>
</style>