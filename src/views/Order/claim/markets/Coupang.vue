<template>
  <a-descriptions title="클레임정보" bordered :column="2" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문번호">{{ orderData.orderNo }}</a-descriptions-item>
    <a-descriptions-item label="클레임요청시간">{{ orderData.returnDate }}</a-descriptions-item>
  </a-descriptions>

  <a-descriptions title="주문자" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
    :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문자 이름">{{ orderData.returnerName }}</a-descriptions-item>
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
            {{ item.prdName }} - {{ item.prdOption }} <a-divider type="vertical" /> {{ item.quantity }}개
          </a-space>
        </template>

        <a-descriptions title="상품정보" bordered :column="2" :labelStyle="{ width: '220px' }"
          :contentStyle="{ width: '500px' }">
          <a-descriptions-item label="상품명">{{ item.prdName }}</a-descriptions-item>
          <a-descriptions-item label="옵션명">{{ item.prdOption }}</a-descriptions-item>
          <a-descriptions-item label="수량">{{ item.quantity }}</a-descriptions-item>
          <a-descriptions-item label="클레임상태">
            <a-badge color="blue" :text="state.orderStatusList[item.status]" v-if="item.status === 'cancelComplete'" />
            <a-badge color="yellow" :text="state.orderStatusList[item.status]"
              v-else-if="item.status === 'returnRequest'" />
            <a-badge color="green" :text="state.orderStatusList[item.status]"
              v-else-if="item.status === 'returnComplete'" />
          </a-descriptions-item>
          <a-descriptions-item label="클레임사유">{{ item.claimCode }} - {{ item.claimDetail }}</a-descriptions-item>
        </a-descriptions>

        <template #extra>
          <a-button @click="placeOneOrder(orderData, item)" size="small" v-if="item.status === 'paid'">
            발주
          </a-button>
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


const getMarketClaimStatusList = async () => {
  await useMarketApi().getMarketClaimStatusList().then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.orderStatusList = res.data;
  });
}
const { orderData } = toRefs(props)


onMounted(async () => {
  await getMarketClaimStatusList();
})
</script>
