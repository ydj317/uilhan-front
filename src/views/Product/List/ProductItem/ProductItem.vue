<template>
  <div class="product-item">
    <div class="product-image-container">
      <div class="product-image-wrap">
        <a-image
          :src="product.item_thumb[0]"
          :fallback="DEFAULT_IMAGE"
          width="276px"
          height="276px"
        />
        <div class="product-image-mask"
          @mouseover="product.hover = true"
          @mouseout="product.hover = false"
          :style="{opacity: product.hover ? '1' : '0'}"
        >
          <a
            href="javascript:void(0)"
            @click="openDetailPopup(product.item_id, '1')"
            style="color: white;font-weight: bold;">편집</a>
          <btn-link-market :product="product" />
        </div>
        <a-checkbox
          :checked="selected"
          @change="$emit('select')"
          style="position: absolute;left: 5px;top: 8px;"
        />
      </div>
    </div>
    <item-title :product="product" @popup="openDetailPopup(product.item_id, '1')" />
    <item-price :product="product" @popup="openMarketPopup"/>
    <a-divider style="margin: 5px 0;"/>
    <item-ctrl-bar
      :product="product"
      @detail-option="openDetailPopup(product.item_id, '2')"
      @detail-desc="openDetailPopup(product.item_id, '3')"
      @edit-memo="$emit('memo')"
      @send="$emit('send')"
    />
  </div>
</template>

<script setup>
import {lib} from "@/util/lib";
import { toRefs } from "vue";
import {message} from "ant-design-vue";
import BtnEdit from "@/views/Product/List/ProductItem/BtnEdit.vue";
import BtnLinkMarket from "@/views/Product/List/ProductItem/BtnLinkMarket.vue";
import ItemTitle from "@/views/Product/List/ProductItem/ItemTitle.vue";
import ItemPrice from "@/views/Product/List/ProductItem/ItemPrice.vue";
import ItemCtrlBar from "@/views/Product/List/ProductItem/ItemCtrlBar.vue";
const DEFAULT_IMAGE = 'data:image/png;base64,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'

const props = defineProps(['product', 'selected', 'marketDetailUrls'])
const emit = defineEmits(['select', 'detail', 'memo', 'send'])
const {selected, product, marketDetailUrls} = toRefs(props)

function openDetailPopup(itemId, tab) {
  emit('detail', {itemId, tab})
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