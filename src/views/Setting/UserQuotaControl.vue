<template>

  <Loading
      v-model:active="loading"
      :can-cancel="false"
      :is-full-page="true"
  />

  <div v-if="isAdmin">
    <a-card :bordered="false" title="금지어 관리">
      <div class="mt5">
        <!--셀렉박스-->
        <a-select
            class="mr10"
            ref="select"
            v-model:value="searchType"
            style="width: 146px"
            @change=""
        >
          <a-select-option value="user_name">用户名</a-select-option>
          <a-select-option value="user_id">用户id</a-select-option>
        </a-select>
        <!--입력-->
        <a-input style="width: 200px" v-model:value="searchValue" placeholder="검색어를 입력해주세요."/>
        <!--검색버튼-->
        <a-button
            @click="searchApi"
            style="width: 100px; margin-left: 10px"
            type="primary"
        >검색
        </a-button>
      </div>
    </a-card>
  </div>
  <div v-else>
    不是管理员
  </div>
</template>


<script setup>
import {ref} from "vue";
import Loading from "vue-loading-overlay";
import Cookie from "js-cookie";

const loading = ref(false);
const userName = Cookie.get("member_name");
const isAdmin = Cookie.get("member_roles").indexOf("ROLE_ADMIN") !== -1;
const searchValue = ref("");
const searchType = ref("user_name");

</script>

<style scoped>

</style>