<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="서비스 결제">
    <a-descriptions title="남은 서비스 일자">
      <a-descriptions-item>
        30일<br>서비스 마감일: 2023-06-29 10:47:50
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions title="서비스 설명">
      <a-descriptions-item label="요금제 안내">
        모든 이용 요금은 부가세(10%) 별도 입니다.
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions title="서비스 선택">
      <a-descriptions-item>
        <a-select v-model:value="licenseSelected" @change="licenseSelectChange" style="width: 400px;">
          <a-select-option value="">선택</a-select-option>
          <a-select-option v-for="license in licenseList" :value="license.id">{{ license.name }}</a-select-option>
        </a-select>
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions title="결제자 정보" bordered>
      <a-descriptions-item label="은행">
        <a-input type="text" v-model:value="licenseParam.card_bank" />
      </a-descriptions-item>
      <a-descriptions-item label="예금주">
        <a-input type="text" v-model:value="licenseParam.card_name" />
      </a-descriptions-item>
      <a-descriptions-item label="카드번호">
        <a-input type="text" v-model:value="licenseParam.card_number" />
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions title="결제가격">
      <a-descriptions-item label="정가">{{ licenseParam.price }}</a-descriptions-item>
      <a-descriptions-item label="부가세">{{ licenseParam.price / 10 }}</a-descriptions-item>
      <a-descriptions-item label="총 결제금액">{{ licenseParam.price * 1.1 }}</a-descriptions-item>
    </a-descriptions>
    <a-button type="primary" @click="putLicense">결제하기</a-button>
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
const licenseParam = reactive({
  name: "",
  price: 0,
  day: 0,
  card_bank: "",
  card_name: "",
  card_number: ""
});

function putLicense() {
  if (licenseParam.name === "") {
    alert("서비스를 선택 해 주세요.");
    return false;
  }

  if (licenseParam.card_bank === "") {
    alert("은행은 필수로 입력 부탁합니다.");
    return false;
  }

  if (licenseParam.card_name === "") {
    alert("예금주는 필수로 입력 부탁합니다.");
    return false;
  }

  if (licenseParam.card_number === "") {
    alert("카드번호는 필수로 입력 부탁합니다.");
    return false;
  }

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/licenseHistory/save", licenseParam).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
        indicator.value = false;
        return false;
      }

      alert("결제신청 성공하였습니다.")
      router.push('/user/licenseHistory')

      indicator.value = false;
    }
  );
}

function licenseSelectChange() {
  licenseParam.name = "";
  licenseParam.price = 0;
  licenseParam.day = 0;

  const selectedValue = licenseList.value.find(item => item.id === licenseSelected.value);
  if (selectedValue) {
    licenseParam.name = selectedValue.name;
    licenseParam.price = selectedValue.price;
    licenseParam.day = selectedValue.day;
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

function getUser() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user", {}).then(
    (res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      console.log("==0==");
      console.log(res);

      cartLoading.value = false;
    }
  );
}

onMounted(() => {
  // getUser();
  getLicense();
});
</script>