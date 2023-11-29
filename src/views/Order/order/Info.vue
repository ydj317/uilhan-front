<template>
  <a-card>
    <component :is="markets[marketCode]" :key="marketCode" :orderData="state.orderData" :marketCode="marketCode" />

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

const router = useRouter();
const route = useRoute();

const state = reactive({
  id: route.params.id,
  orderData: {}
});

const markets = {
  Coupang, Smartstore, Lotteon
}

let marketCode = ref('')
const getOrderDetail = async () => {
  await useMarketOrderApi().getOrderDetail({ id: state.id }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const { marketAccount, marketOrder } = res.data
    state.orderData = marketOrder;

    // 마켓코드 설정
    marketCode.value = marketAccount.marketCode.charAt(0).toUpperCase() + marketAccount.marketCode.slice(1);

  });
}

onMounted(async () => {
  await getOrderDetail();
})


</script>