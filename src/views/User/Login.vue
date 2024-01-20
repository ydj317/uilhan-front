<template>
  <loading v-model:active="loading" :can-cancel="false" :is-full-page="true"/>
  <div class="container" style="display: flex;height: 100vh">
    <div class="login-bg"></div>
    <div class="login-form">
      <div style="display: flex;flex-direction: column; justify-content: center;align-items: center;width: 362px;">
        <img style="margin: 50px" src="../../assets/logo_icon.png" key="logo-light" alt="">
        <div style="display: flex;flex-direction: column;width: 100%;">
            <a-input v-model:value="formState.username" placeholder="아이디" class="user-name" ></a-input>
            <a-input-password v-model:value="formState.password" placeholder="비밀번호" class="user-password"></a-input-password>
        </div>
        <div style="display: flex;justify-content: space-between;font-size: 12px;align-items: center;width: 100%;margin-top: 5px">
          <a-checkbox v-model:checked="checked" style="font-size: 12px;">아이디 저장하기</a-checkbox>
          <a-switch v-model:checked="checked" size="small" style="color: #1a1a1a" checked-children="관리자" un-checked-children="알바생"/>
        </div>
        <div style="display: flex;justify-content: center;width: 100%;margin-top: 20px;">
          <a-button type="primary" html-type="submit" class="loginButton" @click="handleFinish" style="width: 100%;height: 43px;font-size: 16px;font-weight: bold;color: #1a1a1a">
            로그인
          </a-button>
        </div>
        <div style="height: 30px"></div>
        <div style="display: flex;justify-content: center;gap: 10px;width: 100%;align-items: center">
          <a-button type="link" @click="info" style="font-size: 14px;color: #1a1a1a;font-weight: bold">비밀번호 찾기</a-button>
          <a-divider type="vertical" style="height: 12px;"></a-divider>
          <a-button type="link" @click="redirectRegister" style="font-size: 14px;color: #1a1a1a;font-weight: bold">회원가입</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import router, {setFilterRouteList} from "router/index.js";
import {LoginRequest} from 'util/request';
import {defineComponent, reactive, onBeforeMount, ref, onMounted} from 'vue';
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';
import Cookie from "js-cookie";
import {isLogin, cookieInit} from "util/auth";
import {message} from 'ant-design-vue';
import {lib} from "@/util/lib";
import {useRoute} from 'vue-router';

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    Loading,
  },
  setup() {
    onBeforeMount(() => {
      if (isLogin() === true) {
        router.push("/dashboard");
        return false;
      } else {
        cookieInit();
        router.push("/user/login");
        return false;
      }
    });

    let route = useRoute();
    setTimeout(function () {
      window.document.title = route?.meta?.title;
    });

    const formState = reactive({
      username: '',
      password: ''
    });
    let loading = ref(false);
    const handleFinish = () => {
      if (formState.username === '' || formState.password === '') {
        message.warning('아이디 또는 비밀번호을  입력해주시오');
        return true
      }

      let user = {
        username: formState.username,
        password: formState.password,
      };
      loading.value = true;
      LoginRequest.post(
          process.env.VUE_APP_API_URL + '/api/login', user).then((res) => {
        if (res.status === 400 || res.status === 401) {
          message.warning('아이디 또는 비밀번호가 잘못 입력 되었습니다.');
          loading.value = false;
          return false;
        }

        if (res.status !== '2000') {
          message.error(res.message);
          loading.value = false;
          return false;
        }

        if (res.data.member_roles === undefined) {
          message.error('처리중 오류가 발생하였습니다. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.(role error)');
          loading.value = false;
          return false;
        }


        ChannelIO('boot', {
          "pluginKey": "33974dfe-4ab5-4a61-8d67-748faed23416",
          "memberId": res.data.member_name,
          "profile": {
            "name": res.data.member_name
          }
        });

        // 아이디 저장하기
        tempSave();

        Cookie.set('member_name', res.data.member_name);
        Cookie.set('member_roles', res.data.member_roles);
        const menuList = setFilterRouteList();
        router.addRoute(menuList[0])
        router.push("/dashboard");
        loading.value = false;
        return false;
      });
    };

    const handleFinishFailed = () => {
      message.error('입력하신 회원정보는 존재하지 않습니다');
      loading.value = false;
    };

    const remember = false;


    const redirectRegister = () => {
      router.push("/user/register");
      return false;
    };

    const checked = ref(localStorage.save_user_name === 'T');
    const tempSave = () => {
      delete localStorage.save_user_name;
      delete localStorage.user_name;

      if (checked.value) {
        localStorage.save_user_name = 'T';
        localStorage.user_name = formState.username;
      }
    }
    const info = () => {
      message.info('비밀번호 찾기는 고객선터로 연결하시오');
    };
    return {
      loading,
      checked,
      remember,
      formState,
      handleFinish,
      handleFinishFailed,
      redirectRegister,
      info,
      lib
    };
  },

  mounted() {
    if (localStorage.save_user_name !== 'T') {
      localStorage.save_user_name = 'F';
    }
    if (localStorage.save_user_name === 'T' && localStorage.user_name) {
      this.formState.username = localStorage.user_name;
    }

    document.title = lib.isWorldLink() ? '월드링크' : 'X-PLAN'
  }
});
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.login-bg {
  flex: 5;
  height: 100%;
  width: 100%;
  background-color: #ffdb41;
}

.login-form {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.user-name{
  height: 43px;font-size: 16px;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
}
.user-password{
  height: 43px;font-size: 16px;
  border-radius: 0 0 5px 5px;
}
.item_form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: 37px;
}
</style>
<!--<style scoped>-->
<!--::-webkit-scrollbar {-->
<!--  width: 0 !important;-->
<!--}-->
<!--.join .ant-form-item-control-input-content {-->
<!--  margin-top: 0 !important;-->
<!--}-->

<!--.login-bg {-->
<!--  position: fixed;-->
<!--  width: 100%;-->
<!--  height: 1500px;-->
<!--  overflow-y: hidden;-->
<!--  background: url(../../assets/img/bg8.jpg) no-repeat top center;-->
<!--  background-size: 100%;-->
<!--  filter: blur(0px);-->
<!--}-->

<!--.login-bg::before {-->
<!--  content: "";-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));-->
<!--  z-index: -1;-->
<!--}-->

<!--._container {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  height: 1500px;-->
<!--  width: 100%;-->
<!--  position: fixed;-->
<!--  overflow-y: hidden;-->

<!--  //background-image: url(../../assets/img/bg1.jpg);-->
<!--  //background-color: #3051d3;-->

<!--  &#45;&#45;uim-primary-opacity: 1;-->
<!--  &#45;&#45;uim-secondary-opacity: 0.70;-->
<!--  &#45;&#45;uim-tertiary-opacity: 0.50;-->
<!--  &#45;&#45;uim-quaternary-opacity: 0.25;-->
<!--  &#45;&#45;uim-quinary-opacity: 0;-->

<!--  &#45;&#45;blue: #3051D3;-->
<!--  &#45;&#45;indigo: #564ab1;-->
<!--  &#45;&#45;purple: #6f42c1;-->
<!--  &#45;&#45;pink: #e83e8c;-->
<!--  &#45;&#45;red: #F06543;-->
<!--  &#45;&#45;orange: #f1734f;-->
<!--  &#45;&#45;yellow: #e4cc37;-->
<!--  &#45;&#45;green: #3ddc97;-->
<!--  &#45;&#45;teal: #008080;-->
<!--  &#45;&#45;cyan: #00A7E1;-->
<!--  &#45;&#45;white: #fff;-->
<!--  &#45;&#45;gray: #7c8a96;-->
<!--  &#45;&#45;gray-dark: #343a40;-->
<!--  &#45;&#45;primary: #3051D3;-->
<!--  &#45;&#45;secondary: #7c8a96;-->
<!--  &#45;&#45;success: #3ddc97;-->
<!--  &#45;&#45;info: #00A7E1;-->
<!--  &#45;&#45;warning: #e4cc37;-->
<!--  &#45;&#45;danger: #F06543;-->
<!--  &#45;&#45;light: #eff2f7;-->
<!--  &#45;&#45;dark: #343a40;-->
<!--  &#45;&#45;breakpoint-xs: 0;-->
<!--  &#45;&#45;breakpoint-sm: 576px;-->
<!--  &#45;&#45;breakpoint-md: 768px;-->
<!--  &#45;&#45;breakpoint-lg: 992px;-->
<!--  &#45;&#45;breakpoint-xl: 1200px;-->
<!--  &#45;&#45;font-family-sans-serif: "Nunito",sans-serif;-->
<!--  &#45;&#45;font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;-->
<!--}-->

<!--.header {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->

<!--  padding-top: 153px;-->
<!--  width: 100%;-->
<!--  height: 89px;-->
<!--}-->

<!--.icon img {-->
<!--  width: 300px;-->
<!--}-->

<!--.tip {-->
<!--  margin-top: 9px;-->
<!--}-->

<!--.tip h5 {-->
<!--  font-size: 16px !important;-->
<!--  color: rgba(255,255,255,.5) !important;-->
<!--  font-weight: 600;-->
<!--  text-align: center !important;-->
<!--  font-family: Nunito, sans-serif;-->
<!--}-->

<!--.item {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  border-radius: 30px;-->

<!--  margin-top: 80px;-->
<!--  width: 560px;-->
<!--  padding: 50px 0;-->
<!--  background-color: rgb(255,255,255,0.9);-->
<!--}-->

<!--.item .item-text {-->
<!--  text-align: center;-->
<!--}-->
<!--.item .item-text h5 {-->
<!--  color: #495057;-->
<!--  font-weight: 600;-->
<!--  font-size: 1.4rem;-->
<!--  margin-top: 3px;-->
<!--}-->
<!--.item .item-text h6 {-->
<!--  color: #495057;-->
<!--  font-size: 1rem;-->
<!--  margin-top: 3px;-->
<!--}-->

<!--.item_form {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  margin-top: 37px;-->
<!--}-->

<!--.item_form .item_input,-->
<!--.item_input input-->
<!--{-->
<!--  width: 390px;-->
<!--  height: 45px;-->
<!--  border-radius: 5px;-->
<!--  margin-left: 4px;-->
<!--  /*margin-bottom: 24px;*/-->
<!--  font-size: .91rem;-->
<!--  /*font-weight: 500;*/-->
<!--}-->

<!--.item_form .item_input:first-child-->
<!--{-->
<!--  margin-bottom: 24px;-->
<!--}-->

<!--.item_input input {-->
<!--  padding: 15px;-->
<!--}-->

<!--.setting .ant-form-item-control-input-content{-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-between;-->
<!--  padding-left: 5px;-->
<!--  width: 390px;-->
<!--  margin-top: 20px;-->
<!--  font-size: .91rem;-->
<!--}-->
<!--.setting .ant-form-item-control-input-content button{-->
<!--  padding: 0;-->
<!--  color: lightslategrey;-->
<!--}-->

<!--.footer .ant-form-item-control-input-content {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->

<!--  width: 390px;-->
<!--  padding-left: 4px;-->
<!--  margin-top: 20px;-->
<!--  border: none;-->
<!--}-->
<!--.footer .ant-form-item-control-input-content button:first-child {-->
<!--  height: 39px;-->
<!--  border-radius: 5px;-->
<!--  color: white;-->
<!--  margin-bottom: 20px;-->
<!--}-->
<!--.footer a {-->
<!--  border: none;-->
<!--  content: none;-->
<!--  padding: 0;-->
<!--  text-align: center;-->
<!--  color: gray;-->
<!--  font-size: 16px;-->
<!--}-->
<!--/* ant vue 버튼 버그 */-->
<!--::before {-->
<!--  content: none;-->
<!--}-->

<!--.spinPosition {-->
<!--  margin-top: 450px;-->
<!--}-->
<!--</style>-->