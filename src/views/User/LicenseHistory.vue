<template>
  <a-card :loading="cartLoading" :bordered="false" title="서비스 이용 내역">
    <a-table :columns="table_columns" :data-source="licenseList">
      <template #bodyCell="{ column,record, text }">
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import { onMounted, ref } from "vue";

// loading
const cartLoading = ref(true);

const licenseList = ref([]);
const table_columns = ref([
  {
    title: "서비스명",
    key: "name",
    align: "center"
  },
  {
    title: "가격",
    key: "price",
    align: "center"
  },
  {
    title: "충전일수",
    key: "day",
    align: "center"
  },
  {
    title: "사용여부",
    key: "is_use",
    align: "center"
  }
]);

function getLicense() {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/license/list").then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      licenseList.value = res.data;

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