<template>
  <a-drawer placement="right" :closable="false" :visible="visible" @close="onClose">
    <h2>히스토리</h2>
    <h3>{{ historyData.title }}</h3>
    <a-divider />
    <div v-if="state.loading" style="display: flex;height:calc(100vh - 220px);overflow: hidden; justify-content: center;align-items: center;"><a-spin size="large" tip="로딩중..."/></div>
    <div v-else style="height:calc(100vh - 200px);overflow-y:scroll;padding:10px 0;">
      <a-timeline >
        <a-timeline-item v-for="(history, index) in state.data" :key="index"
          :color="history.messageType === 'success' ? 'green' : history.messageType === 'error' ? 'red' : 'blue'">{{
            history.insDate }} [{{ history.userName }}]<div>{{ history.message }}</div></a-timeline-item>
      </a-timeline>
      <div v-if="state.loading === false && Object.keys(state.data).length < 1" style="color:#999999; padding: 20px 0;display: flex;justify-content: center;align-items: center;">히스토리 기록이 없습니다.</div>
    </div>
  </a-drawer>
</template>

<script setup>
import { toRefs, watchEffect, reactive } from 'vue'
import { useHistoryApi } from '@/api/history'
import { message } from "ant-design-vue";

const props = defineProps({
  visible: Boolean,
  historyData: {
    type: Object,
    default: () => ({})
  }
})

const state = reactive({
  data: [],
  loading: false
})

const { visible, historyData } = toRefs(props)
const emit = defineEmits(['close'])

const onClose = () => {
  emit('close')
}

const getHistoryList = async () => {
  state.data = [];
  state.loading = true
  await useHistoryApi().getHistoryList(historyData.value).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const { list } = res.data;
    state.data = list;

  }).catch((e) => {
    message.error(e.message);
    return false;
  }).finally(() => {
    state.loading = false;
  });
}

watchEffect(() => {
  if (visible.value) {
    getHistoryList()
  }
})
</script>