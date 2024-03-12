<template>
  <FullPageLoading v-model:show="indicator" />
  <div class="product-list-container">
    <product-list-title />
    <div class="action-tool" :class="{disabled: listLoading}">
      <div class="button-group">
        <a-checkbox :indeterminate="isSelectPart()" :checked="isSelectAll()" @change="toggleSelectAll"/>
        <a-button type="primary" @click="showFilter = true">필터</a-button>
        <a-divider type="vertical"/>
        <div><strong>선택한 상품</strong></div>
        <btn-delete :delete-items="productList.filter(d => selection.includes(d.item_id))" />
        <btn-clone :selection="selection"></btn-clone>
        <a-button type="primary" @click="MarketListPop">상품등록</a-button>
        <btn-ai-replace v-if="userInfo?.use_ai === '1'" :selection="selection"></btn-ai-replace>
      </div>
      <div class="search">
        <a-input-search
          v-model:value="searchParams.product_name"
          placeholder="검색어를 입력하세요" enter-button="검색" style="width: 300px"
          @search="searchByPrdName"
        />
      </div>
    </div>
    <product-filter v-model:is-show="showFilter" @search="searchByFilter" />
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
    :smartStoreCategory="smartStoreCategory"
    :options="options"
    :product-list="productList"
    :selection="selection"
    @result="setPopupResultData"
  />
  <DetailPopup
    :visible="showDetail"
    @update:visible="showDetail = false"
    :prdId="detailPrd"
    :active-tab="detailActive"
  />
  <ModalMemo v-model:memo-data="memoForm" @before-save="indicator = true" @after-save="() => {getList()}" />
</template>

<script setup>
import {onMounted, provide, ref} from "vue";
import {useMarketApi} from "@/api/market";
import {useUserInfo} from "@/hooks/useUserInfo";
import {useSelection} from "@/hooks/useSelection";
import {ProductList} from "@/services/product/ProductList";
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

const WHITE_LIST_USER = ['jwli', 'irunkorea_02', 'haeju']

const haveDownloadProductPermission = ref(false)
const marketDetailUrls = ref({})  // 用于 ProductItem 显示 market icon
const indicator = ref(false)
const listLoading = ref(false)
const showFilter = ref(false)
const showDetail = ref(false)
const detailPrd = ref(0)
const detailActive = ref('1')
const searchParams = ref(ProductList.defaultParams())
const productList = ref([])
const searchCount = ref(0)
const totalCount = ref(0)
const {userInfo} = useUserInfo({}, checkUserPermission)
const {selection, resetList, isSelect, isSelectAll, isSelectPart, toggleSelect, toggleSelectAll} = useSelection([])
const memoForm = ref({ show: false, item_id: -1, memo: '' })
const options = ref([])    // 用于联动商品
const MarketListVisible = ref(false)  // 是否显示联动商品弹窗
const smartStoreCategory = ref([])  // 联动时，检擦是否有 smartstore 联动失败的商品

provide('search', {searchParams})

async function searchByFilter() {
  searchParams.value.product_name = ''  // 重置右侧快捷搜索
  searchParams.value.page = 1
  return getList()
}

async function searchByPrdName() {
  const params = ProductList.defaultParams()
  params.limit = searchParams.value.limit
  params.product_name = searchParams.value.product_name || ''
  searchParams.value = params
  return getList()
}

async function getList(type = '') {
  indicator.value = false // 当显示 list loading, 则不需要显示全局 loading
  listLoading.value = true
  return ProductList.getList({...searchParams.value}, type).then((res) => {
    productList.value = res.data.list;
    searchParams.value.page = parseInt(res.data.page);
    searchParams.value.limit = parseInt(res.data.limit);
    searchCount.value = parseInt(res.data.searchCount);
    totalCount.value = parseInt(res.data.totalCount);
    searchParams.value.start_time = res.data.start_time
    searchParams.value.end_time = res.data.end_time
    resetList(productList.value.map(d => d['item_id']))
  }).finally(() => {
    listLoading.value = false
  })
}

function onChangePage(page) {
  sessionStorage.marketAccount_page = page;
  searchParams.value.page = page;
  getList();
}

function onChangeLimit(current, pageSize) {
  searchParams.value.page = 1
  sessionStorage.marketAccount_page = 1;

  searchParams.value.limit = pageSize;
  sessionStorage.marketAccount_limit = pageSize;
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

function MarketListPop() {
  if (selection.value.length === 0) {
    message.warning("선택된 상품이 없습니다.");
    return false;
  }
  MarketListVisible.value = true
}

function setPopupResultData(data) {
  console.log('---', data)
  // this.marketSyncSuccess = data[0];
  // this.marketSyncFailedCode = data[1];
  // this.marketSyncFailed = data[2];
  // this.marketSyncTotal = data[3];
  // this.marketSyncResult = data[4];
  // this.marketSyncPop = true;
}

function setResultData(data) {
  console.log('---', data)
  // this.marketSyncSuccess = 0;
  // this.marketSyncFailedCode = "";
  // this.marketSyncFailed = 0;
  // this.marketSyncTotal = 0;
  // this.marketSyncResult = [];
  // this.marketSyncPop = false;
}

// 初始化 options, 用于 MarketList
async function getMarketList() {
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/marketlist").then((res) => {
    if (res.status !== "2000") {
      throw new Error("설정하신 마켓계정 정보가 없습니다. \n마켓계정을 설정해주세요. ");
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
  Promise.all([
    getMarketList(),
    getMarketDetailUrls(),
    getList("reload"),
    getSmartstoreCategory()
  ]);
})

function checkUserPermission(data) {
  if (WHITE_LIST_USER.includes(data?.username)) {
    haveDownloadProductPermission.value = true
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
  grid-template-columns: repeat(5, 1fr);
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
</style>