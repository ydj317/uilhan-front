<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>

<!--  <textarea :value="JSON.stringify(selection, null, '\t')" style="width:500px;height:200px" />-->

  <div class="product-list-container">
    <product-list-title />
    <list-ctrl
      :select-all="isSelectAll()"
      :select-part="isSelectPart()"
      :disabled="listLoading"
      :userinfo="userInfo"
      @toggle-select="toggleSelectAll"
      @show-filter="showFilter = true"
    />
    <product-filter v-model:is-show="showFilter" @submit="doSearch" />
    <a-spin size="large" :spinning="listLoading">
      <div class="product-list">
        <product-item
          v-for="(product,key) in productList"
          :key="key"
          :product="product"
          :selected="isSelect(product.item_id)"
          @select="() => toggleSelect(product.item_id)"
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
</template>

<script setup>
import {onMounted, provide, ref} from "vue";
import {useUserInfo} from "@/hooks/useUserInfo";
import Loading from "vue-loading-overlay";
import ListCtrl from "@/views/Product/List/ListCtrl/ListCtrl.vue";
import ProductListTitle from "@/views/Product/List/ProductListTitle.vue";
import ProductItem from "@/views/Product/List/ProductItem/ProductItem.vue";
import ProductFilter from "@/views/Product/List/ProductFilter/ProductFilter.vue";
import {ProductList} from "@/services/product/ProductList";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import {useSelection} from "@/hooks/useSelection";

const WHITE_LIST_USER = ['jwli', 'irunkorea_02', 'haeju']
const haveDownloadProductPermission = ref(false)
const indicator = ref(false)
const listLoading = ref(false)
const showFilter = ref(false)
const searchParams = ref(ProductList.defaultParams())
const productList = ref([])
const searchCount = ref(0)
const totalCount = ref(0)
const {userInfo} = useUserInfo({}, checkUserPermission)
const {selection, resetList, isSelect, isSelectAll, isSelectPart, toggleSelect, toggleSelectAll} = useSelection([])

provide('search', {searchParams, doSearch})

async function doSearch() {
  searchParams.value.page = 1
  return getList()
}

async function getList(type = '') {
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

// @todo 没用到
const options = ref([])
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

function checkUserPermission(data) {
  if (WHITE_LIST_USER.includes(data?.username)) {
    haveDownloadProductPermission.value = true
  }
}

onMounted(() => {
  Promise.all([
    // getMarketList(),
    // this.getMarketDetailUrls(),
    getList("reload"),
    // this.getSmartstoreCategory()
  ]);
})

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
</style>