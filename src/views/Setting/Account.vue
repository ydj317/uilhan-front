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

      <a-descriptions-item v-if="isAdmin">
        <template #label>
          <a-space>
            <span>자동 저장 사용</span>
            <a-tooltip title="자동 저장은 상품등록 시 저장버튼을 클릭하지 않아도 수정된 상품정보를 실시간으로 저장하는 기능입니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-switch v-model:checked="isAutoSaveEnabled" checked-children="On" un-checked-children="Off" />
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

const isAutoSaveEnabled = ref(false);  //首次默认是关闭的

const recharge = ref(0);

const formState = reactive({
  settingDatas: {
    recharge: 0,
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

function getUserInfoData() {
  formState.loading = true;
  useUserApi().getUserInfoData({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      formState.loading = false;
      return false;
    }

    formState.settingDatas.recharge = res.data.recharge;

    setTimeout(() => {
      formState.loading = false;
    }, 500);

  });
}

onMounted(() => {
  getUserInfoData();
});

</script>