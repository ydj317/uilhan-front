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
    license_end_date: "",
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

function getRecharge() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/getrecharge").then(
      (res) => {
        if (res.status !== "2000" || res.data === undefined) {
          message.error(res.message);
          return false;
        }

        try {
          formState.settingDatas.recharge = res.data.recharge;
          //product.recharge = res.data.recharge;
        } catch (e) {
          message.error("남은회수 호출 실패");
        }
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

    const endDate = new Date(res.data.license_end_date);
    if (new Date() < endDate) {
      formState.settingDatas.license_remaining_days = endDate.toLocaleString()
      formState.settingDatas.license_end_date = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)) + '일'
    }

    setTimeout(() => {
      formState.loading = false;
    }, 500);

  });
}

onMounted(() => {
  getUserInfoData();
  getRecharge();
});

</script>