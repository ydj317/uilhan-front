<template>
  <a-spin style="margin-top: 400px" :spinning="spinning" tip="Loading...">
    <div class="_container">
      <div class="top">
        <div class="icon">
          <img src="../../assets/img/logo-light.png" alt="">
        </div>
        <div class="tip">
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
  <!--          <a-button type="link"><LockOutlined />비밀번호 잊으셨나요?</a-button>-->
          </a-form-item>
          <a-form-item class="footer">
            <a-button
                type="primary"
                html-type="submit"
                :disabled="formState.user === '' || formState.password === ''"
                class="loginButton"
            >
              로그인
            </a-button>
            <a href="/user/register"><UserOutlined /> 회원가입</a>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-spin>
</template>
<script>
import router from "router/index.js";
import { LoginRequest } from 'util/request';
import { defineComponent, reactive, onBeforeMount, ref } from 'vue';
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
    let spinning = ref(false);
    const handleFinish = () => {
      let user = {
        username: formState.username,
        password: formState.password,
      };
      spinning = true;
      LoginRequest.post(
        process.env.VUE_APP_API_URL + '/api/login', user).then((res) => {
        if (res.status === undefined || res.status !== 200) {
          alert('처리중 오류가 발생하였습니다. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.(status error)');
          spinning = false;
          return false;
        }

        if (res.data.member_roles === undefined) {
          alert('처리중 오류가 발생하였습니다. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.(role error)');
          spinning = false;
          return false;
        }

        // 아이디 저장하기
        tempSave();

        Cookie.set('member_name', res.data.member_name);
        Cookie.set('member_roles', res.data.member_roles);
        router.push("/product");
        spinning = false;
        return false;
      });
    };

    const handleFinishFailed = () => {
      alert('입력하신 회원정보는 존재하지 않습니다');
      spinning = false;
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

    return {
      spinning,
      checked,
      remember,
      formState,
      handleFinish,
      handleFinishFailed,
      redirectRegister
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

._container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 1500px;
  width: 100%;
  position: fixed;
  overflow-y: hidden;

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-top: 153px;
  width: 100%;
  height: 89px;
}

.icon img {
  width: 180px;
  height: 40px;
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
  border-radius: 5px;

  margin-top: 80px;
  width: 451px;
  height: 404px;
  padding: 24px;
  background-color: white;
}

.item h5 {
  color: #495057;
  font-weight: 600;
  font-size: 1.1375rem;
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
  background-color: #33d690;
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