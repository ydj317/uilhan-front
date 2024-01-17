<template>
  <a-card :loading="formState.loading" :bordered="false" title="계정정보">
    <a-descriptions bordered :column="1" :labelStyle="{ width: '100px' }"
                    :contentStyle="{ width: '500px' }">

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>이미지 번역 남은 회수</span>
            <a-tooltip title="이미지 번역 남은 회수에 대한 도움말">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>

        <a-input :value="formState.settingDatas.recharge" disabled style="width: 200px;"/>
        <!--도움말-->
      </a-descriptions-item>

      <a-descriptions-item v-if="isAdmin">
        <template #label>
          <a-space>
            <span>카테고리 동기화</span>
            <a-tooltip title="카테고리 동기화에 대한 도움말">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-button @click="onClickSyncDomeggookCategory" type="primary">동기화 실행</a-button>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>AI추천모드 사용</span>
            <a-tooltip>
              <template #title>
                AI 추천모드는 챗GPT 유료서비스로 충전 후 설정이 가능하고 사용함으로 설정하면 AI가 추천하는 상품명과 키워드로 상품을 등록하게 됩니다.<br>
                챗GPT 충전 관련 문의는 관리자에게 하시기 바랍니다.
              </template>
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>

        <a-switch v-model:checked="formState.settingDatas.use_ai" @change="changeUseAi" checked-children="on" un-checked-children="off" />
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>자동 저장 사용</span>
            <a-tooltip title="자동 저장은 상품등록 시 저장버튼을 클릭하지 않아도 수정된 상품정보를 실시간으로 저장하는 기능입니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-switch v-model:checked="formState.settingDatas.use_auto_save" @change="changeUseAutoSave" checked-children="on" un-checked-children="off" />
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script setup>
import {AuthRequest} from "@/util/request";

import {onMounted, reactive, ref} from "vue";
import Cookie from "js-cookie";
import {message} from "ant-design-vue";
import {useUserApi} from "@/api/user";
import {QuestionCircleOutlined} from "@ant-design/icons-vue";

const recharge = ref(0);

const formState = reactive({
  settingDatas: {
    recharge: 0,
    use_ai: false,
    use_auto_save: false,
    license_remaining_days: "",
  },
  loading: false,
});

const isAdmin = ref(Cookie.get("member_roles").split(",").includes("ROLE_ADMIN"));

function onClickSyncDomeggookCategory() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/domeggook/sync/category", {
    market_code: "Domeggook"
  }).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        message.warning("카테고리 동기화 신청완료.");
      }
  );
}

function changeUseAi() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", {
    use_ai: formState.settingDatas.use_ai,
  }).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
  });
}

function changeUseAutoSave() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", {
    use_auto_save: formState.settingDatas.use_auto_save,
  }).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
  });
}

function getUserInfoData() {
  formState.loading = true;
  useUserApi().getUserInfoData({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      formState.loading = false;
      return false;
    }

    formState.settingDatas.recharge = res.data.recharge;
    formState.settingDatas.use_ai = (res.data.use_ai === '1');
    formState.settingDatas.use_auto_save = (res.data.use_auto_save === '1');

    setTimeout(() => {
      formState.loading = false;
    }, 500);

  });
}

onMounted(() => {
  getUserInfoData();
});

</script>