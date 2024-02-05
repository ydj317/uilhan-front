<template>
  <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
          class="market_form">
    <a-form-item name="seller_id" label="파트너 ID" :rules="[{ required: true, message: '파트너 ID를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.seller_id" :disabled="state.formData.sync_market_status"/>
    </a-form-item>

    <a-form-item name="partner_token" label="파트너 API KEY" @keyup="handleResetSyncStatus"
                 :rules="[{ required: true, message: '파트너 API KEY 를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.partner_token"/>
    </a-form-item>
    <a-button class="mt15" @click="handleSyncMarketCheck" :loading="state.syncCheckLoading">
      <template #icon v-if="state.formData.sync_market_status">
        <CheckCircleOutlined style="color:#67C23A;"/>
      </template>
      연동확인
    </a-button>
    <a-divider/>
    <div v-if="state.formData.sync_market_status">

      <h3>마켓정보 불러오기</h3>
      <a-form-item label="출고지/반품지">
        <div style="display: flex; align-items: center;">
          <div>
            <div>
              <a-form-item name="outbound_address_code" label="출고지"
                           :rules="[{ required: true, message: '출고지를 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.outbound_address_code" placeholder="출고지를 선택해 주세요"
                          style="width:260px;">
                  <a-select-option :value="item.outbound_code"
                                   v-for="(item, key) in state.outboundAddressList" :key="key">{{
                      item.outbound_name
                    }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <div>
              <a-form-item name="return_address_code" label="반품지"
                           :rules="[{ required: true, message: '반품지를 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.return_address_code" placeholder="반품지를 선택해 주세요"
                          style="width:260px;">
                  <a-select-option :value="item.return_address_code"
                                   v-for="(item, key) in state.returnAddressList" :key="key">{{
                      item.return_address_name
                    }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>

          <div>
            <a-button @click="syncOutboundAddress(state.formData.id)" class="ml15"
                      :loading="state.syncOutboundAddressLoading">업데이트
            </a-button>
            <a-tag class="ml15" v-if="state.sync_address_status == 0">-</a-tag>
            <a-tag color="#87d068" class="ml15" v-else-if="state.sync_address_status == 1">성공</a-tag>
            <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
            <span>{{ state.sync_address_date ?? '-' }}</span>
          </div>
        </div>
      </a-form-item>


      <h3 class="mt20">마켓정보설정</h3>

      <a-form-item label="제주 추가 배송비">
        <a-form-item name="jeju_add_delivery_price" label="제주 추가 배송비"
                     :rules="[{ required: true, message: '제주 추가 배송비를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input-number v-model:value="state.formData.jeju_add_delivery_price"
                          style="width:160px" step="1000"/>
        </a-form-item>
        <a-form-item name="jeju_add_delivery_price_round_trip" label="제주 외 도서산간 추가 배송비"
                     :rules="[{ required: true, message: '제주 외 도서산간 추가 배송비를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input-number v-model:value="state.formData.jeju_add_delivery_price_round_trip" style="width:200px" step="1000"/>
        </a-form-item>
      </a-form-item>
      <a-form-item name="return_delivery_price" label="반품배송비(편도)"
                   :rules="[{ required: true, message: '제주 추가 배송비를 입력해 주세요.' }]">
        <a-input-number v-model:value="state.formData.return_delivery_price" style="width:160px"
                        step="1000"/>
      </a-form-item>
    </div>
    <a-button class="mt15" @click="goBack">돌아가기</a-button>
    <a-button class="mt15 ml15" @click="handleSubmit" type="primary">저장</a-button>

  </a-form>
</template>

<script setup>
import {reactive, onMounted, ref} from "vue";
import {message} from "ant-design-vue";
import {useMarketAccountApi} from '@/api/marketAccount';

import {
  CheckCircleOutlined,
} from '@ant-design/icons-vue';
import {useRouter} from 'vue-router';
import {useAccountJsonApi} from "@/api/accountJson";

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

const telPrefixs = [
  '010',
  '011',
  '016',
  '017',
  '018',
  '019',
  '0502',
  '0505',
  '0506',
  '0507',
  '02',
  '031',
  '032',
  '033',
  '041',
  '042',
  '043',
  '044',
  '051',
  '052',
  '053',
  '054',
  '055',
  '061',
  '062',
  '063',
  '064',
  '050',
  '060',
  '070',
  '080',
];
const state = reactive({
  formData: {
    id: '',
    market_code: props.market_code,
    seller_id: '',
    partner_token: '',
    sync_market_status: false,

    return_delivery_price: 0,
    jeju_add_delivery_price: 0,
    jeju_add_delivery_price_round_trip: 0,
    // 마켓정보 불러오기
    return_address_code: null,
    outbound_address_code: null,
  },
  returnAddressList: [],
  outboundAddressList: [],

  syncCheckLoading: false,
  syncShippingCostPolicyLoading: false,
})

// 수정시 계정 데이터 설정
const initFormData = () => {
  const accountInfo = props.accountInfo;

  if (Object.keys(accountInfo).length > 0) {
    const {id, marketCode, marketData = {}} = accountInfo;
    const {
      seller_id,
      partner_token,
      return_delivery_price,
      jeju_add_delivery_price,
      jeju_add_delivery_price_round_trip,
      return_address_code,
      outbound_address_code,
      sync_market_status
    } = marketData;
    state.formData.id = id;
    state.formData.market_code = marketCode;
    state.formData.seller_id = seller_id;
    state.formData.partner_token = partner_token;

    state.formData.return_delivery_price = return_delivery_price;
    state.formData.jeju_add_delivery_price = jeju_add_delivery_price;
    state.formData.jeju_add_delivery_price_round_trip = jeju_add_delivery_price_round_trip;

    // 마켓정보 불러오기
    state.formData.return_address_code = accountInfo.marketData.return_address_code;
    state.formData.outbound_address_code = accountInfo.marketData.outbound_address_code;

    state.formData.sync_market_status = sync_market_status;
  }
}

const callMarketCheckAPI = async () => {
  const res = await useMarketAccountApi().syncMarketCheck(state.formData)
  if (res.status !== "2000") {
    throw new Error(res.message);
  }

  return res;
}
// 연동확인
const handleSyncMarketCheck = () => {

  marketFormRef.value.validate().then(async () => {
    state.syncCheckLoading = true;
    try {
      const res = await callMarketCheckAPI();
      const {account_id} = res.data;

      message.success(res.message);
      state.formData.id = account_id;
      syncOutboundAddress(account_id);
      state.formData.sync_market_status = true
    } catch (e) {
      message.error(e.message);
      state.formData.sync_market_status = false;
    } finally {
      state.syncCheckLoading = false;
    }
  });
};

const syncOutboundAddress = (account_id) => {
  state.syncOutboundAddressLoading = true;
  useAccountJsonApi().syncOutboundAddress({account_id: account_id, market_code: props.market_code}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.syncOutboundAddressLoading = false;
      return false;
    }

    message.success('업데이트 완료 되었습니다. 출고지,반품지를 선택해 주세요.');
    const {marketJson, syncStatus, updDate} = res.data;

    // 업데이트상태/날짜
    state.sync_outbound_address_status = syncStatus || '0';
    state.sync_outbound_address_date = updDate || null;
    state.returnAddressList = [];
    state.outboundAddressList = [];

    console.log('marketJson', marketJson)
    marketJson?.forEach(item => {

      if (item.type === 'D' && item.available === true) {
        state.outboundAddressList.push({
          outbound_code: item.no,
          outbound_name: item.addressName
        });
        state.formData.outbound_address_code = item.no;
      }


      if (item.type === 'R' && item.available === true) {
        state.returnAddressList.push({
          return_address_code: item.no,
          return_address_name: item.addressName
        });
        state.formData.return_address_code = item.no;
      }
    });

    state.syncOutboundAddressLoading = false;
  })
};

// 출고지/반품지 리스트 설정
const getAddressList = () => {
  useAccountJsonApi().getAccountJson({account_id: props.accountInfo.id, group: 'outbound_address'}).then(res => {

    const {marketJson, syncStatus, updDate} = res.data;

    // 업데이트상태/날짜
    state.sync_address_status = syncStatus || '0';
    state.sync_address_date = updDate || null;

    marketJson?.forEach(item => {

      state.returnAddressList.push({
        return_address_code: item.no,
        return_address_name: item.addressName
      });

      state.outboundAddressList.push({
        outbound_code: item.no,
        outbound_name: item.addressName
      });

    });
  });
}

// 저장
const handleSubmit = () => {

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

  // 연동확인후
  if (state.formData.sync_market_status) {
    getAddressList()
  }
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