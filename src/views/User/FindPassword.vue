<template>
  <loading v-model:active="loading" :can-cancel="false" :is-full-page="true" />
  <div class="container" style="display: flex;height: 100vh">
    <div class="login-bg">
<!--      <img src="../../assets/img/login_title.png" key="logo-light" alt="">-->
    </div>
    <div class="login-form">
      <div class="login-content">
        <img style="margin: 90px;width: 60px;height: 60px" src="../../assets/logo_icon.png" key="logo-light" alt="">
        <div style="text-align:center;display: flex;flex-direction: column;justify-content: center;margin:20px 0;width: 100%">
          <h3>비밀번호를 잊어버리셨나요?</h3>
          <p style="color: #b0b0b0;font-weight: normal;font-size: 12px">아이디와 가입된 이메일을 인증하시면 비밀번호를 리셋할 수 있습니다.</p>
        </div>
        <div style="display: flex;flex-direction: column;width: 100%;">
          <a-input v-model:value="formState.username" placeholder="아이디" class="user-name" ></a-input>
          <a-input v-model:value="formState.email" placeholder="E-mail" class="user-email"></a-input>
        </div>
        <div style="display: flex;gap:10px;flex-direction: column; justify-content: center;width: 100%;margin-top: 20px;align-items: center;">
          <a-button class="loginButton" @click.prevent="handleSubmit" style="background-color: #1a1a1a; width: 100%;height: 43px;font-size: 16px;font-weight: bold;color: #f8f100;border: none">
            이메일 전송
          </a-button>
          <a-divider style="color: #1a1a1a;"> Or </a-divider>
          <router-link to="/user/login" style="font-size: 12px;color: #1a1a1a;">로그인화면 돌아가기</router-link>
        </div>
      </div>
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

    const handleSubmit = () => {
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
      handleSubmit,
      lib,
    }
  }
})

</script>
<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-image: url('../../assets/img/login_bg.jpg');
  background-size: cover;
  height: 100vh;
  width: 100%;
}

.login-bg {
  flex: 6;
  height: 100%;
  width: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
}


.login-form {
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}

.login-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 500px;
  padding: 30px 80px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.user-name{
  height: 43px;font-size: 16px;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
}
.user-email{
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