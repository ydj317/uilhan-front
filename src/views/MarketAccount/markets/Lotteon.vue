<template>
  <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
          class="market_form">
    <a-form-item name="seller_id" label="판매자 ID" :rules="[{ required: true, message: '롯데ON 판매자 ID를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.seller_id" placeholder="롯데ON 판매자 ID를 입력해 주세요." :disabled="state.formData.sync_market_status"/>
    </a-form-item>

    <a-form-item name="vendor_id" @keyup="handleResetSyncStatus" label="거래처번호"
                 :rules="[{ required: true, message: '거래처번호를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.vendor_id"  placeholder="롯데ON 스토어 센터 > '판매자정보' 메뉴에서 '기본정보관리' 화면에 노출되는 '거래처번호'를 입력해주세요." :disabled="state.formData.sync_market_status" />
    </a-form-item>

    <a-form-item name="access_token" @keyup="handleResetSyncStatus" label="인증키"
                 :rules="[{ required: true, message: '인증키를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.access_token" placeholder="롯데ON 스토어 센터 > '판매자정보' 메뉴에서 '기본정보관리' 화면에 노출되는 '거래처번호'를 입력해주세요."/>
    </a-form-item>

    <a-button class="mt15" @click="handleSyncMarketCheck" :loading="state.syncCheckLoading">
      <template #icon v-if="state.formData.sync_market_status">
        <CheckCircleOutlined style="color:#67C23A;"/>
      </template>
      연동확인
    </a-button>

    <a-divider></a-divider>
    <div v-if="state.formData.sync_market_status">
      <div style="display:flex;justify-content:space-between;align-items:center;" class="mb15">
        <h3>마켓정보 불러오기</h3>
      </div>
      <a-form-item label="배송비정책/추가배송비정책">
        <div style="display: flex; align-items: center;">
          <div>
            <div>
              <a-form-item name="shipping_cost_policy_code" label="배송비정책"
                           :rules="[{ required: true, message: '배송비정책을 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.shipping_cost_policy_code" placeholder="배송비정책을 선택해 주세요"
                          style="width:260px;">
                  <a-select-option :value="item.shipping_cost_policy_code"
                                   v-for="(item, key) in state.shippingCostPolicy" :key="key">{{
                      item.shipping_cost_policy_name
                    }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item name="add_shipping_cost_policy_code" label="추가배송비정책"
                           :rules="[{ required: true, message: '추가배송비정책을 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.add_shipping_cost_policy_code" placeholder="추가배송비정책을 선택해 주세요"
                          style="width:260px;">
                  <a-select-option :value="item.add_shipping_cost_policy_code"
                                   v-for="(item, key) in state.addShippingCostPolicy" :key="key">{{
                      item.add_shipping_cost_policy_name
                    }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
          <div>
            <a-button @click="getShippingCostPolicy(state.formData.id)" class="ml15"
                      :loading="state.getShippingCostPolicyLoading">업데이트
            </a-button>
            <a-tag class="ml15" v-if="state.sync_shipping_status == 0">-</a-tag>
            <a-tag color="#87d068" class="ml15" v-else-if="state.sync_shipping_status == 1">성공</a-tag>
            <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
            <span>{{ state.sync_shipping_date ?? '-' }}</span>
          </div>
        </div>
      </a-form-item>
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

    </div>
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
  RedoOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue';
import {useRoute, useRouter} from 'vue-router';

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
    vendor_id:'',
    seller_id: '',
    access_token: '',

    sync_market_status: false,

    // 마켓정보 불러오기
    return_address_code: null,
    outbound_address_code: null,
    shipping_cost_policy_code: null,
    add_shipping_cost_policy_code: null,

    // 마켓정보 설정
    jeju_add_delivery_price: null, // 제주 추가 배송비
    jeju_add_delivery_price_round_trip: null, // 제주 외 도서산간 추가 배송비
    return_delivery_price: null, // 반품배송비(편도)
    return_delivery_price_round_trip: null, // 반품배송비(왕복)
    as_phone_number: null, // A/S전화번호

    shipping_info: {}

  },

  syncCheckLoading: false,
  syncOutboundAddressLoading: false,
  getShippingCostPolicyLoading: false,

  returnAddressList: [],
  outboundAddressList: [],
  shippingCostPolicy: [],
  addShippingCostPolicy: [],

  // 불러오기 상태
  sync_address_status: 0,
  sync_shipping_status: 0,
  sync_address_date: null,


})

// 수정시 계정 데이터 설정
const initFormData = () => {
  const accountInfo = props.accountInfo;

  if (Object.keys(accountInfo).length > 0) {
    state.formData.id = accountInfo.id;
    state.formData.market_code = accountInfo.marketCode;
    state.formData.vendor_id = accountInfo.marketData.vendor_id;
    state.formData.seller_id = accountInfo.marketData.seller_id;
    state.formData.access_token = accountInfo.marketData.access_token;
    state.formData.sync_market_status = accountInfo.marketData.sync_market_status;

    // 마켓정보 불러오기
    state.formData.return_address_code = accountInfo.marketData.return_address_code;
    state.formData.outbound_address_code = accountInfo.marketData.outbound_address_code;
    state.formData.shipping_cost_policy_code = accountInfo.marketData.shipping_cost_policy_code;
    state.formData.add_shipping_cost_policy_code = accountInfo.marketData.add_shipping_cost_policy_code;


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

      state.syncCheckLoading = false;

      const {account_id} = res.data;
      message.success(res.message);

      state.formData.id = account_id;
      // 출고지/반품지 수집실행
      syncOutboundAddress(account_id);
      getShippingCostPolicy(account_id);
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

  // validation form
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
    state.sync_address_status = syncStatus || '0';
    state.sync_address_date = updDate || null;
    state.returnAddressList = [];
    state.outboundAddressList = [];
    marketJson?.data.forEach(item => {
      if (item.dvpTypCd === '02' && item.useYn === 'Y') {
        state.returnAddressList.push({
          return_address_code: item.dvpNo,
          return_address_name: item.dvpNm
        });
      }

      if (item.dvpTypCd === '01' && item.useYn === 'Y') {
        state.outboundAddressList.push({
          outbound_code: item.dvpNo,
          outbound_name: item.dvpNm
        });
      }
    });

    state.syncOutboundAddressLoading = false;
  })
};


const getShippingCostPolicy = (account_id) => {
  state.getShippingCostPolicyLoading = true;
  useAccountJsonApi().getShippingCostPolicy({account_id: account_id, market_code: props.market_code}).then(res => {
    if (res.status !== "2000") {
      state.getShippingCostPolicyLoading = false;
      message.error(res.message);
      return false;
    }

    state.shippingCostPolicy = [];
    state.addShippingCostPolicy = [];

    message.success('업데이트 완료 되었습니다. 배송비정책을 선택해 주세요.');
    const {marketJson, syncStatus, updDate} = res.data;
    marketJson?.data.forEach(item => {
      if (item.useYn === 'Y' && item.dvCstTypCd === 'DV_CST') {
        state.shippingCostPolicy.push({
          shipping_cost_policy_code: item.dvCstPolNo,
          shipping_cost_policy_name: item.dvCstPolNm
        });
      }
      if (item.useYn === 'Y' && item.dvCstTypCd === 'ADTN_DV_CST') {
        state.addShippingCostPolicy.push({
          add_shipping_cost_policy_code: item.dvCstPolNo,
          add_shipping_cost_policy_name: item.dvCstPolNm
        });
      }
    });

    state.sync_shipping_status = syncStatus || '0';
    state.sync_shipping_date = updDate || null;
    state.getShippingCostPolicyLoading = false
  })
}

// 출고지/반품지 리스트 설정
const getAccountJson = () => {
  // 출고지 반품지
  useAccountJsonApi().getAccountJson({account_id: props.accountInfo.id, group: 'outbound_address'}).then(res => {

    const {marketJson, syncStatus, updDate} = res.data;
    // 업데이트상태/날짜
    state.sync_address_status = syncStatus || '0';
    state.sync_address_date = updDate || null;

    marketJson?.data.forEach(item => {
      if (item.dvpTypCd === '01' && item.useYn === 'Y') {
        state.outboundAddressList.push({
          outbound_code: item.dvpNo,
          outbound_name: item.dvpNm
        });
      }

      if (item.dvpTypCd === '02' && item.useYn === 'Y') {
        state.returnAddressList.push({
          return_address_code: item.dvpNo,
          return_address_name: item.dvpNm
        });
      }
    });
  });

  // 배송비정책
  useAccountJsonApi().getAccountJson({account_id: props.accountInfo.id, group: 'shipping_cost_policy'}).then(res => {
    const {marketJson, syncStatus, updDate} = res.data;
    // 업데이트상태/날짜
    state.sync_shipping_status = syncStatus || '0';
    state.sync_shipping_date = updDate || null;

    marketJson?.data.forEach(item => {
      if (item.useYn === 'Y' && item.dvCstTypCd === 'DV_CST') {
        state.shippingCostPolicy.push({
          shipping_cost_policy_code: item.dvCstPolNo,
          shipping_cost_policy_name: item.dvCstPolNm
        });
      }
      if (item.useYn === 'Y' && item.dvCstTypCd === 'ADTN_DV_CST') {
        state.addShippingCostPolicy.push({
          add_shipping_cost_policy_code: item.dvCstPolNo,
          add_shipping_cost_policy_name: item.dvCstPolNm
        });
      }
    });
  });

}

onMounted(() => {
  initFormData()

  // 연동확인후
  if (state.formData.sync_market_status) {
    getAccountJson()
  }

});

const goBack = () => {
  router.push({name: 'market_accounts_list'});
};
</script>
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