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
        <div class="employee_name" v-if="employee_name">
          직원：{{employee_name}}
        </div>
        <a-dropdown class="setting-wrap fl-tc fl-lb">
          <a @click.prevent>
            <img src="@/assets/img/user2.png">
            <span class="ml20 fs16">{{ user_name }}</span>
            <DownOutlined class="ml30" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item v-if="hasSpecificId" @click="go('/user/mypage')"><UserOutlined/><span class="ml5">My Page</span></a-menu-item>
              <a-sub-menu v-if="Object.keys(this.account_list).length">
                <template #title>
                  <UserSwitchOutlined/><span class="ml5">계정 정보</span>
                </template>
                <a-menu-item @click="toggleAccount(v.id)" v-for="v in account_list">
                  <div class="fl-tc fl-lb">
                    {{ v.username }}
                    <a-badge :count="main_user.username == v.username ? '기본 계정':'하위 계정'" :number-style="{ backgroundColor: '#52c41a' }" class="ml10 fs10" />
                  </div>
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item @click="go('/setting/updateDetail')"><SettingOutlined/><span class="ml5">설정</span></a-menu-item>
              <a-menu-item @click="logout"><LogoutOutlined/><span class="ml5">로그아웃</span></a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
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
import {UserOutlined, SettingOutlined, LogoutOutlined, LoadingOutlined,DownloadOutlined,DownOutlined,UserSwitchOutlined} from "@ant-design/icons-vue";
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
    DownOutlined,
    UserSwitchOutlined
  },

  computed: {
    ...mapState([
      "common"
    ]),

    //특정 계정만 MyPage 보여줌
    hasSpecificId(){
      const specificIds  = ["jmg1052", "haeju","jwli","gom126","poipoi","asdasd","WT0625","qweqwe","polpol","123123","gomgom","gomtest","test12345","test78910"];
      return specificIds.includes(this.$data.user_name);
    }
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
      // rateLoading:false,

      employee_name:Cookie.get('employee') ? JSON.parse(Cookie.get('employee')).username:'',
      account_list:Cookie.get('account_list') ? JSON.parse(Cookie.get('account_list')):{},
      main_user:Cookie.get('main_user') ? JSON.parse(Cookie.get('main_user')):{},
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
    go(url){
      location.href = url
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
    //切换账号
    toggleAccount(id){
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/account/toggle", {toggleId:id}).then((res) => {
        if(res.status !== '2000') {
          message.error(res.message);
          return false;
        }
        Cookie.set('token', res.data.token)
        Cookie.set('member_name', res.data.member_name);
        Cookie.set('member_roles', res.data.member_roles);
        if(res.data.loginUser){
          Cookie.set('login_user', JSON.stringify(res.data.loginUser));
        }
        if(res.data.mainUser){
          Cookie.set('main_user', JSON.stringify(res.data.mainUser));
        }
        if(res.data.employee){
          Cookie.set('employee', JSON.stringify(res.data.employee));
        }
        if(res.data.accountList){
          Cookie.set('account_list', JSON.stringify(res.data.accountList));
        }
        window.location.reload();
      }).catch((e) => {
        message.error(e.message)
        return false;
      });
    }
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
<style scoped>
#Header .employee_name{
  height: 28px;
  line-height: 28px;
  padding: 0 20px;
  background-color: #ffd117;
  border-radius: 18px;
}
#Header .setting-wrap{
  border-radius:18px;
  background-color: #434343;
  color: #fff;
  padding: 0 20px;
  line-height: 28px;
}
#Header .setting-wrap img{
  width: 16px;
  height: 16px;
  border-radius: 50px;
}
</style>
