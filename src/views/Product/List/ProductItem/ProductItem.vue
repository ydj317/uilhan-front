<template>
  <div class="product-item">
    <div class="product-image-container">
      <div class="product-image-wrap">
        <a-image
          :src="product.item_thumb[0]"
          :fallback="DEFAULT_IMAGE"
          alt=""
          style="
          width: 100%;
          height: 250px;
          object-fit: fill;
          "
        />
        <div class="product-image-mask"
          @mouseover="product.hover = true"
          @mouseout="product.hover = false"
          :style="{opacity: product.hover ? '1' : '0'}"
        >
          <a href="javascript:void(0)" @click="openDetailPopup(product, '1')"
            style="color: white; font-weight: bold; padding: 110px 134px;">편집</a>
          <btn-link-market v-if="product.item_url" :product="product" />
          <change-link :product="product" :visible="changLinkVisible"  @update:updateData="changeLinkDataUpdate" />
          <a-button v-if="!product.item_url" class="btn-chang-link" type="primary" @click="openChangLinkPopup()"> 구매링크 추가 </a-button>
        </div>
        <a-checkbox
          :checked="selected"
          @change="$emit('select')"
          style="position: absolute;left: 5px;top: 8px;"
        />

        <div v-if="isShowTag(product)" style="position: absolute; right: 5px; top: 8px;">
          <a-tag
              :color="translateStatusMap[getTranslateStaus(product)]?.color || 'default'"
          >
            <template v-if="translateStatusMap[getTranslateStaus(product)]?.spinning" #icon>
              <SyncOutlined :spin="true" />
            </template>
            {{ translateShowText + translateStatusMap[getTranslateStaus(product)]?.text }}
          </a-tag>
        </div>

      </div>
    </div>
    <item-title :product="product" @popup="openDetailPopup(product, '1', product.item_image_trans_status)" />
    <item-price :product="product" @popup="openMarketPopup"/>
    <a-divider style="margin: 5px 0;"/>
    <item-ctrl-bar
      :product="product"
      @detail-option="openDetailPopup(product, '2')"
      @detail-desc="openDetailPopup(product, '3')"
      @edit-memo="$emit('memo')"
      @send="$emit('send')"
    />
  </div>
</template>

<script setup>
import {lib} from "@/util/lib";
import {reactive, toRefs, ref, computed} from "vue";
import {message} from "ant-design-vue";
import BtnLinkMarket from "@/views/Product/List/ProductItem/BtnLinkMarket.vue";
import ChangeLink from "@/views/Product/List/ProductItem/ChangeLink.vue";
import ItemTitle from "@/views/Product/List/ProductItem/ItemTitle.vue";
import ItemPrice from "@/views/Product/List/ProductItem/ItemPrice.vue";
import ItemCtrlBar from "@/views/Product/List/ProductItem/ItemCtrlBar.vue";
import {useProductApi} from "@/api/product";
import {
  SyncOutlined
} from "@ant-design/icons-vue";

const DEFAULT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='

const props = defineProps(['product', 'selected', 'marketDetailUrls'])
const emit = defineEmits(['select', 'detail', 'memo', 'send'])
const {selected, product, marketDetailUrls} = toRefs(props)

// 텍스트:item_text_trans_status, 이미지:item_image_trans_status
const translateStatusKey = ref('item_text_trans_status');
const translateStatusMap = reactive({
  W: { color: 'orange', text: ' 번역대기' },
  P: { color: 'processing', text: ' 번역중', spinning: true },
  S: { color: 'success', text: ' 번역 성공' },
  F: { color: 'error', text: ' 번역 실패' }
})
const getTranslateStaus = (product) => {
  if (product['item_text_trans_status'] === 'S' && product['item_image_trans_status']) {
    translateStatusKey.value = 'item_image_trans_status';
  } else {
    translateStatusKey.value = 'item_text_trans_status';
  }
  return product[translateStatusKey.value];
}
let translateShowText = computed(() => {
  return translateStatusKey.value === 'item_text_trans_status' ? '텍스트' : '이미지';
})

let changLinkVisible = ref(false);

const changeLinkDataUpdate = (data) => {
  changLinkVisible.value = data.visible;
  if (data.item_url) {
    product.value.item_url = data.item_url;
    product.value.item_code = data.item_code;
    product.value.item_market = data.item_market;
  }
}
const isShowTag = (product) => {
  let isShow = true;
  let sendSuccessMarketList = product.item_sync_market.filter(market => market.status !== 'unsync');
  if (translateStatusMap[getTranslateStaus(product)]) {
    // 성공, 실패인 상품 연동이력이 있으면 미노출
    if (['S', 'F'].includes(getTranslateStaus(product)) && sendSuccessMarketList.length > 0) {
      isShow = false;
    }
  } else {
    isShow = false;
  }

  return isShow;
}

async function openDetailPopup(product, tab) {
  const itemId = product.item_id;
  const transStatus = getTranslateStaus(product);
  if (translateStatusKey === 'item_text_trans_status') {
    if (transStatus === 'W' || transStatus === 'P') {
      let msg = '텍스트 번역 대기중입니다. 잠시후 다시 진행하시기 바랍니다.';
      if (transStatus === 'P') {
        msg = '텍스트 번역중입니다. 잠시후 다시 진행하시기 바랍니다.';
      }
      message.warning(msg);
      return;
    }
  } else {
    if (transStatus === 'W') {
      message.warning('이미지 번역 대기중입니다. 상품정보 편집 시 번역전의 이미지로 뒤덮일 수 있습니다.');
    }

    // 자동이미지 번역중일때  컴펌
    if (transStatus === 'P') {
      const confirmed = confirm(`이미지 번역중입니다. 상품정보 편집 시 번역전의 이미지로 뒤덮일 수 있습니다. 상품정보 편집을 진행하시겠습니까?`);
      if (!confirmed) {
        return false;
      }
    }
  }

  emit('detail', {itemId, tab})
}

function openMarketPopup(marketInfo) {
  let market_prd_code = marketInfo.market_prd_code
  // if (marketInfo.status !== "success") {
  //
  //   message.warning('연동준비중이거나 연동실패된 상품입니다.연동 완료후 시도해 주세요.');
  //   return;
  // }
  if (marketInfo.status === "unsync" || market_prd_code === null) {
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
    let vendor_item_id = '';
    if (marketInfo.front_code !== undefined) {
      let parts = marketInfo.front_code.split(":");
      market_prd_code = parts[0]
      vendor_item_id = parts[1]
    }
    url = marketDetailUrls.value[marketInfo.market_code] + market_prd_code + '?vendorItemId=' + vendor_item_id;
  } else if (['gmarket', 'auction'].includes(marketInfo.market_code) && marketInfo.hasOwnProperty('front_code')) {
    url = marketDetailUrls.value[marketInfo.market_code] + marketInfo.front_code;
  } else {
    url = marketDetailUrls.value[marketInfo.market_code] + market_prd_code;
  }
  window.open(url)
}

function openChangLinkPopup(product) {
  changLinkVisible.value = true;
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
  width: 100%;
  background-color: white;
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

.btn-chang-link {
  position: absolute;
  bottom: 5px;
  width: 226px;
  overflow: hidden;
  display: flex;
  gap: 10px;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>