<template>
  <loading v-model:active="state.indicator" :can-cancel="false" :is-full-page="true"/>
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
            </a-select>
            <a-input v-model:value="state.tableData.params.search_value" style="width: 300px;" allowClear/>
          </a-input-group>
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
        <a-spin v-if="state.indicator"/>

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
          <a-spin v-if="state.indicator"/>
        </a-upload>
      </div>
    </div>

    <a-table :columns="state.columns" :data-source="state.tableData.data" :loading="state.tableData.loading"
             class="custom-order-table"
             :row-selection="rowSelection"
             :defaultExpandAllRows="true" size="small" :scroll="{ x: 1300}"
    >
      <template #bodyCell="{ column,record, text }">
        <!--주문번호-->
        <template v-if="column.key === 'order_no'">
          {{ record.order_no }}
        </template>

        <!--주문일자-->
        <template v-if="column.key === 'ins_date'">
          {{ moment(record.ins_date).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <!--상품명-->
        <template v-if="column.key === 'prd_name'">
          {{ record.prd_name }}
        </template>

        <!--옵션이미지-->
        <template v-if="column.key === 'prd_image'">
          <a-image
              :src="record.prd_image"
              fallback="data:image/png;base64,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"
              style="width: 60px; height: 60px; border-radius: 10px"
          />
        </template>

        <!--실구매가-->
        <template
            v-if="['purchase_price', 'purchase_order_no', 'charge', 'memo', 'package_status_memo', 'purchase_invoice_no','total_payment_amount'].includes(column.dataIndex)">
          <div>
            <a-input
                v-if="state.editableData[record.key]"
                v-model:value="state.editableData[record.key][column.dataIndex]"
                style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>

        <!--바코드-->
        <template v-if="column.key === 'barcode'">
          <a-space>
            <a-button
                @click.prevent="openBarcodePopup(record)"
                type="primary"
                size="small"
            >
              <template #icon>
                <ExportOutlined/>
              </template>
              출력
            </a-button>
          </a-space>
        </template>

        <template v-if="column.key === 'edit'">
          <div class="editable-row-operations">
          <span v-if="state.editableData[record.key]">
            <a-typography-link @click="save(record.key)">저장</a-typography-link>
            <a-popconfirm title="취소 하시겠습니까?" @confirm="cancel(record.key)">
              <a>취소</a>
            </a-popconfirm>
          </span>
            <span v-else>
            <a @click="edit(record.key)">수정</a>
          </span>
          </div>
        </template>

      </template>
    </a-table>
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
  columns: [
    {
      title: "주문번호",
      dataIndex: "order_no",
      key: "order_no",
      width: 100,
      fixed: 'left',
      scopedSlots: {customRender: 'order_no'},
    },
    {
      title: "주문일자",
      dataIndex: "ins_date",
      key: "ins_date",
      width: 100,
      scopedSlots: {customRender: 'ins_date'},
    },
    {
      title: "상품명",
      dataIndex: "prd_name",
      key: "prd_name",
      width: 200,
      scopedSlots: {customRender: 'prd_name'},
    },
    {
      title: "옵션이미지",
      dataIndex: "prd_image",
      key: "prd_image",
      width: 100,
      scopedSlots: {customRender: 'prd_image'},
    },
    {
      title: "상품코드",
      dataIndex: "prd_code",
      key: "prd_code",
      width: 200,
      scopedSlots: {customRender: 'prd_code'},
    },
    {
      title: "품목코드",
      dataIndex: "item_no",
      key: "item_no",
      width: 100,
      scopedSlots: {customRender: 'item_no'},
    },
    {
      title: "옵션명",
      dataIndex: "prd_option_name",
      key: "prd_option_name",
      width: 150,
      scopedSlots: {customRender: 'prd_option_name'},
    },
    {
      title: "사이즈",
      dataIndex: "prd_size_option",
      key: "prd_size_option",
      width: 150,
      scopedSlots: {customRender: 'prd_size_option'},
    },
    {
      title: "주문수량",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      scopedSlots: {customRender: 'quantity'},
    },
    {
      title: "원가",
      dataIndex: "original_price",
      key: "original_price",
      width: 100,
      scopedSlots: {customRender: 'original_price'},
    },
    {
      title: "실구매가",
      dataIndex: "purchase_price",
      key: "purchase_price",
      width: 100,
      scopedSlots: {customRender: 'purchase_price'},
    },
    {
      title: "수수료",
      dataIndex: "charge",
      key: "charge",
      width: 100,
      scopedSlots: {customRender: 'charge'},
    },
    {
      title: "금액",
      dataIndex: "total_payment_amount",
      key: "total_payment_amount",
      width: 100,
      scopedSlots: {customRender: 'total_payment_amount'},
    },
    {
      title: "구매번호",
      dataIndex: "purchase_order_no",
      key: "purchase_order_no",
      width: 100,
      scopedSlots: {customRender: 'purchase_order_no'},
    },
    {
      title: "중국택배번호",
      dataIndex: "purchase_invoice_no",
      key: "purchase_invoice_no",
      width: 100,
      scopedSlots: {customRender: 'purchase_invoice_no'},
    },
    {
      title: "중국택배현황 메모",
      dataIndex: "package_status_memo",
      key: "package_status_memo",
      width: 100,
      scopedSlots: {customRender: 'package_status_memo'},
    },
    {
      title: "메모",
      dataIndex: "memo",
      key: "memo",
      width: 100,
      scopedSlots: {customRender: 'memo'},
    },
    {
      title: "바코드",
      dataIndex: "barcode",
      key: "barcode",
      width: 100,
      scopedSlots: {customRender: 'barcode'},
    },
    {
      title: "액션",
      dataIndex: "edit",
      key: "edit",
      width: 100,
      scopedSlots: {customRender: 'edit'},
      fixed: 'right',
    }
  ],
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
    },
  },
  accountData: {},
  order_date: [moment().subtract(15, 'days'), moment()],
  marketDetailUrls: {},
  uploadCustomOrderPath: process.env.VUE_APP_API_URL + "/api/custom/order/excelUpload" + "?XDEBUG_SESSION_START=PHPSTORM",
  fileList: [],
  headers: reactive({
    token: Cookie.get("token")
  }),

  checkedList : [],
  indicator: false,
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

const handleStatusChange = (e) => {
  rowSelection.value.selectedRowKeys = [];

  getTableData()
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
const downloadCustomOrderExcel = () => {
  state.indicator = true;
  useCustomOrderApi().downloadCustomOrderExcel(state.tableData.data).then(res => {
    if (res === undefined) {
      state.indicator = false;
      message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
      return false;
    }

    state.indicator = false;
    window.open(res.data.download_url, "_blank");
  });
}

// 엑셀 업로드
const excelUploadCustomOrder = (res) => {
  if (res.status === 'uploading') {
    state.indicator = true;
    return false;
  }

  if (res.status === 'error') {
    state.indicator = false;
    message.error(res.error.message);
    return false;
  }

  if (res.status === 'done') {
    state.indicator = false;
    message.success(res.response.message);
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
  await useCustomOrderApi().createQrcode({code:record.barcode}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.showPopupData.prd_option_name = record.prd_option_name;
    state.showPopupData.prd_size_option = record.prd_size_option;
    const content = `
  <div class="container" style="background-color: white;padding: 20px 15px;display: flex;flex-direction: column;gap: 15px;">
      <div style="display: flex;justify-content: space-between;gap: 10px;">
          <div class="content" style="display: flex;flex-direction: column;gap: 5px;padding-top:10px;">
              <span style="font-size: 30pt;line-height: 35pt;font-weight: bold;">${record.prd_code}</span>
              <span style="font-size: 30pt;line-height: 40pt;font-weight: bold;">[${record.prd_option_name} ${record.prd_size_option}]</span>
          </div>
          <div class="qr-code">
              <img src="${res.data.qrCodeUrl}" alt="QR Code" style="width: 258px;height: 258px;">
          </div>
      </div>
      <div style="display: flex;justify-content: center">
          <h1 style="font-size: 50pt;line-height: 0;">${record.barcode}</h1>
      </div>
  </div>
  `

    // process.env.VUE_APP_API_URL
    const printWindow = window.open('/print.html', 'Print', 'width=800,height=800');
    printWindow.onload = function () {
      printWindow.setPrintContent(content);
    };
  });


};


const deleteCustomOrder = async () => {
  if (state.checkedList[0].length === 0) {
    message.error('삭제할 주문을 선택해주세요.');
    return false;
  }
  state.indicator = true;
  await useCustomOrderApi().deleteCustomOrder(state.checkedList[0]).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.indicator = false;
      return false;
    }
    message.success(res.message);
    getTableData();
    state.indicator = false;
  });
}
onMounted(async () => {
  await Promise.all([getUserInfoData(), getMarketDetailUrls()])
      .then(() => {
        getTableData()
      })
})

</script>

<style>
#header .ant-picker-input input {
  text-align: center;
}

.editable-row-operations a {
  margin-right: 8px;
}
.custom-order-table .ant-table-pagination-right {
  display: flex;
  justify-content: flex-start;

}
</style>