<template>

  <div style="font-size: 18px; font-weight: bold; padding-bottom: 10px;">MQ리스트</div>
  <a-card :loading="mqLoading" :bodyStyle="mqLoading ? {overflow: 'hidden'} : {padding: 0, overflow: 'hidden'}">
      <a-table :data-source="mqReportData" :pagination="false">
        <a-table-column title="구분" :width="300" dataIndex="title" key="title" />
        <a-table-column title="이름" :width="300" dataIndex="name" key="name" />
        <a-table-column title="대기중" dataIndex="ready" key="ready" />
        <a-table-column title="처리중" dataIndex="unacked" key="unacked" />
        <a-table-column title="전체" dataIndex="total" key="total" />
      </a-table>
  </a-card>
  <div v-if="!mqLoading" style="font-size: 14px;  padding-top: 10px;">
    <a-button type="dashed" danger>최신시간：{{ lastSuccessTime }} <LoadingOutlined v-if="mqRLoading" /></a-button>
  </div>

  <div style="height: 100px;"></div>

</template>

<script setup>
import {onUnmounted, onMounted, ref} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import {LoadingOutlined} from "@ant-design/icons-vue";

let mqLoading = ref(true);
let mqRLoading = ref(true);
let mqReportData = ref([]);
let intervalId = null;
const lastSuccessTime = ref(null); // 存储最后一次成功获取数据的时间

const getTableList = async () => {
  mqRLoading.value = true;
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/mqReport").then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      mqLoading.value = false;
      mqRLoading.value = false;
      return false;
    }

    mqReportData = res.data;

    lastSuccessTime.value = new Date().toLocaleString(); // 记录成功获取数据的时间
  }).catch((e) => {
    message.error(e.message);
    return false
  }).finally(() => {
    mqLoading.value = false;
    mqRLoading.value = false;
  });
};

onMounted(() => {
  getTableList()
  intervalId = setInterval(getTableList, 5000); // 每5秒钟执行一次 getTableList
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId); // 组件卸载时清除定时器
  }
});

</script>

<style scoped>

.title {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 10px;
}

</style>