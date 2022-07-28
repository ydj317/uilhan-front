<template>
  <div class="header-container">
    <div class="language">
      <div>
        <img @click="languageVisible" width="22" height="14" :src="language_src" style="margin-right: 29px; cursor: pointer;" alt="">
      </div>
      <a-select
          :default-open="true"
          :autofocus="true"
          v-if="language_visible"
          style="width: 95px; margin: 0; padding: 0; position: absolute"
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
    <div class="setting">
      <div style="display: flex; align-items: center; cursor: pointer;" @click="settingVisible">
        <div style="background-color: white; border-radius: 50px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <img src="../../assets/img/avatar.png" width="36" height="36" style="border-radius: 50px;" alt="">
        </div>
        <span style="margin-left: 10px; color: white; font-size: 15px;">{{ user_name }}</span>
      </div>
      <a-select
          class="setting_select"
          v-if="setting_visible"
          :default-open="true"
          :autofocus="true"
          style="width: 100px; margin: 0; padding: 0; position: absolute"
          ref="select"
          v-model:value="setting"
          @select="seletedSetting"
          @blur="settingVisible"
      >
        <a-select-option value="userinfo"><UserOutlined /> <span>회원정보</span></a-select-option>
        <a-select-option value="setting"><SettingOutlined /> 설정</a-select-option>
        <a-select-option value="logout"><LogoutOutlined /> 로그아웃</a-select-option>
      </a-select>
    </div>
    <UserSetting></UserSetting>
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
.ant-layout-header {
  display: flex;
}

.header-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  margin: 0;
  padding: 0;
  content: none;
  outline: none;
  width: 100%;
  height: 64px;
}

/* 선택창 숨기기 */
.header-container .language .ant-select-selector {
  width: 0 !important;
  height: 0 !important;
}
.header-container .setting .ant-select-selector {
  width: 0 !important;
  height: 0 !important;
}

.language {
  /*display: flex;*/
}

.setting {
  width: 150px;
}

/*下拉框*/
.language .ant-select-dropdown,
.setting .ant-select-dropdown
{
  top: 72px !important;
}

.header-container .ant-select,
.header-container .ant-select-selector,
.header-container .ant-select-selection-search,
.header-container .ant-select-selection-item,
.header-container .ant-select-selection-item input {
  background-color: #3051d3 !important;
  border: none !important;
  text-align: right;
}

/* 隐藏下标 */
.ant-select-arrow {
  display: none;
}

.user_name {
  font-size: .91rem;
  color: white;
  margin-left: 10px;
}
</style>
