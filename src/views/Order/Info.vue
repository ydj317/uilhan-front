<template>
  <a-card>
    <component :is="markets[marketCode]" :key="marketCode" :orderData="state.orderData" />

    <a-button type="primary" @click="router.push('/order/list')" class="mt15">목록</a-button>
  </a-card>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useMarketOrderApi } from '@/api/order'
import Coupang from "./markets/Coupang.vue";
import Smartstore from "./markets/SmartStore.vue";

const router = useRouter();

const state = reactive({
  orderData: {}
});

const markets = {
  Coupang, Smartstore
}

let marketCode = ref('')
const getOrderInfo = async () => {
  await useMarketOrderApi().getOrderInfo({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.orderData = res.data;

    // 마켓코드 설정
    marketCode.value = res.data.market_code.charAt(0).toUpperCase() + res.data.market_code.slice(1);

  });
}

onMounted(async () => {
  await getOrderInfo();
})


</script>