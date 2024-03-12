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

const props = defineProps(['show', 'options', 'productList', 'selection'])
const emit = defineEmits(['update:show', 'result'])
const {show} = toRefs(props)
watch(show, val => {
  if (val) marketSelectedRowKeys.value = []
})

const loading = ref(false)
const marketSelectedRowKeys = ref([])
const smartStoreCategory = ref([])

function onMarketSelectChange(selectedRowKeys) {
  marketSelectedRowKeys.value = selectedRowKeys;
}

async function sendMarket() {
  let productList = getCheckList();
  let accountList = marketSelectedRowKeys.value.map(index => props.options[index])

  if (productList === "," || productList.length === 0) {
    message.warning('선택된 상품이 없습니다.');
    return false;
  }

  if (accountList.length === undefined || accountList.length === 0) {
    message.warning("선택된 계정이 없습니다.");
    return false;
  }

  const checkSmartStore = checkSmartStoreCategory(accountList);
  if(checkSmartStore === false) {
    return false
  }

  loading.vaue = true;

  try {
    let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/send_market", {
      productList: productList,
      accountList: accountList
    });

    if (res.status !== "2000") {
      message.error(res.message);
      loading.value = false
      return false;
    }

    if (res.data !== undefined && res.data.length === 0) {
      message.error("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
      loading.vaue = false;
      return false;
    }

    let returnData = res.data;
    emit('result', [
      returnData.success,
      returnData.failedCode,
      returnData.failed,
      returnData.total,
      returnData.data,
    ])

    closeModal()
    loading.vaue = false;
    return true;
  } catch (e) {
    message.error(e.message);
    loading.vaue = false;
    return false;
  }
}

function checkSmartStoreCategory(accountList) {
  const smartstoreAccounts = accountList.filter((item) => item.market_code === 'smartstore')
  const checkedPrdList = props.productList.filter((item) => props.selection.includes(item.item_id));

  let failedItem = [];
  if(smartstoreAccounts.length === 0) {
    return true;
  }

  checkedPrdList.map((prdItem) => {
    failedItem = smartStoreCategory.value.filter((item) => {
      return prdItem.item_sync_keyword.includes(item.cate_name);
    })
  })

  if(failedItem.length > 0) {
    message.warning(`스마트스토어 금지어: [${failedItem.map((item) => item.cate_name).join(', ')}] 상품명 수정후 마켓연동해 주세요.`)
    return false;
  }
  return true;
}

function getCheckList() {
  return props.selection.join(',')
}

function closeModal() {
  emit('update:show', false)
}

onMounted(() => {
  useCategoryApi().getSmartstoreCategory({}).then((res) => {
    if(res.status !== '2000'){
      message.error(res.message);
      return
    }
    smartStoreCategory.value = res.data
  }).catch((e) => {
    message.error(e.message);
  })
})

</script>
