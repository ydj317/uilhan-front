<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true" />
  <div id="Header" class="pr20">
    <div class="h60 right center">
      <div id="download_ext"><a @click.self.prevent="extensionDown">크롬 확장 프로그램 </a></div>
<!--      <div id="language">-->
<!--        <div>-->
<!--          <img class="pointer mr20" @click="languageVisible" width="22" height="14" :src="language_src" alt="">-->
<!--        </div>-->
<!--        <a-select-->
<!--          class="absolute"-->
<!--          :default-open="true"-->
<!--          :autofocus="true"-->
<!--          v-if="language_visible"-->
<!--          ref="select"-->
<!--          v-model:value="language"-->
<!--          @change="languageVisible"-->
<!--          @blur="languageVisible"-->
<!--          style="right: 20px; top: 60px; width: 150px;"-->
<!--        >-->
<!--          <a-select-option value="kor"><img width="22" height="14" :src="kor" alt=""> 한국어-->
<!--          </a-select-option>-->
<!--          <a-select-option value="chn"><img width="22" height="14" :src="chn" alt=""> 中国语-->
<!--          </a-select-option>-->
<!--        </a-select>-->
<!--      </div>-->
      <div id="setting" class="">
        <div class="center pointer" @click="settingVisible">
          <img src="../../assets/img/user.png" width="20" height="20" style="border-radius: 50px;" alt="">
          <h3 class="m10">{{ user_name }}</h3>
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
          style="right: 19px;top: 60px;width: 150px;">
          <a-select-option value="setting">
            <SettingOutlined />
            설정
          </a-select-option>
          <a-select-option value="logout">
            <LogoutOutlined />
            로그아웃
          </a-select-option>
        </a-select>
      </div>
    </div>
  </div>
</template>

<script>
import { UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { AuthRequest } from "@/util/request";
import Cookie from "js-cookie";
import { cookieInit } from "@/util/auth";
import router from "../../router";
import { mapState } from "vuex";
import Loading from "vue-loading-overlay";
import { message } from "ant-design-vue";

export default {
  components: {
    Loading,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined
  },

  computed: {
    ...mapState([
      "common"
    ])
  },

  data() {
    return {
      kor: require("../../assets/img/kor.png"),
      chn: require("../../assets/img/chn.png"),

      language: "kor",
      language_src: require("../../assets/img/kor.png"),
      language_visible: false,

      user_name: Cookie.get("member_name"),
      setting: "userinfo",
      setting_visible: false,
      indicator: false
    };
  },

  methods: {
    languageVisible(event) {
      this.language_src = this[this.language];
      this.language_visible = !this.language_visible;
      if (event.type === "click") {
        setTimeout(() => {
          this.language_visible = true;
        });
      }
    },

    settingVisible(event) {
      this.setting_visible = !this.setting_visible;
      if (event.type === "click") {
        setTimeout(() => {
          this.setting_visible = true;
        });
      }
    },

    seletedSetting() {
      switch (this.setting) {
        case "userinfo":
          break;
        case "setting":
          location.href = "/setting/account";
          break;
        case "logout":
          this.logout();
          break;
      }
    },

    logout() {
      cookieInit();
      router.push("/user/login");
      return false;
    },

    extensionDown() {
      this.indicator = true;
      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/downloadext", { responseType: "blob" }).then((res) => {
        let response = res;
        if (response === undefined) {
          message.error("확장프로그램 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
          this.indicator = false;
          return false;
        }

        let fileName = "WorldLinkExtension.zip";
        let blob = new Blob([response], { type: "charset=utf-8" });
        let downloadElement = document.createElement("a");
        let url = window.URL || window.webkitURL || window.moxURL;
        let href = url.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = decodeURI(fileName); // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        url.revokeObjectURL(href);
        this.indicator = false;
      });
    }
  }
};

</script>

<style>
#download_ext {
  width: 150px;
  padding-top: 5px;
}

/* 선택창 숨기기 */
#Header #language .ant-select-selector,
#Header #setting .ant-select-selector {
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
