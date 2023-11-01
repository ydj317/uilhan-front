<template>
  <a-card title="주문관리">
    <template #extra>
      <a-button class="ml10" @click.prevent="handleCollect">
        <template #icon>
          <FileSyncOutlined />
        </template>
        주문수집
      </a-button>
    </template>
    <div id="header">
      <a-descriptions bordered :column="1" size="middle">
        <a-descriptions-item label="검색기간">
          <a-input-group compact>
            <a-space direction="vertical" :size="12">
                <a-range-picker v-model:value="state.order_date" @change="onChangeDatePicker" />
            </a-space>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="계정">
          <a-input-group compact style="display: flex;">
            <a-select v-model:value="state.tableData.params.account_ids" mode="multiple" style="width: 100%" placeholder="계정 선택">
              <a-select-option v-for="value in state.accountData" :value="value.value" :label="value.value">
                <img :src="getLogoSrc(value.marketCode)" style="width: 18px; height: 18px;" />&nbsp;&nbsp;{{ value.sellerId }}
              </a-select-option>
            </a-select>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="검색어">
          <a-input-group compact style="display: flex;">
            <a-select v-model:value="state.tableData.params.search_type" style="width: 100px;">
              <a-select-option value="order_no">주문번호</a-select-option>
              <a-select-option value="item_no">품주번호</a-select-option>
              <a-select-option value="prd_code">상품번호</a-select-option>
              <a-select-option value="prd_name">상품명</a-select-option>
              <a-select-option value="prd_option_no">옵션번호</a-select-option>
              <a-select-option value="prd_option_name">옵션명</a-select-option>
              <a-select-option value="orderer_name">주문자</a-select-option>
              <a-select-option value="receiver_name">수취인</a-select-option>
            </a-select>
            <a-input v-model:value="state.tableData.params.search_value" style="width: 300px;" allowClear />
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문상태">
          <a-space>
          <a-radio-group v-model:value="state.tableData.params.status" button-style="solid" @change="handleStatusChange">
            <a-radio-button v-for="option in state.orderStatus" :value="option.value">{{ option.label }}</a-radio-button>
          </a-radio-group>

          <a-radio-group v-model:value="state.tableData.params.status" button-style="solid" @change="handleStatusChange">
            <a-radio-button v-for="option in state.claimStatus" :value="option.value">{{ option.label }}</a-radio-button>
          </a-radio-group>
          </a-space>
        </a-descriptions-item>

      </a-descriptions>

      <div style="display: flex;justify-content: center;">
        <a-button type="primary" @click.prevent="handleSearch" class="mt15">검색</a-button>
        <a-button @click="getTableData" class="ml15 mt15">초기화</a-button>
      </div>
    </div>
  </a-card>

  <a-card class="mt15">
    <div class="mb15" style="display: flex;justify-content: space-between;">
      <div class="left-div">
        <a-space>
          <a-button @click.prevent="receiverOrderSelected" v-if="state.tableData.params.status === 'paid'">
            <template #icon>
              <ContainerOutlined />
            </template>
            발주처리
          </a-button>
        </a-space>
      </div>
      <div class="right-div" style="display: flex;align-items: center;">
        <a-tooltip>
          <template #title>EXCEL 다운로드</template>
          <a-button @click.prevent="excelDownload">
            <template #icon>
              <DownloadOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
      :pagination="false" :defaultExpandAllRows="true" size="small">
      <a-table-column :width="200" title="마켓" dataIndex="id" key="id">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column; align-items: center;gap: 5px;">
            <img :src="getLogoSrc(record.marketCode)" style="width: 18px;height: 18px;cursor: pointer;" @click="handleOpenMarketProduct({ marketCode: record.marketCode, prdCode: record.prdCode, marketData: record.marketData})"/>
            {{ record.sellerId }}
          </div>
        </template>
      </a-table-column>
      <a-table-column :width="160" title="주문번호" dataIndex="orderNo" key="orderNo" />
      <a-table-column :width="120" title="주문시간" dataIndex="orderDate" key="orderDate">
        <template #default="{ record }">
          {{ moment(record.orderDate).format('YYYY-MM-DD')}}
        </template>
      </a-table-column>
      <a-table-column :width="120" title="원본상품" dataIndex="prdCode" key="prdCode" >
        <template #default="{ record }">
          <a-space>
            <a-button type="link" size="small" @click.prevent="purchaseProduct(record)">
              <template #icon>
                <ExportOutlined />
              </template>
              열기
            </a-button>
          </a-space>
        </template>
      </a-table-column>
      <a-table-column title="상품명" dataIndex="prdName" key="prdName">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column;gap: 10px;">
            <div>{{ record.prdName }}</div>
            <div>{{ record.prdOptionName }}</div>
          </div>
        </template>
      </a-table-column>
      <a-table-column :width="80" title="수량" dataIndex="quantity" key="quantity">
        <template #default="{ record }">
          <span v-if="Object.keys(state.orderStatus).length > 0 && Object.keys(state.orderStatus).includes(state.tableData.params.status)">{{ record.quantity - record.claimQuantity }}</span>
          <span v-else>{{ record.quantity }}</span>
        </template>
      </a-table-column>
      <a-table-column :width="130" title="최종결제 금액" dataIndex="totalPaymentAmount" key="totalPaymentAmount"  v-if="!Object.keys(state.claimStatusData).includes(state.tableData.params.status)"/>
      <a-table-column :width="80" title="상태">
        <template #default="{ record }">
          {{ state.allStatus.filter(it => it.value === record.status)[0].label }}
        </template>
      </a-table-column>

      <a-table-column :width="100" title="운송장정보" dataIndex="invoiceNumber" key="invoiceNumber"
                      v-if="state.tableData.params.status !== 'paid'">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column;gap: 5px;"
               v-if="state.tableData.params.status === 'shippingAddress'">
            <a-select v-model:value="state.courierNameValues[record.id]" placeholder="택배사를 선택해주세요.">
              <a-select-option :value="key" :key="key" v-for="(company, key) in state.marketDeliveryCompany[record.marketCode]">
                {{ company }}
              </a-select-option>
            </a-select>
            <a-input v-model:value="state.invoiceNumberValues[record.id]" />
          </div>
          <div v-else>
            {{ record.courierName }} - {{ record.invoiceNumber }}
          </div>

        </template>
      </a-table-column>

      <a-table-column title="" dataIndex="manage" key="manage" v-if="!Object.keys(state.claimStatusData).includes(state.tableData.params.status)">
        <template #default="{ record }">
          <div style="display: grid;">
            <a-space>
              <RouterLink :to="`/order/info/${record['id']}`" v-if="record['id']">
                <a-button size="small">상세</a-button>
              </RouterLink>
              <a-button type="primary" size="small" v-if="state.tableData.params.status === 'paid'"
                        @click.prevent="receiverOneOrder(record.id)">발주</a-button>
              <a-button type="info" size="small" v-if="state.tableData.params.status === 'shippingAddress'"
                        @click.prevent="deliveryOrder(record.id)">배송</a-button>
            </a-space>
          </div>
        </template>
      </a-table-column>
    </a-table>
  </a-card>
  <HistoryView :visible="historyVisible" @close="historyVisible = false" :historyData="historyData" />
</template>

<script setup>

import {onMounted, reactive, ref} from 'vue'
import {useMarketAccountApi} from "@/api/marketAccount";
import {useMarketOrderApi} from '@/api/order'
import {useMarketApi} from '@/api/market'
import moment from "moment";
import {message} from 'ant-design-vue'
import HistoryView from '@/components/HistoryView.vue'
import {ContainerOutlined, DownloadOutlined, ExportOutlined, FileSyncOutlined} from '@ant-design/icons-vue';


const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    params: {
      order_date: [moment().subtract(15, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      account_ids: [],
      search_type: 'order_no',
      search_value: '',
      status: 'paid',
    },
  },
  accountData: {},
  order_date: [moment().subtract(15, 'days'), moment()],
  orderStatus: [],
  claimStatus: [],
  allStatus: [],
  claimStatusData: [],
  courierNameValues: {},
  invoiceNumberValues: {},
  marketDeliveryCompany: {},
  marketDetailUrls: {},
});

// 검색기간
const onChangeDatePicker = (value, dateString) => {
  state.tableData.params.order_date = [dateString[0], dateString[1]];
}

// 계정리스트
const getAccountData = async () => {
  state.tableData.loading = true;
  await useMarketAccountApi().getAccountList({
    'page': 'all',
    'is_use': '1',
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.tableData.loading = false;
      return false;
    }

    res.data.list.forEach((item) => {
      state.tableData.params.account_ids.push(item.id);
      item['value'] = item.id;
      state.accountData[item.key] = item;
    })

    state.tableData.loading = false;
  });
}

// 주문 리스트
const getTableData = async () => {
  state.tableData.loading = true;
  await useMarketOrderApi().getOrderList(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.tableData.loading = false;
      return false;
    }

    state.tableData.data = res.data;
    state.tableData.total = res.data.length;
    state.tableData.loading = false;
  });
}

// 주문 상태 리스트
const getMarketStatusList = async () => {
  await useMarketApi().getMarketOrderStatusList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const statusObject = res.data;
    state.orderStatus = Object.keys(statusObject).map((item, index) => {
      return {
        label: statusObject[item],
        value: item,
      }
    });
  });
}

// 주문 상태 리스트
const getMarketClaimStatusList = async () => {
  await useMarketApi().getMarketClaimStatusList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    console.log(res.data);
    state.claimStatusData = res.data;
    state.claimStatus = Object.keys(state.claimStatusData).map((item, index) => {
      return {
        label: state.claimStatusData[item],
        value: item,
      }
    });
  });
}

// 주문 선택
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys;
  },
});

const handleStatusChange = (e) => {
  rowSelection.value.selectedRowKeys = [];
  if (state.tableData.params.status === 'shippingAddress') {
    getMarketDeliveryCompany();
  }
  getTableData()
}

// 로고 이미지
const getLogoSrc = (marketCode) => {
  try {
    return require(`../../../assets/img/list/market-logo/${marketCode}.png`);
  } catch (error) {
    return "../../../assets/img/temp_image.png"
  }
}

/**
 * 선택발주처리
 */
const receiverOrderSelected = () => {
  const selectedRowKeys = rowSelection.value.selectedRowKeys;

  if (!selectedRowKeys) {
    message.error('발주처리할 주문을 선택해주세요.');
    return false;
  }

  receiverOrderApi(selectedRowKeys);
}

// 발주처리
const receiverOrderApi = (ids) => {
  useMarketOrderApi().receiverOrder({
    ids
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success(res.data.message);
  });
}

const receiverOneOrder = (id) => {
  receiverOrderApi([id]);
}

// 배송처리
const deliveryOrder = (id) => {
  if (!state.courierNameValues[id]) {
    message.error('택배사를 선택해주세요.');
    return false;
  }

  if (!state.invoiceNumberValues[id]) {
    message.error('운송장번호를 입력해주세요.');
    return false;
  }

  useMarketOrderApi().deliveryOrder({
    id: id,
    courierName: state.courierNameValues[id],
    invoiceNumber: state.invoiceNumberValues[id]
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.data.message);
      return false;
    }

    message.success(res.data.message === '' ? '배송처리 성공 하었습니다.' : res.data.message);
  });
}

// 마켓 관리자 페이지 열기
const openMarketAdminPage = (marketCode) => {
  const url = state.marketAdminUrls[marketCode]['order'];
  if (!url) {
    message.error("마켓 관리자 페이지가 등록되지 않았습니다.");
    return false;
  }

  window.open(url);
}

// 마켓 관리자 페이지 URL
const getMarketAdminUrls = async () => {
  await useMarketApi().getMarketAdminUrls({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketAdminUrls = res.data;
  });
}

// 택배사 목록
const getMarketDeliveryCompany = () => {
  useMarketApi().getMarketDeliveryCompany({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketDeliveryCompany = res.data;
  });
}

// 구매 페이지 열기
const purchaseProduct = (item) => {
  if (!item.prdUrl) {
    message.error('구매 페이지가 등록되지 않았습니다.');
    return false;
  }
  window.open(item.prdUrl);
}

// 엑셀 다운로드
const excelDownload = () => {
  useMarketOrderApi().downloadOrder(state.tableData.params).then(res => {
    if (res === undefined) {
      message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
      return false;
    }
    // let blob = new Blob([res], { type: "charset=utf-8" });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'x-plan-order.xlsx'; // 파일 이름을 설정합니다.
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url);
    // document.body.removeChild(a);
    fetch(res.data.download_url)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'order'+ moment() +'.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        });

    //window.open(res.data.download_url)
  });
}

const handleSearch = () => {
  if (!state.tableData.params.order_date) {
    message.error('검색기간을 선택해주세요.');
    return false;
  }

  // state.tableData.params.order_date 30일 이상 검색 불가
  if (moment(state.tableData.params.order_date[1]).diff(moment(state.tableData.params.order_date[0]), 'days') > 30) {
    message.error('검색기간은 30일 이상 설정할 수 없습니다.');
    return false;
  }

  getTableData();
}

const handleCollect = () => {
  useMarketOrderApi().collectMarketOrder({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success('수집처리중 입니다. 잠시만 기다려 주세요.');
  });
}

const getMarketDetailUrls = () => {
  useMarketApi().getMarketDetailUrls({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.marketDetailUrls = res.data;
  });
}

const handleOpenMarketProduct = ({marketCode, prdCode, marketData}) => {
  let url = '';
  if (marketCode === 'smartstore') {
    if(!marketData.channel_info) {
      message.error("상품 상세 페이지가 등록되지 않았습니다.마켓계정관리에서 연동확인을 다시 해주세요.");
      return false;
    }
    url = marketData.channel_info.url + '/products/' + prdCode;
  } else {
    url = state.marketDetailUrls[marketCode] + prdCode;
  }

  if (!url) {
    message.error("상품 상세 페이지가 등록되지 않았습니다.");
    return false;
  }


  window.open(url);
}

const historyVisible = ref(false);
const historyData = ref({});

const showHistory = (param) => {

  historyData.value = param;
  historyVisible.value = true;
}

onMounted(async () => {
  await getMarketStatusList()
  await getMarketClaimStatusList()
  await getMarketAdminUrls()
  await getMarketDetailUrls()
  state.allStatus = [...state.orderStatus, ...state.claimStatus]
  await getAccountData()
  await getTableData()
})

</script>

<style scoped>
.order_status {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  cursor: pointer;
  border-radius: 0.5rem;
  border: 1px solid rgb(0 0 0 / 0.1);
  transition: all 0.3s ease-in-out;
}

.order_status:hover {
  /** box shadow */
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.order_status.active {
  background: linear-gradient(to bottom right, #359bfa, #1890ff);
  color: white;
  border-style: none;
}

.order_status.active:hover {
  /** box shadow */
  color: white;
  background: linear-gradient(to bottom right, #3885f8, #1e44ff);
}

</style>

<style>
#header .ant-picker-input input {
  text-align: center;
}
</style>