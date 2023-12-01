<template>
  <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
          class="market_form">
    <a-form-item name="seller_id" label="파트너 ID" :rules="[{ required: true, message: '파트너 ID를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.seller_id" :disabled="state.formData.sync_market_status"/>
    </a-form-item>

    <a-form-item name="client_id" label="clientId" @keyup="handleResetSyncStatus"
                 :rules="[{ required: true, message: 'ClientId를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.client_id"/>
    </a-form-item>

    <a-form-item name="client_secret" label="clientSecret" @keyup="handleResetSyncStatus"
                 :rules="[{ required: true, message: 'ClientSecret를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.client_secret"/>
    </a-form-item>

    <a-form-item name="partner_token" label="파트너 API KEY" @keyup="handleResetSyncStatus"
                 :rules="[{ required: true, message: '파트너 API KEY를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.partner_token"/>
    </a-form-item>

    <a-button class="mt15" @click="handleSyncMarketCheck" :loading="state.syncCheckLoading">
      <template #icon v-if="state.formData.sync_market_status">
        <CheckCircleOutlined style="color:#67C23A;"/>
      </template>
      연동확인
    </a-button>
    <a-divider/>
    <a-button class="mt15" @click="goBack">돌아가기</a-button>
    <a-button class="mt15 ml15" @click="handleSubmit" type="primary">저장</a-button>

  </a-form>
</template>

<script setup>
import {reactive, onMounted, ref} from "vue";
import {message} from "ant-design-vue";
import {useMarketAccountApi} from '@/api/marketAccount';
import {useAccountJsonApi} from '@/api/accountJson';
import {
  CheckCircleOutlined,
} from '@ant-design/icons-vue';
import {useRouter} from 'vue-router';

const props = defineProps({
  market_code: {
    type: String,
    default: ''
  },
  accountInfo: {
    type: Object,
    default: {}
  }
});

const router = useRouter();
const marketFormRef = ref(null);

const state = reactive({
  formData: {
    id: '',
    market_code: props.market_code,
    seller_id: '',
    client_id: '',
    client_secret: '',
    partner_token: '',
    sync_market_status: false,

  },

  syncCheckLoading: false,
  syncShippingCostPolicyLoading: false,

})

// 수정시 계정 데이터 설정
const initFormData = () => {
  const accountInfo = props.accountInfo;

  if (Object.keys(accountInfo).length > 0) {
    state.formData.id = accountInfo.id;
    state.formData.market_code = accountInfo.marketCode;
    state.formData.seller_id = accountInfo.marketData.seller_id;
    state.formData.client_id = accountInfo.marketData.client_id;
    state.formData.client_secret = accountInfo.marketData.client_secret;
    state.formData.partner_token = accountInfo.marketData.partner_token;
    state.formData.sync_market_status = accountInfo.marketData.sync_market_status;
  }
}

// 연동확인
const handleSyncMarketCheck = () => {

  marketFormRef.value.validate().then(() => {
    state.syncCheckLoading = true;

    useMarketAccountApi().syncMarketCheck(state.formData).then(res => {
      if (res.status !== "2000") {
        message.error(res.message);
        state.syncCheckLoading = false;
        return false;
      }

      const {account_id} = res.data;
      message.success(res.message);

      state.formData.id = account_id;

      state.syncCheckLoading = false;
      state.formData.sync_market_status = true
    });
  }).catch((error) => {
    console.log('error', error);
  });
};

// 저장
const handleSubmit = (e) => {

  if (state.formData.sync_market_status === false) {
    message.error('연동확인을 먼저 해주세요.');
    return false;
  }

  marketFormRef.value.validate().then(() => {
    useMarketAccountApi().registerOrModifyAccount(state.formData).then(res => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }

      message.success(res.message);
      setTimeout(() => {
        router.push({name: 'market_accounts_list'});
      }, 500);

    });
  }).catch((error) => {
    console.log('error', error);
  });
};

const handleResetSyncStatus = () => {
  state.formData.sync_market_status = false;
}

onMounted(() => {
  initFormData()
});

const goBack = () => {
  router.push({name: 'market_accounts_list'});
};
</script>
<style scoped>
.popoverTable th {
  background-color: #f5f5f5;
  padding: 5px;
  text-align: center;
}

.popoverTable td {
  padding: 5px;
}
</style>
<style>
.market_form .ant-form-item {
  margin-bottom: 0;
}

.market_form .ant-form-item-label {
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.market_form .ant-form-item-control {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.market_form .ant-form-item-control:nth-last-child {
  border-bottom: 1px solid #eeeeee;
}
</style>