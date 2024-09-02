<template>
  <template v-for="(item,index) in state.list" :key="index">
    <a-modal :key="index" :title="item.title" :mask="false" v-model:open="item['open' + item.id]" @cancel="modalCancel" v-if="state.currentRoute === item.menu && !item.show && todayShow(item)" style="margin-top:-50px;width: 730px">
      <div style="text-align: center;height: 750px;overflow: scroll;overflow-x: unset;" v-html="item.content"></div>
      <template #footer>
        <a-checkbox v-model:checked="item['close' + item.id]" style="color: #999999">오늘 하루 보이지 않기</a-checkbox>
      </template>
    </a-modal>
  </template>
</template>
<script setup>
import { reactive, watch, onMounted, onUnmounted } from "vue";
import { AuthRequest } from "@/util/request";
import { message } from "ant-design-vue";
import { useRoute } from 'vue-router';

const route = useRoute();
const state = reactive({
  list: [],
  currentRoute: '',
});
state.currentRoute = route.path;

const getNoticePopupList = async () => {
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/noticePopupList').then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
    state.list = res.data.map((item) => {
      item.show = false;
      item['open' + item.id] = true;
      item['close' + item.id] = false;
      return item;
    })
    localStorage.setItem('noticeList', JSON.stringify(state.list));
  }).catch((error) => {
    message.error(error.message);
    return false;
  });
}
const todayShow = (item) => {
  let todayTime = Date.now();
  let tomorrowTime = localStorage.getItem(item.id + item.menu);
  if(!tomorrowTime){
    return true;
  }
  if(todayTime > tomorrowTime){
    localStorage.removeItem(item.id + item.menu);
    return true;
  }
  return false;
};
const getMidnightTime = () => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return tomorrow.getTime();
};
const modalCancel = () => {
  state.list = state.list.map(item=>{
    if(state.currentRoute === item.menu && !item.show){
      item.show = true;
      if(item['close' + item.id]){
        const tomorrowTime = getMidnightTime();
        localStorage.setItem(item.id + item.menu, tomorrowTime);
      }
    }
    return {...item};
  })
  localStorage.setItem('noticeList', JSON.stringify(state.list));
};
watch(route, (newRoute) => {
  state.currentRoute = newRoute.path;
  const noticeList = localStorage.getItem('noticeList');
  noticeList ? state.list = JSON.parse(noticeList) : getNoticePopupList();
}, { immediate: true });
const  refresh = async () => {
  localStorage.removeItem('noticeList');
};
onMounted(() => {
  window.addEventListener('beforeunload', refresh);
});
onUnmounted(() => {
  window.removeEventListener('beforeunload', refresh);
});
</script>

<style scoped>

</style>