<template>
  <a-card :loading="cartLoading" :bordered="false" title="서비스 이용내역">
    <a-table :columns="table_columns" :data-source="licenseHistoryData">
      <template #bodyCell="{ column,record, text }">
        <!--서비스명-->
        <template v-if="column.key === 'name'">
          <div style="text-align: left">
            {{ record.name }}
            <a-tag style="margin-left: 10px;">{{ record.day }}일</a-tag>
          </div>
        </template>

        <!--가격-->
        <template v-if="column.key === 'price'">
          {{ record.price.toLocaleString() }}
        </template>

        <!--사용여부-->
        <template v-if="column.key === 'is_use'">
          <a-tag v-if="record.is_use === '1'" color="success">사용중</a-tag>
          <a-tag v-if="record.is_use === '0'" color="error">사용중지</a-tag>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import { onMounted, ref } from "vue";

// loading
const cartLoading = ref(true);

const licenseHistoryData = ref([]);
const table_columns = ref([
  {
    title: "서비스명",
    key: "name",
    align: "center"
  },
  {
    title: "가격",
    key: "price",
    width: "15%",
    align: "center"
  },
  {
    title: "사용여부",
    key: "is_use",
    width: "15%",
    align: "center"
  }
]);

function getLicense() {
  const requestParams = {
    orderBy: "desc"
  };
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/license_history/list", { params: requestParams }).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      licenseHistoryData.value = res.data;

      for (let i = 0; i < licenseHistoryData.value.length; i++) {
        licenseHistoryData.value[i].key = i;
        licenseHistoryData.value[i].checked = false;
      }

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