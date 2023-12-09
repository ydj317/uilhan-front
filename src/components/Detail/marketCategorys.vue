<template>
  <div v-if="categoryLoading" style="display: flex;align-items: center;">
    <LoadingOutlined /> <span style="color: #999999;margin-left: 5px;">카테고리 로딩중입니다.</span>
  </div>
  <div v-else>
    <a-cascader v-model:value="categoryValue" :options="options" placeholder="마켓별 카테고리를 선택해 주세요." style="width: 100%"
      :field-names="{ label: 'cateName', value: 'cateId' }" :load-data="loadData" change-on-select
      @change="handleCascaderChange" :disabled="marketPrdCode !== ''" />
    <div v-if="displayCategoryLoading" style="display: flex;align-items: center;">
      <LoadingOutlined /> <span style="color: #999999;margin-left: 5px;">전시카테고리 로딩중입니다.</span>
    </div>
    <MarketDisplayCategorys v-if="displayCategorysVisible" :marketCode="marketCode" :sellerId="sellerId" :displayCategorys="displayCategorys" />

    <div style="display: flex;flex-direction: column;gap: 10px" class="mt15" v-if="searchMarketCategoryList.length > 0">
      <template v-for="(item, key) in searchMarketCategoryList" :key="key">
        <div>
          <a-typography-link @click="settingCategory(item)">
            {{ item.cate_names.join(' / ') }}
          </a-typography-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUpdated, ref, toRefs, watchEffect } from "vue";
import { useCategoryApi } from "@/api/category";
import { useStore } from 'vuex';
import { LoadingOutlined } from '@ant-design/icons-vue';
import MarketDisplayCategorys from './MarketDisplayCategorys.vue'
import {message} from "ant-design-vue";
const store = useStore();
const { product } = toRefs(store.state);

const props = defineProps(['marketCode', 'sellerId', 'modelValue', 'marketPrdCode'])
const { marketCode, sellerId, modelValue, marketPrdCode } = toRefs(props)


const categoryValue = ref([])
const searchMarketCategoryList = ref([])
const options = ref([]);
const categoryLoading = ref(false)

const displayCategorysVisible = ref(false)
const displayCategorys = ref([])
const displayCategoryMarkets = ['lotteon'];
let displayCategoryLoading = false
const getMarketCategory = () => {
  categoryLoading.value = true
  useCategoryApi().getMarketCategoryList({ market_code: marketCode.value }).then(res => {
    options.value = res.data
    categoryLoading.value = false
  })
}

// 원클릭 카테고리 설정
const settingCategory = (item) => {
  //categoryValue.value = item.cate_ids
  categoryValue.value = item.cate_names.join(' / ')
  if (!product.value.item_cate) {
    product.value.item_cate = {}
  }
  let selectedOption = marketCode.value + '|' + sellerId.value
  product.value.item_cate[selectedOption] = { marketCode: marketCode.value, cateId: item.cate_ids[item.cate_ids.length - 1], categoryNames: categoryValue.value }
  searchMarketCategoryList.value = []
  if(displayCategoryMarkets.includes(marketCode.value)) {
    const cateId = item.cate_ids;
    useCategoryApi().getDisplayCategorys({ market_code: marketCode.value, seller_id: sellerId.value, cate_id: cateId }).then(res => {
      if(res.status !== "2000") {
        message.error(res.message)
        return false;
      }
      displayCategorys.value = res.data
      displayCategorysVisible.value = true
    }).catch(err => {
      message.error(err.message)
      return false;
    })

  }
}


// 자체선택 카테고리 설정
const handleCascaderChange = (value, selectedOptions) => {
  if (!product.value.item_cate) {
    product.value.item_cate = {}
  }
  // check selectedOptions is isLeaf
  if (selectedOptions[selectedOptions.length - 1].isLeaf) {
    let selectedOption = marketCode.value + '|' + sellerId.value
    product.value.item_cate[selectedOption] = { marketCode: marketCode.value, cateId: value[value.length - 1], categoryNames: selectedOptions.map(o => o.cateName).join(' / ') }

    // 전시카테고리 마켓
    if(displayCategoryMarkets.includes(marketCode.value)) {
      const cateId = selectedOptions.map(o => o.cateId)
      displayCategoryLoading = true
      useCategoryApi().getDisplayCategorys({ market_code: marketCode.value, seller_id: sellerId.value, cate_id: cateId }).then(res => {
        console.log(displayCategoryLoading);
        if(res.status !== "2000") {
          message.error(res.message)
          return false;
        }
        displayCategorys.value = res.data
        displayCategorysVisible.value = true
        displayCategoryLoading = false
      }).catch(err => {
        displayCategoryLoading = false
        message.error(err.message)
        return false;
      })

    }
    return false;
  }
}

const loadData = (selectedOptions) => {

  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;

  // load options lazily
  setTimeout(() => {
    targetOption.loading = false;
    useCategoryApi().getMarketCategoryList({ market_code: marketCode.value, cate_id: targetOption.cateId }).then(res => {
      targetOption.children = res.data
    })
    options.value = [...options.value];
  }, 100);
};

const initMarketCategory = () => {
  let selectedOption = marketCode.value + '|' + sellerId.value
  if (product.value.item_cate && product.value.item_cate[selectedOption]) {
    categoryValue.value = product.value.item_cate[selectedOption].categoryNames
  }
}
onMounted(async () => {
  await getMarketCategory()
  initMarketCategory()
})

// watchEffect searchCategoryValue
watchEffect(() => {
  if (modelValue.value !== '') {
    setTimeout(() => {
      if (marketPrdCode.value === '') {
        useCategoryApi().getAutoRecommendCategoryNames({ market_code: marketCode.value, search_keyword: modelValue.value }).then(res => {
          searchMarketCategoryList.value = res.data
        })
      }
    }, 100);
  }
})


onUpdated(async () => {

})
</script>

<style scoped></style>