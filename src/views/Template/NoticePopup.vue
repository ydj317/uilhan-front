<script setup>
import { onBeforeMount,onMounted, reactive, ref, watch} from "vue";
import { AuthRequest } from "@/util/request";
import { message } from "ant-design-vue";
import { useRoute } from 'vue-router';

const route = useRoute();
const open = ref(true);
let indicator = ref(false);

const dataSource = reactive({
  data: [],
  open:[],
  visibleDays:[],
  currentRoute: '',
  popupShownOnDashboard: false
});

dataSource.currentRoute = route.path;

const shouldShowPopup = (id) => {
  // const lastPopupTimestamp = localStorage.getItem('lastPopupTimestamp' + id);
  // if (!lastPopupTimestamp) {
  //   return true
  // } else {
  //   const lastTimestamp = parseInt(lastPopupTimestamp, 10);
  //   const currentTimestamp = Date.now();
  //   const oneWeekInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 7天的毫秒数
  //
  //   return currentTimestamp - lastTimestamp >= oneWeekInMilliseconds;
  // }

  const lastTimestamp = localStorage.getItem('lastPopupTimestamp' + id);
  if (!lastTimestamp) return true;
  const now = Date.now();
  return now > parseInt(lastTimestamp);
}

const checkPopupDisplay = () => {
  if (dataSource.currentRoute === '/dashboard') {
    if (sessionStorage.getItem('dashboardRefreshed') === 'true') {
      // 如果当前 sessionStorage 中标记为已刷新，则直接获取弹窗数据
      getNoticePopupList();
      sessionStorage.removeItem('dashboardRefreshed');
    } else {
      dataSource.popupShownOnDashboard = false;
    }
  } else {
    // 如果当前不在 dashboard 页面，则清除标记
    dataSource.popupShownOnDashboard = false;
  }
};

const handleCancel = (id) => {
  if(dataSource.visibleDays['visibal'+id] === true){
    // const currentTimestamp = Date.now();
    // localStorage.setItem('lastPopupTimestamp' + id, currentTimestamp.toString());

    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
    localStorage.setItem('lastPopupTimestamp' + id, endOfDay.toString());
  }
  dataSource.open['open' + id] = false;
};

const getNoticePopupList = () => {

  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/noticePopupList').then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      indicator.value = false;
      return false;
    }

    dataSource.data = res.data

    dataSource.data.forEach((item) => {
      dataSource.open['open'+item.id] = ref(true);
      dataSource.visibleDays['visibal'+item.id] = ref(false);
    })
  }).catch((error) => {
    message.error(error.message);
    return false;
  });
}

//启动时检查并清理过期的时间戳
const clearExpiredPopupTimestamps = () => {
  const now = Date.now();
  dataSource.data.forEach(item => {
    const lastTimestamp = localStorage.getItem('lastPopupTimestamp' + item.id);
    if (lastTimestamp && now > parseInt(lastTimestamp)) {
      localStorage.removeItem('lastPopupTimestamp' + item.id);
    }
  });
};

const handleBeforeUnload = () => {
  if (dataSource.currentRoute === '/dashboard') {
    sessionStorage.setItem('dashboardRefreshed', 'true');
  }
};

watch(route, (newRoute) => {
  dataSource.currentRoute = newRoute.path;
  checkPopupDisplay();
});

onBeforeMount(() => {
  // getNoticePopupList()
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

onMounted(() => {
  dataSource.currentRoute = route.path;
  checkPopupDisplay();
  clearExpiredPopupTimestamps();
  window.addEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <template v-for="(item,index) in dataSource.data" :key="index">
    <a-modal :key="index" v-if="shouldShowPopup(item.id) && dataSource.currentRoute === '/dashboard'" v-model:open="dataSource.open[`open${item.id}`]" :title="item.title" @cancel="handleCancel(item.id)" :mask="false" style="margin-top:-50px;width: 730px">
      <div style="text-align: center;height: 750px;overflow: scroll;overflow-x: unset;" v-html="item.content">
      </div>
      <template #footer>
        <a-checkbox v-model:checked="dataSource.visibleDays['visibal'+item.id]" style="color: #999999">오늘 하루 보이지 않기</a-checkbox>
      </template>
    </a-modal>
  </template>
</template>

<style scoped>

</style>