<template>
  <a-drawer placement="right" :closable="false" :visible="visible" @close="onClose">
    <h2>히스토리</h2>
    <h3>{{ historyData.title }}</h3>
    <a-divider />
    <div style="height:calc(100vh - 200px);overflow-y:scroll;padding:10px 0;" :v-loading="state.loading">
      <div v-if="Object.keys(state.data).length < 1" style="color:#999999;">히스토리 기록이 없습니다.</div>
      <a-timeline>
        <a-timeline-item v-for="(history, index) in state.data" :key="index"
          :color="history.messageType === 'success' ? 'green' : history.messageType === 'error' ? 'red' : 'blue'">{{
            history.insDate }} [{{ history.userName }}]<div>{{ history.message }}</div></a-timeline-item>
      </a-timeline>
    </div>
  </a-drawer>
</template>

<script setup>
import { toRefs, onMounted, watch, watchEffect, reactive } from 'vue'
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
  state.loading = true
  await useHistoryApi().getHistoryList(historyData.value).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.loading = false
      return false;
    }

    const { list } = res.data;
    state.data = list;
    state.loading = false;
  });
}

watchEffect(() => {
  if (visible.value) {
    getHistoryList()
  }
})
</script>