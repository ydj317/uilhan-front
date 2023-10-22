<template>
  <a-descriptions title="주문정보" bordered :column="2" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문번호">{{ orderData.orderNo }}</a-descriptions-item>
    <a-descriptions-item label="주문일시">{{ orderData.orderDate }}</a-descriptions-item>
  </a-descriptions>

  <a-descriptions title="주문자" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
    :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문자 이름">{{ orderData.ordererName }}</a-descriptions-item>
    <a-descriptions-item label="주문자 email">{{ orderData.ordererName }}</a-descriptions-item>
    <a-descriptions-item label="주문자 연락처(안심번호)">{{ orderData.ordererName }}</a-descriptions-item>
    <a-descriptions-item label="주문자 연락처(실전화번호)">{{ orderData.ordererName }}</a-descriptions-item>
  </a-descriptions>

  <div class="mt40" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }" style="">
    <h3>상품정보</h3>
    <a-collapse v-model:activeKey="state.collapseKey" style="background-color: white;" collapsible="header">
      <a-collapse-panel :key="index" v-for="(item, index) in orderData.items">
        <template #header style="display: flex;align-items: center;">
          <a-space>
            <a-image :src="`https://picsum.photos/id/${index + 20}/200/300`"
              style="width:50px;height:50px;border-radius: 5px;" />
            {{ item.prdName }} - {{ item.prdOption }} <a-divider type="vertical" /> {{ item.quantity }}개 <a-divider
              type="vertical" /> {{ item.unitPrice }}원 <a-divider type="vertical" /> {{ item.quantity * item.unitPrice }}원
          </a-space>
        </template>

        <a-descriptions title="상품정보" bordered :column="2" :labelStyle="{ width: '220px' }"
          :contentStyle="{ width: '500px' }">
          <a-descriptions-item label="상품명">{{ item.prdName }}</a-descriptions-item>
          <a-descriptions-item label="옵션명">{{ item.prdOption }}</a-descriptions-item>
          <a-descriptions-item label="수량">{{ item.quantity }}</a-descriptions-item>
          <a-descriptions-item label="개당">{{ item.unitPrice }}</a-descriptions-item>
          <a-descriptions-item label="총 가격">{{ item.quantity * item.unitPrice }}</a-descriptions-item>
          <a-descriptions-item label="주문상태">
            <a-badge color="blue" :text="state.orderStatusList[item.status]" v-if="item.status === 'paid'" />
            <a-badge color="yellow" :text="state.orderStatusList[item.status]"
              v-else-if="item.status === 'shippingAddress'" />
            <a-badge color="orange" :text="state.orderStatusList[item.status]" v-else-if="item.status === 'shipping'" />
            <a-badge color="green" :text="state.orderStatusList[item.status]"
              v-else-if="item.status === 'shippingComplete'" />
          </a-descriptions-item>
          <a-descriptions-item label="수취인">{{ item.receiverName }}</a-descriptions-item>
        </a-descriptions>

        <a-descriptions title="배송정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
          :contentStyle="{ width: '500px' }">
          <a-descriptions-item label="택배사">{{ item.courierName }}</a-descriptions-item>
          <a-descriptions-item label="운송장번호">{{ item.invoiceNumber }}</a-descriptions-item>
        </a-descriptions>

        <a-descriptions title="해외배송정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
          :contentStyle="{ width: '500px' }">
          <a-descriptions-item label="개인통관 고유부호">{{ item.itemOrgData.orderPrice }}</a-descriptions-item>
          <a-descriptions-item label="통관용 구매자 전화번호">{{ item.itemOrgData.orderPrice }}</a-descriptions-item>
        </a-descriptions>

        <template #extra>
          <a-button @click="placeOrder(orderData.orderNo, item.id)" size="small" v-if="item.status === 'paid'">
            <template #icon><setting-outlined /></template>
            발주
          </a-button>
          <div v-if="item.status === 'shippingAddress'">
            <a-input v-model:value="state.invoiceNumberValues[item.id]" style="width: 250px;" size="small">
              <template #addonBefore>
                <a-select v-model:value="state.courierNameValues[item.id]" style="width: 120px" placeholder="택배사 선택">
                  <a-select-option value="1">CJ대한통운</a-select-option>
                  <a-select-option value="2">우체국</a-select-option>
                </a-select>
              </template>
            </a-input>
            <a-button @click="deliveryOrder(orderData.orderNo, item.id)" size="small" class="ml10">
              <template #icon><setting-outlined /></template>
              배송
            </a-button>
          </div>
          <div v-if="item.status === 'shipping' || item.status === 'shippingComplete'">
            {{ item.courierName }} <a-divider type="vertical" /> {{ item.invoiceNumber }}
            <a-button size="small" class="ml10">
              추적
            </a-button>
          </div>
        </template>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { onMounted, toRefs, reactive } from 'vue'
import { message } from "ant-design-vue";
import { SettingOutlined } from '@ant-design/icons-vue';
import { useMarketApi } from '@/api/market'
import { useMarketOrderApi } from '@/api/order'
const props = defineProps({
  orderData: {
    type: Object,
    default: () => ({})
  }
})

const state = reactive({
  orderStatusList: {},
  collapseKey: [],
  courierNameValues: {},
  invoiceNumberValues: {},
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
const { orderData } = toRefs(props)

const placeOrder = (orderNo, itemId) => {

  useMarketOrderApi().placeOrder({
    orderNo,
    itemId
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    message.success('발주처리가 완료되었습니다.');
  });

}

// 배송처리
const deliveryOrder = (orderNo, itemId) => {

  if (!state.courierNameValues[itemId]) {
    message.error('택배사를 선택해주세요.');
    return false;
  }

  if (!state.invoiceNumberValues[itemId]) {
    message.error('운송장번호를 입력해주세요.');
    return false;
  }

  useMarketOrderApi().deliveryOrder({
    orderNo,
    itemId,
    courierName: state.courierNameValues[itemId],
    invoiceNumber: state.invoiceNumberValues[itemId]
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    message.success('배송처리가 완료되었습니다.');
  });
}

onMounted(async () => {
  await getMarketOrderStatusList();
})
</script>
