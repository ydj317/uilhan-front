<template>
  <div style="position: sticky;top: 0;">
    <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys = "openKeys"
        mode="inline"
        theme="dark"
    >
      <a-menu-item key="0">
        <template #icon>
          <gift-outlined/>
        </template>
        <router-link to="/main">
          <span>메인</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="1">
        <template #icon>
          <gift-outlined/>
        </template>
        <router-link to="/product">
          <span>상품관리</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <template #icon>
          <calendar-outlined/>
        </template>
        <router-link to="/order/list">
          <span>주문관리</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="3">
        <template #icon>
          <api-outlined/>
        </template>
        <RouterLink to="/market/seller/list">
          <span>마켓연동</span>
        </RouterLink>
      </a-menu-item>
      <a-sub-menu key="4">
        <template #icon>
          <profile-outlined/>
        </template>
        <template #title>
          <span>게시판</span>
        </template>
        <a-menu-item key="041" v-if="isAdmin">
          <RouterLink to="/board/list">
            <span>게시글관리</span>
          </RouterLink>
        </a-menu-item>

        <a-menu-item key="042">
          <RouterLink to="/board/notice">
            <span>공지사항</span>
          </RouterLink>
        </a-menu-item>

        <a-menu-item key="043">
          <RouterLink to="/board/question">
            <span>1:1 문의</span>
          </RouterLink>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="5">
        <template #icon>
          <setting-outlined/>
        </template>
        <template #title>
          <span>설정</span>
        </template>
        <a-menu-item key="054">
          <router-link to="/user/detail"><span>연동정보</span></router-link>
        </a-menu-item>
        <a-menu-item key="055">
          <router-link to="/user/password"><span>비밀번호 변경</span></router-link>
        </a-menu-item>
        <a-menu-item key="051">
          <router-link to="/setting/account"><span>계정정보</span></router-link>
        </a-menu-item>
        <a-menu-item key="052">
          <router-link to="/setting/margin"><span>마진 & 환율</span></router-link>
        </a-menu-item>
        <a-menu-item key="053">
          <router-link to="/setting/delivery"><span>배송정책</span></router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="6">
        <template #icon>
          <money-collect-outlined />
        </template>
        <template #title>
          <span>서비스 관리</span>
        </template>
        <a-menu-item key="061" v-if="isAdmin">
          <router-link to="/user/license"><span>서비스 관리</span></router-link>
        </a-menu-item>
        <a-menu-item key="062">
          <router-link to="/user/licensePay"><span>서비스 결제</span></router-link>
        </a-menu-item>
        <a-menu-item key="063">
          <router-link to="/user/licenseHistory"><span>서비스 이력</span></router-link>
        </a-menu-item>
        <a-menu-item key="064" v-if="isAdmin">
          <router-link to="/user/manage"><span>이미지 번역 회수</span></router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="21">
        <template #icon>
          <close-circle-outlined/>
        </template>
        <router-link to="/user/FilterProductWords">
          <span>금지어 관리</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="22">
        <template #icon>
          <appstore-outlined/>
        </template>
        <router-link to="/product/domeggook">
          <span>도매꾹</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="30" v-if="false">
        <template #icon>
          <pay-circle-outlined/>
        </template>
        <span>예치금관리(준비중)</span>
      </a-menu-item>
      <a-menu-item key="31" v-if="false">
        <template #icon>
          <group-outlined/>
        </template>
        <span>상세페이지 제작(준비중)</span>
      </a-menu-item>
      <a-menu-item key="32" v-if="false">
        <template #icon>
          <file-text-outlined/>
        </template>
        <span>상품부가정보(준비중)</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
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
  ProfileOutlined
} from "@ant-design/icons-vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()

const selectedKeys = ref(["0"]);
const openKeys = ref(["0"]);
const rootSubmenuKeys = ref([]);

const isAdmin = ref(false);

onMounted(() => {
  const roles = Cookie.get("member_roles");
  if (roles.indexOf("ROLE_ADMIN") > -1) {
    isAdmin.value = true;
  }
});

</script>

<style scoped>
.ant-menu .ant-menu-submenu {
  font-weight: bold;
  color: #e3e3e3;
}
.ant-menu-item .ant-menu-title-content a {
  font-weight: bold;
  color: #e3e3e3;
}
</style>
<style>
.ant-menu .ant-menu-submenu {
  font-weight: bold;
  color: #e3e3e3;
}
</style>

