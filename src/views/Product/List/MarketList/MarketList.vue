<template>
<!--  <FullPageLoading v-model:show="loading" />-->
  <a-modal width="800px" :open="show" @update:open="closeModal" centered>
    <template #title><market-list-title /></template>
    <a-spin size="large" :spinning="syncLoading" >
    <a-table
      :columns="columns"
      :data-source="options"
      :pagination="{hideOnSinglePage:true}"
      :row-selection="{ selectedRowKeys: marketSelectedRowKeys, onChange: onMarketSelectChange }"
    >
      <!--bodyCell-->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'market_name'">
          <div  style="text-align: center;" class="market-code">
            <img :src="getLogoSrc('market-logo', record.market_code)"
              style="width: 25px; height: 25px;"
            >
            <a-tooltip v-if="record.market_code === 'lotteon'">
              <template #title>
                <div>-롯데ON의 경우 마켓 등록 재전송 필요합니다.(*기존 데이터 베이스가 없으므로 작업 후 기존 마켓들과 동일하게 업로드 가능)</div>
              </template>
              <ExclamationCircleOutlined />
            </a-tooltip>

            <a-tooltip v-else-if="record.market_code === 'smartstore'">
              <template #title>
                <div>-마켓 정책에 의하여 상품등록 시 기준 판매가로 세팅된 옵션명이 상품명 뒤에 추가됩니다. 글자 수 초과 시 상품명은 자동으로 잘리게 됩니다.
                  <br> -단일 옵션은 정책 대상이 아니기 때문에 적용되지 않습니다.</div>
              </template>
              <ExclamationCircleOutlined />
            </a-tooltip>

            <a-tooltip v-else-if="['gmarket', 'auction'].includes(record.market_code)">
              <template #title>
                <div>-마켓 정책 상 일부 카테고리는 단일상품만 등록이 가능하기에 해당 카테고리로 상품을 등록할 경우 옵션이 아닌 단일상품으로 등록하고 최대 50개까지 그룹상품으로 추가해 드립니다.</div>
              </template>
              <ExclamationCircleOutlined />
            </a-tooltip>
          </div>
        </template>

        <template v-if="column.key === 'market_account'">
          <div style="text-align: left">
            {{ record.seller_id }}
          </div>
        </template>
      </template>
    </a-table>
    </a-spin>
    <span class="help-text" v-if="showNaverHelp" > -스마트스토어 마켓 정책 : 기준 판매가 옵션이 첫 번째 옵션으로 되고 상품명 뒤에 옵션명이 추가됩니다.</span>

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
    width: '150px'
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
const showNaverHelp = ref(false)
watch(show, val => {
  if (val) marketSelectedRowKeys.value = []
})

const loading = ref(false)
const syncLoading = ref(false)
const marketSelectedRowKeys = ref([])

function onMarketSelectChange(selectedRowKeys) {
  marketSelectedRowKeys.value = selectedRowKeys;
}

watch(marketSelectedRowKeys, val => {
  const iSmartstoreKey = props.options.findIndex(item => item.market_code === 'smartstore');
  if (iSmartstoreKey !== -1) {
    if (val.includes(iSmartstoreKey)) {
      showNaverHelp.value = true
    } else {
      showNaverHelp.value = false
    }
  }
})

async function sendMarket() {
  let accountList = marketSelectedRowKeys.value.map(index => props.options[index])

  const productList = props.productList.filter(d => props.selection.includes(d.item_id))
  if (! ServiceProduct.checkBeforeSendMarket(productList, accountList, smartStoreCategory.value)) {
    return
  }

  syncLoading.value = true
  const result = await ServiceProduct.sendMarket(productList, accountList, smartStoreCategory.value)
  emit('result', result)
  closeModal()
  syncLoading.value = false
}

function closeModal() {
  emit('update:show', false)
}

</script>
