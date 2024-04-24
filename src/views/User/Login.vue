<template>
  <loading v-model:active="loading" :can-cancel="false" :is-full-page="true"/>
  <div class="container" style="display: flex;height: 100vh">
    <div class="login-bg">
      <img src="../../assets/img/login_title.png" key="logo-light" alt="">
    </div>
    <div class="login-form">
      <div class="login-content">
        <img style="margin: 90px;width: 60px;height: 60px" src="../../assets/logo_icon.png" key="logo-light" alt="" >
        <div style="display: flex;flex-direction: column;width: 100%;">
            <a-input v-model:value="formState.username" placeholder="아이디" class="user-name" ></a-input>
            <a-input-password v-model:value="formState.password" placeholder="비밀번호" class="user-password"></a-input-password>
        </div>
        <div style="display: flex;justify-content: space-between;font-size: 12px;align-items: center;width: 100%;margin-top: 5px">
          <!-- checkbox use icon -->

          <div @click="handleSaveId" style="cursor: pointer ">
            <check-circle-two-tone :two-tone-color="checked ? '#52c41a' : '#bdbdbd'"/> 아이디 저장
          </div>

          <div style="display: flex;gap: 5px;align-items: center">
          <span>관리자</span>
          <a-switch v-model:checked="user_type" size="small" style="color: #1a1a1a;background-color: #1a1a1a"/>
          </div>
        </div>
        <div style="display: flex;justify-content: center;width: 100%;margin-top: 20px;">
          <a-button html-type="submit" class="loginButton" @click="handleFinish" style="background-color: #1a1a1a; width: 100%;height: 43px;font-size: 16px;font-weight: bold;color: #f8f100;border: none">
            로그인
          </a-button>
        </div>
        <div style="height: 30px"></div>
        <div style="display: flex;justify-content: center;gap: 10px;width: 100%;align-items: center">
          <a-button type="link" @click="info" style="font-size: 14px;color: #1a1a1a;font-weight: bold">비밀번호 찾기</a-button>
          <a-divider type="vertical" style="height: 12px;color: #1a1a1a;background-color: #1a1a1a"></a-divider>
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
import {UserOutlined, LockOutlined, CheckCircleTwoTone} from '@ant-design/icons-vue';
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
    CheckCircleTwoTone
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

    const user_type = ref(true);

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
      router.push("/user/find/password");
    };

    const handleSaveId = () => {
      checked.value = !checked.value;
    };
    return {
      loading,
      checked,
      remember,
      formState,
      handleFinish,
      handleFinishFailed,
      redirectRegister,
      handleSaveId,
      info,
      lib,
      user_type
    };
  },

  mounted() {
    if (localStorage.save_user_name !== 'T') {
      localStorage.save_user_name = 'F';
    }
    if (localStorage.save_user_name === 'T' && localStorage.user_name) {
      this.formState.username = localStorage.user_name;
    }

    document.title = lib.isWorldLink() ? '월드링크' : '유일'
  }
});
</script>
<style scoped>
.container {
  background-image: url('../../assets/img/login_bg.jpg');
  background-size: cover;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
.user-password{
  height: 43px;font-size: 16px;
  border-radius: 0 0 5px 5px;
}
.user-password:focus{
  background-color: white;
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

<style>
.user-password.ant-input-affix-wrapper {
  padding: 0;
}
.user-password.ant-input-affix-wrapper .ant-input {
  padding: 4px 11px !important;
  border-radius: 3px;
}
.user-password.ant-input-affix-wrapper span {
  padding: 4px 11px;
}
.user-password.ant-input-affix-wrapper .ant-input-suffix {
  position: absolute;
  right: 0;
  top: 5px;
}
</style>
