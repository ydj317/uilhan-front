<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { AuthRequest } from "@/util/request";
import { message } from "ant-design-vue";
const open = ref(true);
const isSevenDays = ref(false);
let indicator = ref(false);

let formState = reactive({
  id: '',
  title: '',
  content: '',
  user_name: '',
  hits: 0,
  is_fixtop: false,
  type: 'notice',
  status: '0',
  sort: '0',
  insDate: '',
});

function shouldShowPopup() {
  const lastPopupTimestamp = localStorage.getItem('lastPopupTimestamp');

  if (!lastPopupTimestamp) {
    open.value = true
  } else {
    const lastTimestamp = parseInt(lastPopupTimestamp, 10);
    const currentTimestamp = Date.now();
    const oneWeekInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 7天的毫秒数

    open.value = currentTimestamp - lastTimestamp >= oneWeekInMilliseconds;
  }
}

const handleCancel = (e) => {
  if(isSevenDays.value === true){
    const currentTimestamp = Date.now();
    localStorage.setItem('lastPopupTimestamp', currentTimestamp.toString());
  }
  open.value = false;
};

const getBoardDetail = (id) => {
  if (!id) return false;
  indicator.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/detail',{params:{id:id}}).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      indicator.value = false;
      return false;
    }

    formState.id = res.data.id
    formState.title = res.data.title
    formState.content = res.data.content
    formState.is_fixtop = res.data.isFixtop
    formState.type = res.data.type
    formState.insDate = res.data.insDate
    formState.user_name = res.data.userName
    formState.hits = res.data.hits
    indicator.value = false;
  }).catch((error) => {
    message.error(error.message);
    indicator.value = false;
    return false;
  });
}
onBeforeMount(() => {
  getBoardDetail(123)
  shouldShowPopup()
})
</script>

<template>
  <a-modal v-model:visible="open" :title="formState.title" @cancel="handleCancel" :mask="false" >
    <div style="text-align: center;" v-html="formState.content">

    </div>
    <template #footer>
      <a-checkbox v-model:checked="isSevenDays" style="color: #999999">3일간 보이지 않기</a-checkbox>
    </template>
  </a-modal>

</template>

<style scoped>

</style>