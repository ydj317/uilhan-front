<template>
  <loading v-model:active="state.indicator.loading" :can-cancel="false" :is-full-page="true"/>
  <div style="display: flex; gap: 10px;height:calc(100vh)">
    <a-card title="출고처리" style=" width: 38%; ">
      <div style=" width: 100%">
        <a-descriptions bordered :column="1" :labelStyle="{ width: '50px' }"
                        :contentStyle="{ width: '200px',height:'50px' }" size="small">
          <a-descriptions-item label="출고스캔">
            <a-input
                :rows="5"
                @keyup.enter="inputShippingData"
                v-model:value="state.beforeShipTable.barcode">
            </a-input>
          </a-descriptions-item>
        </a-descriptions>

        <div>
          <div style="margin-top: 10px">
            <a-upload
                :action="state.getBarcodeExcelData"
                v-model:fileList="state.fileList"
                name="file"
                :max-count="1"
                :headers="state.headers"
                :multiple="false"
                :showUploadList="false"
                @change="excelUploadBarcode"
            >
              <a-button class="custom-button" style="margin-right: 5px;" type="primary">
                바코드 엑셀 업로드
                <template #icon>
                  <UploadOutlined/>
                </template>
              </a-button>
              <a-spin v-if="state.indicator.upload"/>
            </a-upload>
            <a-button style="margin-left: 5px; margin-bottom: 5px; width:150px" type="primary"
                      @click.prevent="setShipping">
              <template #icon>
                <CodeSandboxOutlined />
              </template>
              출고완료 처리
            </a-button>
          </div>

          <a-table
              size="small"
              style="margin-top: 5px;"
              :columns="state.beforeShipColumns"
              :data-source="state.beforeShipTable.data"
              :loading="state.beforeShipTable.loading"
              :pagination="state.beforeShipPagination"
              v-model:current="state.beforeShipPagination.current"
              :defaultExpandAllRows="true" :scroll="{ y: 700}"
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.key === 'barcode'">
                <div v-if="record.id === '' " style="color: red">
                  {{ record.barcode }}
                </div>
                <div v-else style="text-align: left">
                  {{ record.barcode }}
                </div>
              </template>
              <template v-if="column.key === 'quantity'">
                <div v-if="record.id === '' " style="color: red">
                  {{ record.quantity }}
                </div>
                <div v-else style="text-align: left">
                  {{ record.quantity }}
                </div>
              </template>
            </template>
          </a-table>
        </div>

      </div>
    </a-card>
    <a-card title="출고이력" style="width: 100%;flex: 1;">
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
                <a-radio-group v-model:value="state.shipmentTable.params.period" button-style="solid"
                               @change="handleDateChange">
                  <a-radio-button v-for="option in state.period" :value="option.value">{{
                      option.label
                    }}
                  </a-radio-button>
                  <a-button style="margin-left: 5px" type="primary" @click.prevent="getShipmentTableData();">
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
                      @click.prevent="downloadSearchItemsExcel">
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
            :data-source="state.shipmentTable.data"
            :loading="state.shipmentTable.loading"
            :pagination="state.shipmentPagination"
            v-model:current="state.shipmentPagination.current"
            :defaultExpandAllRows="true" :scroll="{ x: 600, y: 700}"
        >
          <a-table-column :width="160" title="출고이력">
            <template #default="{ record }">
              <div>
                <span>{{  moment(record.ins_date).format('YYYY년 MM월 DD일 HH시 mm분') }} : {{ record.total_quantity}} 건 출고완료</span>
                <span style="margin-left: 10px;">
                  <a-button size="small" @click="downloadGroupItemsExcel(record)">
                    <template #icon>
                      <ProfileOutlined/>
                    </template>
                  </a-button>
                </span>
              </div>
            </template>
          </a-table-column>
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
  CodeSandboxOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue';

import {useUserApi} from "@/api/user";
import {useCustomOrderApi} from "@/api/customOrder";
import Loading from "vue-loading-overlay";
import Cookie from "js-cookie";
import {cloneDeep} from "lodash";

const state = reactive({
  shipmentColumns: [
    {
      title: '출고완료 기록',
      dataIndex: 'list',
      key: 'list',
    },
  ],

  beforeShipColumns : [
    {
      title: '바코드',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 300,
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    }
  ],
  shipmentTable: {
    data: [],
    loading: false,
    params: {
      order_date: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      userinfo: [],
      period: 'today',
    },
  },
  beforeShipTable: {
    data: [],
    loading: false,
    barcode: '',
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
  shipmentPagination: {
    onShowSizeChange: (current, pageSize) => {
      state.shipmentPagination.current = 1;
      state.shipmentPagination.pageSize = pageSize;
      getShipmentTableData();
    },

    onChange: (page, pageSize) => {
      state.shipmentPagination.current = page;
      state.shipmentPagination.pageSize = pageSize;
      getShipmentTableData();
    },
    size: 'middle',
    position: ['bottomLeft'],
    current: 1,
    pageSize: 10,
    defaultPageSize: 10,
    pageSizeOptions: ['10', '50', '100', '500', '1000', '1500' , '2000'],
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `검색된 ${total} 건 중 ${range[0]} - ${range[1]} 건`,
  },

  beforeShipPagination: {
    size: 'middle',
    position: ['bottomLeft'],
    defaultCurrent: 1,
    defaultPageSize: 10,
    pageSizeOptions: ['10', '30', '50', '100', '200'],
    total: 0,
    showSizeChanger: true,
    showTotal: (total, range) => `검색된 ${total} 건 중 ${range[0]} - ${range[1]} 건`,
  },

  // 업로드 관련
  getBarcodeExcelData: process.env.VUE_APP_API_URL + "/api/custom/order/shipmentItem/getExcelData",
  fileList: [],
  headers: reactive({
    token: Cookie.get("token")
  }),

});

// 검색기간
const onChangeDatePicker = (value, dateString) => {
  state.shipmentTable.params.order_date = [dateString[0], dateString[1]];
  if (state.shipmentTable.params.order_date[0] === '' || state.shipmentTable.params.order_date[1] === '') {
    state.shipmentTable.params.period = 'all';
  } else {
    state.shipmentTable.params.period = '';
  }

  state.shipmentPagination.current = 1;
  getShipmentTableData();
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

  switch (state.shipmentTable.params.period) {
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
    state.shipmentTable.params.order_date = [moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD')];
  } else {
    state.order_date = [];
    state.shipmentTable.params.order_date = [];
  }

  state.shipmentPagination.current = 1;
  getShipmentTableData();
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
const getShipmentTableData = async () => {
  state.shipmentTable.loading = true;
  let params = cloneDeep(state.shipmentTable.params);
  params.limit = parseInt(state.shipmentPagination.pageSize);
  params.offset = (parseInt(state.shipmentPagination.current) - 1) * parseInt(state.shipmentPagination.pageSize);
  await useCustomOrderApi().getShipmentGroupList(params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.indicator.loading = false;
      state.shipmentTable.loading = false;
      return false;
    }

    state.shipmentTable.data = res.data.list;
    state.shipmentPagination.total = res.data.totalCount;
    state.shipmentTable.loading = false;
    state.indicator.loading = false;

  })
}
// 스캔한 바코드를 테이플 데이타에 입력
const inputShippingData = async () => {

  if (state.beforeShipTable.barcode.trim() === '') {
    message.error('트래킹번호를 입력해주세요.');
    return false;
  }

  state.beforeShipTable.data.unshift({
    barcode: state.beforeShipTable.barcode.trim(),
    quantity: 1,
  });

  state.beforeShipTable.barcode = '';
}

// 출고완료 처리
const setShipping = async () => {
  state.indicator.loading = true;

  if (state.beforeShipTable.data.length === 0) {
    state.indicator.loading = false;
    message.error('출고처리 할 데이터가 없습니다.');
    return false;
  }

  await useCustomOrderApi().addShipment(state.beforeShipTable.data).then(res => {
    if (res.status !== "2000") {
      state.indicator.loading = false;
      message.error(res.message);
      return false;
    }

    state.indicator.loading = false;
    message.success(res.message);
    state.beforeShipTable.data = [];

    state.shipmentPagination.current = 1;
    getShipmentTableData();
  })
}

// 출고이력에 그룹별 엑셀 다운로드
const downloadGroupItemsExcel = async (record) => {
  // state.indicator.loading = true;

  if (record.id === '') {
    state.indicator.loading = false;
    message.error('출고처리 할 데이터가 없습니다.');
    return false;
  }

  await useCustomOrderApi().downloadGroupItemsExcel(record).then(res => {
    if (res === undefined || res.status !== "2000") {
      state.indicator.loading = false;
      message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
      return false;
    }

    let downloadElement = document.createElement("a");
    let url = window.URL || window.webkitURL || window.moxURL;
    let timeStamp = new Date().getTime(); // 创建一个时间戳
    let formattedDate = moment(record.ins_date).format('YYYY년 MM월 DD일 HH시 mm분');
    let fileName = decodeURI('shipment-items' + formattedDate + '.xlsx');
    let href = process.env.VUE_APP_API_URL + '/uploads/shipment-items.xlsx?t=' + timeStamp;
    downloadElement.href = href;
    downloadElement.download = fileName; // 设置下载文件名
    document.body.appendChild(downloadElement);
    state.indicator.loading = false;
    downloadElement.click(); // 触发下载
    document.body.removeChild(downloadElement); // 下载后移除元素
    url.revokeObjectURL(href);

  })

}

const downloadSearchItemsExcel = async () => {
  state.indicator.loading = true;
  await useCustomOrderApi().downloadSearchItemsExcel(state.shipmentTable.params).then(res => {
    console.log(res)

    if (res === undefined || res.status !== "2000") {
      state.indicator.loading = false;
      message.error(res.message);
      return false;
    }

    let downloadElement = document.createElement("a");
    let url = window.URL || window.webkitURL || window.moxURL;
    let timeStamp = new Date().getTime(); // 创建一个时间戳
    let fileName = decodeURI('search-shipment-items.xlsx');
    let href = process.env.VUE_APP_API_URL + '/uploads/search-shipment-items.xlsx?t=' + timeStamp;
    downloadElement.href = href;
    downloadElement.download = fileName; // 设置下载文件名
    document.body.appendChild(downloadElement);
    state.indicator.loading = false;
    downloadElement.click(); // 触发下载
    document.body.removeChild(downloadElement); // 下载后移除元素
    url.revokeObjectURL(href);
  })

}

const excelUploadBarcode = async (res) => {
  if (res.file.status === 'uploading') {
    state.indicator.upload = true;
    return false;
  }

  if (res.file.status === 'error') {
    state.indicator.upload = false;
    message.error(res.error.message);
    return false;
  }

  if (res.file.status === 'done') {
    const response = res.file.response;
    if (response.status !== '2000') {
      state.indicator.upload = false;
      message.error(response.message);
      return false;
    }
    response.data.forEach((item) => {
      state.beforeShipTable.data.push({
        barcode: item.barcode,
        quantity: item.quantity,
      });
    });

    state.indicator.upload = false;
    message.success(response.message);
  }
}


onMounted(async () => {
  await Promise.all([getUserInfoData()])
      .then(() => {
        getShipmentTableData()
      })
})

</script>

<style>
.flexCenter {
  display: flex;
  justify-content: center; /* 水平居中 */
}
</style>