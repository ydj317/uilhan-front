<script setup>
import {useRoute} from "vue-router";
import {lib} from "@/util/lib";
import router from "@/router";
import {AuthRequest} from "@/util/request";
import {onBeforeMount, ref} from "vue";
import Loading from "vue-loading-overlay";
import { message } from "ant-design-vue";

const route = useRoute();
const indicator = ref(true);
const queryString = decodeURIComponent(route.params.query);
const params = new URLSearchParams(queryString);
const queryJson = Object.fromEntries(params);
const message_v = ref('페이지 이동중 입니다. 잠시만 기다려 주세요.');
//const queryJson = {'ssi_ix': 4600,'pid':'0008875356','site_id':'ncp_1nn2zx_01'}
const marketUrls = {
  '11st': "https://www.11st.co.kr/products/",
  'storefarm': "https://smartstore.naver.com/",
  'coupang': "https://www.coupang.com/vp/products/",
  'wemakeprice': "https://front.wemakeprice.com/deal/",
  'interpark': "https://shopping.interpark.com/product/productInfo.do?prdNo=",
  'tmon': "",
  'esm_gmarket': "http://item.gmarket.co.kr/Item?goodscode=",
  'lotteon': "https://www.lotteon.com/p/product/bundle/",
}
const syncProduct = (queryJson) => {

  if (!lib.isNumeric(queryJson.ssi_ix)) {
    message.warning("마켓 업체별 고유번호가 잘못되었습니다.");
    router.push("/product");
    return false;
  }
  if (!lib.isNumeric(queryJson.pid)) {
    message.warning("상품코드가 잘못되었습니다.");
    router.push("/product");
    return false;
  }
  if (!lib.isNumeric(queryJson.site_id)) {
    message.warning("마켓 LOGIN ID가 잘못되었습니다.");
    router.push("/product");
    return false;
  }

  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/product/syncDetail", {
    params: queryJson,
  }).then((res) => {
    if (
        lib.isEmpty(res) ||
        res.status !== "2000" ||
        lib.isEmpty(res.data)
    ) {
      message.error(res.message);
      setTimeout(() => {
        router.push("/product");
      }, 1000);
      return false;
    }

    const resData = res.data.data

    if(resData.total <= 0) message.warning('마켓상품이 존재하지 않습니다. 다시시도해 주세요.')
    const prdDetail = resData.ProductInfo['item'];

    let url = '';
    if(prdDetail.site_code === 'storefarm' || prdDetail.site_code === 'tmon') {
      message_v.value = '스마트스토어는 잠시 지원하지 않습니다.';
      //url = marketUrls[prdDetail.site_code] + prdDetail.site_id + '/products/' + queryJson.pid
    } else {
      url = marketUrls[prdDetail.site_code] + prdDetail.market_pid
      window.location.href = url
    }

  });
}

onBeforeMount(() => {
  syncProduct(queryJson)
})

</script>

<template>
  <div style="display: flex;justify-content: center;align-items: center;gap:30px;flex-direction:column;width: 100vw;height: 100vh;padding-top: 100px;">
    <h3 v-html="message_v">페이지 이동중 입니다. 잠시만 기다려 주세요.</h3>
  </div>
</template>

<style scoped>

</style>