<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :bordered="false" title="서비스 이력" :style="{marginBottom:'20px'}">
    <a-input-group compact v-if="isAdmin">
      <a-select value="1" style="width: 150px;">
        <a-select-option value="1">사용자</a-select-option>
      </a-select>
      <a-input v-model:value="search_value" placeholder="키워드" style="width: 300px;" />
      <a-button @click="getLicense" type="primary">검색</a-button>
    </a-input-group>
  </a-card>
  <a-card :loading="cartLoading" :bordered="false">
    <a-table :columns="table_columns" :data-source="licenseHistoryData" :pagination="pagination">
      <template #bodyCell="{ column,record, text }">

        <!--사용자-->
        <a-table-column title="사용자" dataIndex="user_name" width="7%" align="center" :show="isAdmin">
          {{ record.user_name }}
        </a-table-column>

        <!--서비스명-->
        <template v-if="column.key === 'name'">
          <div style="text-align: left">
            {{ record.name }}
            <a-tag style="margin-left: 10px;">{{ record.day }}일</a-tag>
          </div>
        </template>

        <!--결제금액-->
        <template v-if="column.key === 'price'">
          {{ record.price.toLocaleString() }}
        </template>

        <!--결제은행-->
        <template v-if="column.key === 'card_bank'">
          {{ record.card_bank }}
        </template>

        <!--예금주-->
        <template v-if="column.key === 'card_name'">
          {{ record.card_name }}
        </template>

        <!--카드번호-->
        <template v-if="column.key === 'card_number'">
          {{ record.card_number }}
        </template>

        <!--신청일자-->
        <template v-if="column.key === 'ins_date'">
          {{ new Date(record.ins_date).toLocaleString() }}
        </template>

        <!--확인여부-->
        <template v-if="column.key === 'status'">
          <a-tag v-if="record.status === '1'" color="success">확인완료</a-tag>
          <a-tag v-if="record.status === '0'">확인대기</a-tag>
          <a-tag v-if="record.status === '2'" color="error">입금취소</a-tag>
          <div v-if="record.check_date" style="font-size: 12px; color: #999; padding-top: 5px;">
            ( {{ new Date(record.check_date).toLocaleString() }} )
          </div>
        </template>

        <!--수정-->
        <template v-if="column.key === 'check_date'">
          <a-input-group compact>
            <a-button v-if="isAdmin && record.status === '0'" type="primary" @click="statusChange(record.id, '1')">
              확인
            </a-button>
            <a-button v-if="record.status === '0'" @click="statusChange(record.id, '2')">
              취소
            </a-button>
          </a-input-group>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import { onMounted, ref } from "vue";
import Cookie from "js-cookie";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";

// loading
const indicator = ref(false);
const cartLoading = ref(true);

const isAdmin = ref(Cookie.get("member_roles").split(",").includes("ROLE_ADMIN"));

const search_value = ref('');
const licenseHistoryData = ref([]);
const table_columns = ref([
  {
    title: "서비스 명",
    key: "name",
    align: "center"
  },
  {
    title: "결제금액",
    key: "price",
    width: "10%",
    align: "center"
  },
  {
    title: "결제은행",
    key: "card_bank",
    width: "7%",
    align: "center"
  },
  {
    title: "예금주",
    key: "card_name",
    width: "7%",
    align: "center"
  },
  {
    title: "카드번호",
    key: "card_number",
    width: "10%",
    align: "center"
  },
  {
    title: "신청일자",
    key: "ins_date",
    width: "10%",
    align: "center"
  },
  {
    title: "확인여부",
    key: "status",
    width: "10%",
    align: "center"
  },
  {
    title: "수정",
    key: "check_date",
    width: "10%",
    align: "center"
  }
]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total, range) => `현재 ${range[0]}-${range[1]}건 / 총 ${total}건`,
  pageSizeOptions: ['10', '20', '50'],
  onChange: page => {
    pagination.value.current = page;
  },
  onShowSizeChange: (current, pageSize) => {
    pagination.value.current = 1;
    pagination.value.pageSize = pageSize;
  },
});

function statusChange(id, status) {
  indicator.value = true;

  const clonedData = licenseHistoryData.value.map(item => ({ ...item }))
  const params = clonedData.find(item => item.id === id)
  params.status = status

  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/licenseHistory/check", params).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
        indicator.value = false;
        return false;
      }

      licenseHistoryData.value.map((item, i) => {
        if (item.id === id) {
          licenseHistoryData.value[i].status = res.data.status;
          licenseHistoryData.value[i].check_date = res.data.check_date;
        }
      });

      indicator.value = false;
    }
  );
}

function getLicense() {
  cartLoading.value = true;
  const requestParams = {
    orderBy: "desc",
    search_value: search_value.value
  };
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/licenseHistory/list", { params: requestParams }).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      licenseHistoryData.value = res.data;

      cartLoading.value = false;
    }
  );
}

onMounted(() => {
  getLicense();
});
</script>

<style scoped>
</style>