<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" :title="'서비스 ' + (route.params.id ? '수정' : '등록')">
    <a-form :model="formState" name="license_form" @finish="onFinish"
            @finishFailed="onFinishFailed" autocomplete="off" :scrollToFirstError="true" layout="horizontal"
            class="delivery_form">

      <a-form-item label="서비스명" name="name"
                   :rules="[{ required: true, message: '서비스명을 입력해 주세요.' }]">
        <a-input v-model:value="formState.name" allow-clear placeholder="서비스명을 입력해 주세요." />
      </a-form-item>

      <a-form-item label="가격" name="price"
                   :rules="[{ required: true, message: '가격을 입력해 주세요.' },
                     { pattern: /^[0-9]+$/, message: '숫자만 입력해 주세요.' }]">
        <a-input v-model:value="formState.price" allow-clear placeholder="가격을 입력해 주세요." />
      </a-form-item>

      <a-form-item label="충전 일수" name="day"
                   :rules="[{ required: true, message: '충전 일수를 입력해 주세요.' },
                     { pattern: /^[0-9]+$/, message: '숫자만 입력해 주세요.' }]">
        <a-input v-model:value="formState.day" allow-clear placeholder="충전 일수를 입력해 주세요." />
      </a-form-item>

      <a-form-item label="사용 여부" name="status">
        <a-radio-group v-model:value="formState.status">
          <a-radio :value="'1'">사용중</a-radio>
          <a-radio :value="'0'">사용중지</a-radio>
        </a-radio-group>
      </a-form-item>

      <div style="display: flex;justify-content: center;margin-top: 20px;">
        <a-button type="primary" html-type="submit">저장</a-button>
        <a-button style="margin-left: 10px" @click="router.back()">취소</a-button>
      </div>
    </a-form>
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

// loading
const indicator = ref(false);
const cartLoading = ref(true);

const route = useRoute();
const formState = reactive({
  id: route.params.id,
  name: "",
  price: "",
  day: "",
  status: '1'
});

const onFinish = values => {
  indicator.value = true;
  values = Object.assign(values, { id: formState.id });
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/license/save", values).then((res) => {
    if (res.status !== "2000") {
      alert(res.message);
      indicator.value = false;
      return false;
    }

    alert("서비스 등록 성공하였습니다.");
    router.push("/user/license");
  }).catch((error) => {
    alert(error.message);
    indicator.value = false;
    return false;
  });
};

const onFinishFailed = errorInfo => {
  console.log("Failed:", errorInfo);
};

function getLicense() {
  if (!route.params.id) {
    cartLoading.value = false;
  }
  const requestParams = {
    id: route.params.id
  };

  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/license", { params: requestParams }).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      formState.name = res.data.name;
      formState.price = res.data.price;
      formState.day = res.data.day;
      formState.status = res.data.status;

      cartLoading.value = false;
    }
  );
}

onMounted(() => {
  getLicense();
});
</script>

<style>
.delivery_form .ant-form-item {
  margin-bottom: 0;
}

.delivery_form .ant-form-item-label {
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.delivery_form .ant-form-item-control {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.delivery_form .ant-form-item-control:nth-last-child {
  border-bottom: 1px solid #eeeeee;
}
</style>

<style scoped>
</style>