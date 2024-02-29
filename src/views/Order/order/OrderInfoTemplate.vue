<template>
  <a-descriptions title="주문정보" bordered :column="2" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문번호">{{ orderData.orderNo }}</a-descriptions-item>
    <a-descriptions-item label="주문일시">{{ moment(orderData.orderDate).format('YYYY-MM-DD') }}</a-descriptions-item>
    <a-descriptions-item label="결제위치">{{ orderData.payLocation }}</a-descriptions-item>
    <a-descriptions-item label="결제일시">{{ moment(orderData.payDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD') }}</a-descriptions-item>
  </a-descriptions>
  <div class="mt20">
    <h3><strong>주문상품</strong></h3>
    <a-table :data-source="orderData.items" :pagination="false" :bordered="true">
      <a-table-column title="이미지" dataIndex="prdImage" key="prdImage">
        <template #customRender="{text}">
          <a-image :src="text"
                   fallback="data:image/png;base64,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"
                   style="width:50px;height:50px;border-radius: 5px;" />
        </template>
      </a-table-column>
      <a-table-column title="상품명/옵션명" dataIndex="prdOptionName" key="prdOptionName">
        <template #default="{ record }">
          <div :style="{color: state.orderStatusList.hasOwnProperty(record.status) ? '' : '#cccccc'}">{{ record.prdName }}</div>
          <div :style="{color: state.orderStatusList.hasOwnProperty(record.status) ? '' : '#cccccc'}">{{ record.prdOptionName }}</div>
        </template>
      </a-table-column>
      <a-table-column title="원본상품" dataIndex="prdOptionNo" key="prdOptionNo">
        <template #default="{ record }">
          <div v-if="state.orderStatusList.hasOwnProperty(record.status)">
            {{ record.prdOptionNo }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </a-table-column>
      <a-table-column title="판매가" dataIndex="unitPrice" key="unitPrice">
        <template #default="{ record }">
          <div v-if="state.orderStatusList.hasOwnProperty(record.status)">
            {{ record.unitPrice.toLocaleString() }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </a-table-column>
      <a-table-column title="수량" dataIndex="quantity" key="quantity" />
      <a-table-column title="배송비" dataIndex="deliveryFee" key="deliveryFee">
        <template #customRender="{ text,record }">
          <div v-if="state.orderStatusList.hasOwnProperty(record.status)">
            {{ text.toLocaleString() }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </a-table-column>
      <a-table-column title="결제금액" dataIndex="totalPaymentAmount" key="totalPaymentAmount">
        <template #default="{ record }">
          <div v-if="state.orderStatusList.hasOwnProperty(record.status)">
            {{ record.totalPaymentAmount.toLocaleString() }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </a-table-column>
      <a-table-column title="주문상태" dataIndex="status" key="status">
        <template #customRender="{text}">
          <a-badge color="blue" :text="state.orderStatusList[text]" v-if="text === 'paid'" />
          <a-badge color="yellow" :text="state.orderStatusList[text]" v-else-if="text === 'shippingAddress'" />
          <a-badge color="orange" :text="state.orderStatusList[text]" v-else-if="text === 'shipping'" />
          <a-badge color="green" :text="state.orderStatusList[text]" v-else-if="text === 'shippingComplete'" />
          <a-badge color="red" :text="allStatus[text]" v-else/>
        </template>
      </a-table-column>

      <template #summary>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="7" :index="0" style="text-align: right">합계 금액</a-table-summary-cell>
          <a-table-summary-cell :index="1">{{ total.price.toLocaleString() }}</a-table-summary-cell>
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="7" :index="0" style="text-align: right">배송비</a-table-summary-cell>
          <a-table-summary-cell :index="1">{{ total.deliveryFee.toLocaleString() }}</a-table-summary-cell>
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="7" :index="0" style="text-align: right">총 할인금액</a-table-summary-cell>
          <a-table-summary-cell :index="1">{{ total.totalDiscountAmount.toLocaleString() }}</a-table-summary-cell>
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :col-span="7" :index="0" style="text-align: right">실 결제금액</a-table-summary-cell>
          <a-table-summary-cell :index="1">{{ total.totalPaymentAmount.toLocaleString() }}</a-table-summary-cell>
        </a-table-summary-row>
      </template>
    </a-table>
  </div>

  <a-descriptions title="주문자 정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문자">{{ orderData.ordererName }}</a-descriptions-item>
    <a-descriptions-item label="주문자 연락처">{{ orderData.ordererTel }}</a-descriptions-item>
  </a-descriptions>

  <a-descriptions title="수령자 정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
                  :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="수령자">{{ orderData.receiverName }}</a-descriptions-item>
    <a-descriptions-item label="수령자 전화번호 1">{{ orderData.receiverTel1 }}</a-descriptions-item>
    <a-descriptions-item label="개인통관번호">{{ orderData.personalCustomsClearanceCode }}</a-descriptions-item>
    <a-descriptions-item label="수령자 전화번호 2">{{ orderData.receiverTel2 }}</a-descriptions-item>
    <a-descriptions-item label="기본 주소">{{ orderData.receiverAddr1 }}</a-descriptions-item>
    <a-descriptions-item label="상세 주소">{{ orderData.receiverAddr2 }}</a-descriptions-item>
    <a-descriptions-item label="우편번호">{{ orderData.receiverPostCode }}</a-descriptions-item>
  </a-descriptions>

  <a-descriptions title="배송 정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
                  :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="택배사" >{{ orderData.courierName }}</a-descriptions-item>
    <a-descriptions-item label="운송장번호 " >{{ orderData.invoiceNumber }}</a-descriptions-item>
    <a-descriptions-item label="배송메모" >{{ orderData.message }}</a-descriptions-item>
  </a-descriptions>
</template>

<script setup>
import { onMounted, toRefs, reactive, computed } from "vue";
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
  claimStatusList: {},
  marketDeliveryCompany: {}
});

const allStatus = computed(() => {
  return {...state.orderStatusList,...state.claimStatusList};
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
const getMarketClaimStatusList = async () => {
  await useMarketApi().getMarketClaimStatusList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.claimStatusList = res.data;
  });
}
const { orderData, marketCode } = toRefs(props)

/**
 * @description: 합계 금액
 * @param {Object} orderData
 * @return {totalPaymentAmount, deliveryFee, price, totalDiscountAmount}
 */
const total = computed(() => {
  /** 합계 금액 */
  const price = orderData.value.items.reduce((acc, cur) => {
    if(Object.keys(state.orderStatusList).includes(cur.status)) {
      return acc + cur.unitPrice * cur.quantity;
    } else {
      return acc
    }
  }, 0);


  /** 실 결제금액 */
  const totalPaymentAmount = orderData.value.items.reduce((acc, cur) => {
    if(Object.keys(state.orderStatusList).includes(cur.status)) {
      return acc + cur.totalPaymentAmount;
    } else {
      return acc
    }
  }, 0);

  /** 배송비 */
  const deliveryFee = orderData.value.items.reduce((acc, cur) => {
    if(Object.keys(state.orderStatusList).includes(cur.status)) {
      return acc + cur.deliveryFee;
    } else {
      return acc
    }
  }, 0);

  /** 총 할인금액 */
  const totalDiscountAmount = orderData.value.items.reduce((acc, cur) => {
    if(Object.keys(state.orderStatusList).includes(cur.status)) {
      return acc + cur.totalDiscountAmount || 0;
    } else {
      return acc
    }
  }, 0);

  return {
    totalPaymentAmount,
    deliveryFee,
    price,
    totalDiscountAmount
  }
});

onMounted(async () => {
  await getMarketOrderStatusList();
  await getMarketClaimStatusList();
})

</script>