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
                 :rules="[{ required: true, message: 'ClientSecret 를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.client_secret"/>
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

      <a-form-item label="배송지 주소">
        <a-checkbox class="mb10" v-model:checked="state.formData.delivery_address.delivery_overseaship"
                    @change="handleDeliveryOverseaship">해외 주소지로 사용
        </a-checkbox>

        <a-form-item :name="['delivery_address', 'zip_code']" label="우편번호"
                     :rules="[{ required: true, message: '우편번호를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.delivery_address.zip_code"
                   style="width:150px;" :disabled="!state.formData.delivery_address.delivery_overseaship"/>
          <a-button class="ml10" v-if="!state.formData.delivery_address.delivery_overseaship"
                    @click="execDaumPostcode(state.formData.delivery_address)">우편번호 검색
          </a-button>
        </a-form-item>

        <a-form-item :name="['delivery_address', 'address']" label="주소"
                     :rules="[{ required: true, message: '주소를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.delivery_address.address"
                   style="width:500px" :disabled="!state.formData.delivery_address.delivery_overseaship"/>
        </a-form-item>
        <a-form-item :name="['delivery_address', 'street_address']" label="도로명주소"
                     :rules="state.formData.delivery_address.street_address_rule" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.delivery_address.street_address"
                   style="width:500px" :disabled="true"/>
        </a-form-item>
        <a-form-item :name="['delivery_address', 'address_detail']" label="상세주소"
                     :rules="[{ required: true, message: '상세주소를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.delivery_address.address_detail"
                   style="width:500px"/>
        </a-form-item>
        <a-form-item :name="['delivery_address', 'manager_name']" label="담당자"
                     :rules="[{ required: true, message: '담당자를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.delivery_address.manager_name"
                   style="width:160px"/>
        </a-form-item>
        <a-form-item :name="['delivery_address', 'manager_tel']" label="담당자 연락처"
                     :rules="[{ required: true, message: '담당자 연락처를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }" v-if="state.formData.delivery_address.delivery_overseaship">
          <a-input v-model:value="state.formData.delivery_address.manager_tel"
                   style="width:160px"/>
        </a-form-item>
        <a-form-item :name="['delivery_address', 'manager_tel']" label="담당자 연락처"
                     :rules="[{ required: true, message: '담당자 연락처를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }" v-else>
          <a-select v-model:value="state.delivery_address.tel1" style="width: 80px" @input="
            state.delivery_address.tel1 = state.delivery_address.tel1.replace(/[^0-9]/g, '');
            ">
            <a-select-option value="">-선택-</a-select-option>
            <a-select-option v-for="prefix in telPrefixs" :key="prefix" :value="prefix">{{ prefix }}</a-select-option>
          </a-select>
          -
          <a-input v-model:value="state.delivery_address.tel2" style="width:80px" @input="
            state.delivery_address.tel2 = state.delivery_address.tel2.replace(/[^0-9]/g, '').substring(0, 4);
            "/>
          -
          <a-input v-model:value="state.delivery_address.tel3" style="width:80px" @input="
            state.delivery_address.tel3 = state.delivery_address.tel3.replace(/[^0-9]/g, '').substring(0, 4);
            "/>
        </a-form-item>
      </a-form-item>

      <a-form-item label="반품/교환 주소">
        <a-checkbox class="mb10" v-model:checked="state.formData.return_address.return_overseaship"
                    @change="handleReturnOverseaship">해외 주소지로 사용
        </a-checkbox>

        <a-form-item :name="['return_address', 'zip_code']" label="우편번호"
                     :rules="[{ required: true, message: '우편번호를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.return_address.zip_code"
                   style="width:150px;" :disabled="!state.formData.return_address.return_overseaship"/>
          <a-button class="ml10" v-if="!state.formData.return_address.return_overseaship"
                    @click="execDaumPostcode(state.formData.return_address)">우편번호 검색
          </a-button>
        </a-form-item>

        <a-form-item :name="['return_address', 'address']" label="주소"
                     :rules="[{ required: true, message: '주소를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.return_address.address"
                   style="width:500px" :disabled="!state.formData.return_address.return_overseaship"/>
        </a-form-item>
        <a-form-item :name="['return_address', 'street_address']" label="도로명주소"
                     :rules="state.formData.return_address.street_address_rule" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.return_address.street_address"
                   style="width:500px" :disabled="true"/>
        </a-form-item>
        <a-form-item :name="['return_address', 'address_detail']" label="상세주소"
                     :rules="[{ required: true, message: '상세주소를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.return_address.address_detail"
                   style="width:500px"/>
        </a-form-item>
        <a-form-item :name="['return_address', 'manager_name']" label="담당자"
                     :rules="[{ required: true, message: '담당자를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.return_address.manager_name"
                   style="width:160px"/>
        </a-form-item>
        <a-form-item :name="['return_address', 'manager_tel']" label="담당자 연락처"
                     :rules="[{ required: true, message: '담당자 연락처를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }" v-if="state.formData.return_address.return_overseaship">
          <a-input v-model:value="state.formData.return_address.manager_tel"
                   style="width:160px"/>
        </a-form-item>
        <a-form-item :name="['return_address', 'manager_tel']" label="담당자 연락처"
                     :rules="[{ required: true, message: '담당자 연락처를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }" v-else>
          <a-select v-model:value="state.return_address.tel1" style="width: 80px" @input="
            state.return_address.tel1 = state.return_address.tel1.replace(/[^0-9]/g, '');
            ">
            <a-select-option value="">-선택-</a-select-option>
            <a-select-option v-for="prefix in telPrefixs" :key="prefix" :value="prefix">{{ prefix }}</a-select-option>
          </a-select>
          -
          <a-input v-model:value="state.return_address.tel2" style="width:80px" @input="
            state.return_address.tel2 = state.return_address.tel2.replace(/[^0-9]/g, '').substring(0, 4);
            "/>
          -
          <a-input v-model:value="state.return_address.tel3" style="width:80px" @input="
            state.return_address.tel3 = state.return_address.tel3.replace(/[^0-9]/g, '').substring(0, 4);
            "/>
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
    client_id: '',
    client_secret: '',
    partner_token: '',
    sync_market_status: false,

    return_delivery_price: 0,
    jeju_add_delivery_price: 0,
    jeju_add_delivery_price_round_trip: 0,
    delivery_address: {
      zip_code: '',
      address: '',
      address_name: '',
      address_detail: '',
      street_address: '',
      manager_name: '',
      manager_tel: '',
      delivery_overseaship: false,
      street_address_rule : [{ required: true, message: '도로명주소를 입력해 주세요.' }],
    },
    return_address: {
      zip_code: '',
      address: '',
      address_name: '',
      address_detail: '',
      street_address: '',
      manager_name: '',
      manager_tel: '',
      return_overseaship: false,
      street_address_rule : [{ required: true, message: '도로명주소를 입력해 주세요.' }],
    }
  },

  syncCheckLoading: false,
  syncShippingCostPolicyLoading: false,

  delivery_address: {
    tel1: '',
    tel2: '',
    tel3: '',
  },
  return_address: {
    tel1: '',
    tel2: '',
    tel3: '',
  }
})

// 수정시 계정 데이터 설정
const initFormData = () => {
  const accountInfo = props.accountInfo;

  if (Object.keys(accountInfo).length > 0) {
    const {id, marketCode, marketData = {}} = accountInfo;
    const {
      seller_id,
      client_id,
      client_secret,
      partner_token,
      return_delivery_price,
      jeju_add_delivery_price,
      jeju_add_delivery_price_round_trip,
      delivery_address,
      return_address,
      sync_market_status
    } = marketData;
    state.formData.id = id;
    state.formData.market_code = marketCode;
    state.formData.seller_id = seller_id;
    state.formData.client_id = client_id;
    state.formData.client_secret = client_secret;
    state.formData.partner_token = partner_token;

    state.formData.return_delivery_price = return_delivery_price;
    state.formData.jeju_add_delivery_price = jeju_add_delivery_price;
    state.formData.jeju_add_delivery_price_round_trip = jeju_add_delivery_price_round_trip;
    state.formData.delivery_address.zip_code = delivery_address?.zip_code;
    state.formData.delivery_address.address = delivery_address?.address;
    state.formData.delivery_address.address_detail = delivery_address?.address_detail;
    state.formData.delivery_address.street_address = delivery_address?.street_address;
    state.formData.delivery_address.manager_name = delivery_address?.manager_name;
    state.formData.delivery_address.manager_tel = delivery_address?.manager_tel;
    state.formData.delivery_address.delivery_overseaship = delivery_address?.delivery_overseaship;
    if (!delivery_address?.delivery_overseaship) {
      const tel = delivery_address?.manager_tel.split('-');
      state.delivery_address.tel1 = tel[0];
      state.delivery_address.tel2 = tel[1];
      state.delivery_address.tel3 = tel[2];
    }

    state.formData.return_address.zip_code = return_address?.zip_code;
    state.formData.return_address.address = return_address?.address;
    state.formData.return_address.address_detail = return_address?.address_detail;
    state.formData.return_address.street_address = return_address?.street_address;
    state.formData.return_address.manager_name = return_address?.manager_name;
    state.formData.return_address.manager_tel = return_address?.manager_tel;
    state.formData.return_address.return_overseaship = return_address?.return_overseaship;
    if (!return_address?.return_overseaship) {
      const tel = return_address?.manager_tel.split('-');
      state.return_address.tel1 = tel[0];
      state.return_address.tel2 = tel[1];
      state.return_address.tel3 = tel[2];
    }

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
      state.formData.sync_market_status = true
    } catch (e) {
      message.error(e.message);
      state.formData.sync_market_status = false;
    } finally {
      state.syncCheckLoading = false;
    }
  });
};

// 저장
const handleSubmit = () => {

  if (state.formData.sync_market_status === false) {
    message.error('연동확인을 먼저 해주세요.');
    return false;
  }

  if (state.formData.delivery_address.delivery_overseaship !== true) {
    if (state.delivery_address.tel1 === '' || state.delivery_address.tel2 === '' || state.delivery_address.tel3 === '') {
      message.error('배송지 담당자 연락처를 입력해 주세요.');
      return false;
    }
    state.formData.delivery_address.manager_tel = `${state.delivery_address.tel1}-${state.delivery_address.tel2}-${state.delivery_address.tel3}`;
  }

  if (state.formData.return_address.return_overseaship !== true) {
    if (state.return_address.tel1 === '' || state.return_address.tel2 === '' || state.return_address.tel3 === '') {
      message.error('반품/교환지 담당자 연락처를 입력해 주세요.');
      return false;
    }
    state.formData.return_address.manager_tel = `${state.return_address.tel1}-${state.return_address.tel2}-${state.return_address.tel3}`;
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

const handleDeliveryOverseaship = (is_delivery_overseaship) => {
  state.formData.delivery_address.delivery_overseaship = is_delivery_overseaship.target.checked;
  state.formData.delivery_address.street_address = '';
  state.formData.delivery_address.street_address_rule = is_delivery_overseaship.target.checked ? [] : [{ required: true, message: '도로명주소를 입력해 주세요.' }];
}

const handleReturnOverseaship = (is_return_overseaship) => {
  state.formData.return_address.return_overseaship = is_return_overseaship.target.checked;
  state.formData.return_address.street_address = '';
  state.formData.return_address.street_address_rule = is_return_overseaship.target.checked ? [] : [{ required: true, message: '도로명주소를 입력해 주세요.' }];

}

const execDaumPostcode = (obj) => {
  new daum.Postcode({
    oncomplete: function (data) {
      obj.zip_code = data.zonecode

      // 지번 data.jibunAddress
      obj.address = data.jibunAddress
      // 도로 data.roadAddress
      obj.address_detail = ''

      obj.street_address = data.roadAddress
    }
  }).open();
};

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