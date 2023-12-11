<template>
  <loading v-model:active="loading" :can-cancel="false" :is-full-page="true" />

  <div class="login-bg"></div>
  <div class="_container">
    <div class="header">
      <div class="icon">
        <img src="@/assets/img/logo-light.png" v-if="!lib.isWorldLink()" key="logo-light">
        <img src="@/assets/img/logo-light-worldlink.png" v-else key="logo-light-worldlink">
      </div>
    </div>
    <div class="item">
      <div class="item-text">
        <h5>비밀번호를 잊어버리셨나요?</h5>
        <h6>아이디와 가입된 이메일을 인증하시면 비밀번호를 리셋할 수 있습니다.</h6>
      </div>
      <a-form class="item_form"
              layout="inline"
              :model="formState"
              @finish="handleFinish"
      >
        <a-form-item class="item_input">
          <a-input v-model:value="formState.username" placeholder="User Name"></a-input>
        </a-form-item>
        <a-form-item  class="item_input">
          <a-input v-model:value="formState.email" type="email" placeholder="Email"></a-input>
        </a-form-item>
        <a-form-item class="footer">
          <a-button type="primary" html-type="submit" class="findButton">
            인증메일 전송
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
import {defineComponent, reactive, ref} from "vue";
import {lib} from "@/util/lib";
import {message} from "ant-design-vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import {NoAuthAjax} from "@/util/request";
import router from "@/router";
import {useRoute} from "vue-router";

export default defineComponent ({
  components: {
    Loading
  },
  setup(){
    const formState = reactive({
      username: '',
      email: '',
    });
    let loading = ref(false);

    let route = useRoute();
    setTimeout(function () {
      window.document.title = route?.meta?.title;
    });

    const handleFinish = () => {
      if (formState.username === '' || formState.email === '') {
        message.warning('아이디 또는 이메일을  입력해주시오');
        return true
      }

      let user = {
        username: formState.username,
        email: formState.email,
      }

      loading.value = true;
      //发送一个POST请求到Symfony接口, 不需要登录就可验证发送请求的 NoAuthAjax
      NoAuthAjax.post(process.env.VUE_APP_API_URL + '/api/find/password', user).then((res) => {
        if (res.data.status !== '2000') {
          message.error(res.data.message);
          loading.value = false;
          return false;
        }

        loading.value = false;
        message.success('이메일이 전송되었습니다. 새로 발급된 비밀번호로 로그인 후 수정해 주세요.');

        setTimeout(function () {
          router.push("/user/login");
        }, 1000)

      });
    }

    return {
      loading,
      formState,
      handleFinish,
      lib,
    }
  }
})
</script>

<style>
  .login-bg {
    position: fixed;
    width: 100%;
    height: 1500px;
    overflow-y: hidden;
    background: url(../../assets/img/bg8.jpg) no-repeat top center;
    background-size: 100%;
    filter: blur(0px);
  }

  .login-bg::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
    z-index: -1;
  }

  ._container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 1500px;
    width: 100%;
    position: fixed;
    overflow-y: hidden;

  //background-image: url(../../assets/img/bg1.jpg);
  //background-color: #3051d3;

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

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding-top: 153px;
    width: 100%;
    height: 89px;
  }

  .icon img {
    width: 300px;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 30px;

    margin-top: 80px;
    width: 560px;
    padding: 50px 0;
    background-color: rgb(255,255,255,0.9);
  }

  .item .item-text{
    text-align: center;
  }

  .item .item-text h5 {
    color: #495057;
    font-weight: 600;
    font-size: 1.4rem;
    margin-top: 3px;
  }

  .item .item-text h6 {
    color: #495057;
    font-size: 1rem;
    margin-top: 3px;
  }

  .item_form .item_input,
  .item_input input
  {
    width: 390px;
    height: 45px;
    border-radius: 5px;
    margin-left: 4px;
    /*margin-bottom: 24px;*/
    font-size: .91rem;
    /*font-weight: 500;*/
  }

  .item_form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-top: 37px;
  }

  .item_form .item_input:first-child
  {
    margin-bottom: 24px;
  }

  .item_input input {
    padding: 15px;
  }

  .footer .ant-form-item-control-input-content {
    display: flex;
    flex-direction: column;

    width: 390px;
    padding-left: 4px;
    margin-top: 20px;
    border: none;
  }

  .footer .ant-form-item-control-input-content button:first-child {
    height: 39px;
    border-radius: 5px;
    color: white;
    margin-bottom: 20px;
  }
</style>