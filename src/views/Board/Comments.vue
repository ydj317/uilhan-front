<script setup>
import {onBeforeMount, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import {useRoute, useRouter} from "vue-router";
import { message } from "ant-design-vue";
const route = useRoute()
const router = useRouter()

const props = defineProps(['ids'])

const initLoading = ref(true);
const buttonLoading = ref(false);
const data_show = ref(false);
const data = ref([]);
const list = ref([]);

const formState = reactive({
    pid: '',
    content: '',
});

const validateMessages = {
  required: '${label} 을/를 입력해 주세요.',
};

const onFinish = values => {
  console.log('Success:', values);
  values = Object.assign(values, {id: formState.pid})
  buttonLoading.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + '/api/board/commentsSave', values).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      buttonLoading.value = false;
      return false;
    }

    let data = res.data;
    message.success(data.message);
    formState.content = '';
    buttonLoading.value = false;
    getComments(props.ids)
  }).catch((error) => {
    message.error(error.message);
    buttonLoading.value = false;
    return false;
  });
};

const getComments = (id) => {
  if (!id) return false;
  initLoading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/commentsList', {params: {id: id}}).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      initLoading.value = false;
      router.push('/board/question')
      return false;
    }

    initLoading.value = false;

    data.value = res.data;
    list.value = res.data;
  }).catch((error) => {
    message.error(error.message);
    initLoading.value = false;
    return false;
  });
}

onBeforeMount(() => {
  formState.pid = props.ids
  getComments(props.ids)
})
</script>

<template>
  <a-card :bordered="false" :loading="initLoading">
    <a-list
        class="demo-loadmore-list"
        :loading="initLoading"
        item-layout="horizontal"
        :data-source="list"
        v-if="data.length>0"
    >
      <template #renderItem="{ item }" >
        <a-list-item>

          <a-list-item-meta :description="item.title">
            <template #title>
              {{ item.userName }}
            </template>
            <template #avatar>
              <a-avatar :src="item.img"/>
            </template>
          </a-list-item-meta>
          <div>{{ item.updDate }}</div>
        </a-list-item>
      </template>
    </a-list>
    <a-divider v-if="data.length>0"></a-divider>
    <a-form
        :model="formState"
        name="nest-messages"
        :validate-messages="validateMessages"
        @finish="onFinish"
    >
      <a-form-item name="content" label="내용" :rules="[{ required: true }]">
        <a-textarea v-model:value="formState.content" />
      </a-form-item>

      <a-form-item>
        <div style="display: flex;justify-content: center;margin-top: 20px;">
          <a-button type="primary" html-type="submit" :loading="buttonLoading">저장</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<style scoped>

</style>