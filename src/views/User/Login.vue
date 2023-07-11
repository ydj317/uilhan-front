<template>
  <loading v-model:active="loading" :can-cancel="false" :is-full-page="true" />
  <div class="login-bg"></div>

  <div class="_container">
    <div class="header">
      <div class="icon">
        <img src="../../assets/img/logo-light.png" alt="">
      </div>
      <!--        <div class="tip">-->
      <!--          <h5>이용해주셔서 감사합니다!</h5>-->
      <!--        </div>-->
    </div>
    <div class="item">
      <div class="item-text">
        <h5>전세계를 하나로!</h5>
        <h6>클릭 몇번으로 상품을 등록할 수 있는 플랫폼을 만들어가고 있습니다.</h6>
      </div>
      <a-form class="item_form"
              layout="inline"
              :model="formState"
              @finish="handleFinish"
              @finishFailed="handleFinishFailed"
      >
        <a-form-item class="item_input">
          <a-input v-model:value="formState.username" placeholder="User Name">
            <!--            <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>-->
          </a-input>
        </a-form-item>
        <a-form-item  class="item_input">
          <a-input v-model:value="formState.password" type="password" placeholder="Password">
          </a-input>
        </a-form-item>
        <a-form-item class="setting">
          <a-checkbox v-model:checked="checked">저장하기</a-checkbox>
          <a-button type="link" @click="info"><LockOutlined />비밀번호 잊으셨나요?</a-button>
        </a-form-item>
        <a-form-item class="footer">
          <a-button type="primary" html-type="submit" class="loginButton">
            로그인
          </a-button>
        </a-form-item>
        <a-form-item class="setting join">
          <div><img width="22" height="14" src="../../assets/img/kor.png" alt=""> <img width="22" height="14" src="../../assets/img/chn.png" alt=""></div>
          <a-button type="link"><a href="/user/register"><UserOutlined /> 회원가입</a></a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import router, {setFilterRouteList} from "router/index.js";
import { LoginRequest } from 'util/request';
import { defineComponent, reactive, onBeforeMount, ref } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import Cookie from "js-cookie";
import { isLogin, cookieInit } from "util/auth";
import { message } from 'ant-design-vue';

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    Loading,
  },

  setup() {
    onBeforeMount(() => {
      if (isLogin() === true) {
        router.push("/main");
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
    let loading = ref(false);
    const handleFinish = () => {
      if (formState.user === '' || formState.password === '') {
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
          "pluginKey": "9af85962-c843-4429-8d99-8436956baa33",
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
        router.push("/main");
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
      info
    };
  },

  mounted() {
    if (localStorage.save_user_name !== 'T') {
      localStorage.save_user_name = 'F';
    }
    if (localStorage.save_user_name === 'T' && localStorage.user_name) {
      this.formState.username = localStorage.user_name;
    }
  }
});
</script>

<style>
::-webkit-scrollbar {
  width: 0 !important;
}
.join .ant-form-item-control-input-content {
  margin-top: 0 !important;
}

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

.tip {
  margin-top: 9px;
}

.tip h5 {
  font-size: 16px !important;
  color: rgba(255,255,255,.5) !important;
  font-weight: 600;
  text-align: center !important;
  font-family: Nunito, sans-serif;
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

.item .item-text {
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

.item_form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: 37px;
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

.item_form .item_input:first-child
{
  margin-bottom: 24px;
}

.item_input input {
  padding: 15px;
}

.setting .ant-form-item-control-input-content{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 5px;
  width: 390px;
  margin-top: 20px;
  font-size: .91rem;
}
.setting .ant-form-item-control-input-content button{
  padding: 0;
  color: lightslategrey;
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
.footer a {
  border: none;
  content: none;
  padding: 0;
  text-align: center;
  color: gray;
  font-size: 16px;
}
/* ant vue 버튼 버그 */
::before {
  content: none;
}

.spinPosition {
  margin-top: 450px;
}
</style>