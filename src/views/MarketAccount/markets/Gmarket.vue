<template>
  <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
          class="market_form">
    <a-form-item name="seller_id" :rules="[{ required: true, message: 'G마켓 ID를 입력해 주세요.' }]">
      <template #label>
        <span>판매자 ID</span>
        <a-tooltip class="ml10">
          <template #title>
            <p>사이트 판매자 ID를 입력해주세요. ESM PLUS 마스터 ID는 사용할 수 없습니다.</p>
          </template>
          <QuestionCircleOutlined/>
        </a-tooltip>
      </template>
      <a-input v-model:value="state.formData.seller_id" :disabled="!auth && registerId !== ''" placeholder="사이트 판매자ID를 입력해주세요. ESM PLUS 마스터 ID는 사용할 수 없습니다."/>
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

      <a-form-item label="출고지/묶음배송비"
                   v-if="state.formData.outbound_address_code"
                   >

        <!--      출고지-->
        <a-form-item name="outbound_address_code" label="출고지"
                     :rules="[{ required: true, message: '출고지를 선택해 주세요.' }]">
          <a-select v-model:value="state.formData.outbound_address_code"
                    @change="syncBundleShipping(state.formData.id, state.formData.outbound_address_code)"
                    placeholder="출고지를 선택해 주세요"
                    style="width:260px;">
            <a-select-option :value="item.outbound_address_code" v-for="(item, key) in state.outboundAddressList"
                             :key="key">{{ item.outbound_address_name }}</a-select-option>
          </a-select>
          <a-button @click="syncOutboundAddress(state.formData.id)" class="ml15"
                    :loading="state.syncOutboundAddressLoading">업데이트</a-button>
          <a-tag class="ml15" v-if="state.sync_outbound_address_status == 0">-</a-tag>
          <a-tag color="#87d068" class="ml15" v-else-if="state.sync_outbound_address_status == 1">성공</a-tag>
          <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
          <span>{{ state.sync_outbound_address_date ?? '-' }}</span>
        </a-form-item>

        <!--묶음배송비-->
        <a-form-item name="bundle_shipping_code"
                     label="묶음배송비"
                     v-if="state.formData.outbound_address_code"
                     :rules="[{ required: true, message: '묶음배송비를 선택해 주세요.' }]">
          <a-select v-model:value="state.formData.bundle_shipping_code" placeholder="묶음배송비를 선택해 주세요" style="width:260px;">
            <a-select-option :value="item.bundle_shipping_code" v-for="(item, key) in state.bundleShippingList"
                             :key="key">{{ item.bundle_shipping_name }}</a-select-option>
          </a-select>
          <a-button @click="syncBundleShipping(state.formData.id, state.formData.outbound_address_code)" class="ml15"
                    :loading="state.syncBundleShippingLoading">업데이트</a-button>
          <a-tag class="ml15" v-if="state.sync_bundle_shipping_status == 0">-</a-tag>
          <a-tag color="#87d068" class="ml15" v-else-if="state.sync_bundle_shipping_status == 1">성공</a-tag>
          <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
          <span>{{ state.sync_bundle_shipping_date ?? '-' }}</span>

        </a-form-item>

      </a-form-item>


<!--      반품지-->
      <a-form-item name="return_address_code" label="교환/반품지" :rules="[{ required: true, message: '교환/반품지를 선택해 주세요.' }]">
        <a-select v-model:value="state.formData.return_address_code" placeholder="교환/반품지를 선택해 주세요" style="width:260px;">
          <a-select-option :value="item.return_address_code" v-for="(item, key) in state.returnAddressList"
                           :key="key">{{ item.return_address_name }}</a-select-option>
        </a-select>
        <a-button @click="syncReturnAddress(state.formData.id)" class="ml15"
                  :loading="state.syncReturnAddressLoading">업데이트</a-button>
        <a-tag class="ml15" v-if="state.sync_return_address_status == 0">-</a-tag>
        <a-tag color="#87d068" class="ml15" v-else-if="state.sync_return_address_status == 1">성공</a-tag>
        <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
        <span>{{ state.sync_return_address_date ?? '-' }}</span>
      </a-form-item>

<!--      발송정책-->
      <a-form-item name="return_address_code" label="발송 정책" :rules="[{ required: true, message: '발송 정책을 선택해 주세요.' }]">
        <a-select v-model:value="state.formData.shipping_policy_code" placeholder="발송 정책을 선택해 주세요" style="width:260px;">
          <a-select-option :value="item.code" v-for="(item, key) in state.shippingPolicyList"
                           :key="key">{{ item.name }}</a-select-option>
        </a-select>
        <a-button @click="syncShippingPolicy(state.formData.id)" class="ml15"
                  :loading="state.syncShippingPolicyLoading">업데이트</a-button>
        <a-tag class="ml15" v-if="state.sync_shipping_policy_status == 0">-</a-tag>
        <a-tag color="#87d068" class="ml15" v-else-if="state.sync_shipping_policy_status == 1">성공</a-tag>
        <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
        <span>{{ state.sync_shipping_policy_date ?? '-' }}</span>
      </a-form-item>

      <h3 class="mt20">마켓정보설정</h3>

      <a-form-item name="delivery_company_code" label="택배사"
                   :rules="[{ required: true, message: '반품/교환 배송비(편도) 를 선택해 주세요.' }]">
        <a-select v-model:value="state.formData.delivery_company_code" placeholder="택배사를 선택해 주세요" style="width:260px;">
          <a-select-option :value="code" v-for="(name, code) in state.deliveryCompanyList"
                           :key="code">{{ name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="return_shipping_free" label="반품/교환 배송비(편도)"
                   :rules="[{ required: true, message: '반품/교환 배송비(편도) 유형을 선택해 주세요.' }]">
        <a-radio-group v-model:value="state.formData.return_shipping_free" name="return_shipping_free_group">
          <a-radio value="T">무료</a-radio>
          <a-radio value="F">유료</a-radio>
        </a-radio-group>

        <a-form-item name="return_shipping_fee"
                     v-if="state.formData.return_shipping_free === 'F'"
                     class="mt10"
                     :rules="[{ required: true, message: '반품/교환 배송비(편도)를 입력해 주세요.' }]">
          <a-input-number
            addon-after="원"
            v-model:value="state.formData.return_shipping_fee"
            min="100"
            max="200000"
            step="100"
            style="width:
              200px;" >

          </a-input-number>
        </a-form-item>
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
import Cookie from "js-cookie";
import {QuestionCircleOutlined} from "@ant-design/icons-vue";
import { useMarketApi } from "@/api/market";

const auth = Cookie.get("member_name") == 'jwli' ? true : false;
const props = defineProps({
  market_code: {
    type: String,
    default: ''
  },
  accountInfo: {
    type: Object,
    default: {}
  },
  registerId: {
    type: String,
    default: ''
  }
});

const router = useRouter();

const marketFormRef = ref(null);

const state = reactive({
  formData: {
    id: '',
    market_code: props.market_code,
    seller_id: '',
    access_token: '',
    client_secret: '',

    sync_market_status: false,

    // 마켓정보 불러오기
    return_address_code: null,
    outbound_address_code: null,
    bundle_shipping_code: null,
    shipping_policy_code : null,
    // 정보설정
    delivery_company_code : null,
    return_shipping_free : 'T',
    return_shipping_fee : ''
  },

  syncCheckLoading: false,
  syncOutboundAddressLoading: false,
  syncReturnAddressLoading : false,
  syncShippingPolicyLoading : false,
  syncBundleShippingLoading: false,

  returnAddressList: [],
  outboundAddressList: [],
  bundleShippingList: [],
  deliveryCompanyList: [],
  shippingPolicyList: [],

  // 불러오기 상태
  sync_address_status: 0,
  sync_address_date: null,

  // 묶음배송 매핑값
  bundle_shipping_map_rule : {
    'feeType': {
      1 : '무료',
      2 : '유료',
      3 : '조건부'
    },
  }


})

// 수정시 계정 데이터 설정
const initFormData = () => {
  const accountInfo = props.accountInfo;

  if (Object.keys(accountInfo).length > 0) {
    state.formData.id = accountInfo.id;
    state.formData.market_code = accountInfo.marketCode;
    state.formData.seller_id = accountInfo.marketData.seller_id;
    state.formData.access_token = accountInfo.marketData.access_token;
    state.formData.sync_market_status = accountInfo.marketData.sync_market_status;
    // 마켓정보 불러오기
    state.formData.return_address_code = accountInfo.marketData.return_address_code;
    state.formData.outbound_address_code = accountInfo.marketData.outbound_address_code;
    state.formData.bundle_shipping_code = accountInfo.marketData.bundle_shipping_code;
    state.formData.shipping_policy_code = accountInfo.marketData.shipping_policy_code;

    // 마켓정보설정
    state.formData.delivery_company_code = accountInfo.marketData.delivery_company_code;
    state.formData.return_shipping_free = accountInfo.marketData.return_shipping_free;
    state.formData.return_shipping_fee = accountInfo.marketData.return_shipping_fee;
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
      syncReturnAddress(account_id);
      syncShippingPolicy(account_id);

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
        router.back();
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

    message.success('업데이트 완료 되었습니다. 출고지를 선택해 주세요.');
    const {marketJson, syncStatus, updDate} = res.data;

    // 업데이트상태/날짜
    state.sync_outbound_address_status = syncStatus || '0';
    state.sync_outbound_address_date = updDate || null;
    state.outboundAddressList = [];

    marketJson?.shippingPlaces.forEach(item => {
      state.outboundAddressList.push({
        outbound_address_code: item.placeNo,
        outbound_address_name: item.placeName
      });
    });
    state.syncOutboundAddressLoading = false;
  })
};

const syncReturnAddress = (account_id) => {
  state.syncReturnAddressLoading = true;
  useAccountJsonApi().syncReturnAddress({ account_id: account_id, market_code: props.market_code }).then(res => {
    if (res?.status !== "2000") {
      message.error(res?.message);
      state.syncReturnAddressLoading = false;
      return false;
    }

    message.success('업데이트 완료 되었습니다. 교환/반품지를 선택해 주세요.');
    const { marketJson, syncStatus, updDate } = res.data;

    // 업데이트상태/날짜
    state.sync_return_address_status = syncStatus || '0';
    state.sync_return_address_date = updDate || null;
    state.returnAddressList = [];

    marketJson?.sellerAddressBookList.forEach(item => {
      state.returnAddressList.push({
        return_address_code: item.addrNo,
        return_address_name: item.addrName
      });
    });
    state.syncReturnAddressLoading = false;
  });
};


// 선택한 출고지의 묶음배송비 정책 불러오기
const syncBundleShipping = (account_id, outbound_address_code) => {
  state.syncBundleShippingLoading = true;
  state.bundleShippingList = [];
  state.formData.bundle_shipping_code = null;

  useAccountJsonApi().getBundleShipping({account_id: account_id, market_code: props.market_code, outbound_address_code: outbound_address_code}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.syncBundleShippingLoading = false;
      return false;
    }

    message.success('업데이트 완료 되었습니다. 묶음배송비를 선택해 주세요.');
    const {marketJson, syncStatus, updDate} = res.data;

    // 업데이트상태/날짜
    state.sync_bundle_shipping_status = syncStatus || '0';
    state.sync_bundle_shipping_date = updDate || null;
    state.bundleShippingList = [];
    if (marketJson?.policies.length === 0) {
      message.error('해당 출고지에 등록된 배송비가 없습니다. 판매자 센터에서 배송비를 등록해주세요. 그리고 업데이트 버튼을 눌러주세요.');
      return false;
    }
    marketJson?.policies.forEach(item => {
      let name = '';
      name += state.bundle_shipping_map_rule.feeType[item.feeType] + ' : ';
      if (item.feeType === 3) {
        name += `${item.shippingFee[0]?.condition}원 이상 무료 / ${item.shippingFee[0]?.condition}원 미만 ${item.fee}원`;
      } else {
        name += `${item.fee}원`;
      }
      state.bundleShippingList.push({
        bundle_shipping_code: item.policyNo,
        bundle_shipping_name: name
      });
    });
    state.syncBundleShippingLoading = false;
  })
}


const syncShippingPolicy = (account_id) => {
  state.syncShippingPolicyLoading = true;
  useAccountJsonApi().getShippingCostPolicy({account_id: account_id, market_code: props.market_code}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.syncShippingPolicyLoading = false;
      return false;
    }

    message.success('업데이트 완료 되었습니다. 발송정책을 선택해 주세요.');
    const {marketJson, syncStatus, updDate} = res.data;

    // 업데이트상태/날짜
    state.sync_shipping_policy_status = syncStatus || '0';
    state.sync_shipping_policy_date = updDate || null;
    state.shippingPolicyList = [];

    marketJson?.dispatchPolicies.forEach(item => {
      state.shippingPolicyList.push({
        code: item.dispatchPolicyNo,
        name: item.dispatchPolicyName
      });
    });
    state.syncShippingPolicyLoading = false;
  })
};

// 출고지/반품지 리스트 설정
const getAddressList = () => {
  useAccountJsonApi().getAccountJson({account_id: props.accountInfo.id, group: 'outbound_address'}).then(res => {
    const {marketJson, syncStatus, updDate} = res.data;
    // 업데이트상태/날짜
    state.sync_outbound_address_status = syncStatus || '0';
    state.sync_outbound_address_date = updDate || null;

    marketJson?.shippingPlaces.forEach(item => {
      state.outboundAddressList.push({
        outbound_address_code: item.placeNo,
        outbound_address_name: item.placeName
      });
    });
  });

  useAccountJsonApi().getAccountJson({account_id: props.accountInfo.id, group: 'return_address'}).then(res => {

    const {marketJson, syncStatus, updDate} = res.data;

    // 업데이트상태/날짜
    state.sync_return_address_status = syncStatus || '0';
    state.sync_return_address_date = updDate || null;
    marketJson?.sellerAddressBookList.forEach(item => {
      state.returnAddressList.push({
        return_address_code: item.addrNo,
        return_address_name: item.addrName
      });
    });
  });
}

const getShippingPolicy = () => {
  // 발송정책 init
  useAccountJsonApi().getAccountJson({account_id: props.accountInfo.id, group: 'shipping_cost_policy'}).then(res => {
    const {marketJson, syncStatus, updDate} = res.data;

    // 업데이트상태/날짜
    state.sync_shipping_policy_status = syncStatus || '0';
    state.sync_shipping_policy_date = updDate || null;
    marketJson?.dispatchPolicies.forEach(item => {
      state.shippingPolicyList.push({
        code: item.dispatchPolicyNo,
        name: item.dispatchPolicyName
      });
    });
  });
}

const getBundleShippingAccountJson = () => {
  // 발송정책 init
  useAccountJsonApi().getAccountJson({account_id: props.accountInfo.id, group: 'bundle_shipping'}).then(res => {
    const {marketJson, syncStatus, updDate} = res.data;

    // 업데이트상태/날짜
    state.sync_bundle_shipping_status = syncStatus || '0';
    state.sync_bundle_shipping_date = updDate || null;

    marketJson?.policies.forEach(item => {
      let name = '';
      name += state.bundle_shipping_map_rule.feeType[item.feeType] + ' : ';
      if (item.feeType === 3) {
        name += `${item.shippingFee[0]?.condition}원 이상 무료 / ${item.shippingFee[0]?.condition}원 미만 ${item.fee}원`;
      } else {
        name += `${item.fee}원`;
      }
      state.bundleShippingList.push({
        bundle_shipping_code: item.policyNo,
        bundle_shipping_name: name
      });
    });

  });
}


// 출고지/반품지 리스트 설정
const getMarketDeliveryCompany = () => {
  useMarketApi().getMarketDeliveryCompany({}).then(res => {
      state.deliveryCompanyList = res.data.gmarket;
  });
}

onMounted(() => {
  getMarketDeliveryCompany()
  initFormData()

  // 연동확인후
  if (state.formData.sync_market_status) {
    getAddressList();
    getShippingPolicy();
    getBundleShippingAccountJson();
  }

});

const goBack = () => {
  router.back();
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