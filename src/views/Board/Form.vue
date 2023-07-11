<script setup>
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import BoardEditor from "@/components/ImageEditor/BoardEditor.vue";
import { message } from "ant-design-vue";

const route = useRoute();
const router = useRouter();
let board = ref([]);
let indicator = ref(false);
let buttonLoading = ref(false);

let formState = reactive({
  id: '',
  title: '',
  content: '',
  is_fixtop: false,
  type: 'notice',
  status: '0',
  sort: '0',
});

const contentUpdate = (tinymce) => {
  formState.content = tinymce.editors[0].getContent();
}

const getBoardDetail = (id) => {
  if (!id) return false;
  indicator.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/detail',{params:{id:id}}).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      indicator.value = false;
      router.push('/board/list')
      return false;
    }

    formState.id = res.data.id
    formState.title = res.data.title
    formState.content = res.data.content
    formState.is_fixtop = res.data.isFixtop
    formState.type = res.data.type
    indicator.value = false;
  }).catch((error) => {
    message.error(error.message);
    indicator.value = false;
    return false;
  });
}

const onFinish = values => {
  values = Object.assign(values, {id: formState.id})
  buttonLoading.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + '/api/board/save', values).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      buttonLoading.value = false;
      return false;
    }

    let data = res.data;
    message.success(data.message);

    buttonLoading.value = false;
    router.push('/board/list')

  }).catch((error) => {
    message.error(error.message);
    buttonLoading.value = false;
    return false;
  });
};

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

onBeforeMount(() => {
  getBoardDetail(route.params.id)
})
</script>

<template>
  <a-card :bordered="false" title="게시글 등록/수정" :loading="indicator">
    <a-form :model="formState" name="board_form" @finish="onFinish"
            @finishFailed="onFinishFailed" autocomplete="off" :scrollToFirstError="true" layout="horizontal"
            class="board_form">
      <a-form-item label="상단고정" name="is_fixtop">
        <a-switch v-model:checked="formState.is_fixtop"/>
      </a-form-item>

      <a-form-item label="타입" name="type">
        <a-radio-group v-model:value="formState.type" button-style="solid">
          <a-radio-button value="notice">공지사항</a-radio-button>
          <a-radio-button value="question">1:1 문의</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="제목" name="title"
                   :rules="[{ required: true, message: '제목을 입력해 주세요.' }]">
        <a-input v-model:value="formState.title" allow-clear placeholder="제목을 입력해 주세요."/>
      </a-form-item>

      <a-form-item label="내용" name="content">
        <BoardEditor
            ref="editor"
            v-model:value="formState.content"
            @contentUpdate="contentUpdate"
        />
      </a-form-item>


      <div style="display: flex;justify-content: center;margin-top: 20px;">
        <a-button type="primary" html-type="submit" :loading="buttonLoading">저장</a-button>
        <a-button style="margin-left: 10px" @click="router.back()">취소</a-button>
      </div>
    </a-form>
  </a-card>
</template>

<style>
.board_form .ant-form-item {
  margin-bottom: 0;
}

.board_form .ant-form-item-label {
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.board_form .ant-form-item-control {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.board_form .ant-form-item-control:nth-last-child {
  border-bottom: 1px solid #eeeeee;
}

</style>