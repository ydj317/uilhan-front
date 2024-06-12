<template>
  <div id="Header" class="pr20">
    <div class="h60 right center">
      <a-space size="small">
<!--        <div>-->
<!--          <div v-if="rateLoading">-->
<!--            <a-spin />-->
<!--          </div>-->
<!--          <a-space v-else>-->
<!--            <div>-->
<!--              <img src="../../assets/img/chn2.png" style="width:20px; vertical-align: text-top" /> 1위안-->
<!--            </div>-->
<!--            <span>⇋</span>-->
<!--            <div>-->
<!--              <img src="../../assets/img/kor2.png" style="width:20px; vertical-align: text-top" /> {{ rate }}원-->
<!--            </div>-->
<!--          </a-space>-->
<!--        </div>-->
<!--        <a-divider type="vertical"/>-->
<!--        <div>-->
<!--          <a-button type="link" size="small" @click="worldLinkGuide">가이드북</a-button>-->
<!--        </div>-->
        <div>
          <a-button type="link" @click.prevent="extensionDown" size="small">
            <span class="mr10">
              <img src="../../assets/img/download.png" style="vertical-align: -3px" />
            </span>
            크롬 확장 프로그램
          </a-button>
          <a-spin v-if="indicator"/>
        </div>
        <div id="setting" class="">
          <div class="center pointer pl20 pr20" @click="settingVisible" style="display: flex;align-items: center;border-radius:18px;background-color: #434343">
            <img src="@/assets/img/user2.png" width="16" height="16" style="border-radius: 50px;" alt="">
            <h3 class="mt8 mr30 mb10 ml10 p5" style="color:#fff;line-height:0;">{{ user_name }}</h3>
            <DownOutlined />
          </div>
          <a-select class="absolute" v-if="setting_visible" :default-open="true" :autofocus="true" ref="select"
                    v-model:value="setting" @select="seletedSetting" @blur="settingVisible"
                    style="right: 19px;top: 60px;width: 150px;">
            <a-select-option value="setting">
              <SettingOutlined/>
              설정
            </a-select-option>
            <a-select-option value="logout">
              <LogoutOutlined/>
              로그아웃
            </a-select-option>
          </a-select>
        </div>
      </a-space>

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

    </div>
  </div>
</template>

<script>
import {UserOutlined, SettingOutlined, LogoutOutlined, LoadingOutlined,DownloadOutlined,DownOutlined} from "@ant-design/icons-vue";
import {AuthRequest} from "@/util/request";
import Cookie from "js-cookie";
import {cookieInit} from "@/util/auth";
import router from "../../router";
import {mapState} from "vuex";
import Loading from "vue-loading-overlay";
import {message} from "ant-design-vue";

export default {
  components: {
    Loading,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    DownloadOutlined,
    DownOutlined
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
      indicator: false,

      // rate: 0,
      // rateLoading:false
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
          location.href = "/setting/updateDetail";
          break;
        case "logout":
          this.logout();
          break;
      }
    },

    logout() {
      cookieInit();
      sessionStorage.setItem("orderData", "");
      router.push("/user/login");
      return false;
    },

    extensionDown() {
      this.indicator = true;
      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/downloadext", {responseType: "blob"}).then((res) => {
        let response = res;
        if (response === undefined) {
          message.error("확장프로그램 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
          this.indicator = false;
          return false;
        }

        let fileName = "UilExtension.zip";
        let blob = new Blob([response], {type: "charset=utf-8"});
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
    },

    worldLinkGuide() {
      window.open("https://www.notion.so/worldlink/WORLD-LINK-0013348223c04c4792ed5d26b7c982ac", "_blank");
    },

    // getRate() {
    //   this.rateLoading = true;
      // AuthRequest.get(process.env.VUE_APP_API_URL + "/api/getrate", {}).then((res) => {
      //   if(res.status !== '2000') {
      //     message.error(res.message);
      //     return false;
      //   }
      //   const { ko } = res.data;
      //   this.rate = ko
      // }).catch((e) => {
      //   message.error(e.message)
      //   return false;
      // }).finally(() => {
      //   this.rateLoading = false;
      // });
    // }
  },
  // mounted() {
  //   this.getRate()
  // }
};

</script>

<style>
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

.ant-divider-vertical{
  background-color:#0e0e0e;
}

.pointer .anticon-down{
  color:#fff;
}
</style>
