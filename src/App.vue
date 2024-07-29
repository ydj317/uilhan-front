<template>
  <a-config-provider :theme="{
      token: {
        colorPrimary: '#ffd117',
        fontFamily: 'SCDream3',
        //colorPrimaryBg: '#ffd117',
      },
    }">
    <router-view/>
  </a-config-provider>
</template>

<script setup>
import {theme} from 'ant-design-vue';
import {onMounted, onUnmounted} from "vue";
import Cookie from "js-cookie";
import moment from "moment";

const path = window.location.pathname;
const exclude = ['/user/login', '/user/register', '/user/find/password']

// 10분에 한번씩 토큰이 만료되였는지 확인
let interval = null;
const checkLogin = () => {
  interval = setInterval(() => {

    if(!Cookie.get('expires_time') || moment().unix() > Cookie.get('expires_time')) {
      Cookie.remove('account_list');
      Cookie.remove('expires_time');
      Cookie.remove('login_user');
      Cookie.remove('main_user');
      Cookie.remove('member_name');
      Cookie.remove('member_roles');
      Cookie.remove('token');
      alert('세션이 만료되었습니다. 다시 로그인해주세요.')
      window.location.replace('/user/login')
    }
  }, 10 * 60 * 1000);
}

onMounted(() => {
  if(!exclude.includes(path)) {
    checkLogin();
  }
});

onUnmounted(() => {
  clearInterval(interval);
});

</script>