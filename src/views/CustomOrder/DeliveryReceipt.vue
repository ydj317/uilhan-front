<template>
  <loading v-model:active="state.indicator.loading" :can-cancel="false" :is-full-page="true"/>
  <div style="display: flex; gap: 10px;height:calc(100vh)">
    <a-card title="택배사 입고 처리" style=" width: 35%; ">
      <div style=" width: 100%">
        <div style="font-size: large">스캔 총 <span style="color: #1e44ff">{{ state.invoiceNo.split('\n').length }}</span>
          건
        </div>
        <a-descriptions bordered :column="1" :labelStyle="{ width: '50px' }"
                        :contentStyle="{ width: '200px',height:'400px' }" size="small">
          <a-descriptions-item label="트래킹번호">
            <a-textarea
                :rows="15"
                v-model:value="state.invoiceNo">
            </a-textarea>
          </a-descriptions-item>
        </a-descriptions>
        <div class="flexCenter">
          <a-button type="primary" @click.prevent="handleReceiving" class="mt15">확인</a-button>
        </div>
      </div>
    </a-card>
    <a-card title="택배사 입고 입력" style="width: 100%;flex: 1;">
      <div style="width: 100%;flex: 1;">
        <div>
          <a-descriptions bordered :column="2" size="small" :labelStyle="{ width: '120px' }">
            <a-descriptions-item label="입고일자">
              <template #label>
              </template>
              <a-space :size="12">
                <a-input-group compact>
                  <a-range-picker
                      v-model:value="state.order_date"
                      @change="onChangeDatePicker"
                  />
                </a-input-group>
                <a-radio-group v-model:value="state.tableData.params.period" button-style="solid"
                               @change="handleDateChange">
                  <a-radio-button v-for="option in state.period" :value="option.value">{{
                      option.label
                    }}
                  </a-radio-button>
                  <a-button style="margin-left: 5px" type="primary" @click.prevent="getTableData();">
                    <template #icon>
                      <search-outlined/>
                    </template>
                  </a-button>
                </a-radio-group>
              </a-space>
            </a-descriptions-item>
          </a-descriptions>
          <div style="margin-top: 10px">
            <a-button style="margin-left: 5px; margin-bottom: 5px; width: 140px" type="primary"
                      @click.prevent="receiptListExcelDownload">
              <template #icon>
                <ProfileOutlined/>
              </template>
              엑셀 다운로드
            </a-button>
          </div>
        </div>
        <a-table
            size="small"
            style="margin-top: 5px;"
            :columns="state.columns"
            :data-source="state.tableData.data"
            :loading="state.tableData.loading"
            :pagination="state.pagination"
            v-model:current="state.pagination.current"
            :defaultExpandAllRows="true" :scroll="{ x: 600, y: 600}"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.key === 'receipt_date'">
              <div v-if="record.pid === 0" style="color: red">
                {{ moment(record.receipt_date).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div v-else style="text-align: left">
                {{ moment(record.receipt_date).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
            <template v-if="column.key === 'purchase_invoice_no'">
              <div v-if="record.pid === 0" style="color: red">
                {{ record.purchase_invoice_no }}
              </div>
              <div v-else style="text-align: left">
                {{ record.purchase_invoice_no }}
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>

</template>

<script setup>

import {onMounted, reactive} from 'vue'
import moment from "moment";
import {message} from 'ant-design-vue'
import "vue-loading-overlay/dist/vue-loading.css";

import {
  ProfileOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';

import {useUserApi} from "@/api/user";
import {useCustomOrderApi} from "@/api/customOrder";
import Loading from "vue-loading-overlay";


const state = reactive({
  columns: [
    {
      title: '입고시간',
      dataIndex: 'receipt_date',
      key: 'receipt_date',
      width: 400,
    },
    {
      title: '트래킹번호',
      dataIndex: 'purchase_invoice_no',
      key: 'purchase_invoice_no',
    }
  ],
  tableData: {
    data: [],
    loading: false,
    syncBridgeStatusLoading: false,
    params: {
      order_date: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      userinfo: [],
      period: 'today',
    },
  },
  period: [
    {label: '전체', value: 'all'},
    {label: '오늘', value: 'today'},
    {label: '어제', value: 'yesterday'},
    {label: '이번주', value: 'this_week'},
    {label: '지난주', value: 'last_week'},
    {label: '이번달', value: 'this_month'},
    {label: '지난달', value: 'last_month'},
  ],

  indicator: {
    loading: false
  },

  order_date: [moment(), moment()],
  invoiceNo: '',
  pagination: {
    size: 'middle',
    position: ['bottomLeft'],
    defaultCurrent: 1,
    defaultPageSize: 10,
    pageSizeOptions: ['10', '30', '50', '100'],
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `검색된 ${total} 건 중 ${range[0]} - ${range[1]} 건`,
  },

});

// 검색기간
const onChangeDatePicker = (value, dateString) => {
  state.tableData.params.order_date = [dateString[0], dateString[1]];
  if (state.tableData.params.order_date[0] === '' || state.tableData.params.order_date[1] === '') {
    state.tableData.params.period = 'all';
  } else {
    state.tableData.params.period = '';
  }
  getTableData();
}

const handleDateChange = (event) => {
  const value = event.target.value;
  let startDate, endDate;

  // 날짜 설정
  const today = moment();
  const yesterday = moment().subtract(1, 'days');
  const startOfThisWeek = moment().startOf('week');
  const endOfThisWeek = moment().endOf('week');
  const startOfLastWeek = moment().subtract(1, 'week').startOf('week');
  const endOfLastWeek = moment().subtract(1, 'week').endOf('week');
  const startOfThisMonth = moment().startOf('month');
  const endOfThisMonth = moment().endOf('month');
  const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
  const endOfLastMonth = moment().subtract(1, 'month').endOf('month');

  switch (state.tableData.params.period) {
    case 'today':
      startDate = today;
      endDate = today;
      break;
    case 'yesterday':
      startDate = yesterday;
      endDate = yesterday;
      break;
    case 'this_week':
      startDate = startOfThisWeek;
      endDate = endOfThisWeek;
      break;
    case 'last_week':
      startDate = startOfLastWeek;
      endDate = endOfLastWeek;
      break;
    case 'this_month':
      startDate = startOfThisMonth;
      endDate = endOfThisMonth;
      break;
    case 'last_month':
      startDate = startOfLastMonth;
      endDate = endOfLastMonth;
      break;
    default:
      startDate = null;
      endDate = null;
  }
  if (startDate && endDate) {
    state.order_date = [startDate, endDate];
    state.tableData.params.order_date = [moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD')];
  } else {
    state.order_date = [];
    state.tableData.params.order_date = [];
  }

  getTableData();
}

const getUserInfoData = async () => {
  try {
    await useUserApi().getUserInfoData({}).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
    });
  } catch (error) {
    message.error(error.message);
    return false;
  }
}

// 주문 리스트
const getTableData = async () => {
  state.tableData.loading = true;
  await useCustomOrderApi().getCustomOrderReceiptList(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.indicator.loading = false;
      state.tableData.loading = false;
      return false;
    }

    state.tableData.data = res.data;
    state.pagination.total = res.data.length;
    state.tableData.loading = false;
    state.indicator.loading = false;
  })
}
// 택배사 입고 처리
const handleReceiving = async () => {

  if (state.invoiceNo.trim() === '') {
    message.error('트래킹번호를 입력해주세요.');
    return false;
  }
  state.indicator.loading = true;
  await useCustomOrderApi().setWaitWarehouse(state.invoiceNo.split('\n')).then(res => {
    if (res.status !== "2000") {
      state.indicator.loading = false;
      message.error(res.message);
      return false;
    }

    message.success(res.message);
    getTableData();

  })
}

const receiptListExcelDownload = async () => {
  state.indicator.loading = true;

  if (state.tableData.data.length === 0) {
    state.indicator.loading = false;
    message.error('엑셀 다운로드 할 데이터가 없습니다.');
    return false;
  }

  await useCustomOrderApi().downloadCustomOrderReceiptList(state.tableData.data).then(res => {
    if (res === undefined || res.status !== "2000") {
      state.indicator.loading = false;
      message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
      return false;
    }

    state.indicator.loading = false;
    window.open(res.data.download_url, "_blank");
  })

}

onMounted(async () => {
  await Promise.all([getUserInfoData()])
      .then(() => {
        getTableData()
      })
})

</script>

<style>
.flexCenter {
  display: flex;
  justify-content: center; /* 水平居中 */
}
</style>