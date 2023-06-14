<template>
  <div id="container" >
    <loading v-model:active="bLoading"
             :can-cancel="false"
             :is-full-page="true"/>
    <div id="search" class="pl20 pr20 pb20 pt20 mb30 bg-white">
      <span :style="{ marginRight: '8px' }">키워드 : </span>
      <a-select v-model:value="search_key" style="width: 120px">
        <a-select-option value="user_id">유저 아이디</a-select-option>
      </a-select>
      <a-input style="width: 500px; margin-left: 10px" v-model:value="search_value" placeholder="유저아이디" />

      <a-button @click="getUserList" style="width: 100px; margin-left: 10px" type="primary">검색</a-button>
      <a-button @click="apikey" style="width: 100px; margin-left: 10px" type="primary">apikey</a-button>
    </div>
    <div id="list" class="p20 bg-white">
      <a-table :bordered="false" :columns="columns" :data-source="userList" :pagination="pagination">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'all'">
            <div style="text-align: center"><a-button>{{column.title}}</a-button></div>
          </template>
          <template v-else>
            <div style="text-align: center">{{column.title}}</div>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'all'">
            <div style="text-align: center">
              <a-checkbox v-model:checked="record.checked"></a-checkbox>
            </div>
          </template>
          <template v-else-if="column.key === 'action'">
            <div style="text-align: center;"><a-button @click="openRechargePop(record.id, record.now_recharge, record.username)">충전</a-button></div>
          </template>
          <template v-else>
            <div  style="text-align: center;">{{record[column.key]}}</div>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal width="600px" :maskClosable="false" v-model:visible="rechargePop" @ok="">
      <template #title>
        <h3 style="text-align: center; display: inline-block; width: 90%"><b>이미지 번역 충전</b></h3>
      </template>

      <div style="text-align: center">
        <a-table
            :bordered="false"
            :columns="[{title: '회원명',
            dataIndex: 'username',
            key: 'username',
            width: 100,}, {title: '남은회수(현재)',
            dataIndex: 'now_recharge',
            key: 'now_recharge',
            width: 100,}]"
            :data-source="userRemaining"
            :pagination="{hideOnSinglePage:true}"
        >
          <template #headerCell="{ column }">
            <template v-if="column.key === 'all'">
              <div style="text-align: center"><a-button>{{column.title}}</a-button></div>
            </template>
            <template v-else>
              <div style="text-align: center">{{column.title}}</div>
            </template>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'all'">
              <div style="text-align: center">
                <a-checkbox v-model:checked="record.checked"></a-checkbox>
              </div>
            </template>
            <template v-else>
              <div  style="text-align: center;">{{record[column.key]}}</div>
            </template>
          </template>
        </a-table>

        <a-input style="width: 200px; margin-top: 20px" v-model:value="recharge_value" placeholder="청전회수" />
      </div>
      <template v-slot:footer>
        <div style="text-align: center">
          <a-button type="primary" @click="recharge()">확인</a-button>
          <a-button type="primary" @click="closeRecharge()">취소</a-button>
        </div>

      </template>
    </a-modal>
  </div>
  <!--  <div class="search_body">-->
  <!--    <a-button type="primary" @click="register">계정등록</a-button>-->
  <!--  </div>-->

  <!--  <a-list class="search_body" item-layout="horizontal" :data-source="userList">-->
  <!--    <template #renderItem="{ item }">-->
  <!--      <a-list-item>-->
  <!--        <a-list-item-meta>-->
  <!--          <template #title>-->
  <!--            <h4>{{ item.username }}</h4>-->
  <!--          </template>-->
  <!--          <template #avatar>-->
  <!--            <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />-->
  <!--          </template>-->
  <!--        </a-list-item-meta>-->
  <!--      </a-list-item>-->
  <!--    </template>-->
  <!--  </a-list>-->
</template>
<script>
import {defineComponent, onMounted, ref} from 'vue';
import Cookie from "js-cookie";
import {AuthRequest} from "util/request";
import router from "router";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default defineComponent({
  components: { Loading },
  setup() {
    const userList = ref([]);
    const roles = ref(Cookie.get('member_roles'));
    const search_key = ref('user_id');
    const search_value = ref('');
    let rechargePop = ref(false);
    let recharge_value = ref(0);
    let bLoading = ref(false);
    let id = (0);
    let userRemaining = ref([]);
    let limit = ref(10);
    let pageNum = ref(1);
    const userTotal = ref(0);
    let pagination = ref({});
    onMounted(async () => {
      if (roles.value === null || roles.value.indexOf('ROLE_ADMIN') === -1) {
        return false;
      }
      bLoading.value = true;
      await getUserList();
    });

    // let validateUsername = async (rule, value) => {
    //
    //
    //     if (oldName === value) {
    //       return Promise.resolve();
    //     }
    //
    //     if (value.length < 5 || value.length > 20) {
    //       return Promise.reject('최소 5자 최대 20자이내로 입력해주십시오');
    //     }
    //
    //     let returnData = await NoAuthAjax.post(
    //         process.env.VUE_APP_API_URL + '/api/checkname', value).then((res) => {
    //       return res.data;
    //     });
    //
    //     if (returnData === undefined || returnData.status === undefined) {
    //       alert("서버장애로 인해 회원가입에 실패하였습니다. \n 잠시후 시도해주시길 바랍니다.");
    //       return false;
    //     }
    //
    //     if (returnData.status !== 2000) {
    //       return Promise.reject('이미 존재하는 아이디입니다.');
    //     }
    //
    //     return Promise.resolve();
    //
    // };

    const getUserList = () => {
      let param = initParam();

      return AuthRequest.post(process.env.VUE_APP_API_URL + '/api/userlist', param).then((res) => {
        if (res.data.list !== undefined && res.data.list.length > 0) {
          for (let i=0; i < res.data.list.length; i++) {
            res.data.list[i].checked = false;
          }

          userList.value = res.data.list;
          pageNum.value = res.data.page;
          limit.value = res.data.limit;
          if (search_value.value.length > 0) {
            userTotal.value = res.data.list.length;
          } else {
            userTotal.value = res.data.total;
          }

          pagination.value = {
            total: userTotal.value,
            current: pageNum.value,
            pageSize: limit.value,
            position: ['bottomCenter'],
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: page => {
              pageNum.value = page;
              pagination.value.current = page;
              getUserList();
            },
            onShowSizeChange: (current, pageSize) => {
              limit.value = pageSize;
              getUserList();
            },
          };
        }

        if (bLoading.value === true) {
          bLoading.value = false;
        }
      });
    };

    // const getrate = () => {
    //   AuthRequest.post(process.env.VUE_APP_API_URL + '/api/getrate').then((res) => {
    //     console.log(res)
    //   });
    // };

    const recharge = () => {
      let intPattern = /^[0-9]*$/;
      if (isNaN(parseInt(recharge_value.value)) === true ||
          intPattern.test(recharge_value.value) !== true) {
        alert('충전회수는 숫자만 입력가능합니다');
        return false;
      }

      bLoading.value = true;

      let data = {
        recharge: recharge_value.value,
        user: id
      };

      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/recharge', data).then(async (res) => {
        if (res.status === undefined || res.status !== '2000') {
          alert(res.message);
          return false;
        }

        rechargePop.value = false;
        recharge_value.value = 0;

        alert(res.message);
        await getUserList();
        bLoading.value = false;
      });
    };
    const closeRecharge = () => {
      id = 0;
      rechargePop.value = false;
    };

    const openRechargePop = (no, now_recharge, username) => {
      id = no;
      rechargePop.value = true;
      userRemaining.value = [{now_recharge: now_recharge, username: username}];
    };

    const register = () => {
      router.push("/user/register");
      return false;
    };

    const columns = [
      {
        title: '회원아이디',
        dataIndex: 'username',
        key: 'username',
        width: 100,
      }, {
        title: '충전회수',
        dataIndex: 'recharge',
        key: 'recharge',
        width: 100,
      }, {
        title: '기존 회수',
        dataIndex: 'remaining',
        key: 'remaining',
        width: 100,
      }, {
        title: '총수량',
        dataIndex: 'total',
        key: 'total',
        width: 100,
      }, {
        title: '충전유형',
        dataIndex: 'type',
        key: 'type',
        width: 100,
      }, {
        title: '충전시간',
        dataIndex: 'ins_time',
        key: 'ins_time',
        width: 100,
      }, {
        title: '충전인',
        dataIndex: 'add_user',
        key: 'add_user',
        width: 100,
      }, {
        title: '액션',
        dataIndex: 'action',
        key: 'action',
        width: 100,
      }
    ];

    const initParam =  () => {
      return {
        user: search_value.value,
        limit: limit.value,
        page: pageNum.value
      }
    };

    const apikey = () => {
      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/copykey').then(async (res) => {
        if (res.status === undefined || res.status !== '2000') {
          alert('실패');
          return false;
        }

        alert('성공');
      });
    };

    return {
      search_key,
      search_value,
      userList,
      register,
      getUserList,
      columns,
      recharge,
      closeRecharge,
      rechargePop,
      openRechargePop,
      recharge_value,
      bLoading,
      userRemaining,
      pagination,
      apikey
    };
  },
});
</script>
<style scoped>
.search_body {
  padding: 10px 10px;
  background: #fff;
  margin: 10px 10px 10px 10px;
}
</style>

