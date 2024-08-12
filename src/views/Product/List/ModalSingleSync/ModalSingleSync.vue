<template>
  <a-modal width="1000px" :open="show" @update:open="$emit('update:show', false)" centered>
    <loading style="z-index: 999" v-model:active="syncLoading" :can-cancel="false" :is-full-page="false" />
    <template #title>
      선택상품 등록
      <a-tooltip>
        <template #title>
          <div>상품을 등록할 마켓을 선택하여 등록해 주세요.</div>
        </template>
        <QuestionCircleOutlined/>
      </a-tooltip>
    </template>
    <a-table
      class="tableSyncStatus"
      :dataSource="product.item_sync_market"
      :columns="SYNC_COLUMNS_CONFIG"
      :row-selection="{ selectedRowKeys: syncSelectedRowKeys, onChange: onSyncSelectChange }"
    >
      <!--table body-->
      <template v-slot:bodyCell="{ text, record, index, column }">
        <!--연동계정-->
        <template v-if="column.key === 'market_account'">
          <div style="text-align: center;" class="market-code">
            <a-tooltip :title="record.seller_id">
            <img :src="getLogoSrc('market-logo', record.market_code)"
                 style="width: 25px; height: 25px;" :alt="record.market_code">
            </a-tooltip>
            <a-tooltip v-if="record.market_code === 'lotteon'">
              <template #title>
                <div>롯데ON의 경우 마켓 등록 재전송 필요합니다.(*기존 데이터 베이스가 없으므로 작업 후 기존 마켓들과 동일하게 업로드 가능)</div>
              </template>
              <ExclamationCircleOutlined />
            </a-tooltip>
          </div>
        </template>

        <!--상태-->
        <template v-if="column.key === 'status'">
          <div style="text-align: left">
            <a-tag color="processing" v-if="record.status === 'sending'">전송중</a-tag>
            <a-tag color="processing" v-else-if="record.status === 'approval'">승인대기</a-tag>
            <a-tag color="success" v-else-if="record.status === 'success'">연동성공</a-tag>
            <a-tag color="error" v-else-if="record.status === 'failed'">연동실패</a-tag>
            <a-tag color="default" v-else>연동대기</a-tag>
            <span v-if="record.status === 'failed'">실패원인: {{ record.result }}</span>
            <a-tag color="#108ee9" v-if="record.status === 'approval'" style="cursor: pointer"
                   @click="approvalCheck(record.market_id)">
              승인상태확인
            </a-tag>
          </div>
        </template>

        <!--연동시간-->
        <template v-if="column.key === 'ins_time'">
          <div v-if="record.status !== 'unsync'">
            <div v-if="!record.upd_time">{{ record.ins_time }}</div>
            <div v-else>{{ record.upd_time }}</div>
          </div>
        </template>
        <template v-if="column.key === 'employee_name'">
          <div>{{ record.employee_name }}</div>
        </template>
      </template>

    </a-table>

    <template v-slot:footer>
      <a-button @click="closeModal">닫기</a-button>
      <a-button type="primary" @click="sendMarket()">선택마켓연동</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {ExclamationCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons-vue";
import {ref, toRefs, watch} from "vue";
import {getLogoSrc} from "@/util/functions";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import {ServiceProduct} from "@/services/product/ServiceProduct";
import Loading from "vue-loading-overlay";

const SYNC_COLUMNS_CONFIG = [
  {
    title: "마켓",
    key: "market_account",
    align: "center",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "등록상태",
    key: "status",
    align: "center",
  },
  {
    title: "등록시간",
    key: "ins_time",
    width: "170px",
    align: "center"
  },
  {
    title: "처리자",
    key: "employee_name",
    width: "170px",
    align: "center"
  }
]

const props = defineProps(['show', 'product', 'smartStoreCategory'])
const emit = defineEmits(['update:show', 'result', 'close'])
const {show} = toRefs(props)
watch(show, val => {
  if (val && props.product) {
    loadSyncInfo()
  }
})

const syncLoading = ref(false)
const syncSelectedRowKeys = ref([])

function onSyncSelectChange(selectedRowKeys) {
  syncSelectedRowKeys.value = selectedRowKeys;
}

async function approvalCheck(market_id) {
  syncLoading.value = true;

  try {
    let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/approval_check", {
      market_id: market_id,
    });

    if (res.status !== "2000") {
      message.error(res.message);
      syncLoading.value = false;
      return false;
    }

    if (res.data !== undefined && res.data.length === 0) {
      message.error("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
      syncLoading.value = false;
      return false;
    }

    if (res.data.message !== undefined && res.data.message !== '') {
      message.warning(res.data.message);
      syncLoading.value = false;
      return false;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    let now_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    for (let i = 0; i < props.product.item_sync_market.length; i++) {
      if (props.product.item_sync_market[i].market_id === market_id) {
        props.product.item_sync_market[i].upd_time = now_time;
        props.product.item_sync_market[i].status = res.data.status;
        props.product.item_sync_market[i].result = res.data.result;
        props.product.item_sync_date = now_time;
        props.product.item_sync_status = res.data.status === 'success';
        props.product.item_sync_result = res.data.result;
      }
    }

    syncLoading.value = false;

    return true;
  } catch (e) {
    message.error(e.message);
    syncLoading.value = false;
    return false;
  }
}

function closeModal() {
  emit('update:show', false)
  emit('close')
}

async function sendMarket() {
  const productList = [props.product]

  let accountList = syncSelectedRowKeys.value.map(index => props.product.item_sync_market[index])
  if (! ServiceProduct.checkBeforeSendMarket(productList, accountList, props.smartStoreCategory)) {
    return
  }

  syncLoading.value = true
  const result = await ServiceProduct.sendMarket(productList, accountList, props.smartStoreCategory)
  if (result !== false) {
    emit('result', result)
    closeModal()
  }
  syncLoading.value = false
}

async function loadSyncInfo() {
  let syncMarkets = []
  try {
    const res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/get_sync_market", {
      'prd_id': props.product.item_id
    });

    if (res.status !== "2000") {
      message.error(res.message);
      closeModal()
    }

    syncMarkets = res.data;
  } catch (e) {
    message.error("등록상태 조회실패 하였습니다.");
    closeModal()
  }

  syncSelectedRowKeys.value = []
  for (let i = 0; i < props.product.item_sync_market.length; i++) {
    const foundItem = syncMarkets.find(
      item => (
        item.market_code === props.product.item_sync_market[i].market_code
        && item.market_account === props.product.item_sync_market[i].seller_id
      ));
    if (foundItem) {
      props.product.item_sync_market[i].marker_id = foundItem.id;
      props.product.item_sync_market[i].status = foundItem.status;
      props.product.item_sync_market[i].result = foundItem.result;
    }

    props.product.item_sync_market[i].key = i;
    let isChecked = false;
    if (props.product.item_sync_market[i].status !== "unsync") {
      isChecked = true;
      syncSelectedRowKeys.value.push(i)
    }
  }
}

</script>
<style>
.ant-table-thead th {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
<style scoped>
.market-code {
  position: relative;
}

.market-code .anticon{
  position:absolute;
  top:-1px;
  right:27px;
  opacity:0.5;
}

</style>