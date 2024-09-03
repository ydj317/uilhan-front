<template>
  <FullPageLoading v-model:show="indicator"/>
  <div class="product-list-container">
    <product-list-title/>
    <div class="action-tool" :class="{disabled: listLoading}">
      <div class="button-group">
        <a-checkbox :indeterminate="isSelectPart()" :checked="isSelectAll()" @change="toggleSelectAll"/>
        <a-button type="primary" @click="showFilter = true">필터</a-button>
        <a-divider type="vertical"/>
        <div><strong>선택한 상품</strong></div>
        <btn-delete :delete-items="productList.filter(d => selection.includes(d.item_id))"/>
        <btn-clone :selection="selection"></btn-clone>
        <a-tooltip title="최대 50개 상품까지 일괄등록이 가능합니다.">
          <a-button type="default" @click="MarketListPop">상품등록</a-button>
        </a-tooltip>
        <btn-ai-replace v-if="userInfo?.user_data?.use_ai===true || userInfo?.user_data?.use_ai==='true'"
                        :selection="selection"></btn-ai-replace>
      </div>
      <div class="search">
        <a-input-search
            v-model:value="searchParams.keyword"
            placeholder="상품명을 입력하세요" enter-button="검색" style="width: 300px"
            @search="searchByKeyword"
        />
      </div>
<!--      <div v-show="checkSpecialMarket" class="button-synchronization">-->
<!--        <a-tooltip placement="topLeft" title="쿠팡 승인대기 상태인 상품들을 확인 처리합니다.">-->
<!--          <a-button>-->
<!--            <ReloadOutlined @click="SynchronizationPop()"/>-->
<!--          </a-button>-->
<!--        </a-tooltip>-->
<!--      </div>-->
    </div>
    <product-filter v-model:is-show="showFilter" @search="searchByFilter"/>
    <a-spin size="large" :spinning="listLoading">
      <div class="product-list">
        <product-item
            v-for="(product,key) in productList"
            :key="key"
            :product="product"
            :selected="isSelect(product.item_id)"
            :market-detail-urls="marketDetailUrls"
            @select="() => toggleSelect(product.item_id)"
            @detail="openDetailPopup"
            @memo="editPrdMemo(product)"
            @send="sendMarketSingle(product)"
        />
      </div>
    </a-spin>
    <a-pagination
        :disabled="listLoading"
        style="width: 100%;display: flex;justify-content: center;align-items: center;margin-top: 15px;"
        v-model:current="searchParams.page"
        v-model:page-size="searchParams.limit"
        show-size-changer
        @show-size-change="onChangeLimit"
        @change="onChangePage"
        :total="searchCount"
        :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
    />
  </div>
  <MarketList
      v-model:show="MarketListVisible"
      :smart-store-category="smartStoreCategory"
      :options="options"
      :product-list="productList"
      :selection="selection"
      @result="showSyncResult"
  />
  <modal-single-sync
      v-model:show="singleSyncPop"
      :product="singleDetail"
      :smart-store-category="smartStoreCategory"
      @result="showSyncResult"
      @close="clearSingleSendData"
  />
  <modal-sync-result
      :sync-result="syncResult"
      v-model:show="syncResult.marketSyncPop"
      @close="closeSyncResult"
  />
  <DetailPopup
      :visible="showDetail"
      @update:visible="handleUpdateVisible"
      :prdId="detailPrd"
      :active-tab="detailActive"
  />
  <ModalMemo v-model:memo-data="memoForm" @before-save="indicator = true" @after-save="reloadList"/>
</template>

<script setup>
import {onMounted, provide, reactive, ref} from "vue";
import {useMarketApi} from "@/api/market";
import {useUserInfo} from "@/hooks/useUserInfo";
import {useSelection} from "@/hooks/useSelection";
import {ServiceProduct} from "@/services/product/ServiceProduct";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import FullPageLoading from "@/components/FullPageLoading.vue";
import ProductListTitle from "@/views/Product/List/ProductListTitle.vue";
import ProductItem from "@/views/Product/List/ProductItem/ProductItem.vue";
import ProductFilter from "@/views/Product/List/ProductFilter/ProductFilter.vue";
import BtnDelete from "@/views/Product/List/Ctrls/BtnDelete.vue";
import BtnClone from "@/views/Product/List/Ctrls/BtnClone.vue";
import MarketList from "@/views/Product/List/MarketList/MarketList.vue";
import BtnAiReplace from "@/views/Product/List/Ctrls/BtnAiReplace.vue";
import DetailPopup from "@/views/Product/DetailPopup.vue";
import ModalMemo from "@/views/Product/List/Ctrls/ModalMemo.vue";
import {useCategoryApi} from "@/api/category";
import ModalSingleSync from "@/views/Product/List/ModalSingleSync/ModalSingleSync.vue";
import ModalSyncResult from "@/views/Product/List/ModalSyncResult/ModalSyncResult.vue";
import Cookie from "js-cookie";
import {EventSourcePolyfill} from "event-source-polyfill";
import emitter from "@/util/emitter";
import { mapState, useStore } from "vuex";
import {ReloadOutlined} from "@ant-design/icons-vue";

const WHITE_LIST_USER = ['jwli', 'irunkorea_02', 'haeju']

const haveDownloadProductPermission = ref(false)
const marketDetailUrls = ref({})  // 用于 ProductItem 显示 market icon
const indicator = ref(false)
const listLoading = ref(false)
const showFilter = ref(false)
const showDetail = ref(false)
const detailPrd = ref(0)
const detailActive = ref('1')
const searchParams = ref(ServiceProduct.getCacheParams())
const productList = ref([])
const transImagePrdList = ref([])
const searchCount = ref(0)
const totalCount = ref(0)
const {userInfo} = useUserInfo({}, checkUserPermission)
const {selection, resetList, isSelect, isSelectAll, isSelectPart, toggleSelect, toggleSelectAll} = useSelection([])
const memoForm = ref({show: false, item_id: -1, memo: ''})
const options = ref([])    // 用于登录商品
const MarketListVisible = ref(false)  // 是否显示批量登录商品弹窗
const singleSyncPop = ref(false)    // 是否显示登录单个商品弹窗
const singleDetail = ref({})
const smartStoreCategory = ref([])  // 联动时，检擦是否有 smartstore 联动失败的商品
const defaultSyncResult = {
  marketSyncPop: false,
  marketSyncResult: false,
}
const syncResult = ref({...defaultSyncResult})
let imageTransStateEvent = null;

const store = useStore();

// const checkSpecialMarket = ref(false)


provide('search', {searchParams})

async function searchByFilter() {
  searchParams.value.keyword = ''  // 重置右侧快捷搜索
  searchParams.value.page = 1
  return getList()
}

async function searchByKeyword() {
  const params = ServiceProduct.defaultParams()
  params.limit = searchParams.value.limit
  params.keyword = searchParams.value.keyword || ''
  searchParams.value = params
  return getList()
}

async function reloadList() {
  return getList(ServiceProduct.getCacheParams())
}

async function getList() {
  indicator.value = false // 当显示 list loading, 则不需要显示全局 loading
  listLoading.value = true
  return ServiceProduct.getList({...searchParams.value}).then((res) => {
    // item_image_trans_status 가 P 혹은  W 인 값들만 빼옴
    transImagePrdList.value = res.data.list.filter(d => d.item_image_trans_status === 'P' || d.item_image_trans_status === 'W')
    productList.value = res.data.list;
    searchParams.value.page = parseInt(res.data.page);
    searchParams.value.limit = parseInt(res.data.limit);
    searchCount.value = parseInt(res.data.searchCount);
    totalCount.value = parseInt(res.data.totalCount);
    searchParams.value.start_time = res.data.start_time
    searchParams.value.end_time = res.data.end_time
    resetList(productList.value.map(d => d['item_id']))

    // 스페셜마켓 (coupang) 체크 동기화버튼
    // if (res.data.market_list.length > 0) {
    //   res.data.market_list.filter((item) => {
    //     if (item.marketCode === 'coupang') {
    //       checkSpecialMarket.value = true;
    //     }
    //   })
    // }

  }).finally(() => {
    listLoading.value = false
    // 번역중 혹은 대기 상태인 상품이 있을경우 sse 열어줌
    if (transImagePrdList.value.length !== 0) {
      getImageTransStatusConnectSSE();
    }
  })
}

// 자동 이미지 번역 상태 업데이트 SSE
function getImageTransStatusConnectSSE() {
  if (!window.EventSource) {
    console.log('Your browser does not support server-sent events');
    return false;
  }

  // url 조합
  let url = process.env.VUE_APP_API_URL + "/api/prd/transImageStatus"
  if (Cookie.get('XDEBUG_SESSION')) {
    url += '?XDEBUG_SESSION_START=PHPSTORM' + "&prd_ids=" + JSON.stringify({ids: transImagePrdList.value.map(d => d.item_id)});
  } else {
    url += "?prd_ids=" + JSON.stringify({ids: transImagePrdList.value.map(d => d.item_id)})
  }

  const headers = {token: Cookie.get("token")}
  if (!imageTransStateEvent || imageTransStateEvent.readyState === imageTransStateEvent.CLOSED) {
    imageTransStateEvent = new EventSourcePolyfill(url, {
      headers: headers
    });
  }

  imageTransStateEvent.onopen = () => {
    console.log('SSE connection opened');
  };

  // 결과 받고 업데이트
  imageTransStateEvent.onmessage = (e) => {
    const resultData = JSON.parse(e.data)
    if (resultData.code !== '2000') {
      return false;
    }
    // data.data 와 productList.value item_image_trans_status 업데이트
    if (resultData.data.length > 0) {
      for (let i = 0; i < productList.value.length; i++) {
        const item = productList.value[i]
        if (transImagePrdList.value.find(d => d.item_id === item.item_id)) {
          productList.value[i].item_image_trans_status = resultData.data.find(d => d.item_id === item.item_id).item_image_trans_status
        }
      }

      let bComplete = true;
      // resultData.data 를 루프하여 P 혹은 W 상태가 있으면 bComplete = false
      for (let i = 0; i < resultData.data.length; i++) {
        if (resultData.data[i].item_image_trans_status === 'P' || resultData.data[i].item_image_trans_status === 'W') {
          bComplete = false;
          break;
        }
      }
      if (bComplete) {
        console.log('image trans complete and close SSE');
        imageTransStateEvent.close();
      }
    }

    if (resultData.action === 'close') {
      console.log('SSE connection closed');
      imageTransStateEvent.close();
    }
  };

// 에러
  imageTransStateEvent.onerror = (e) => {
    console.log('error', e)
    console.log('SSE connection closed');
    imageTransStateEvent.close();
  };
}

function onChangePage(page) {
  // 应用上一次生效的搜索条件，并设置新 page
  searchParams.value = ServiceProduct.getCacheParams()
  searchParams.value.page = page
  getList();
}

function onChangeLimit(current, pageSize) {
  // 应用上一次生效的搜索条件，且分页设为1，然后设置新的 limit
  searchParams.value = ServiceProduct.getCacheParams()
  searchParams.value.page = 1
  searchParams.value.limit = pageSize;
  getList();
}

function openDetailPopup({itemId, tab}) {
  showDetail.value = true
  detailPrd.value = itemId
  detailActive.value = tab
}

function editPrdMemo(product) {
  memoForm.value.show = true
  memoForm.value.item_id = product.item_id
  memoForm.value.memo = product.item_memo
}

// singlePop
function sendMarketSingle(product) {
  singleSyncPop.value = true
  singleDetail.value = product
}

function clearSingleSendData() {
  singleSyncPop.value = false
  singleDetail.value = {}
}

function MarketListPop() {
  if (selection.value.length === 0) {
    message.warning("선택된 상품이 없습니다.");
    return false;
  }

  if (selection.value.length > 50) {
    message.error("최대 50개 상품까지 일괄등록이 가능합니다.");
    return false;
  }
  MarketListVisible.value = true
}

function showSyncResult(data) {
  syncResult.value.marketSyncResult = data
  syncResult.value.marketSyncPop = true
}

function closeSyncResult() {
  syncResult.value = {...defaultSyncResult}

  // 按旧代码, 清空 single send market 相关的数据
  clearSingleSendData()
}

// 初始化 options, 用于 MarketList
async function getMarketList() {
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/marketlist").then((res) => {
    if (res.status !== "2000") {
      throw new Error("연동중인 마켓이 없습니다. 마켓연동에서 판매될 마켓을 등록해 주세요.");
    }

    for (let i = 0; i < res.data.length; i++) {
      res.data[i].key = i;
    }

    options.value = res.data;
  }).catch((e) => {
    message.error(e.message);
    return false;
  });
}

async function getMarketDetailUrls() {
  await useMarketApi().getMarketDetailUrls({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    marketDetailUrls.value = res.data;
  });
}

function getSmartstoreCategory() {
  return useCategoryApi().getSmartstoreCategory({}).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message);
      return false;
    }

    smartStoreCategory.value = res.data
  }).catch((e) => {
    message.error(e.message);
    return false;
  })
}

onMounted(() => {
  searchParams.value.page = 1;
  Promise.all([
    // 추천옵션 사용 마켓리스트 불러오기
    store.dispatch('market/getUseRecommendedOptionMarketList'),
    store.dispatch('market/getOpenMarketList'),
    getMarketList(),
    getMarketDetailUrls(),
    reloadList(),
    getSmartstoreCategory()
  ]);
})

function checkUserPermission(data) {
  if (WHITE_LIST_USER.includes(data?.username)) {
    haveDownloadProductPermission.value = true
  }
}

const handleUpdateVisible = () => {
  showDetail.value = false;
  getList();
};

// 주문리스트 상품 구매관리 링크 없고 상품에도 없을경우 상품리스트에서 해당상품 검색
emitter.on('set-product-filter',(prd_id)=>{
  searchParams.value = ServiceProduct.getCacheParams()
  searchParams.value.page = 1
  searchParams.value.prd_id = prd_id
  getList();
})


// 승인대기 상태인 상품 동기화
async function SynchronizationPop() {
  try {
    const res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/get_special_sync_market", {});
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    if (res.data.length === 0) {
      message.error("승인대기 상태인 상품이 없습니다.");
      return false;
    }
  } catch (e) {
    message.error("등록상태 조회실패 하였습니다.");
    return false;
  }
}

</script>

<style scoped>
.product-list-container {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-list {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
  background-color: #f5f5f5;
  width: 100%;
  min-height: 310px;
}

.action-tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-tool.disabled {
  opacity: .5;
  pointer-events: none;
}

.button-group {
  flex: auto;
  display: flex;
  align-items: center;
  gap: 5px;
}

.button-synchronization {
  margin-left: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>