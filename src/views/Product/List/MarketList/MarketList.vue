<template>
  <FullPageLoading v-model:show="loading" />
  <a-modal width="600px" :open="show" @update:open="closeModal" centered>
    <template #title><market-list-title /></template>

    <a-table
      :columns="columns"
      :data-source="options"
      :pagination="{hideOnSinglePage:true}"
      :row-selection="{ selectedRowKeys: marketSelectedRowKeys, onChange: onMarketSelectChange }"
    >
      <!--bodyCell-->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'market_name'">
          <div  style="text-align: center;">{{ record.market_code }}</div>
        </template>

        <template v-if="column.key === 'market_account'">
          <div style="text-align: left">
            <img 
              :src="getLogoSrc('market-logo', record.market_code)"
              style="width: 16px; height: 16px; margin-right: 5px;" 
            >
            {{ record.seller_id }}
            <a-tooltip v-if="record.market_code === 'lotteon'">
              <template #title>
                <div>롯데ON의 경우 마켓 등록 재전송 필요합니다.(*기존 데이터 베이스가 없으므로 작업 후 기존 마켓들과 동일하게 업로드 가능)</div>
              </template>
              <ExclamationCircleOutlined />
            </a-tooltip>
          </div>
        </template>
      </template>
    </a-table>

    <template v-slot:footer><market-list-footer @send="sendMarket" @close="closeModal" /></template>
  </a-modal>
</template>

<script setup>
import {onMounted, ref, toRefs, watch} from "vue";
import {getLogoSrc} from "@/util/functions";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import FullPageLoading from "@/components/FullPageLoading.vue";
import MarketListTitle from "@/views/Product/List/MarketList/MarketListTitle.vue";
import MarketListFooter from "@/views/Product/List/MarketList/MarketListFooter.vue";
import {message} from "ant-design-vue";
import {AuthRequest} from "@/util/request";
import {useCategoryApi} from "@/api/category";
import {ServiceProduct} from "@/services/product/ServiceProduct";

const columns = [
  {
    title: '마켓',
    key: 'market_name',
    align: "center",
    width: '160px'
  },
  {
    title: '계정',
    key: 'market_account',
    align: "center",
  },
]

const props = defineProps(['show', 'options', 'productList', 'selection', 'smartStoreCategory'])
const emit = defineEmits(['update:show', 'result'])
const {show, smartStoreCategory} = toRefs(props)
watch(show, val => {
  if (val) marketSelectedRowKeys.value = []
})

const loading = ref(false)
const marketSelectedRowKeys = ref([])

function onMarketSelectChange(selectedRowKeys) {
  marketSelectedRowKeys.value = selectedRowKeys;
}

async function sendMarket() {
  let accountList = marketSelectedRowKeys.value.map(index => props.options[index])

  const productList = props.productList.filter(d => props.selection.includes(d.item_id))
  if (! ServiceProduct.checkBeforeSendMarket(productList, accountList, smartStoreCategory.value)) {
    return
  }

  loading.value = true
  const result = await ServiceProduct.sendMarket(productList, accountList, smartStoreCategory.value)
  if (result !== false) {
    emit('result', result)
    closeModal()
  }
  loading.value = false
}

function closeModal() {
  emit('update:show', false)
}

</script>
