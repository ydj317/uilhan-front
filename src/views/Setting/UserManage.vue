<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true" />

  <a-card :loading="tableLoading" :bordered="false" title="고객 계정관리">

    <div class="mb20">
      <a-input-group compact>
        <a-select v-model:value="searchFrom.search_key" style="width: 120px;">
          <a-select-option v-for="config in searchKeyword" :value="config.key">
            {{ config.label }}
          </a-select-option>
        </a-select>
        <a-input v-model:value="searchFrom.search_value" placeholder="검색어" style="width: 200px;"/>

        <a-button @click="getUserList" style="width: 80px;" type="primary">
          검색
        </a-button>
      </a-input-group>

    </div>

    <a-table :dataSource="userData" :columns="tableColumns">

      <template #bodyCell="{ column, record }">
        <template v-if="column.title === 'Action'">
          <a-button type="primary" @click="userLogin(record)">로그인 하기</a-button>
        </template>
      </template>

    </a-table>

  </a-card>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {useUserApi} from "@/api/user";
import router, {setFilterRouteList} from "@/router";
import Cookie from "js-cookie";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const tableLoading = ref(false);
const indicator = ref(false);

const searchFrom = reactive({
  search_key: "username",
  search_value: ""
})
const searchKeyword = ref([
  {
    key: "username",
    label: "아이디"
  },
  {
    key: "name",
    label: "사용자명"
  }
]);

const userData = ref([]);
const tableColumns = ref([
  {
    title: 'No.',
    dataIndex: 'key',
  },
  {
    title: '아이디',
    dataIndex: 'username',
  },
  {
    title: '사용자명',
    dataIndex: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: '휴대전화',
    dataIndex: 'phone',
  },
  {
    title: 'Action',
  }
]);

// 로컬스토리지 저장
const checked = ref(localStorage.save_user_name === 'T');
const tempSave = () => {
  delete localStorage.save_user_name;
  delete localStorage.user_name;

  if (checked.value) {
    localStorage.save_user_name = 'T';
    localStorage.user_name = formState.username;
  }
}

// 회원 로그인
function userLogin(record) {
  indicator.value = true;
  useUserApi().userLogin(record).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
      return false;
    }

    if (res.data.member_roles === undefined) {
      message.error('처리중 오류가 발생하였습니다. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.(role error)');
      indicator.value = false;
      return false;
    }

    ChannelIO('boot', {
      "pluginKey": "33974dfe-4ab5-4a61-8d67-748faed23416",
      "memberId": res.data.member_name,
      "profile": {
        "name": res.data.member_name
      }
    });

    // 아이디 저장하기
    tempSave();

    Cookie.set('member_name', res.data.member_name);
    Cookie.set('member_roles', res.data.member_roles);
    Cookie.set('token', res.data.token);
    const menuList = setFilterRouteList();
    router.addRoute(menuList[0])

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000)
  });
}

function getUserList() {
  tableLoading.value = true;
  useUserApi().getUserList(searchFrom).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      tableLoading.value = false;
      return false;
    }

    userData.value = res.data.userList.map((item, index) => {
      return {...item, key: index + 1};
    });

    tableLoading.value = false;
  });
}

onMounted(() => {
  getUserList();
});
</script>
