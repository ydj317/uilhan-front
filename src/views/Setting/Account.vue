<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="릴라켓정보" class="setting-page-margin" :style="{marginBottom:'20px'}">
    <a-descriptions title="세션키 설정" bordered :column="{ xs: 1, sm: 1, md: 1}">
      <a-descriptions-item label="세션키">
        <div>
          <a-input class="" v-model:value="accessKey" placeholder="AccessKey" />
          <a-input
            class="mt5"
            v-model:value="secretKey"
            placeholder="SecretKey"
          />
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <div class="center">
      <a-button class="mt20" @click="addKey" type="primary" style="width: 100px;">등록</a-button>
    </div>
  </a-card>

</template>

<script setup>
import { AuthRequest } from "@/util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import { onMounted, ref } from "vue";

const accessKey = ref();
const secretKey = ref();

// loading
const indicator = ref(false)
const cartLoading = ref(true)

function addKey() {
  if (accessKey.value.length === undefined || accessKey.value.length === 0) {
    alert("accessKey는 필수로 입력해주십시오");
    return false;
  }

  if (secretKey.value.length === undefined || secretKey.value.length === 0) {
    alert("secretKey는 필수로 입력해주십시오");
    return false;
  }

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    access_key: accessKey.value,
    secret_key: secretKey.value,
    type: "key",
  }).then((res) => {
    if (res.status !== '2000') {
      alert(res.message);
      return false;
    }

    alert("등록성공");
    indicator.value = false;
  });
}

function getUser() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user", {}).then(
    (res) => {
      if (res.status !== '2000') {
        alert(res.message)
      }

      accessKey.value = res.data.key.access_key;
      secretKey.value = res.data.key.secret_key;

      cartLoading.value = false
    }
  );
}

onMounted(() => {
  getUser();
})

</script>

<style>
.setting-page-margin .ant-descriptions-item-label {
  width: 200px;
}
</style>