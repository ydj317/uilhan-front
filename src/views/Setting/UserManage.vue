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
        <a-input v-model:value="searchFrom.search_value" placeholder="검색어" @keyup.enter="searchList" style="width: 200px;"/>

        <a-button @click="searchList" style="width: 80px;" type="primary">
          검색
        </a-button>
      </a-input-group>

    </div>

    <a-table :dataSource="userData" :columns="tableColumns" :pagination="false" :scroll="{ x: 1700 }" :row-class-name="(_record, index) => (_record.del_date ? 'bg-f0f0f0' : '')">
      <template #bodyCell="{ column, record }">

        <template v-if="column.title === '추천코드'">
          <a-button @click="copyText(record.username)">
            {{ record.username }}
            <CopyOutlined />
          </a-button>
        </template>
        <template v-if="column.title === '추천인 아이디'">
          <template v-if="Cookie.get('member_name') == 'jwli'">
            <div class="fl-tc fl-le">
              <div class="wb-ba">{{ record.parent_user }}</div>
              <EditOutlined class="cp ml5" @click="editParentUser(record)" />
            </div>
          </template>
          <template v-else>
            {{ record.parent_user }}
          </template>
        </template>

        <template v-if="column.title === 'Action'">
         <a-flex gap="10" align="center">
           <a-button type="primary" @click="userLogin(record)">로그인 하기</a-button>
           <a-button type="default" @click="deleteAccountModal(record)">탈퇴</a-button>
           <a-button
             size="small"
             :type="!! record.memo ? 'primary' : 'default'"
             style="width: 32px;padding: 0;"
             @click="editPrdMemo(record)"
           ><FileTextOutlined/></a-button>
         </a-flex>
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
  <a-modal v-model:open="deleteOpen" title="회원 탈퇴 확인" @ok="deleteAccount" ok-text="확인" cancel-text="취소">
    {{deleteAccountData.username}}회원 계정 탈퇴를 확인하시겠습니까?&nbsp; 확인 완료 후 더 이상 사용 불가합니다.
  </a-modal>
  <a-modal
    width="600px"
    v-model:open="memoForm.show"
    centered title="고객 계정 메모"
    :afterClose="cancelEditMemo"
    :maskClosable="false"
  >
    <a-textarea
      show-count :maxlength="500"
      v-model:value="memoForm.memo"
      placeholder="메모를 입력해주세요."
      :auto-size="{ minRows: 15, maxRows: 15 }"
    />
    <br>

    <template v-slot:footer>
      <a-button @click="cancelEditMemo">취소</a-button>
      <a-button type="primary" @click="savePrdMemo">저장</a-button>
    </template>
  </a-modal>
  <a-modal v-model:open="searchFrom.editModal" title="추천인 아이디" cancel-text="취소" ok-text="저장" @ok="setParentUser" @cancel="cancelParentUser">
    <a-input v-model:value="searchFrom.editUser.parent_user"/>
  </a-modal>
</template>

<script setup>
import {
  CopyOutlined, FileTextOutlined,EditOutlined
} from "@ant-design/icons-vue";
import {onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {useUserApi} from "@/api/user";
import router, {setFilterRouteList} from "@/router";
import Cookie from "js-cookie";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { AuthRequest } from "@/util/request";

const tableLoading = ref(false);
const indicator = ref(false);
const deleteOpen = ref(false);
const deleteAccountData = ref({});
const memoForm = ref({show: false, id: -1, memo: ''})
const searchFrom = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  loading: false,
  search_key: "username",
  search_value: "",
  editModal: false,
  editUser:{},
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
    width: '10%',
  },
  {
    title: '아이디',
    dataIndex: 'username',
    width: '12%',
  },
  {
    title: '추천코드',
    dataIndex: 'recommend_code',
    width: '10%',
  },
  {
    title: '추천인 아이디',
    dataIndex: 'parent_user',
    width: '12%',
  },
  {
    title: '추천 횟수',
    dataIndex: 'recommend_count',
    width: '8%',
  },
  {
    title: '상품수집수',
    dataIndex: 'prd_register_count',
    width: '8%',
  },
  {
    title: '사용자명',
    dataIndex: 'name',
    width: '12%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '12%',
  },
  {
    title: '휴대전화',
    dataIndex: 'phone',
    width: '12%',
  },
  {
    title: '가입시간',
    dataIndex: 'ins_date',
    width: '12%',
  },
  {
    title: 'Action',
    fixed: 'right',
    width: '16%',
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
const tempSave = (record) => {
  delete localStorage.save_user_name;
  delete localStorage.user_name;

  if (checked.value) {
    localStorage.save_user_name = 'T';
    localStorage.user_name = record.username;
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
      "pluginKey": "0415e1c8-2665-407e-b81c-8cb4f7d08a2e",
      "memberId": res.data.member_name,
      "profile": {
        "name": res.data.member_name
      }
    });

    // 아이디 저장하기
    tempSave(record);

    Cookie.set('member_name', res.data.member_name);
    Cookie.set('member_roles', res.data.member_roles);
    Cookie.set('token', res.data.token);
    sessionStorage.clear();
    const menuList = setFilterRouteList();
    router.addRoute(menuList[0])

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000)
  });
}

function searchList() {
  searchFrom.page = 1;
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
      const formattedCreatedAt = getDate(item[0].insDate);
      item['children'] = item['children'].map(item2=>{
        return {...item2,ins_date:getDate(item2.insDate)}
      })
      const children = item['children'].length ? item['children'] : '';
      return {...item[0], key: searchFrom.total - ((searchFrom.page - 1) * searchFrom.pageSize + index), ins_date: formattedCreatedAt, recommend_count: item['childCount'],children, prd_register_count: item['prdRegisterCount'] };
    });
    tableLoading.value = false;
  });
}
// 格式化输出
function getDate(rq){
  const date = new Date(rq);
  // 提取年月日时分秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 格式化输出
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const  deleteAccountModal = (record) => {
  deleteAccountData.value = record;
  deleteOpen.value = true;
};
const  deleteAccount = () => {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/account/delete", {id:deleteAccountData.value.id}).then((res) => {
    deleteOpen.value = false;
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    searchFrom.page = 1;
    getUserList();
  });
};
const  editPrdMemo = (record) => {
  memoForm.value.show = true
  memoForm.value.id = record.id
  memoForm.value.memo = record.memo
};
const  cancelEditMemo = () => {
  memoForm.value.show = false
  memoForm.value.id = -1
  memoForm.value.memo = ''
};
const  savePrdMemo = () => {
  if(memoForm.value.memo.trim() == ''){
    return;
  }
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user/set", {id:memoForm.value.id,memo:memoForm.value.memo}).then((res) => {
    deleteOpen.value = false;
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    memoForm.value.show = false
    searchFrom.page = 1;
    getUserList();
  });
};
const editParentUser = (record) => {
    searchFrom.editUser.id =record.id;
    searchFrom.editUser.parent_user = record.parent_user;
    searchFrom.editModal = true;
};
const setParentUser = () => {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user/set", {id:searchFrom.editUser.id,parent_user:searchFrom.editUser.parent_user}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    userData.value = userData.value.map(user => {
      if(user.id === searchFrom.editUser.id){
        user.parent_user = searchFrom.editUser.parent_user.toLowerCase();
      }
      return user;
    })
    cancelParentUser();
  });
};
const cancelParentUser = () => {
  searchFrom.editModal = false;
};
onMounted(() => {
  getUserList();
});
</script>
