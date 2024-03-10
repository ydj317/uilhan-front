<template>
  <div class="product-item">
    <div class="product-image-container">
      <div class="product-image-wrap">
        <img :src="product.item_thumb[0]" class="product-image"/>
        <div class="product-image-mask"
          @mouseover="() => product.hover = true"
          @mouseout="() => product.hover = false"
          :style="{'opacity': product.hover ? '1' : '0'}"
        >
          <btn-edit @click="openDetailPopup(product.item_id)" />
          <btn-link-market :product="product" />
        </div>
        <a-checkbox
          :checked="selected"
          @change="$emit('select')"
          style="position: absolute;left: 5px;top: 8px;"
        />
      </div>
    </div>
    <item-title :product="product" @popup="openDetailPopup" />
    <item-price :product="product" @popup="openMarketPopup"/>
    <a-divider style="margin: 5px 0;"/>
    <item-ctrl-bar :product="product" />
  </div>
</template>

<script setup>
import BtnEdit from "@/views/Product/List/ProductItem/BtnEdit.vue";
import BtnLinkMarket from "@/views/Product/List/ProductItem/BtnLinkMarket.vue";
import ItemTitle from "@/views/Product/List/ProductItem/ItemTitle.vue";
import ItemPrice from "@/views/Product/List/ProductItem/ItemPrice.vue";
import {message} from "ant-design-vue";
import {lib} from "@/util/lib";
import {ref, toRefs} from "vue";
import ItemCtrlBar from "@/views/Product/List/ProductItem/ItemCtrlBar.vue";
const props = defineProps(['product', 'selected'])
const emit = defineEmits(['select'])
const {selected} = toRefs(props)

const marketDetailUrls = ref({})

function openDetailPopup(itemId) {
  console.log('---', 'openDetailPopup',  itemId)
}

function openMarketPopup(marketInfo) {
  let market_prd_code = marketInfo.market_prd_code
  if (marketInfo.status !== "success") {
    if (marketInfo.status === "unsync") {
      return;
    }
    message.warning('연동준비중이거나 연동실패된 상품입니다.연동 완료후 시도해 주세요.');
    return;
  }


  if (!lib.isNumeric(marketInfo.market_code)) {
    message.warning("마켓코드가 잘못되었습니다.");
    return false;
  }
  if (!lib.isNumeric(market_prd_code)) {
    message.warning("상품코드가 잘못되었습니다.");
    return false;
  }
  let url = '';
  if (marketInfo.market_code === 'smartstore') {
    // check channel_info
    const channelInfo = marketInfo.market_data?.channel_info;

    if (!channelInfo?.url) {
      message.warning("채널정보가 없습니다. 마켓계정관리에서 연동확인 후 다시 시도해주세요.");
      return false;
    }
    url = `${channelInfo.url}/products/${market_prd_code}`;
  } else if (marketInfo.market_code === 'coupang') {
    if (marketInfo.front_code !== undefined) {
      market_prd_code = marketInfo.front_code
    }
    url = marketDetailUrls.value[marketInfo.market_code] + market_prd_code;
  } else {
    url = marketDetailUrls.value[marketInfo.market_code] + market_prd_code;
  }
  window.open(url)
}

</script>

<style scoped>
.product-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: white;
  width: 100%;
}

.product-image-container {
  width: 100%;
  display: flex; 
  justify-content: center;
  align-items: center;
}

.product-image-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.product-image {width: 100%;height: 100%;object-fit: contain}
.product-image-mask {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 223, 64,0.3);
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.2s ease-in-out;
}
</style>