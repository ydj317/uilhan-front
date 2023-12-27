
<template>
  <a-card :loading="formState.loading" :bordered="false">
    <a-descriptions title="배대지 계정 연동" bordered :column="1" :labelStyle="{ width: '170px' }"
                    :contentStyle="{ width: 'auto' }">
      <a-descriptions-item label="배대지 ID:" :labelStyle="{textAlign: 'right'}">
        <a-input v-model:value="formState.settingDatas.bind_bridge_id" size="small" style="width: 200px;" allow-clear @input="formState.settingDatas.is_bridge_sync = false" />
      </a-descriptions-item>
      <a-descriptions-item label="배대지 비밀번호:" :labelStyle="{textAlign: 'right'}">
        <!-- 크롬 자동입력 방지 하기위하여 추가 -->
        <a-input type="password" style="position: absolute; opacity: 1; width: 1px; height: 1px; z-index: 1;" />
        <!-- 실제 비밀번호 입력 인풋 -->
        <a-input type="password" v-model:value="formState.settingDatas.bind_bridge_password" size="small" style="position: relative; z-index: 2; width: 200px;" allow-clear @input="formState.settingDatas.is_bridge_sync = false" />
      </a-descriptions-item>
      <a-descriptions-item label="연동상태:" :labelStyle="{textAlign: 'right'}">
        <a-space>
          <a-tag v-if="formState.settingDatas.is_bridge_sync" color="green">연동완료</a-tag>
          <a-tag v-else color="red">미연동</a-tag>
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item label="연동확인" :labelStyle="{textAlign: 'right'}">
        <a-button type="primary" size="small" @click.prevent="bridgeSyncCheck">연동확인</a-button>
      </a-descriptions-item>
    </a-descriptions>
    <div style="display: flex;justify-content: center" class="mt15">
      <a-button type="primary" @click="handleSaveUserData" :disabled="!formState.settingDatas.is_bridge_sync">저장</a-button>
    </div>
  </a-card>
</template>

<script setup>
import {onMounted, reactive} from "vue";
import {useUserApi} from "@/api/user";
import {message} from "ant-design-vue";
import {NoAuthAjax} from "@/util/request";
import {useBridgeApi} from "@/api/bridge";

const formState = reactive({
  settingDatas: {
    bind_bridge_id: '',
    is_bridge_sync: false,
    bind_bridge_password: '',
  },
  loading: false,
})

function getUserInfoData() {
  formState.loading = true;
  useUserApi().getUserInfoData({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      formState.loading = false;
      return false;
    }

    const { bridge_mb_id,is_bridge_sync } = res.data;

    formState.settingDatas.bind_bridge_id = bridge_mb_id
    formState.settingDatas.bind_bridge_password = ''
    formState.settingDatas.is_bridge_sync = is_bridge_sync

    setTimeout(() => {
      formState.loading = false;
    }, 500);

  });
}

const handleSaveUserData = () => {
  if (checkValidation() === false) {
    return false;
  }
  useUserApi().bindBridge(formState.settingDatas).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success('저장 되었습니다.');
    getUserInfoData();
  });
}

const bridgeSyncCheck = () => {
  if (checkValidation() === false) {
    return false;
  }
  useBridgeApi().syncCheckIsMember(formState.settingDatas).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    if (res.data.code !== "2000") {
      message.error(res.data.message);
      return false;
    }

    message.success('바인딩 가능한 ID입니다. 저장 버튼을 눌러주세요.');
    formState.settingDatas.is_bridge_sync = true;
  });
}

// 유효성 체크
const checkValidation = () => {
  if (formState.settingDatas.bind_bridge_id === '') {
      message.error("배대지 ID를 입력해주세요.");
      return false;
  }

  if (formState.settingDatas.bind_bridge_password === '') {
      message.error("배대지 비밀번호를 입력해주세요.");
      return false;
  }

  return true;
}

onMounted(() => {
  getUserInfoData();
});
</script>