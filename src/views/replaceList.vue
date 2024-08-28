<template>

  <div class="title">메세지치환 관리</div>

  <a-card :loading="loading" :bodyStyle="loading ? {overflow: 'hidden'} : {padding: 0, overflow: 'hidden'}">
    <a-table :data-source="replaceData" :pagination="false">
      <a-table-column title="구분" :width="300" dataIndex="title" key="title" />
      <a-table-column title="이름" :width="300" dataIndex="name" key="name" />
      <a-table-column title="대기중" dataIndex="ready" key="ready" />
      <a-table-column title="처리중" dataIndex="unacked" key="unacked" />
      <a-table-column title="전체" dataIndex="total" key="total" />
    </a-table>
  </a-card>

  <div style="height: 100px;"></div>

</template>

<script setup>
import {onUnmounted, onMounted, ref} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import {LoadingOutlined} from "@ant-design/icons-vue";

let loading = ref(true);
let replaceData = ref([]);

const getTableList = async () => {
  loading.value = true;
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/mqReport").then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      loading.value = false;
      return false;
    }

    replaceData.value = res.data;

  }).catch((e) => {
    message.error(e.message);
    return false
  }).finally(() => {
    loading.value = false;
  });
};

onMounted(() => {
  getTableList()
});

</script>

<style scoped>

.title {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 10px;
}

</style>