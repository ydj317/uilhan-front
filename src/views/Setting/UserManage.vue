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

        <a-button @click="searchList" style="width: 80px;" type="primary">
          검색
        </a-button>
      </a-input-group>

    </div>

    <a-table :dataSource="userData" :columns="tableColumns" :pagination="false">
      <template #bodyCell="{ column, record }">

        <template v-if="column.title === '추천코드'">
          <a-button @click="copyText(record.username)">
            {{ record.username }}
            <CopyOutlined />
          </a-button>
        </template>

        <template v-if="column.title === 'Action'">
          <a-button type="primary" @click="userLogin(record)">로그인 하기</a-button>
        </template>

      </template>
    </a-table>
    <a-pagination
        style="width: 100%;display: flex;justify-content: center;align-items: center;margin-top: 15px;"
        v-model:current="searchFrom.page"
        v-model:page-size="searchFrom.pageSize"
        @change="onPageChange"
        :total="searchFrom.total"
        :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
    />

  </a-card>
</template>

<script setup>
import {
  CopyOutlined
} from "@ant-design/icons-vue";
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
  page: 1,
  pageSize: 10,
  total: 0,
  loading: false,
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
  },
  {
    key: "recommend_code",
    label: "추천코드"
  },
  {
    key: "parent_user",
    label: "추천인 아이디"
  }
]);

const userData = ref([]);
const tableColumns = ref([
  {
    title: 'No.',
    dataIndex: 'key',
    width: '5%',
  },
  {
    title: '아이디',
    dataIndex: 'username',
    width: '13%',
  },
  {
    title: '추천코드',
    dataIndex: 'recommend_code',
    width: '10%',
  },
  {
    title: '추천인 아이디',
    dataIndex: 'parent_user',
    width: '13%',
  },
  {
    title: '추천 횟수',
    dataIndex: 'recommend_count',
    width: '10%',
  },
  {
    title: '사용자명',
    dataIndex: 'name',
    width: '13%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '13%',
  },
  {
    title: '휴대전화',
    dataIndex: 'phone',
    width: '13%',
  },
  {
    title: '가입시간',
    dataIndex: 'ins_date',
    width: '13%',
  },
  {
    title: 'Action',
  }
]);

const onPageChange = (page, pageSize) => {
  searchFrom.page = page;
  searchFrom.pageSize = pageSize;
  getUserList();
};

const copyText = (recommend_code) => {
  var textArea = document.createElement("textarea");
  textArea.value = recommend_code;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  message.success('복사성공 하였습니다.');
};

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

    // ChannelIO('boot', {
    //   "pluginKey": "33974dfe-4ab5-4a61-8d67-748faed23416",
    //   "memberId": res.data.member_name,
    //   "profile": {
    //     "name": res.data.member_name
    //   }
    // });

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

function searchList() {
  searchFrom.page = 1;
  searchFrom.search_value = searchFrom.search_value.trim();

  if (searchFrom.search_value === "") {
    message.error('검색어를 입력해주세요.');
    return false;
  }

  getUserList();
}

function getUserList() {
  tableLoading.value = true;
  useUserApi().getUserList(searchFrom).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      tableLoading.value = false;
      return false;
    }

    searchFrom.total = res.data.total;

    userData.value = res.data.userList.map((item, index) => {
      // 创建一个Date对象
      const date = new Date(item[0].insDate);

      // 提取年月日时分秒
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      // 格式化输出
      const formattedCreatedAt = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      return {...item[0], key: searchFrom.total - (searchFrom.page * searchFrom.pageSize) - index, ins_date: formattedCreatedAt, recommend_count: item['childCount'] };
    });

    tableLoading.value = false;
  });
}

onMounted(() => {
  getUserList();
});
</script>
