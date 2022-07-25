<template>
  <div class="sideBar">
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
        <span class="defaultColor defaultStyle">주문관리</span>
      </a-menu-item>
      <a-menu-item key="3">
        <img src="../../assets/img/side/pre.png" >
        <span class="defaultColor defaultStyle">예치금관리</span>
      </a-menu-item>
      <a-menu-item key="4">
        <img src="../../assets/img/side/detail.png" >
        <span class="defaultColor defaultStyle">상세페이지 제작</span>
      </a-menu-item>
      <a-menu-item key="5">
        <img src="../../assets/img/side/download.png" >
        <span class="defaultColor defaultStyle">자료 다운로드</span>
      </a-menu-item>
      <a-sub-menu key="6">
        <template #title>
          <img src="../../assets/img/side/setting.png" >
          <span class="defaultColor defaultStyle">설정</span>
        </template>
        <a-menu-item key="7"><span class="defaultColor defaultStyle">릴라켓정보</span></a-menu-item>
        <a-menu-item key="7"><span class="defaultColor defaultStyle">배송정책</span></a-menu-item>
        <a-menu-item key="7"><span class="defaultColor defaultStyle">출고지</span></a-menu-item>
        <a-menu-item key="8"><span class="defaultColor defaultStyle">반품지</span></a-menu-item>
        <a-menu-item key="8"><span class="defaultColor defaultStyle">마진 & 환율</span></a-menu-item>
      </a-sub-menu>
      <a-menu-item key="9">
        <img src="../../assets/img/side/market.png" >
        <span class="defaultColor defaultStyle">제휴사연동</span>
      </a-menu-item>
      <a-menu-item key="10">
        <img src="../../assets/img/side/other.png" >
        <span class="defaultColor defaultStyle">상품부가정보</span>
      </a-menu-item>
    </a-menu>

    <div class="menuFooter">
      <a href="https://relaket.com" target="_blank"></a>
      <img class="menuFooterLogo" src="../../assets/img/side/relaket_logo_link.png" alt="">
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
  setup() {
    const state = reactive({
      rootSubmenuKeys: ['6'],
      openKeys: [],
      selectedKeys: [],
    });

    const onOpenChange = openKeys => {
      const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);

      if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys;
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    };

    return {
      ...toRefs(state),
      onOpenChange,
    };
  },

});
</script>

<style scoped>
.sideLogo {
  width: 250px;
  height: 70px;
  background-image: url("../../assets/img/logo-dark.png");
  background-size: 180px 40px;
  background-repeat: no-repeat;
  background-position: center;
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
  text-align: center;
}

.menuFooterLogo {
  height:40px;
}

.defaultActive {
  color: #3051d3!important
}


</style>
