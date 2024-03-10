<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>
  <div class="product-list-container">
    <product-list-title />

    <list-ctrl :disabled="listLoading" :userinfo="userInfo" @show-filter="showFilter = true" />
    <product-filter v-model:is-show="showFilter"/>

    <a-spin size="large" :spinning="listLoading">
      <div class="product-list">
        <product-item v-for="(product,key) in productList" :key="key" :product="product"/>
        <!-- @todo empty -->
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
import {onMounted, ref} from "vue";
import {useUserInfo} from "@/hooks/useUserInfo";
import moment from "moment/moment";

import Loading from "vue-loading-overlay";
import ListCtrl from "@/views/Product/List/ListCtrl/ListCtrl.vue";
import ProductListTitle from "@/views/Product/List/ProductListTitle.vue";
import ProductItem from "@/views/Product/List/ProductItem/ProductItem.vue";
import ProductFilter from "@/views/Product/Popup/ProductFilter.vue";
import {ProductList} from "@/services/product/ProductList";

const defaultParams = ProductList.defaultParams()

const haveDownloadProductPermission = ref(false)
const indicator = ref(false)
const listLoading = ref(false)
const checked = ref(false)
const date = ref([moment().subtract(3, 'months'), moment()])
const showFilter = ref(false)
const searchParams = ref(defaultParams)
const productList = ref([])
const searchCount = ref(0)
const totalCount = ref(0)
const {userInfo} = useUserInfo({}, data => {
  if (['jwli', 'irunkorea_02', 'haeju'].includes(data?.username)) {
    haveDownloadProductPermission.value = true
  }
})

const getList = async (type = '') => {
  listLoading.value = true
  return ProductList.getList({...searchParams.value}, type).then((res) => {
    productList.value = res.data.list;
    searchParams.value.page = parseInt(res.data.page);
    searchParams.value.limit = parseInt(res.data.limit);
    searchCount.value = parseInt(res.data.searchCount);
    totalCount.value = parseInt(res.data.totalCount);
    // @todo date 用在哪？
    date.value = [moment(res.data.start_time), moment(res.data.end_time)];
    checked.value = false;
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

onMounted(() => {
  Promise.all([
    // this.getMarketList(),
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