<template>
  <loading
      v-model:active="indicator"
      :can-cancel="false"
      :is-full-page="true"
  />
  <a-affix :offset-top="0">
  <div class="sideBar space-between col">
    <div>
      <div class="sideLogo"></div>
      <div class="topMenuStyle"><span class="defaultColor">MENU</span></div>
      <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          :open-keys="openKeys"
          @openChange="onOpenChange"
          class="menuStyle"
      >
        <a-menu-item key="1">
          <img src="../../assets/img/side/product.png" >
          <router-link to="/product">
            <span class="defaultColor defaultStyle">상품관리</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <img src="../../assets/img/side/order.png" >
            <router-link to="/order/list">
          <span class="defaultColor defaultStyle">주문관리</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <img src="../../assets/img/side/pre.png" >
          <span class="defaultColor defaultStyle">예치금관리(준비중)</span>
        </a-menu-item>
        <a-menu-item key="4">
          <img src="../../assets/img/side/detail.png" >
          <span class="defaultColor defaultStyle">상세페이지 제작</span>
        </a-menu-item>
        <a-menu-item key="5" @click="extensionDown">
          <img src="../../assets/img/side/download.png" >
          <span class="defaultColor defaultStyle">자료 다운로드</span>
        </a-menu-item>
        <a-sub-menu key="6">
          <template #title>
            <img src="../../assets/img/side/setting.png" >
            <span class="defaultColor defaultStyle">설정(준비중)</span>
          </template>
          <a-menu-item key="71"><span class="defaultColor defaultStyle">릴라켓정보</span></a-menu-item>
          <a-menu-item key="72"><span class="defaultColor defaultStyle">배송정책</span></a-menu-item>
          <a-menu-item key="73"><span class="defaultColor defaultStyle">출고지</span></a-menu-item>
          <a-menu-item key="81"><span class="defaultColor defaultStyle">반품지</span></a-menu-item>
          <a-menu-item key="82"><span class="defaultColor defaultStyle">마진 & 환율</span></a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <img src="../../assets/img/side/market.png" >
            <RouterLink to="/market/seller/list">
                <span class="defaultColor defaultStyle">제휴사연동</span>
            </RouterLink>
        </a-menu-item>
        <a-menu-item key="10">
          <img src="../../assets/img/side/other.png" >
          <span class="defaultColor defaultStyle">상품부가정보(준비중)</span>
        </a-menu-item>
        <a-menu-item key="11" v-if="isAdmin">
          <DollarTwoTone style="font-size: 20px"/>
          <router-link to="/user/manage">
            <span class="defaultColor defaultStyle">회원충전</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="12">
          <DollarTwoTone style="font-size: 20px"/>
          <router-link to="/user/FilterProductWords">
            <span class="defaultColor defaultStyle">금지어 관리</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="13">
          <DollarTwoTone style="font-size: 20px"/>
          <router-link to="/product/domeggook">
            <span class="defaultColor defaultStyle">도매꾹</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </div>

<!--    <div class="menuFooter" v-if="isAdmin">-->
<!--      <router-link to="/user/manage">-->
<!--        <a href="https://relaket.com" target="_blank"></a>-->
<!--      </router-link>-->
<!--    </div>-->

  </div>
  </a-affix>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue';
import Cookie from "js-cookie";
import { DollarTwoTone, AppstoreAddOutlined} from '@ant-design/icons-vue';
import {AuthRequest} from "@/util/request";
import Loading from "vue-loading-overlay";
export default defineComponent({
  components: {
    DollarTwoTone,
      AppstoreAddOutlined,
    Loading
  },
  setup() {
    const state = reactive({
      rootSubmenuKeys: ['6'],
      openKeys: [],
      selectedKeys: [],
    });

    const isAdmin = ref(false);
    const indicator = ref(false);
    onMounted( () => {
      const roles = Cookie.get('member_roles');
      if (roles.indexOf('ROLE_ADMIN') > -1) {
        isAdmin.value = true;
      }
    });

    //const roles = Cookie.get('member_roles');

    const onOpenChange = openKeys => {
      const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);

      if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys;
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    };

    const extensionDown = () => {
      indicator.value = true;
      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/downloadext", {responseType: 'blob'}).then((res) => {
        let response = res;
        if (response === undefined) {
          alert("확장프로그램 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
          indicator.value = false;
          return false;
        }

        let fileName = 'relaket.zip';
        let blob = new Blob([response], {type: 'charset=utf-8'});
        let downloadElement = document.createElement('a');
        let url = window.URL || window.webkitURL || window.moxURL
        let href = url.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = decodeURI(fileName); // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        url.revokeObjectURL(href);
        indicator.value = false;
      });
    }

    return {
      ...toRefs(state),
      onOpenChange,
      isAdmin,
      extensionDown,
      indicator
    };
  },

  mounted() {
    document.querySelector('.sideBar').style.minHeight = window.outerHeight + 'px';
  }

});
</script>

<style scoped>
.sideLogo {
  width: 202px;
  height: 200px;
  background-image: url("../../assets/img/logo-new2.png");
  background-size: 180px auto;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
}

.sideBar {
  height:100%;
}

.defaultStyle {
  padding-left: 10px;
  font-size: 15px;
}

.defaultStyle:hover{
  color: #3051d3!important
}

.defaultColor {
  color: #7c8a96;
}

.topMenuStyle {
  margin-top: 15px;
  padding-left: 15px;
}

.menuStyle {
  height: 80%;
}

.menuFooter {
  margin: 0 0 250px 20px;
  text-align: left;
  /*height:40px;*/
}

.defaultActive {
  color: #3051d3!important
}


</style>
