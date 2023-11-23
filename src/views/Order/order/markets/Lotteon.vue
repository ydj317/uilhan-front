<template>
  <a-descriptions title="주문정보" bordered :column="2" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문번호">{{ orderData.orderNo }}</a-descriptions-item>
    <a-descriptions-item label="주문순번">{{ orderData.itemOrgData.odSeq }}</a-descriptions-item>
    <a-descriptions-item label="결제일시">{{ moment(orderData.itemOrgData.odCmptDttm).format('YYYY-MM-DD') }}</a-descriptions-item>
    <a-descriptions-item label="주문상태 " >
      <a-badge color="blue" :text="state.orderStatusList[orderData.status]" v-if="orderData.status === 'paid'" />
      <a-badge color="yellow" :text="state.orderStatusList[orderData.status]"
               v-else-if="orderData.status === 'shippingAddress'" />
      <a-badge color="orange" :text="state.orderStatusList[orderData.status]" v-else-if="orderData.status === 'shipping'" />
      <a-badge color="green" :text="state.orderStatusList[orderData.status]"
               v-else-if="orderData.status === 'shippingComplete'" />
    </a-descriptions-item>

  </a-descriptions>

  <a-descriptions title="상품 정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
                  :contentStyle="{ width: '500px' }">
        <a-descriptions-item label="이미지">
          <a-image :src="orderData.prdImage"
                   fallback="data:image/png;base64,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"
                   style="width:50px;height:50px;border-radius: 5px;" />
        </a-descriptions-item>

        <a-descriptions-item label="상품명" >{{ orderData.prdName }}</a-descriptions-item>
        <a-descriptions-item label="옵션번호/옵션명" >{{orderData.itemOrgData.itmNo}} / {{ orderData.prdOptionName }}</a-descriptions-item>
        <a-descriptions-item label="주문수량" >{{ orderData.quantity }} <span v-if="orderData.claimQuantity > 0" style="margin-left:10px;color: #DD4A68">(반품: {{ orderData.claimQuantity }})</span></a-descriptions-item>
        <a-descriptions-item label="배송비" >{{ orderData.itemOrgData.dvCst	 }}</a-descriptions-item>
        <a-descriptions-item label="판매단가" >{{ orderData.itemOrgData.slPrc }}</a-descriptions-item>
        <a-descriptions-item label="주문금액" >{{ orderData.itemOrgData.slAmt }}</a-descriptions-item>
    <template #extra>
      <a-button @click="receiverOneOrder(orderData.id)" size="small" v-if="orderData.status === 'paid'">
        발주
      </a-button>
      <div v-if="orderData.status === 'shippingAddress'">
        <a-input v-model:value="state.invoiceNumberValues[orderData.id]" style="width: 250px;" size="small">
          <template #addonBefore>
            <a-select v-model:value="state.courierNameValues[orderData.id]" style="width: 120px" placeholder="택배사 선택">
              <a-select-option :value="key" :key="key"
                               v-for="(company, key) in state.marketDeliveryCompany[orderData.marketCode]">{{
                  company
                }}</a-select-option>
            </a-select>
          </template>
        </a-input>
        <a-button @click="deliveryOrder(orderData.id)" size="small" class="ml10">
          배송
        </a-button>
      </div>
    </template>
  </a-descriptions>

  <a-descriptions title="주문자 정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
                  :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문자">{{ orderData.itemOrgData.odrNm }}</a-descriptions-item>
    <a-descriptions-item label="주문자 전화번호">{{ orderData.itemOrgData.telNo }}</a-descriptions-item>
    <a-descriptions-item label="주문자 휴대폰번호">{{ orderData.itemOrgData.mphnNo }}</a-descriptions-item>
    <a-descriptions-item label="주문자 이메일">{{ orderData.itemOrgData.emlAddr }}</a-descriptions-item>
  </a-descriptions>

  <a-descriptions title="수취인 정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
                  :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="수취인 성명">{{ orderData.itemOrgData.dvpCustNm }}</a-descriptions-item>
    <a-descriptions-item label="수취인 전화번호">{{ orderData.itemOrgData.dvpTelNo }}</a-descriptions-item>
    <a-descriptions-item label="수취인 휴대폰번호">{{ orderData.itemOrgData.dvpMphnNo }}</a-descriptions-item>
    <a-descriptions-item label="수취인 이메일">{{ orderData.itemOrgData.dvpEmlAddr }}</a-descriptions-item>
    <a-descriptions-item label="배송지 우편번호">{{ orderData.itemOrgData.dvpZipNo }}</a-descriptions-item>
    <a-descriptions-item label="배송지 배송지도로명우편주소">{{ orderData.itemOrgData.dvpStnmZipAddr }}</a-descriptions-item>
    <a-descriptions-item label="배송지 배송지도로명상세주소">{{ orderData.itemOrgData.dvpStnmDtlAddr }}</a-descriptions-item>
    <a-descriptions-item label="배송지 배송지도로명상세주소">{{ orderData.itemOrgData.dvpStnmDtlAddr }}</a-descriptions-item>
    <a-descriptions-item label="개인통관고유번호">{{ orderData.itemOrgData.indvCstmPclrNo }}</a-descriptions-item>
  </a-descriptions>





  <a-descriptions title="배송 정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
                  :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="택배사" >{{ orderData.courierName }}</a-descriptions-item>
    <a-descriptions-item label="운송장번호 " >{{ orderData.invoiceNumber }}</a-descriptions-item>
    <a-descriptions-item label="배송상태발생일 " >{{ orderData.itemOrgData.dvTrcStatDttm }}</a-descriptions-item>
    <a-descriptions-item label="배송메모" >{{ orderData.itemOrgData.dvMsg }}</a-descriptions-item>
  </a-descriptions>
</template>

<script setup>
import { onMounted, toRefs, reactive } from 'vue'
import { message } from "ant-design-vue";
import moment from "moment";
import { useMarketApi } from '@/api/market'
import { useMarketOrderApi } from '@/api/order'

const props = defineProps({
  orderData: {
    type: Object,
    default: () => ({})
  },
  marketCode: {
    type: String,
    default: ''
  }
})

const state = reactive({
  orderStatusList: {},
  collapseKey: [],
  courierNameValues: {},
  invoiceNumberValues: {},
  marketDeliveryCompany: {}
});


const getMarketOrderStatusList = async () => {
  await useMarketApi().getMarketOrderStatusList().then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.orderStatusList = res.data;
  });
}
const { orderData, marketCode } = toRefs(props)

// 주문처리
const receiverOrderApi = (ids) => {
  useMarketOrderApi().receiverOrder({
    ids
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success(res.data.message);
  });
}

const receiverOneOrder = (id) => {
  receiverOrderApi([id]);
}

// 배송처리
const deliveryOrder = (id) => {

  if (!state.courierNameValues[id]) {
    message.error('택배사를 선택해주세요.');
    return false;
  }

  if (!state.invoiceNumberValues[id]) {
    message.error('운송장번호를 입력해주세요.');
    return false;
  }

  useMarketOrderApi().deliveryOrder({
    id: id,
    courierName: state.courierNameValues[id],
    invoiceNumber: state.invoiceNumberValues[id]
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.data.message);
      return false;
    }

    message.success(res.data.message === '' ? '배송처리 성공 하었습니다.' : res.data.message);
  });
}

const getMarketDeliveryCompany = () => {
  useMarketApi().getMarketDeliveryCompany({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketDeliveryCompany = res.data;
  });
}

onMounted(async () => {
  getMarketDeliveryCompany();
  await getMarketOrderStatusList();
})
console.log(orderData);
</script>
