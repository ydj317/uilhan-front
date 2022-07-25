<template>
  <div class="_container">
    <div class="top">
      <div class="top_image">
        <img src="../../assets/img/logo-light.png" alt="">
      </div>
      <div class="top_text">
        <h5>저희 릴라켓플러스 이용해주셔서 감사합니다!</h5>
      </div>
    </div>
    <div class="item">
      <div>
        <h5>릴라켓플러스 로그인하기</h5>
      </div>
      <a-form class="item_form"
              layout="inline"
              :model="formState"
              @finish="handleFinish"
              @finishFailed="handleFinishFailed"
      >
        <a-form-item class="item_input">
          <a-input v-model:value="formState.username" placeholder="Username">
            <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>
        </a-form-item>
        <a-form-item  class="item_input">
          <a-input v-model:value="formState.password" type="password" placeholder="Password">
            <template #prefix><LockOutlined/></template>
          </a-input>
        </a-form-item>
        <a-form-item class="item_buttons">
          <a-button
              type="primary"
              html-type="submit"
              :disabled="formState.user === '' || formState.password === ''"
              class="loginButton"
          >
            Log in
          </a-button>
          <a class="ant-btn ant-btn-dashed loginButton" href="/user/register">회원가입</a>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
import router from "router/index.js";
import { LoginRequest } from 'util/request';
import { defineComponent, reactive, onBeforeMount } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import Cookie from "js-cookie";
import { isLogin, cookieInit } from "util/auth";
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined
  },

  setup() {
    onBeforeMount(() => {
      if (isLogin() === true) {
        router.push("/product");
        return false;
      } else {
        cookieInit();
        router.push("/user/login");
        return false;
      }
    });

    const formState = reactive({
      username: '',
      password: '',
    });

    const handleFinish = () => {
      let user = {
        username: formState.username,
        password: formState.password,
      };

      LoginRequest.post(
          process.env.VUE_APP_API_URL + '/api/login', user).then((res) => {
        if (res.status === undefined || res.status !== 200) {
          alert('login error');
          return false;
        }

        if (res.data.member_roles === undefined) {
          alert('사용자 권한부여에 실패하였습니다. 시스템 관리자와 문의하시길 바랍니다.');
          return false;
        }

        Cookie.set('member_name', res.data.member_name);
        Cookie.set('member_roles', res.data.member_roles);
        router.push("/product");
        return false;
      });
    };

    const handleFinishFailed = () => {
      alert('Login Error')
    };

    const remember = false;

    const redirectRegister = () => {
      router.push("/user/register");
      return false;
    };

    return {
      remember,
      formState,
      handleFinish,
      handleFinishFailed,
      redirectRegister
    };
  },
});
</script>

<style scoped>
div {
  /*border: 1px solid red;*/
}

._container {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 112px 112px 112px 96px;

  background-image: url(../../assets/img/bg-pattern.png);
  background-color: #3051d3;

  --uim-primary-opacity: 1;
  --uim-secondary-opacity: 0.70;
  --uim-tertiary-opacity: 0.50;
  --uim-quaternary-opacity: 0.25;
  --uim-quinary-opacity: 0;

  --blue: #3051D3;
  --indigo: #564ab1;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #F06543;
  --orange: #f1734f;
  --yellow: #e4cc37;
  --green: #3ddc97;
  --teal: #008080;
  --cyan: #00A7E1;
  --white: #fff;
  --gray: #7c8a96;
  --gray-dark: #343a40;
  --primary: #3051D3;
  --secondary: #7c8a96;
  --success: #3ddc97;
  --info: #00A7E1;
  --warning: #e4cc37;
  --danger: #F06543;
  --light: #eff2f7;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: "Nunito",sans-serif;
  --font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
}

.top {
  width: 1116px;
  height: 89.188px;
}

.top_image {
  display: flex;
  justify-content: center;
}

.top_image img {
  width: 180px;
  height: 40px;
}

.top_text h5 {
  color: #98a8e9;
  font-family: Nunito, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.2px;
  text-align: center;
  text-size-adjust: 100%;
  padding-top: 12px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 50px;
  width: 1140px;
  height: 428.406px;
  background-color: white;
}

.item_form, item_buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>