<template>
  <a-card title="클레임관리">
    <template #extra>
      <a-button class="ml10" @click="handleCollect">
        <template #icon>
          <FileSyncOutlined />
        </template>
        주문수집
      </a-button>
    </template>
    <div>
      <a-descriptions bordered :column="1" size="middle">
        <a-descriptions-item label="검색기간">
          <a-input-group compact>
            <a-space direction="vertical" :size="12">
              <a-range-picker v-model:value="state.tableData.params.paid_date" :showTime="false" picker="date" />
            </a-space>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문번호">
          <a-input-group compact style="display: flex;">
            <a-select v-model:value="state.tableData.params.order_type" style="width: 100px;">
              <a-select-option value="oid">주문번호</a-select-option>
            </a-select>
            <a-input v-model:value="state.tableData.params.order_value" style="width: 300px;" allowClear />
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="반품자">
          <a-input-group compact>
            <a-input-group compact>
              <a-select v-model:value="state.tableData.params.orderer_type" style="width: 100px;">
                <a-select-option value="rname">반품자</a-select-option>
              </a-select>
              <a-input v-model:value="state.tableData.params.orderer_value" style="width: 300px;" allowClear />
            </a-input-group>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문상태">
          <a-radio-group v-model:value="state.tableData.params.status" button-style="solid" @change="handleStatusChange">
            <a-radio-button v-for="option in state.orderStatus" :value="option.value">{{ option.label
            }}</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>

      </a-descriptions>

      <div style="display: flex;justify-content: center;">
        <a-button type="primary" @click="handleSearch" class="mt15">검색</a-button>
        <a-button @click="getTableData" class="ml15 mt15">초기화</a-button>
      </div>
    </div>
  </a-card>

  <a-card class="mt15">

    <div class="mb15" style="display: flex;justify-content: space-between;">
      <div class="left-div">
        <a-space>
        </a-space>
      </div>
      <div class="right-div" style="display: flex;align-items: center;">
        <a-tooltip>
          <template #title>EXCEL 다운로드</template>
          <a-button @click="excelDownload">
            <template #icon>
              <DownloadOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
      :pagination="false" :defaultExpandAllRows="true">
      <a-table-column title="마켓" dataIndex="id" key="id">
        <template #default="{ record }">
          <div style="display: flex;align-items: center;gap: 5px;" v-if="record.market_code">
            <img :src="getLogoSrc(record.market_code)" style="width: 18px;height: 18px;" />
            {{ record.seller_id }}
          </div>
        </template>
      </a-table-column>
      <a-table-column title="주문번호" dataIndex="order_no" key="order_no"></a-table-column>
      <a-table-column title="클레임요청시간" dataIndex="claim_date" key="claim_date"></a-table-column>
      <a-table-column title="" dataIndex="manage" key="manage">
        <template #default="{ record }">
          <div style="display: grid;">
            <a-space>
              <RouterLink :to="`/claim/info/${record['id']}`" v-if="record['id']">
                <a-button size="small">상세</a-button>
              </RouterLink>

              <a-button size="small" type="primary" @click="openMarketAdminPage(record.market_code)">마켓바로가기</a-button>
            </a-space>
          </div>
        </template>
      </a-table-column>
      <template #expandedRowRender="scoped" style="padding:0">
        <div>
          <a-table :data-source="scoped.record.claimItems" :pagination="false" size="small"
            :row-selection="rowItemSelection" :showHeader="true" style="padding: 0;" bordered>
            <a-table-column title="이미지" dataIndex="prd_image" key="prd_image" :width="50">
              <template #default="{ record }">
                <a-image :src="record.prd_image"
                  fallback="data:image/png;base64,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"
                  style="width: 50px;height: 50px;border-radius: 5px;" />
              </template>
            </a-table-column>
            <a-table-column title="상품명" dataIndex="prd_name" key="prd_name" />
            <a-table-column title="옵션명" dataIndex="prd_option_name" key="prd_option_name" :width="240" />
            <a-table-column title="수량" dataIndex="quantity" key="quantity" :width="100">
              <template #default="{ record }">
                <span>{{ record.quantity }}</span>
                <span style="color: red;" v-if="record.is_cancel === '1'">(반품철회)</span>
              </template>
            </a-table-column>
            <a-table-column title="반품자" dataIndex="returner_name" key="returner_name" :width="100" />
          </a-table>
        </div>
      </template>
    </a-table>

  </a-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useMarketOrderApi } from '@/api/order'
import { useMarketApi } from '@/api/market'
import table2excel from 'js-table2excel';
import moment from "moment";
import { message } from 'ant-design-vue'
import { DownloadOutlined, FileSyncOutlined, PlusOutlined, ContainerOutlined } from '@ant-design/icons-vue';


const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    params: {
      paid_date: [moment().subtract(15, 'days'), moment()],
      order_type: 'oid',
      order_value: '',
      orderer_type: 'rname',
      orderer_value: '',
      market_code: '',
      status: 'cancelComplete',
      page: 1,
      pageSize: 20,
    },
  },
  orderStatus: [],
  courierNameValues: {},
  invoiceNumberValues: {},
  marketAdminUrls: {},
});

// 주문 리스트
const getTableData = () => {

  useMarketOrderApi().getClaimList(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const { list, total } = res.data

    state.tableData.data = list;
    state.tableData.total = total;

  });
}

// 주문 상태 리스트
const getMarketStatusList = () => {
  useMarketApi().getMarketClaimStatusList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const statusObject = res.data;
    const options = Object.keys(res.data).map((item, index) => {
      return {
        label: statusObject[item],
        value: item,
      }
    })

    state.orderStatus = options;
  });
}

// 상품 선택
const rowItemSelection = ref({
  columnTitle: '선택',
  checkStrictly: false,
  selectedRowKeys: [],
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.value.selectedRowKeys = selectedRows.map(row => row.order_id);
    rowItemSelection.value.selectedRowKeys = selectedRowKeys

  },
});

// 주문 선택
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.value.selectedRowKeys = selectedRows.map(row => row.key);
    rowItemSelection.value.selectedRowKeys = selectedRows.flatMap(row => row.claimItems.map(item => item.key));
  },
});

const handleStatusChange = (e) => {
  getTableData()
}
const pageChangeHandler = (page) => {
  state.tableData.params.page = page;
  getTableData();
}

// 로고 이미지
const getLogoSrc = (marketCode) => {
  try {
    return require(`../../../assets/img/list/market-logo/${marketCode}.png`);
  } catch (error) {
    return "../../../assets/img/temp_image.png"
  }
}

// 마켓 클레임 관리자 페이지
const openMarketAdminPage = (marketCode) => {
  const url = state.marketAdminUrls[marketCode]['return'];
  if (!url) {
    message.error("마켓 관리자 페이지가 등록되지 않았습니다.");
    return false;
  }

  window.open(url);
}

// 마켓 관리자 페이지 URL
const getMarketAdminUrls = () => {
  useMarketApi().getMarketAdminUrls({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketAdminUrls = res.data;
  });
}

// 엑셀 다운로드
const excelDownload = () => {
  const header = [
    { title: '주문번호', key: 'order_no' },
    { title: '셀러ID', key: 'seller_id' },
    { title: '클레임번호', key: 'claim_no' },
    { title: '클레임사유', key: 'claim_message' },
    { title: '클레임사유상세', key: 'claim_detail' },
    { title: '클레임요청시간', key: 'claim_date' },
    { title: '상태', key: 'status' },
    { title: '상품코드', key: 'prd_code' },
    { title: '상품명', key: 'prd_name' },
    { title: '옵션NO', key: 'prd_option_no' },
    { title: '옵션명', key: 'prd_option_name' },
    { title: '이미지', key: 'prd_image' },
    { title: '수량', key: 'quantity' },
    { title: '반품자', key: 'returner_name' },
    { title: '택배사', key: 'courier_name' },
    { title: '송장번호', key: 'invoice_number' },
    { title: '수집날자', key: 'ins_date' },
    { title: '업데이트날자', key: 'upd_date' },
  ]

  const excelData = [];

  state.tableData.data.forEach(order => {
    order.claimItems.forEach(item => {
      const status = state.orderStatus.filter(it => it.value === item.status);
      excelData.push({
        order_no: order.order_no,
        seller_id: order.seller_id,
        claim_no: item.claim_no,
        claim_message: item.claim_message || '',
        claim_detail: item.claim_detail,
        claim_date: order.claim_date,
        status: status[0].label,
        prd_code: item.prd_code,
        prd_name: item.prd_name,
        prd_option_no: item.prd_option_no,
        prd_option_name: item.prd_option_name,
        prd_image: item.prd_image,
        quantity: item.quantity,
        returner_name: item.returner_name,
        courier_name: item.courier_name,
        invoice_number: item.invoice_number,
        ins_date: item.item_ins_date,
        upd_date: item.item_upd_date,
      })
    })
  });

  table2excel(header, excelData, `x-plan-claim ${new Date().toLocaleString()}`);
}

// 검색
const handleSearch = () => {

  if (!state.tableData.params.paid_date) {
    message.error('검색기간을 선택해주세요.');
    return false;
  }

  // state.tableData.params.paid_date 30일 이상 검색 불가
  const diff = moment(state.tableData.params.paid_date[1]).diff(moment(state.tableData.params.paid_date[0]), 'days');

  if (diff > 30) {
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

onMounted(() => {
  getMarketStatusList();
  getMarketAdminUrls();
  getTableData()
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