<script setup>
import {useRoute, useRouter} from "vue-router";
import {defineAsyncComponent, nextTick, onBeforeMount, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import { message } from "ant-design-vue";
const Comments = defineAsyncComponent(() => import("@/views/Board/Comments.vue"));
const route = useRoute();
const router = useRouter();
let board = ref([]);
let indicator = ref(false);
let buttonLoading = ref(false);

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

const getBoardDetail = (id) => {
  if (!id) return false;
  indicator.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/detail', {params: {id: id}}).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      indicator.value = false;
      router.push('/board/notice')
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
  getBoardDetail(route.params.id)
})
</script>

<template>
  <a-card :bordered="false" :title="formState.title" :loading="indicator">
    <div style="display: flex;align-items: center">
      <div style="font-weight: bold">{{ formState.user_name }}</div>
      <a-divider type="vertical" />
      <div>클릭수: {{ formState.hits }}</div>
      <a-divider type="vertical" />
      <div>{{formState.insDate}}</div>
    </div>
    <a-divider></a-divider>
    <div v-html="formState.content"></div>
    <a-divider></a-divider>
    <div style="display: flex;justify-content: center;margin-top: 20px;">
      <a-button @click="router.back()">목록</a-button>
    </div>
  </a-card>

  <Comments :ids="route.params.id" style="margin-top: 10px;"/>
</template>

<style>

</style>