<template>
  <a-card>
    <component :is="markets[marketCode]" :key="marketCode" :orderData="state.orderData" />

    <a-button type="primary" @click="router.push('/claim/list')" class="mt15">목록</a-button>
  </a-card>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useMarketOrderApi } from '@/api/order'
import { message } from "ant-design-vue";
import Coupang from "./markets/Coupang.vue";
import Smartstore from "./markets/SmartStore.vue";

const router = useRouter();
const route = useRoute();

const state = reactive({
  id: route.params.id,
  orderData: {}
});

const markets = {
  Coupang, Smartstore
}

let marketCode = ref('')
const getClaimDetail = async () => {
  await useMarketOrderApi().getClaimDetail({ id: state.id }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const { marketAccount, marketClaim } = res.data
    state.orderData = marketClaim;

    // 마켓코드 설정
    marketCode.value = marketAccount.marketCode.charAt(0).toUpperCase() + marketAccount.marketCode.slice(1);

  });
}

onMounted(async () => {
  await getClaimDetail();
})


</script>