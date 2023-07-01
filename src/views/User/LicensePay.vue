<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="서비스 결제" class="license-pay-page">
    <a-descriptions title="서비스" bordered :column="{ xs: 2, sm: 2, md: 2}" :style="{marginBottom:'20px'}">
      <a-descriptions-item label="서비스 선택">
        <a-select v-model:value="licenseSelected" @change="licenseSelectChange" style="width: 100%;">
          <a-select-option value="">선택</a-select-option>
          <a-select-option v-for="license in licenseList" :value="license.id">{{ license.name }}</a-select-option>
        </a-select>
      </a-descriptions-item>

      <a-descriptions-item label="은행">
        <a-input type="text" v-model:value="formState.card_bank" />
      </a-descriptions-item>

      <a-descriptions-item label="예금주">
        <a-input type="text" v-model:value="formState.card_name" />
      </a-descriptions-item>

      <a-descriptions-item label="카드번호">
        <a-input type="text" v-model:value="formState.card_number" />
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions title="결제가격" bordered :column="{ xs: 1, sm: 1, md: 1}" :style="{marginBottom:'20px'}">
      <a-descriptions-item label="정가">
        {{ formState.price }}원
      </a-descriptions-item>

      <a-descriptions-item label="부가세">
        {{ formState.price / 10 }}원
      </a-descriptions-item>

      <a-descriptions-item label="총 결제금액">
        {{ formState.final_price }}원
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions title="결제수단(무통장입금)" bordered :column="{ xs: 1, sm: 1, md: 1}" :style="{marginBottom:'20px'}">
      <a-descriptions-item label="은행">
        IBK기업은행
      </a-descriptions-item>
      <a-descriptions-item label="예금주">
        월드링크크로스보더이커머스
      </a-descriptions-item>
      <a-descriptions-item label="계좌번호">
        338-082819-04-011
      </a-descriptions-item>
    </a-descriptions>

    <div class="center">
      <a-button type="primary" @click="BuyLicense">결제하기</a-button>
    </div>
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import { onMounted, reactive, ref } from "vue";
import router from "@/router";

// loading
const indicator = ref(false);
const cartLoading = ref(true);

const licenseList = ref([]);
const licenseSelected = ref("");
const formState = reactive({
  name: "",
  price: 0,
  final_price: 0,
  day: 0,
  card_bank: "",
  card_name: "",
  card_number: "",
  status: "0"
});

function BuyLicense() {
  if (formState.name === "") {
    alert("서비스를 선택 해 주세요.");
    return false;
  }

  if (formState.card_bank === "") {
    alert("은행은 필수로 입력 부탁합니다.");
    return false;
  }

  if (formState.card_name === "") {
    alert("예금주는 필수로 입력 부탁합니다.");
    return false;
  }

  if (formState.card_number === "") {
    alert("카드번호는 필수로 입력 부탁합니다.");
    return false;
  }

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/licenseHistory/buy", formState).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
        indicator.value = false;
        return false;
      }

      alert("결제신청 성공하였습니다.");
      router.push("/user/licenseHistory");

      indicator.value = false;
    }
  );
}

function licenseSelectChange() {
  formState.name = "";
  formState.price = 0;
  formState.final_price = 0;
  formState.day = 0;

  const selectedValue = licenseList.value.find(item => item.id === licenseSelected.value);
  if (selectedValue) {
    formState.name = selectedValue.name;
    formState.price = selectedValue.price;
    formState.final_price = Math.round(selectedValue.price * 1.1);
    formState.day = selectedValue.day;
  }
}

function getLicense() {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/license/list").then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      licenseList.value = res.data;

      cartLoading.value = false;
    }
  );
}

onMounted(() => {
  getLicense();
});
</script>

<style>
.license-pay-page .ant-descriptions-item-label {
  width: 200px;
}
</style>