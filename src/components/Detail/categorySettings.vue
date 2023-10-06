<template>
  <a-modal v-model:visible="props.isShow" title="계정별 카테고리 설정" @ok="handleOk" @cancel="handleCancel" style="width: 800px">

    <div class="mb15">
      <a-auto-complete v-model:value="autoCompleteValue" :options="autoCompleteOptions" style="width: 100%"
        placeholder="검색할 카테고리를 입력하세요." @select="onAutoCompSelect" @search="onAutoCompSearch" />
      <p class="mt5" style="color: #999999">도움말입니다.</p>
    </div>
    <div style="max-height: 500px;overflow-y: scroll">
      <a-table :dataSource="marketAccounts" :pagination="false">
        <a-table-column title="마켓계정" dataIndex="seller_id" key="seller_id" :width="120"></a-table-column>
        <a-table-column title="마켓카테고리">
          <template #default="{ record }">
            <market-categorys ref="marketCategorysRef" :marketCode="record.market_code" :sellerId="record.seller_id"
              :status="record.status" v-model="searchCategoryValue" :key="record.seller_id">
            </market-categorys>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-modal>
</template>

<script setup>
import { onMounted, onUpdated, ref, toRefs } from 'vue';
import marketCategorys from "@/components/Detail/marketCategorys.vue";
import { useMarketAccountApi } from '@/api/marketAccount';
import { useCategoryApi } from "@/api/category";
import { useStore } from 'vuex';
const store = useStore();
const { product } = toRefs(store.state);

const props = defineProps(['isShow'])
const emit = defineEmits(['cancelDialog'])


const autoCompleteValue = ref('')
const autoCompleteOptions = ref([])
const searchCategoryValue = ref('')
const marketCategorysRef = ref(null)
const marketAccounts = ref('')

const onAutoCompSearch = (searchText) => {

  setTimeout(() => {
    useCategoryApi().getAutoRecommendCategory({ search_keyword: searchText }).then(res => {

      const options = [];
      res.data.forEach(element => {
        options.push({
          value: element.cate_name,
          labels: element.cate_name,
          code: element.cate_id,
        });
      });

      // options에서 중복 제거
      const uniqueOptions = options.filter((item, index) => {
        return options.findIndex((item2, index2) => {
          return item.value === item2.value;
        }) === index;
      });

      autoCompleteOptions.value = !searchText
        ? []
        : uniqueOptions
    })
  }, 300);


};

const onAutoCompSelect = (value, name) => {

  searchCategoryValue.value = value
};

const getMarketAccount = () => {

  marketAccounts.value = product.value.item_sync_market
  //marketAccounts.value = product
  // useMarketAccountApi().getAccountList({ page: 1, pageSize: '50000', is_use: 1 }).then(res => {
  //   marketAccounts.value = res.data.list
  // })
};


// watch(autoCompleteValue, () => {
//   console.log('value', autoCompleteValue.value);
// });

const handleOk = () => {
  emit("cancelDialog", false);
};

const handleCancel = () => {
  emit("cancelDialog", false);
};
// on mounted
onMounted(() => {
  getMarketAccount();
  console.log('mounted');
});
onUpdated(() => {
  console.log('updated');
});

</script>

<style scoped></style>