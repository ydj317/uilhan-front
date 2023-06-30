<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="서비스 이력">
    <a-table :columns="table_columns" :data-source="licenseHistoryData">
      <template #bodyCell="{ column,record, text }">
        <!--사용자-->
        <template v-if="isAdmin && column.key === 'user_name'">
          {{ record.user_name }}
        </template>

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

        <!--결제일자-->
        <template v-if="column.key === 'ins_date'">
          {{ new Date(record.ins_date).toLocaleString() }}
        </template>

        <!--확인여부-->
        <template v-if="column.key === 'is_check'">
          <a-tag v-if="record.is_check === '1'" color="success">확인완료</a-tag>
          <a-tag v-if="record.is_check === '0'">확인대기</a-tag>
        </template>

        <!--확인일자-->
        <template v-if="column.key === 'check_date'">
          <span v-if="record.check_date">{{ new Date(record.check_date).toLocaleString() }}</span>
          <span v-else>
            <a-button v-if="isAdmin" type="primary" shape="round" @click="dataCheck(record.id)">
              결제확인
            </a-button>
          </span>
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

const licenseHistoryData = ref([]);
const table_columns = ref([
  {
    title: "사용자",
    key: "user_name",
    width: "7%",
    align: "center"
  },
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
    title: "결제일자",
    key: "ins_date",
    width: "10%",
    align: "center"
  },
  {
    title: "확인여부",
    key: "is_check",
    width: "7%",
    align: "center"
  },
  {
    title: "확인일자",
    key: "check_date",
    width: "10%",
    align: "center"
  }
]);

function dataCheck(id) {
  indicator.value = true;

  const clonedData = licenseHistoryData.value.map(item => ({ ...item }))
  const params = clonedData.find(item => item.id === id)
  params.is_check = '1'

  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/licenseHistory/check", params).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
        indicator.value = false;
        return false;
      }

      licenseHistoryData.value.map((item, i) => {
        if (item.id === id) {
          licenseHistoryData.value[i].is_check = res.data.is_check;
          licenseHistoryData.value[i].check_date = res.data.check_date;
        }
      });

      indicator.value = false;
    }
  );
}

function getLicense() {
  const requestParams = {
    orderBy: "desc"
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