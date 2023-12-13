<template>
  <div style="display: flex; gap: 10px">
    <a-card title="택배사 입고 처리" style=" width: 40%">
      <div style=" width: 100%">
        <span>택배사 입고 처리 (스캔 총 {{}} 건))</span>
        <a-descriptions bordered :column="1" :labelStyle="{ width: '50px', height:'400px' }"
                        :contentStyle="{ width: '200px',height:'400px' }" size="small">
          <a-descriptions-item label="트래킹번호">
            <a-textarea
                :rows="15"
                v-model:value="state.invoiceNo"
            >

            </a-textarea>
            <a-button type="primary" @click.prevent="handleReceiving" class="mt15">확인</a-button>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
    <a-card title="택배사 입고 입력" style="width: 100%;flex: 1;">
      <div style="width: 100%;flex: 1;">
        <span>택배사 입고 입력</span>
        <div id="search-content">
          <a-descriptions bordered :column="2" size="small" :labelStyle="{ width: '120px' }">
            <a-descriptions-item label="입고일자">
              <template #label>
              </template>
              <a-space  :size="12">
                <a-input-group compact>

                  <a-range-picker
                      v-model:value="state.order_date"
                      @change="onChangeDatePicker"
                  />

                </a-input-group>
                <a-radio-group v-model:value="state.tableData.params.period" button-style="solid"
                               @change="handleDateChange">
                  <a-radio-button value="">전체</a-radio-button>
                </a-radio-group>

                <a-radio-group v-model:value="state.tableData.params.period" button-style="solid"
                               @change="handleDateChange">
                  <a-radio-button v-for="option in state.period" :value="option.value">{{
                      option.label
                    }}
                  </a-radio-button>
                </a-radio-group>
              </a-space>

            </a-descriptions-item>
          </a-descriptions>
          <div style="display: flex;justify-content: center;">
<!--            <a-button type="primary" @click.prevent="handleSearch" class="mt15">검색</a-button>-->
<!--            <a-button @click="getTableData" class="ml15 mt15">초기화</a-button>-->
          </div>

        </div>
        <a-table
            size="small"
            style="margin-top: 5px;"
            :columns="state.columns"
            :data-source="state.tableData.data"
        >
        </a-table>
      </div>
    </a-card>
  </div>

</template>

<script setup>

import {onMounted, reactive, ref} from 'vue'
import {useMarketApi} from '@/api/market'
import moment from "moment";
import {message} from 'ant-design-vue'
import "vue-loading-overlay/dist/vue-loading.css";

import {
  DownloadOutlined,
  UploadOutlined,
  ExportOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import {useUserApi} from "@/api/user";
import {useCustomOrderApi} from "@/api/customOrder";
import Cookie from "js-cookie";
import Loading from "vue-loading-overlay";
import {cloneDeep} from "lodash";

const state = reactive({
  columns: [
    {
      title: '입고시간',
      dataIndex: 'receiving_date',
      key: 'receiving_date',
    },
    {
      title: '트래킹번호',
      dataIndex: 'purchase_invoice_no',
      key: 'purchase_invoice_no',
    }
  ],
  tableData: {
    data: [],
    total: 0,
    loading: false,
    syncBridgeStatusLoading: false,
    params: {
      order_date: [moment().subtract(15, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      userinfo: []
    },
  },
  period: [
    {label: '오늘', value: 'today'},
    {label: '어제', value: 'yesterday'},
    {label: '이번주', value: 'this_week'},
    {label: '지난주', value: 'last_week'},
    {label: '이번달', value: 'this_month'},
    {label: '지난달', value: 'last_month'},
  ],

  order_date: [moment().subtract(15, 'days'), moment()],
  invoiceNo : ''

});

// 검색기간
const onChangeDatePicker = (value, dateString) => {
  state.tableData.params.order_date = [dateString[0], dateString[1]];
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

  console.log(startDate, endDate)

  if (startDate && endDate) {
    state.order_date = [startDate, endDate];
  } else {
    state.order_date = [];
  }
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
  await useCustomOrderApi().getDeliveryReceiptList(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.tableData.loading = false;
      return false;
    }

    state.tableData.data = res.data;
    state.tableData.loading = false;
  })
}

const handleReceiving = async () => {
  const params = {
    purchase_invoice_no: state.invoiceNo.split('\n')
  }

  await useCustomOrderApi().receiving(params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success(res.message);
    getTableData();
  })
} // 택배사 입고 처리

onMounted(async () => {
  await Promise.all([getUserInfoData()])
      .then(() => {
        getTableData()
      })
})

</script>

<style>

</style>