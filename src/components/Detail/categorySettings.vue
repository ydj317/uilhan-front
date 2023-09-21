<template>
  <a-modal v-model:visible="props.isShow" title="계정별 카테고리 설정" @ok="handleOk" @cancel="handleCancel" style="width: 800px">

    <div class="mb15">
      <a-auto-complete
          v-model:value="autoCompleteValue"
          :options="autoCompleteOptions"
          style="width: 100%"
          placeholder="검색할 카테고리를 입력하세요."
          @select="onAutoCompSelect"
          @search="onAutoCompSearch"
      />
      <p class="mt5" style="color: #999999">도움말입니다.</p>
    </div>
    <div style="max-height: 500px;overflow-y: scroll">
      <a-table :dataSource="itemSyncMarket" :pagination="false">
        <a-table-column title="마켓계정" dataIndex="market_account" key="market_account" :width="120"></a-table-column>
        <a-table-column title="마켓카테고리" dataIndex="category" key="category">
          <template #default="{ record }">
            <market-categorys :marketAccount="record.market_account" v-model="searchCategoryValue" :key="record.market_account"></market-categorys>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-modal>
</template>

<script setup>
import {onMounted, onUpdated, ref} from 'vue';
import marketCategorys from "@/components/Detail/marketCategorys.vue";
const props = defineProps(['isShow', 'itemSyncMarket'])
const emit = defineEmits(['cancelDialog'])
const {itemSyncMarket} = props

const autoCompleteValue = ref('')
const autoCompleteOptions = ref([])
const searchCategoryValue = ref('')
const mockVal = (str, repeat = 1) => {
  return {
    value: str.repeat(repeat),
  };
};
const onAutoCompSearch = (searchText) => {
  // @TODO api call select categorys


  console.log('searchText');
  autoCompleteOptions.value = !searchText
      ? []
      : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
};
const onAutoCompSelect = (value) => {
  searchCategoryValue.value = value
  autoCompleteValue.value = ''
};

// watch(autoCompleteValue, () => {
//   console.log('value', autoCompleteValue.value);
// });

const handleOk = () => {
  console.log(111);
  //emit("update:isShow", false);
};

const handleCancel = () => {
  emit("cancelDialog", false);
};
// on mounted
onMounted(() => {
  console.log('mounted');
});
onUpdated(() => {
  console.log('updated');
});

</script>

<style scoped>

</style>