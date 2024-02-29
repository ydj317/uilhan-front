<template>
  <a-card :bordered="false">
    <OrderInfoTemplate v-if="marketCode !== ''" :key="marketCode" :orderData="state.orderData" :marketCode="marketCode" />
    <a-button type="primary" @click="router.push('/order/list')" class="mt15">목록</a-button>
  </a-card>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useMarketOrderApi } from '@/api/order'
import { message } from "ant-design-vue";
import Coupang from "./markets/Coupang.vue";
import Smartstore from "./markets/SmartStore.vue";
import Lotteon from "./markets/Lotteon.vue";
import Tmon from "./markets/Tmon.vue";
import Interpark from "./markets/Interpark.vue";
import Sk11st from "@/views/Order/order/markets/Sk11st.vue";
import Qoo10sg from "@/views/Order/order/markets/Qoo10sg.vue";
import { OrderMapping } from "@/views/Order/order/mapping";
import OrderInfoTemplate from "@/views/Order/order/OrderInfoTemplate.vue";

const router = useRouter();
const route = useRoute();
const state = reactive({
  orderNo: route.params.orderNo,
  orderData: {}
});

const markets = {
  Coupang, Smartstore, Tmon, Lotteon, Interpark, Sk11st, Qoo10sg
}

let marketCode = ref('')
const getOrderDetail = async () => {
  await useMarketOrderApi().getOrderDetail({ orderNo: state.orderNo }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const { marketAccount, marketOrder } = res.data

    const order = new OrderMapping(marketAccount.marketCode)
    state.orderData = order.mappingMarketOrder(marketOrder);

    // 마켓코드 설정
    marketCode.value = marketAccount.marketCode.charAt(0).toUpperCase() + marketAccount.marketCode.slice(1);

  });
}

onMounted(async () => {
  await getOrderDetail();
})


</script>