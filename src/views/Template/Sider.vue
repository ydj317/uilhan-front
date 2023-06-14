<template >
<!--  <loading-->
<!--      v-model:active="indicator"-->
<!--      :can-cancel="false"-->
<!--      :is-full-page="true"-->
<!--  />-->
  <a-affix :offset-top="0">
    <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="dark"
    >
      <a-menu-item key="1">
        <template #icon>
          <gift-outlined />
        </template>
        <router-link to="/product">
          <span>상품관리</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <template #icon>
          <calendar-outlined />
        </template>
          <router-link to="/order/list">
        <span>주문관리</span>
          </router-link>
      </a-menu-item>
      <a-menu-item key="3">
        <template #icon>
          <pay-circle-outlined />
        </template>
        <span>예치금관리(준비중)</span>
      </a-menu-item>
      <a-menu-item key="4">
        <template #icon>
          <group-outlined />
        </template>
        <span>상세페이지 제작</span>
      </a-menu-item>
      <a-sub-menu key="6">
        <template #icon>
          <setting-outlined />
        </template>
        <template #title>
          <span>설정(준비중)</span>
        </template>
        <a-menu-item key="71"><span>릴라켓정보</span></a-menu-item>
        <a-menu-item key="72"><span>배송정책</span></a-menu-item>
        <a-menu-item key="73"><span>출고지</span></a-menu-item>
        <a-menu-item key="81"><span>반품지</span></a-menu-item>
        <a-menu-item key="82"><span>마진 & 환율</span></a-menu-item>
      </a-sub-menu>
      <a-menu-item key="9">
        <template #icon>
          <api-outlined />
        </template>
          <RouterLink to="/market/seller/list">
              <span>제휴사연동</span>
          </RouterLink>
      </a-menu-item>
      <a-menu-item key="10">
        <template #icon>
          <file-text-outlined />
        </template>
        <span >상품부가정보(준비중)</span>
      </a-menu-item>
      <a-menu-item key="11" v-if="isAdmin">
        <template #icon>
          <money-collect-outlined />
        </template>
        <router-link to="/user/manage">
          <span>회원충전</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="12">
        <template #icon>
          <close-circle-outlined />
        </template>
        <router-link to="/user/FilterProductWords">
          <span>금지어 관리</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="13">
        <template #icon>
          <appstore-outlined />
        </template>
        <router-link to="/product/domeggook">
          <span>도매꾹</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-affix>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue';
import Cookie from "js-cookie";
import {
  GiftOutlined,
  CalendarOutlined,
  PayCircleOutlined,
  FileTextOutlined,
  ApiOutlined,
  SettingOutlined,
  GroupOutlined,
  AppstoreOutlined,
  MoneyCollectOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue';
import {AuthRequest} from "@/util/request";
import Loading from "vue-loading-overlay";

const selectedKeys = ref(['1']);
const openKeys = ref([]);
const rootSubmenuKeys = ref([]);

const isAdmin = ref(false);

onMounted( () => {
  const roles = Cookie.get('member_roles');
  if (roles.indexOf('ROLE_ADMIN') > -1) {
    isAdmin.value = true;
  }
});

const onOpenChange = openKeys => {
  const latestOpenKey = openKeys.find(key => openKeys.indexOf(key) === -1);

  if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    openKeys = openKeys;
  } else {
    openKeys = latestOpenKey ? [latestOpenKey] : [];
  }
};


</script>

<style scoped>

</style>
