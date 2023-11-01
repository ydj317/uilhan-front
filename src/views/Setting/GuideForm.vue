<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cardLoading" :bordered="false" :title="'안내정보 ' + (route.params.id ? '수정' : '등록')">
    <a-form :model="formState" name="guide_form" @finish="onFinish"
            @finishFailed="onFinishFailed" autocomplete="off" :scrollToFirstError="true" layout="horizontal"
            class="guide_form">

      <a-form-item label="안내정보명" name="name"
                   :rules="[{ required: true, message: '안내정보명을 입력해 주세요.' }]">
        <a-input v-model:value="formState.name" allow-clear placeholder="안내정보명을 입력해 주세요." />
      </a-form-item>

      <a-form-item label="기본설정" name="is_default"
                   :rules="[{ required: true, message: '기본설정을 선택해 주세요.' }]">
        <a-radio-group v-model:value="formState.is_default">
          <a-radio :value="'1'">사용함</a-radio>
          <a-radio :value="'0'" :disabled="guideData !== undefined && guideData.length < 1">사용안함</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="안내정보(앞)" name="before_cont">
        <BoardEditor
          ref="beforeContEditor"
          v-model:value="formState.before_cont"
          @contentUpdate="beforeContUpdate"
        />
      </a-form-item>

      <a-form-item label="안내정보(뒤)" name="after_cont">
        <BoardEditor
          ref="afterContEditor"
          v-model:value="formState.after_cont"
          @contentUpdate="afterContUpdate"
        />
      </a-form-item>

      <div style="display: flex;justify-content: center;margin-top: 20px;">
        <a-button type="primary" html-type="submit">저장</a-button>
        <a-button style="margin-left: 10px" @click="router.back()">취소</a-button>
      </div>
    </a-form>
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { message } from "ant-design-vue";
import BoardEditor from "@/components/ImageEditor/BoardEditor.vue";

// loading
const indicator = ref(false);
const cardLoading = ref(true);

const route = useRoute()
const guideData = ref()
const formState = reactive({
  id: route.params.id,
  name: "",
  before_cont: "",
  after_cont: "",
  is_default: "0"
});

const beforeContUpdate = (tinymce) => {
  formState.before_cont = tinymce.editors[0].getContent();
}

const afterContUpdate = (tinymce) => {
  formState.after_cont = tinymce.editors[1].getContent();
}

const onFinish = values => {
  indicator.value = true;
  values = Object.assign(values, { id: formState.id });
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/guide/save", values).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
      return false;
    }

    message.success("서비스 등록 성공하였습니다.");
    router.push("/setting/updateDetail");
  }).catch((error) => {
    message.error(error.message);
    indicator.value = false;
    return false;
  });
};

const onFinishFailed = errorInfo => {
  console.log("Failed:", errorInfo);
};

function getGuide() {
  if (!route.params.id) {

    AuthRequest.get(process.env.VUE_APP_API_URL + "/api/guide/list").then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
        }

        guideData.value = res.data;

        if (guideData.value.length < 1) {
          formState.is_default = '1'
        }

        cardLoading.value = false;
      }
    );

    return true;
  }

  const requestParams = {
    id: route.params.id
  };

  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/guide", { params: requestParams }).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
      }

      formState.name = res.data.name;
      formState.before_cont = res.data.beforeCont;
      formState.after_cont = res.data.afterCont;
      formState.is_default = res.data.isDefault;

      cardLoading.value = false;
    }
  );
}

onMounted(() => {
  getGuide();
});
</script>

<style>
.guide_form .ant-form-item {
  margin-bottom: 0;
}

.guide_form .ant-form-item-label {
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.guide_form .ant-form-item-control {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.guide_form .ant-form-item-control:nth-last-child {
  border-bottom: 1px solid #eeeeee;
}
</style>

<style scoped>
</style>