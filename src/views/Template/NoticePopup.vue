<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { AuthRequest } from "@/util/request";
import { message } from "ant-design-vue";
const open = ref(true);
let indicator = ref(false);

const dataSource = reactive({
  data: [],
  open:[],
  visibleDays:[],
});


const shouldShowPopup = (id) => {
  const lastPopupTimestamp = localStorage.getItem('lastPopupTimestamp' + id);

  if (!lastPopupTimestamp) {
    return true
  } else {
    const lastTimestamp = parseInt(lastPopupTimestamp, 10);
    const currentTimestamp = Date.now();
    const oneWeekInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 7天的毫秒数

    return currentTimestamp - lastTimestamp >= oneWeekInMilliseconds;
  }
}

const handleCancel = (id) => {
  if(dataSource.visibleDays['visibal'+id] === true){
    const currentTimestamp = Date.now();
    localStorage.setItem('lastPopupTimestamp' + id, currentTimestamp.toString());
  }
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
onBeforeMount(() => {
  getNoticePopupList()
})
</script>

<template>
  <template v-for="(item,index) in dataSource.data" :key="index">
    <a-modal :key="index" v-if="shouldShowPopup(item.id)" v-model:open="dataSource.open[`open${item.id}`]" :title="item.title" @cancel="handleCancel(item.id)" :mask="false">
      <div style="text-align: center;height: 600px;overflow: scroll;overflow-x: unset;" v-html="item.content">
      </div>
      <template #footer>
        <a-checkbox v-model:checked="dataSource.visibleDays['visibal'+item.id]" style="color: #999999">3일간 보이지 않기</a-checkbox>
      </template>
    </a-modal>
  </template>
</template>

<style scoped>

</style>