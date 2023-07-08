<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :bordered="false" :title="'배송정보 변경'">

    <a-form ref="formRef" :rules="rulesRef" :model="formState" name="user_form" class="user_form" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">

      <a-form-item label="기존 비밀번호" name="password" has-feedback>
        <a-input-password v-model:value="formState.password"
                          type="password" placeholder="기존 비밀번호 입력해주시오" />
      </a-form-item>

      <a-form-item label="새로운 비밀번호" name="new_password" has-feedback>
        <a-input-password v-model:value="formState.new_password"
                          type="password" placeholder="새로운 비밀번호 길이는 최소 8자 최대 20자 이내로 입력해주십시오" />
      </a-form-item>

      <a-form-item label="비밀번호 확인" name="password_confirm" has-feedback>
        <a-input-password v-model:value="formState.password_confirm"
                          type="password" placeholder="비밀번호 길이는 최소 8자 최대 20자 이내로 입력해주십시오" />
      </a-form-item>

      <div style="display: flex;justify-content: center;margin-top: 20px;">
        <a-button type="primary" html-type="submit">변경하기</a-button>
        <a-button style="margin-left: 10px" @click="router.back()">취소</a-button>
      </div>
    </a-form>

  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import { reactive, ref } from "vue";
import router from "@/router";

// loading
const indicator = ref(false);

const formRef = ref();

const formState = reactive({
  password: "",
  new_password: "",
  password_confirm: ""
});

let validatePass = async (rule, value) => {
  if (value === "") {
    return Promise.reject("기존 비밀번호를 입력해주십시오");
  }

  return Promise.resolve();
};

let validateNewPass = async (rule, value) => {
  if (value === "") {
    return Promise.reject("새로운 비밀번호를 입력해주십시오");
  } else {
    if (value.length < 8 || value.length > 20) {
      return Promise.reject("새로운 비밀번호 길이는 최소 8자 최대 20자이내로 입력해주십시오");
    }

    if (formState.password_confirm !== "") {
      formRef.value.validateFields("password_confirm");
    }

    return Promise.resolve();
  }
};

let validatePassConfirm = async (rule, value) => {
  if (value === "") {
    return Promise.reject("비밀번호가 일치하지 않습니다");
  } else if (value !== formState.new_password) {
    return Promise.reject("비밀번호가 일치하지 않습니다");
  } else {
    return Promise.resolve();
  }
};

const rulesRef = reactive({
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: "blur"
    }
  ],
  new_password: [
    {
      required: true,
      validator: validateNewPass,
      trigger: "blur"
    }
  ],
  password_confirm: [
    {
      required: true,
      validator: validatePassConfirm,
      trigger: "blur"
    }
  ]
});

const onFinish = () => {
  let user = {
    password: formState.password,
    new_password: formState.new_password
  };

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userDetail", user).then((res) => {
    if (res.status !== "2000") {
      alert(res.message);
      indicator.value = false;
      return false;
    }
    console.log(res);

    alert(res.message);

    indicator.value = false;
  });
};

const onFinishFailed = errorInfo => {
  console.log("Failed:", errorInfo);
};

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