<template>
  <div id="Header" class="h100">
    <div class="h70 right center">
      <div id="language">
        <div>
          <img class="pointer mr20" @click="languageVisible" width="22" height="14" :src="language_src" alt="">
        </div>
        <a-select
            class="absolute"
            :default-open="true"
            :autofocus="true"
            v-if="language_visible"
            ref="select"
            v-model:value="language"
            @change="languageVisible"
            @blur="languageVisible"
        >
          <a-select-option value="kor"><img width="22" height="14" :src="kor" alt=""> 한국어
          </a-select-option>
          <a-select-option value="chn"><img width="22" height="14" :src="chn" alt=""> 中国语
          </a-select-option>
        </a-select>
      </div>
      <div id="setting" class="pr50">
        <div class="center pointer" @click="settingVisible">
          <img src="../../assets/img/user.png" width="36" height="36" style="border-radius: 50px;" alt="">
          <h3 class="m10 white">{{ user_name }}</h3>
        </div>
        <a-select
            class="absolute"
            v-if="setting_visible"
            :default-open="true"
            :autofocus="true"
            ref="select"
            v-model:value="setting"
            @select="seletedSetting"
            @blur="settingVisible"
        >
<!--          <a-select-option value="userinfo"><UserOutlined /> <span>회원정보</span></a-select-option>-->
          <a-select-option value="setting"><SettingOutlined /> 설정</a-select-option>
          <a-select-option value="logout"><LogoutOutlined /> 로그아웃</a-select-option>
        </a-select>
      </div>
      <UserSetting></UserSetting>
    </div>
    <!--刘海-->
    <div class="w100 h30 plr20 center bg-3051d3">
      <div class="w100 h30 bg-white"></div>
    </div>
  </div>
</template>

<script>
import UserSetting from 'components/SettingDrawer/index.vue';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import Cookie from "js-cookie";
import {cookieInit} from '@/util/auth';
import router from '../../router';
import {mapState} from 'vuex';

export default {
  components: {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserSetting
  },

  computed: {
    ...mapState([
      'common',
    ])
  },

  data() {
    return {
      kor: require('../../assets/img/kor.png'),
      chn: require('../../assets/img/chn.png'),

      language: 'kor',
      language_src: require('../../assets/img/kor.png'),
      language_visible: false,

      user_name: Cookie.get('member_name'),
      setting: 'userinfo',
      setting_visible: false,
    };
  },

  methods: {
    languageVisible(event) {
      this.language_src = this[this.language];
      this.language_visible = !this.language_visible;
      if (event.type === 'click') {
        setTimeout(() => {
          this.language_visible = true;
        });
      }
    },

    settingVisible(event) {
      this.setting_visible = !this.setting_visible;
      if (event.type === 'click') {
        setTimeout(() => {
          this.setting_visible = true;
        });
      }
    },

    seletedSetting() {
      switch (this.setting)
      {
        case 'userinfo':
          break;
        case 'setting':
          this.common.user_visible = true;
          setTimeout(() => {
            this.setting_visible = false;
          });
          break;
        case 'logout':
          this.logout();
          break;
      }
    },

    logout() {
      cookieInit();
      router.push("/user/login");
      return false;
    },
  }
};
</script>

<style>
/* 선택창 숨기기 */
#Header #language .ant-select-selector,
#Header #setting .ant-select-selector
{
  width: 0 !important;
  height: 0 !important;
  border: none !important;
}
/* 선택창 아이콘 숨기기 */
#Header .ant-select-arrow {
  display: none;
}
/* 선택창 정상노출 */
.ant-select-dropdown {
  width: auto !important;
}
</style>
