<template>
  <loading v-model:active="state.indicator.table" :can-cancel="false" :is-full-page="true"/>
  <a-card title="구매관리">
    <div id="header">
      <a-descriptions bordered :column="1" size="middle">
        <a-descriptions-item>
          <template #label>
            검색기간
            <a-tooltip>
              <template #title>
                <div>검색기간은 30일 단위로 조회 가능합니다.</div>
              </template>
              <QuestionCircleOutlined/>
            </a-tooltip>
          </template>
          <a-input-group compact>
            <a-space direction="vertical" :size="12">
              <a-range-picker v-model:value="state.order_date" @change="onChangeDatePicker"/>
            </a-space>
          </a-input-group>
        </a-descriptions-item>

        <a-descriptions-item label="검색어">
          <a-input-group compact style="display: flex;">
            <a-select v-model:value="state.tableData.params.search_type" style="width: 100px;">
              <a-select-option value="order_no">주문번호</a-select-option>
              <a-select-option value="prd_name">상품명</a-select-option>
              <a-select-option value="prd_code">상품코드</a-select-option>
              <a-select-option value="item_no">품목코드</a-select-option>
              <a-select-option value="prd_option_name">옵션명</a-select-option>
              <a-select-option value="prd_size_option">사이즈</a-select-option>
              <a-select-option value="purchase_order_no">구매번호</a-select-option>
              <a-select-option value="purchase_invoice_no">중국택배번호</a-select-option>
              <a-select-option value="package_status_memo">택배현황 메모</a-select-option>
              <a-select-option value="memo">메모</a-select-option>
            </a-select>
            <a-input v-model:value="state.tableData.params.search_value" style="width: 300px;" allowClear/>
          </a-input-group>
        </a-descriptions-item>

        <a-descriptions-item label="구매상태">
          <a-space>

            <a-radio-group v-model:value="state.tableData.params.orderStatus" button-style="solid"
                           @change="handleOrderStatusChange">
              <a-radio-button value="">전체</a-radio-button>

              <a-radio-button v-for="option in state.orderStatus" :value="option.value">
                {{ option.label}}
                <span>({{ state[option.value + 'Count'] }})</span>
              </a-radio-button>
            </a-radio-group>

          </a-space>
        </a-descriptions-item>

        <a-descriptions-item label="입출고상태">
          <a-space>

            <a-radio-group v-model:value="state.tableData.params.shippingStatus" button-style="solid"
                           @change="handleOrderStatusChange">
              <a-radio-button value="">전체</a-radio-button>
              <a-radio-button v-for="option in state.shippingStatus" :value="option.value">
                {{ option.label }}
                <span>({{ state[option.value + 'Count'] }})</span>
              </a-radio-button>
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
      <div>
        <a-popconfirm title="삭제하시겠습니까?" @confirm="deleteCustomOrder">
          <a-button>삭제</a-button>
        </a-popconfirm>
      </div>
      <div class="right-div" style="display: flex;align-items: center;gap: 5px">
        <!--상품삭제-->
        <a-button style="margin-right: 5px;" @click="downloadCustomOrderExcel" type="primary">
          주문 다운로드
          <template #icon>
            <DownloadOutlined/>
          </template>
        </a-button>
        <a-spin v-if="state.indicator.download"/>

        <a-upload
            :action="state.uploadCustomOrderPath"
            v-model:fileList="state.fileList"
            name="file"
            :max-count="1"
            :headers="state.headers"
            :multiple="false"
            :showUploadList="false"
            @change="excelUploadCustomOrder"
        >
          <a-button class="custom-button" style="margin-right: 5px;" type="primary">
            주문 업로드
            <template #icon>
              <UploadOutlined/>
            </template>
          </a-button>
          <a-spin v-if="state.indicator.upload"/>
        </a-upload>
      </div>
    </div>
    <table class="header-table">
      <thead style="position: sticky;top: 0;">
      <tr>
        <th rowspan="3">
          <input type="checkbox" @change="handleCheckAll"/>
        </th>
        <th style="width: 300px;">
          주문번호
        </th>
        <th>상품코드</th>
        <th>옵션명</th>
        <th>원가</th>
        <th>택배번호</th>
        <th rowspan="3">메모</th>
        <th rowspan="3">바코드</th>
        <th rowspan="3">입출고상태</th>
        <th rowspan="3">액션</th>
      </tr>
      <tr>
        <th>주문일자</th>
        <th>옵션코드</th>
        <th>사이즈</th>
        <th>실구매가</th>
        <th>택배현황</th>
      </tr>
      <tr>
        <th>주문상태</th>
        <th>고객사코드</th>
        <th></th>
        <th>현지운임</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="state.tableData.loading">
        <td colspan="8" style="padding: 80px;background-color: white">
          <a-spin size="large"/>
        </td>
      </tr>
      <template v-else v-for="(item, key) in state.tableData.data" :key="key">
        <tr :class="isInPattern(key+1) ? 'bg-blue' : 'bg-white'">
          <td rowspan="3"><input v-model:checked="item.checked" type="checkbox" @change="handleOrderChecked(item)"></td>
          <td>{{ item.order_no }}</td><!--주문번호-->
          <td>{{ item.prd_code }}</td><!--상품코드-->
          <td>{{ item.prd_option_name }}</td><!--옵션명-->
          <td>{{ item.original_price }}</td><!--원가-->
          <td>{{ item.purchase_invoice_no }}</td><!--택배번호-->
          <td rowspan="3">{{ item.memo }}</td><!--메모-->
          <td rowspan="3">            <!--바코드-->
            <a-button
                @click.prevent="openBarcodePopup(item)"
                size="small"
                style="z-index: 99"
            >
              <template #icon>
                <ExportOutlined/>
              </template>
              출력
            </a-button></td><!--바코드-->
          <td rowspan="3"> <!--입출고상태-->
            {{ state.shippingStatus.find(obj=> obj.value === item.shipping_status) ? state.shippingStatus.find(obj=> obj.value === item.shipping_status).label : ''}}
          </td>
          <td rowspan="3">
            <div class="editable-row-operations">
              <span v-if="state.editableData[item.key]">
                <a-typography-link @click="save(item.key)">저장</a-typography-link>
                <a-popconfirm title="취소 하시겠습니까?" @confirm="cancel(item.key)">
                  <a>취소</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="edit(item.key)">수정</a>
              </span>
            </div>
          </td>
        </tr>
        <tr :class="isInPattern(key+1) ? 'bg-blue' : 'bg-white'">
          <td>{{ item.ins_date }}</td><!--주문일자-->
          <td>{{ item.item_no }}</td><!--옵션코드-->
          <td>{{ item.prd_size_option }}</td><!--사이즈-->
          <td>{{ item.purchase_price }}</td><!--실구매가-->
          <td>{{ item.package_status_memo }}</td><!--택배현황-->
        </tr>
        <tr :class="isInPattern(key+1) ? 'bg-blue' : 'bg-white'">
          <td>{{ item.shipping_status }}</td><!--주문상태-->
          <td>{{ item.barcode }}</td><!--고객사코드(추가)-->
          <td></td>
          <td>{{ item.prd_size_option }}</td><!--현지운임(추가)-->
          <td>

          </td>

        </tr>
      </template>
      </tbody>
    </table>
  </a-card>

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
  tableData: {
    data: [],
    total: 0,
    loading: false,
    syncBridgeStatusLoading: false,
    params: {
      order_date: [moment().subtract(15, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      userinfo: [],
      search_type: 'order_no',
      search_value: '',
      orderStatus: '',
      shippingStatus: ''
    },
  },
  orderStatus: [],
  orderStatusData: [],
  shippingStatus: [],
  shippingStatusData: [],

  // 구매상태 카운트
  paidCount: 0,
  receiptCompletedCount: 0,
  purchaseCompletedCount: 1,
  returnCount: 2,
  cancelCount: 3,
  completeCount: 4,

  // 입출고 상태 카운트
  shippingAddressCount: 0,
  waitWarehouseCount: 0,
  warehousingCount: 0,
  partiallyWarehousingCount: 0,
  shippingCount: 0,

  accountData: {},
  order_date: [moment().subtract(15, 'days'), moment()],
  marketDetailUrls: {},
  uploadCustomOrderPath: process.env.VUE_APP_API_URL + "/api/custom/order/excelUpload",
  fileList: [],
  headers: reactive({
    token: Cookie.get("token")
  }),

  checkedList: [],
  indicator: {
    upload: false,
    download: false,
    table: false,

  },
  editableData: {},
  editingKey: '',

  // 바코드 팝업에 데이타
  showPopupData: {
    barcode: '',
    prd_code: '',
    prd_option_name: '',
    prd_size_option: '',
  },

});

// 검색기간
const onChangeDatePicker = (value, dateString) => {
  state.tableData.params.order_date = [dateString[0], dateString[1]];
}

const handleOrderStatusChange = (e) => {
  rowSelection.value.selectedRowKeys = [];

  getTableData()
}

const getCustomOrderStatusList = async () => {
  await useMarketApi().getCustomOrderStatusList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.orderStatusData = res.data.orderStatus;
    state.shippingStatusData = res.data.shippingStatus;
    state.orderStatus = Object.keys(state.orderStatusData).map((item, index) => {
      return {
        label: state.orderStatusData[item],
        value: item,
      }
    });
    state.shippingStatus = Object.keys(state.shippingStatusData).map((item, index) => {
      return {
        label: state.shippingStatusData[item],
        value: item,
      }
    });

    console.log(state.orderStatus)
    console.log(state.shippingStatus)
  });
}


// 주문 리스트
const getTableData = async () => {
  state.tableData.loading = true;
  await useCustomOrderApi().getCustomOrderList(state.tableData.params).then(res => {
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


// 주문 선택
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    state.checkedList = [];
    state.checkedList.push(selectedRowKeys)
    rowSelection.value.selectedRowKeys = selectedRowKeys;

  },
});


// 엑셀 다운로드
const downloadCustomOrderExcel = () => {
  state.indicator.download = true;
  useCustomOrderApi().downloadCustomOrderExcel(state.tableData.data).then(res => {
    if (res === undefined || res.status !== "2000") {
      state.indicator.download = false;
      message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
      return false;
    }

    state.indicator.download = false;
    window.open(res.data.download_url, "_blank");
  });
}

// 엑셀 업로드
const excelUploadCustomOrder = (res) => {
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
    state.indicator.upload = false;
    message.success(res.file.response.message);
    getTableData();
  }
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

const getMarketDetailUrls = async () => {
  await useMarketApi().getMarketDetailUrls({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.marketDetailUrls = res.data;
  });
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

const edit = key => {
  state.editableData[key] = cloneDeep(state.tableData.data.filter(item => key === item.key)[0]);
};

const save = async key => {
  await useCustomOrderApi().updateCustomOrder(state.editableData[key]).then(res => {
    if (res.status !== "2000") {
      delete state.editableData[key];
      message.error(res.message);
      return false;
    }
    Object.assign(state.tableData.data.filter(item => key === item.key)[0], state.editableData[key]);
    message.success(`수정되었습니다.`);
  });

  delete state.editableData[key];
};

const cancel = key => {
  delete state.editableData[key];
};

const openBarcodePopup = async (record) => {
  await useCustomOrderApi().createQrcode({code: record.barcode}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.showPopupData.prd_option_name = record.prd_option_name;
    state.showPopupData.prd_size_option = record.prd_size_option;
    const content = `
      <div style="display: flex;justify-content: space-between;gap: 10px;">
          <div  style="display: flex;flex-direction: column;gap: 5px;padding-top:10px;">
              <span style="font-size: 30pt;line-height: 35pt;font-weight: bold;">${record.prd_code}</span>
              <span style="font-size: 30pt;line-height: 40pt;font-weight: bold;">[${record.prd_option_name} ${record.prd_size_option}]</span>
          </div>
          <div class="qr-code">
              <img src="${res.data.qrCodeUrl}" alt="QR Code" style="width: 258px;height: 258px;">
          </div>
      </div>
      <div style="display: flex;justify-content: center">
          <h1 style="font-size: 40pt;line-height: 0;">${record.barcode}</h1>
      </div>
  `

    // process.env.VUE_APP_API_URL
    const printWindow = window.open('/print.html', '_blank');
    printWindow.onload = function () {
      printWindow.setPrintContent(content);
    };
  });
};

const deleteCustomOrder = async () => {

  // 체크된 주문 없을시 경고창 띄우기
  const checkedList = state.tableData.data.filter(item => item.checked === true)
  checkedList.length === 0 && message.error('삭제할 주문을 선택해주세요.');

  state.indicator.table = true;
  await useCustomOrderApi().deleteCustomOrder(checkedList).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.indicator.table = false;
      return false;
    }
    message.success(res.message);
    getTableData();
    state.indicator.table = false;
  });
}

const handleOrderChecked = (item) => {
  console.log(item);
  item.checked = !item.checked;
}

// 全选 全不选
const handleCheckAll = (e) => {
  state.tableData.data.forEach(item => {
    item.checked = e.target.checked;
  })
}
onMounted(async () => {
  await Promise.all([getUserInfoData(), getMarketDetailUrls(), getCustomOrderStatusList()])
      .then(() => {
        getTableData()
      })
})

const isInPattern = (num) => {
  // 4로 나눈 나머지가 0, 1, 또는 2인지 확인
  if (num % 4 >= 0 && num % 4 <= 2) {
    // (num - 4)를 6으로 나눈 나머지가 0인지 확인
    return (num - 4) % 2 === 0;
  }
  return false;
}
</script>

<style>
#header .ant-picker-input input {
  text-align: center;
}

.editable-row-operations a {
  margin-right: 8px;
}

</style>
<style scoped>
.header-table {
  overflow: auto;
  width: 100%;
}

.header-table thead th, .header-table thead td {
  padding: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
}

.header-table tbody th, .header-table tbody td {
  padding: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  border: 1px solid #d9d9d9;
}

.header-table thead th {
  border: 1px solid #4f46e5;
  background-color: #6366f1;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  z-index: 999
}

.header-table tbody tr:nth-child(6n+1),
.header-table tbody tr:nth-child(6n+2),
.header-table tbody tr:nth-child(6n+3) {
  background-color: #eeeeee; /* 원하는 색상 코드로 변경 */
}

.header-table tbody .bg-blue {
  background-color: #edf1fc;
}

.header-table tbody .bg-white {
  background-color: #ffffff;
}

</style>