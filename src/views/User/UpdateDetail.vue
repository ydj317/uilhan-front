<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" :title="'사용자 정보 수정'">

    <a-form :rules="rulesRef" :model="formState" name="user_form" class="user_form" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">

      <a-form-item label="아이디">
        {{ formState.username }}
      </a-form-item>

      <a-form-item label="비밀번호" name="password" has-feedback>
        <a-input-password v-model:value="formState.password" type="password" placeholder="비밀번호 입력해주시오" />
      </a-form-item>

      <a-form-item label="사용자명/사업자명" name="name" has-feedback>
        <a-input v-model:value="formState.name" placeholder="사용자명/사업자명을 입력해주시오" />
      </a-form-item>

      <a-form-item label="Email" name="email" has-feedback>
        <a-input v-model:value="formState.email" placeholder="Email을 입력해주시오" />
      </a-form-item>

      <a-form-item label="휴대전화" name="phone1">
        <a-row :gutter="10">
          <a-col style="width: 160px;">
            <a-form-item name="phone1" class="phone" has-feedback>
              <a-input v-model:value="formState.phone1" placeholder="휴대전화" />
            </a-form-item>
          </a-col>
          <a-col style="width: 160px;">
            <a-form-item name="phone2" class="phone" has-feedback>
              <a-input v-model:value="formState.phone2" placeholder="휴대전화" />
            </a-form-item>
          </a-col>
          <a-col style="width: 160px;">
            <a-form-item name="phone3" class="phone" has-feedback>
              <a-input v-model:value="formState.phone3" placeholder="휴대전화" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item label="업체명/사업자명" name="com_name" has-feedback>
        <a-input v-model:value="formState.com_name" placeholder="업체명/사업자명을 입력해주시오" />
      </a-form-item>

      <a-form-item label="사업자번호" name="com_number" has-feedback>
        <a-input v-model:value="formState.com_number" placeholder="사업자번호를 입력해주시오" />
      </a-form-item>

      <a-form-item label="사업장 전화번호" name="com_phone1">
        <a-row :gutter="10">
          <a-col style="width: 160px;">
            <a-form-item name="com_phone1" class="phone" has-feedback>
              <a-input v-model:value="formState.com_phone1" placeholder="전화번호" />
            </a-form-item>
          </a-col>
          <a-col style="width: 160px;">
            <a-form-item name="com_phone2" class="phone" has-feedback>
              <a-input v-model:value="formState.com_phone2" placeholder="전화번호" />
            </a-form-item>
          </a-col>
          <a-col style="width: 160px;">
            <a-form-item name="com_phone3" class="phone" has-feedback>
              <a-input v-model:value="formState.com_phone3" placeholder="전화번호" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item label="대표자명" name="com_ceo" has-feedback>
        <a-input v-model:value="formState.com_ceo" placeholder="대표자명을 입력해주시오" />
      </a-form-item>

      <a-form-item label="유선전화" name="tel1">
        <a-row :gutter="10">
          <a-col style="width: 160px;">
            <a-form-item name="tel1" class="phone" has-feedback>
              <a-input v-model:value="formState.tel1" placeholder="유선전화" />
            </a-form-item>
          </a-col>
          <a-col style="width: 160px;">
            <a-form-item name="tel2" class="phone" has-feedback>
              <a-input v-model:value="formState.tel2" placeholder="유선전화" />
            </a-form-item>
          </a-col>
          <a-col style="width: 160px;">
            <a-form-item name="tel3" class="phone" has-feedback>
              <a-input v-model:value="formState.tel3" placeholder="유선전화" />
            </a-form-item>
          </a-col>
        </a-row>
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
import router from "@/router";

// loading
const indicator = ref(false);
const cartLoading = ref(true);

const formState = reactive({
  username: "",
  password: "",
  //[필수] 사용자명/사업자명
  name: "",
  //[필수] 이메일
  email: "",
  //[필수] 휴대전화
  phone1: "",
  phone2: "",
  phone3: "",
  //유선전화
  tel1: "",
  tel2: "",
  tel3: "",
  //[필수] 사업자명/업체명
  com_name: "",
  //[필수] 사업자번호
  com_number: "",
  //사업장전화번호
  com_phone1: "",
  com_phone2: "",
  com_phone3: "",
  //대표자명
  com_ceo: ""
});

let validateName = async (rule, value) => {
  if (value === "") {
    return Promise.reject("사용자 또는 사업자명을 입력해주십시오");
  } else {
    if (value.length < 2 || value.length > 20) {
      return Promise.reject("사업자명은 최소 2자 최대 20자이내로 입력해주십시오");
    }
  }

  return Promise.resolve();
};

let validateEmail = async (rule, value) => {
  if (value === "") {
    return Promise.reject("메일을 입력해주십시오");
  } else {
    let regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    if (regEmail.test(value) !== true) {
      return Promise.reject("메일 격식이 옳바르지 않습니다.");
    }
  }

  return Promise.resolve();
};

let validatePhone = async (rule, value) => {
  if (value === "") {
    return Promise.reject("번호를 입력해주십시오");
  } else {
    let regPhone = /^\d{4}$/;
    if (regPhone.test(value) !== true) {
      return Promise.reject("숫자를 입력해주십시오");
    }
  }

  return Promise.resolve();
};

let _validatePhone = async (rule, value) => {
  if (value === "") {
    return Promise.reject("번호를 입력해주십시오");
  } else {
    let regPhone = /^\d{4}$/;
    if (regPhone.test(value) !== true) {
      return Promise.reject("숫자를 입력해주십시오");
    }
  }

  return Promise.resolve();
};

let validatePhoneFirst = async (rule, value) => {
  if (value === "") {
    return Promise.reject("번호를 입력해주십시오");
  } else {
    let regPhone = /^\d{2,3}$/;
    if (regPhone.test(value) !== true) {
      return Promise.reject("숫자를 입력해주십시오");
    }
  }

  return Promise.resolve();
};

let validateComname = async (rule, value) => {
  if (value === "") {
    return Promise.reject("업체 또는 사업자명을 입력해주십시오");
  } else {
    if (value.length < 2 || value.length > 20) {
      return Promise.reject("업체명은 최소 2자 최대 20자이내로 입력해주십시오");
    }
  }

  return Promise.resolve();
};

let validateComnumber = async (rule, value) => {
  if (value === "") {
    return Promise.reject("사업자번호를 입력해주십시오");
  } else {
    let comnumber = /^([0-9]{3})-?([0-9]{2})-?([0-9]{5})$/;

    if (comnumber.test(value) !== true) {
      return Promise.reject("사업자번호 격식이 옳바르지 않습니다.");
    }
  }

  return Promise.resolve();
};

let validateComCeo = async (rule, value) => {
  if (value === "") {
    return Promise.reject("대표자명을 입력해주십시오");
  } else {
    if (value.length < 2 || value.length > 10) {
      return Promise.reject("대표자명은 최소 2자 최대 10자이내로 입력해주십시오");
    }
  }

  return Promise.resolve();
};

const rulesRef = reactive({
  name: [
    {
      required: true,
      validator: validateName,
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      validator: validateEmail,
      trigger: "blur"
    }
  ],
  phone1: [
    {
      required: true,
      validator: validatePhoneFirst,
      trigger: "blur"
    }
  ],
  phone2: [
    {
      required: true,
      validator: _validatePhone,
      trigger: "blur"
    }
  ],
  phone3: [
    {
      required: true,
      validator: validatePhone,
      trigger: "blur"
    }
  ],
  com_name: [
    {
      required: true,
      validator: validateComname,
      trigger: "blur"
    }
  ],
  com_number: [
    {
      required: true,
      validator: validateComnumber,
      trigger: "blur"
    }
  ],
  com_phone1: [
    {
      required: true,
      validator: validatePhoneFirst,
      trigger: "blur"
    }
  ],
  com_phone2: [
    {
      required: true,
      validator: _validatePhone,
      trigger: "blur"
    }
  ],
  com_phone3: [
    {
      required: true,
      validator: validatePhone,
      trigger: "blur"
    }
  ],
  com_ceo: [
    {
      required: true,
      validator: validateComCeo,
      trigger: "blur"
    }
  ],
  tel1: [
    {
      validator: validatePhoneFirst,
      trigger: "blur"
    }
  ],
  tel2: [
    {
      validator: _validatePhone,
      trigger: "blur"
    }
  ],
  tel3: [
    {
      validator: validatePhone,
      trigger: "blur"
    }
  ]
});

const onFinish = () => {
  let user = {
    password: formState.password,
    name: formState.name,
    email: formState.email,
    phone: formState.phone1 + "-" + formState.phone2 + "-" + formState.phone3,
    tel: formState.tel1 + "-" + formState.tel2 + "-" + formState.tel3,
    com_name: formState.com_name,
    com_number: formState.com_number,
    com_phone: formState.com_phone1 + "-" + formState.com_phone2 + "-" + formState.com_phone3,
    com_ceo: formState.com_ceo,
  };

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", user).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      indicator.value = false;
      return false;
    }
    console.log(res)

    alert(res.message);

    indicator.value = false;
  });
};

const onFinishFailed = errorInfo => {
  console.log("Failed:", errorInfo);
};

function splitPhone (key, phone) {
  if (phone === undefined || phone === null || phone === '') {
    return false
  }

  if (phone.includes("-")) {
    const phoneArray = phone.split("-");
    formState[key + 1] = phoneArray[0]
    formState[key + 2] = phoneArray[1]
    formState[key + 3] = phoneArray[2]
  } else {
    formState[key + 1] = '';
    formState[key + 2] = phone.slice(-8, -4);
    formState[key + 3] = phone.slice(-4);

    if (phone.length > 8) {
      formState[key + 1] = phone.slice(0, -8);
    }
  }}

function getUser() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user", {}).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      formState.username = res.data.member_name
      formState.name = res.data.name
      formState.email = res.data.email
      splitPhone('phone', res.data.phone)
      formState.com_name = res.data.com_name;
      formState.com_number = res.data.com_number;
      splitPhone('com_phone', res.data.com_phone)
      formState.com_ceo = res.data.com_ceo;
      splitPhone('tel', res.data.tel)

      cartLoading.value = false;
    }
  );
}

onMounted(() => {
  getUser();
});
</script>

<style>
.user_form .ant-form-item {
  margin-bottom: 0;
}

.user_form .ant-form-item-label {
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.user_form .ant-form-item-control {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.user_form .ant-form-item-control:nth-last-child {
  border-bottom: 1px solid #eeeeee;
}

.user_form .phone .ant-form-item-control {
  border: none;
  padding: 0;
  margin: 0;
}

.user_form .phone .ant-form-item-control:nth-last-child {
  border-bottom: none;
}
</style>

<style scoped>

</style>