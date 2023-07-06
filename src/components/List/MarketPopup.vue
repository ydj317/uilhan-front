<script setup>
import {useRoute} from "vue-router";
import {lib} from "@/util/lib";
import router from "@/router";
import {AuthRequest} from "@/util/request";
import {onBeforeMount, ref} from "vue";
import Loading from "vue-loading-overlay";

const route = useRoute();
const indicator = ref(true);
const queryString = decodeURIComponent(route.params.query);
const params = new URLSearchParams(queryString);
const queryJson = Object.fromEntries(params);

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
    alert("마켓 업체별 고유번호가 잘못되었습니다.");
    router.push("/product");
    return false;
  }
  if (!lib.isNumeric(queryJson.pid)) {
    alert("상품코드가 잘못되었습니다.");
    router.push("/product");
    return false;
  }
  if (!lib.isNumeric(queryJson.site_id)) {
    alert("마켓 LOGIN ID가 잘못되었습니다.");
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
      alert(res.message);
      router.push("/product");
      return false;
    }

    const resData = res.data.data
    if(resData.total <= 0) alert('마켓상품이 존재하지 않습니다. 다시시도해 주세요.')
    const prdDetail = resData.ProductInfo[0];
    let url = '';
    if(prdDetail.site_code !== 'storefarm') {
      url = marketUrls[prdDetail.site_code] + queryJson.pid
    } else {
      url = marketUrls[prdDetail.site_code] + prdDetail.site_id + '/products/' + queryJson.pid
    }
    window.location.href = url

  });
}

onBeforeMount(() => {
  syncProduct(queryJson)
})

</script>

<template>
  <div style="display: flex;justify-content: center;align-items: center;width: 100vw;height: 100vh;">
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>
  </div>
</template>

<style scoped>

</style>