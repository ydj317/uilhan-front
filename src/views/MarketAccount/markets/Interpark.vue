<template>
  <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
          class="market_form">
    <a-form-item name="seller_id" label="인터파크ID" :rules="[{ required: true, message: '인터파크ID를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.seller_id" :disabled="!auth && registerId !== ''" />
    </a-form-item>
    <!-- 상품등록 -->
    <a-form-item name="prd_register_client_id" @keyup="handleResetSyncStatus" label="상품등록 인증키"
                 :rules="[{ required: true, message: '상품등록 인증키를 입력해 주세요.' }]">
      <a-input class=".half-width-input" v-model:value="state.formData.prd_register_client_id" :disabled="!auth && registerId !== ''" />
    </a-form-item>

    <a-form-item name="prd_register_client_secret" @keyup="handleResetSyncStatus" label="상품등록 비밀키"
                 :rules="[{ required: true, message: '상품등록 비밀키를 입력해 주세요.' }]">
      <a-input class=".half-width-input" v-model:value="state.formData.prd_register_client_secret" :disabled="!auth && registerId !== ''" />
    </a-form-item>

    <!-- 상품수정 -->
    <a-form-item name="prd_update_client_id" @keyup="handleResetSyncStatus" label="상품수정 인증키"
                 :rules="[{ required: true, message: '상품수정 인증키를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.prd_update_client_id" :disabled="!auth && registerId !== ''" />
    </a-form-item>

    <a-form-item name="prd_update_client_secret" @keyup="handleResetSyncStatus" label="상품수정 비밀키"
                 :rules="[{ required: true, message: '상품수정 비밀키를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.prd_update_client_secret" :disabled="!auth && registerId !== ''" />
    </a-form-item>

    <!-- 배송비정책조회 -->
    <a-form-item name="return_address_client_id" @keyup="handleResetSyncStatus" label="반품배송지 인증키"
                 :rules="[{ required: true, message: '반품배송지 인증키를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.return_address_client_id"  :disabled="!auth && registerId !== ''" />
    </a-form-item>

    <a-form-item name="return_address_client_secret" @keyup="handleResetSyncStatus" label="반품배송지 비밀키"
                 :rules="[{ required: true, message: '반품배송지 비밀키를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.return_address_client_secret" :disabled="!auth && registerId !== ''" />
    </a-form-item>

    <a-form-item name="supply_seq" @keyup="handleResetSyncStatus" label="업체/공급계약번호"
                 :rules="[{ required: true, message: '업체/공급계약번호를 입력해 주세요.' }]">
      <a-input v-model:value="state.formData.supply_seq" placeholder="판매자 센터->판매자정보관리->관리계정(ID)관리->업체/공급계약번호->1000********/1" :disabled="!auth && registerId !== ''"/>
    </a-form-item>

    <a-button class="mt15" @click="handleSyncMarketCheck" :loading="state.syncCheckLoading">
      <template #icon v-if="state.formData.sync_market_status">
        <CheckCircleOutlined style="color:#67C23A;" />
      </template>
      연동확인
    </a-button>

    <a-divider></a-divider>
    <div v-if="state.formData.sync_market_status">
      <div style="display:flex;justify-content:space-between;align-items:center;" class="mb15">
        <h3>마켓정보 불러오기</h3>
      </div>

      <a-form-item label="반품지">
        <div style="display: flex; align-items: center;">
          <div>
            <div>
              <a-form-item name="return_address_code" label="반품지"
                           :rules="[{ required: true, message: '반품지를 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.return_address_code" placeholder="반품지를 선택해 주세요"
                          style="width:260px;">
                  <a-select-option :value="item.return_address_code"
                                   v-for="(item, key) in state.returnAddressList" :key="key">{{
                      item.return_address_name
                    }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>

          <div>
            <a-button @click="syncReturnAddress(state.formData.id)" class="ml15"
                      :loading="state.syncReturnAddress">업데이트</a-button>
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
          <a-input v-model:value="state.formData.jeju_add_delivery_price" placeholder="제주 추가 배송비"
                   style="width:160px" />
        </a-form-item>
        <a-form-item name="jeju_add_delivery_price_round_trip" label="도서산간 추가 배송비"
                     :rules="[{ required: true, message: '도서산간 추가 배송비를 입력해 주세요.' }]" :label-col="{ span: 5 }"
                     :wrapper-col="{ span: 19 }">
          <a-input v-model:value="state.formData.jeju_add_delivery_price_round_trip"
                   placeholder="제주 외 도서산간 추가 배송비" style="width:200px" />
        </a-form-item>
      </a-form-item>
      <a-form-item name="return_delivery_price" label="반품배송비"
                   :rules="[{ required: true, message: '반품배송비를 입력해 주세요.' }]">
        <a-input v-model:value="state.formData.return_delivery_price" placeholder="반품배송비" style="width:160px" />
      </a-form-item>

      <a-form-item name="send_day" label="발송예정일"
                   :rules="[{ required: true, message: '발송예정일을 입력해 주세요.' }]">
        <a-select v-model:value="state.formData.send_day" style="width:150px;">
          <a-select-option value=""> - 선택해주세요 - </a-select-option>
          <a-select-option :value="item" v-for="(item, key) in state.sendDay"  :key="key">{{ item }}</a-select-option>
        </a-select>일 이내 발송예정
      </a-form-item>
    </div>
    <a-button class="mt15" @click="goBack">돌아가기</a-button>
    <a-button class="mt15 ml15" @click="handleSubmit" type="primary">저장</a-button>

  </a-form>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useMarketAccountApi } from '@/api/marketAccount';
import { useAccountJsonApi } from '@/api/accountJson';
import {
  RedoOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import Cookie from "js-cookie";

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
    prd_register_client_id: '',
    prd_register_client_secret: '',
    prd_update_client_id: '',
    prd_update_client_secret: '',
    return_address_client_id: '',
    return_address_client_secret: '',
    supply_seq: '',

    sync_market_status: false,

    // 마켓정보 불러오기
    return_address_code: null,

    // 마켓정보 설정
    jeju_add_delivery_price: null, // 제주 추가 배송비
    jeju_add_delivery_price_round_trip: null, // 제주 외 도서산간 추가 배송비
    return_delivery_price: null, // 반품배송비
    send_day: '' // 발송예정일
  },

  syncCheckLoading: false,
  syncReturnAddressLoading: false,

  returnAddressList: [],
  sendDay : ['02', '03', '04', '05', '06', '07', '08', '09', '10', '12', '13', '14'],

  // 불러오기 상태
  sync_address_status: 0,
  sync_address_date: null,



})
// 수정시 계정 데이터 설정
const initFormData = () => {
  const accountInfo = props.accountInfo;

  if (Object.keys(accountInfo).length > 0) {
    state.formData.id = accountInfo.id;
    state.formData.market_code = accountInfo.marketCode;
    state.formData.seller_id = accountInfo.marketData.seller_id;

    state.formData.prd_register_client_id = accountInfo.marketData.prd_register_client_id;
    state.formData.prd_register_client_secret = accountInfo.marketData.prd_register_client_secret;

    state.formData.prd_update_client_id = accountInfo.marketData.prd_update_client_id;
    state.formData.prd_update_client_secret = accountInfo.marketData.prd_update_client_secret;

    state.formData.return_address_client_id = accountInfo.marketData.return_address_client_id;
    state.formData.return_address_client_secret = accountInfo.marketData.return_address_client_secret;
    state.formData.supply_seq = accountInfo.marketData?.supply_seq;

    state.formData.sync_market_status = accountInfo.marketData.sync_market_status;

    // 마켓정보 불러오기
    state.formData.return_address_code = accountInfo.marketData.return_address_code;
    // 제주
    state.formData.jeju_add_delivery_price = accountInfo.marketData.jeju_add_delivery_price;
    // 도서산간
    state.formData.jeju_add_delivery_price_round_trip = accountInfo.marketData.jeju_add_delivery_price_round_trip;
    // 반품 배송비
    state.formData.return_delivery_price = accountInfo.marketData.return_delivery_price;
    state.formData.send_day = accountInfo.marketData.send_day;

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

      const { account_id } = res.data;
      message.success(res.message);

      state.formData.id = account_id;
      // 반품지 수집실행
      syncReturnAddress(account_id);
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


const syncReturnAddress = (account_id) => {
  state.syncReturnAddressLoading = true;
  useAccountJsonApi().syncReturnAddress({ account_id: account_id, market_code: props.market_code }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.syncReturnAddressLoading = false;
      return false;
    }

    message.success('업데이트 완료 되었습니다. 반품지를 선택해 주세요.');

    const { marketJson, syncStatus, updDate } = res.data;

    // 업데이트상태/날짜
    state.sync_return_address_status = syncStatus || '0';
    state.sync_return_address_date = updDate || null;
    state.returnAddressList = [];

    marketJson?.delvInfo.forEach(item => {

      state.returnAddressList.push({
        return_address_code: item.entrDelvInfoNo,
        return_address_name: item.delvNm + '-' + item.delvAddr1 + '-' + item.delvAddr2
      });

    });

    state.syncReturnAddressLoading = false;
  })
};

// 반품지 리스트 설정
const getAddressList = () => {
  useAccountJsonApi().getAccountJson({ account_id: props.accountInfo.id, group: 'return_address' }).then(res => {

    const { marketJson, syncStatus, updDate } = res.data;

    // 업데이트상태/날짜
    state.sync_address_status = syncStatus || '0';
    state.sync_address_date = updDate || null;

    marketJson?.delvInfo.forEach(item => {

      state.returnAddressList.push({
        return_address_code: item.entrDelvInfoNo,
        return_address_name: item.delvNm + '-' + item.delvAddr1 + item.delvAddr2
      });

    });
  });
}

onMounted(() => {
  initFormData()

  // 연동확인후
  if (state.formData.sync_market_status) {
    getAddressList()
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

.half-width-input {
  width: 50%;
}
</style>