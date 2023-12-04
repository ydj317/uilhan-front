<template>
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
<!--        <a-descriptions-item label="계정">-->
<!--          <a-input-group compact style="display: flex;">-->
<!--            <a-select v-model:value="state.tableData.params.account_ids" mode="multiple" style="width: 100%"-->
<!--                      placeholder="계정 선택">-->
<!--              <a-select-option v-for="value in state.accountData" :value="value.value" :label="value.value">-->
<!--                <img :src="getLogoSrc(value.marketCode)"-->
<!--                     style="width: 18px; height: 18px;"/>&nbsp;&nbsp;{{ value.sellerId }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </a-input-group>-->
<!--        </a-descriptions-item>-->
        <a-descriptions-item label="검색어">
          <a-input-group compact style="display: flex;">
            <a-select v-model:value="state.tableData.params.search_type" style="width: 100px;">
              <a-select-option value="order_no">주문번호</a-select-option>
              <a-select-option value="prd_code">상품번호</a-select-option>
              <a-select-option value="prd_name">상품명</a-select-option>
              <a-select-option value="prd_option_no">옵션번호</a-select-option>
              <a-select-option value="prd_option_name">옵션명</a-select-option>
            </a-select>
            <a-input v-model:value="state.tableData.params.search_value" style="width: 300px;" allowClear/>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문상태">
          <a-space>
            <a-radio-group v-model:value="state.tableData.params.status" button-style="solid"
                           @change="handleStatusChange">
              <a-radio-button value="">전체</a-radio-button>
            </a-radio-group>
            <a-radio-group v-model:value="state.tableData.params.status" button-style="solid"
                           @change="handleStatusChange">
              <a-radio-button v-for="option in state.orderStatus" :value="option.value">{{
                  option.label
                }}
              </a-radio-button>
            </a-radio-group>

            <a-radio-group v-model:value="state.tableData.params.status" button-style="solid"
                           @change="handleStatusChange">
              <a-radio-button v-for="option in state.claimStatus" :value="option.value">{{
                  option.label
                }}
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
      <div class="right-div" style="display: flex;align-items: center;gap: 5px">
        <a-button style="margin-right: 5px;"  @click="uploadOrderWithExcel" type="primary">
          EXCEL 다운로드
          <template #icon>
            <DownloadOutlined />
          </template>
        </a-button>
        <a-button style="margin-right: 5px;"  @click="uploadOrderWithExcel" type="primary">
          EXCEL 업로드
          <template #icon>
            <UploadOutlined />
          </template>
        </a-button>
      </div>
    </div>

    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
             :pagination="false" :defaultExpandAllRows="true" size="small" :scroll="{ x: 1300}"
    >
      <a-table-column title="주문번호" dataIndex="id" key="id">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column; align-items: center;gap: 5px;">
            <span>{{ record.orderNo }}</span>
          </div>
        </template>
      </a-table-column>

      <a-table-column :width="160" title="주문일자" dataIndex="orderNo" key="orderNo">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column; align-items: center;gap: 5px;">
            <span style="color: #999999;">({{ moment(record.insData).format('YYYY-MM-DD HH:mm:ss') }})</span>
          </div>
        </template>
      </a-table-column>

      <a-table-column :width="500" title="상품명"  dataIndex="prdName" key="prdName">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column;gap: 10px;">
            <h4>{{ record.prdName }}</h4>
          </div>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="옵션이미지" dataIndex="prdImage" key="prdImage">
        <template #default="{ record }">
          <a-image
              :src="record.prdImage"
              fallback="data:image/png;base64,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"
              style="width:60px;height:60px;border-radius: 10px;"/>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="품목코드" dataIndex="prdCode" key="prdCode">
        <template #default="{ record }">
          <a-space>
            <span>{{ record.itemNo }}</span>
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="400" title="옵션명" dataIndex="prdOptionName" key="prdOptionName">
        <template #default="{ record }">
          <a-space>
            <div style="display: flex;align-items: center;gap: 10px;">
              <div style="display: flex;flex-direction: column; align-items: start;gap: 10px;">
                <span>{{ record.prdOptionName }}</span>
              </div>
            </div>
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="80" title="주문수량" dataIndex="quantity" key="quantity">
        <template #default="{ record }">
          <span v-else>{{ record.quantity }}</span>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="원가" dataIndex="originPrice" key="originPrice">
        <template #default="{ record }">
          <a-space>
            <span>{{ record.originPrice }}</span>
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="실구매가" dataIndex="purchasePrice" key="purchasePrice">
        <template #default="{ record }">
          <a-space >
            <input
                class="ant-input"
                :id="'purchasePrice' + record.id"
                @dblclick="activateEdit(record, 'purchasePrice')"
                   @keyup.enter="saveEdit(record, 'purchasePrice')"
                   @blur="saveEdit(record, 'purchasePrice')"
                   :value="record.purchasePrice"
                   style="width: 70px;background-color:#f0f0f0;"
                readonly
            />
          </a-space>


        </template>
      </a-table-column>

      <a-table-column :width="100" title="수수료" dataIndex="charge" key="charge">
        <template #default="{ record }">
          <a-space>
            <input :value="record.charge"
                   class="ant-input"
                   :id="'charge' + record.id"
                   @dblclick="activateEdit(record, 'charge')"
                   @keyup.enter="saveEdit(record, 'charge')"
                   @blur="saveEdit(record, 'charge')"
                   style="width: 40px; background-color:#f0f0f0;"
                   readonly
            />
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="금액" dataIndex="totalPaymentAmount" key="totalPaymentAmount">
        <template #default="{ record }">
          <a-space>
            <input :value="record.totalPaymentAmount"
                   class="ant-input"
                   :id="'totalPaymentAmount' + record.id"
                   @dblclick="activateEdit(record, 'totalPaymentAmount')"
                   @keyup.enter="saveEdit(record, 'totalPaymentAmount')"
                   @blur="saveEdit(record, 'totalPaymentAmount')"
                   style="width: 70px; background-color:#f0f0f0;"
                   readonly
            />
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="구매번호" dataIndex="purchaseOrderNo" key="purchaseOrderNo">
        <template #default="{ record }">
          <a-space>
            <input :value="record.purchaseOrderNo"
                   class="ant-input"
                   :id="'purchaseOrderNo' + record.id"
                   @dblclick="activateEdit(record, 'purchaseOrderNo')"
                   @keyup.enter="saveEdit(record, 'purchaseOrderNo')"
                   @blur="saveEdit(record, 'purchaseOrderNo')"
                   style="width: 150px; background-color:#f0f0f0;"
                   readonly
            />
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="중국택배번호" dataIndex="purchaseInvoiceNo" key="purchaseInvoiceNo">
        <template #default="{ record }">
          <a-space>
            <input :value="record.purchaseInvoiceNo"
                   class="ant-input"
                   :id="'purchaseInvoiceNo' + record.id"
                   @dblclick="activateEdit(record, 'purchaseInvoiceNo')"
                   @keyup.enter="saveEdit(record, 'purchaseInvoiceNo')"
                   @blur="saveEdit(record, 'purchaseInvoiceNo')"
                   style="width: 150px; background-color:#f0f0f0;"
                   readonly
            />
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="중국택배현황 메모" dataIndex="packageStatusMemo" key="packageStatusMemo">
        <template #default="{ record }">
          <a-space>
            <input :value="record.packageStatusMemo"
                   class="ant-input"
                   :id="'packageStatusMemo' + record.id"
                   @dblclick="activateEdit(record, 'packageStatusMemo')"
                   @keyup.enter="saveEdit(record, 'packageStatusMemo')"
                   @blur="saveEdit(record, 'packageStatusMemo')"
                   style="width: 150px; background-color:#f0f0f0;"
                   readonly
            />
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="메모" dataIndex="memo" key="memo">
        <template #default="{ record }">
          <a-space>
            <input :value="record.memo"
                   class="ant-input"
                   :id="'memo' + record.id"
                   @dblclick="activateEdit(record, 'memo')"
                   @keyup.enter="saveEdit(record, 'memo')"
                   @blur="saveEdit(record, 'memo')"
                   style="width: 150px; background-color:#f0f0f0;"
                   readonly
            />
          </a-space>
        </template>
      </a-table-column>

      <a-table-column :width="100" title="바코드" dataIndex="barCode" key="barCode">
        <template #default="{ record }">
          <a-space>
            <a-button @click.prevent="handleBarcode(record)" type="primary" size="small">
              <template #icon>
                <ExportOutlined/>
              </template>
              출력
            </a-button>
          </a-space>
        </template>
      </a-table-column>


    </a-table>
  </a-card>


</template>

<script setup>

import {onMounted, reactive, ref} from 'vue'
import {useMarketAccountApi} from "@/api/marketAccount";
import {useMarketOrderApi} from '@/api/order'
import {useMarketApi} from '@/api/market'
import moment from "moment";
import {message} from 'ant-design-vue'
import HistoryView from '@/components/HistoryView.vue'
import BridgeFormView from '@/components/BridgeFormView.vue'
import { nextTick } from 'vue';
import {
  ContainerOutlined,
  DownloadOutlined,
  UploadOutlined,
  ExportOutlined,
  FileSyncOutlined,
  QuestionCircleOutlined,
  RedoOutlined
} from '@ant-design/icons-vue';
import {useUserApi} from "@/api/user";
import {useCustomOrderApi} from "@/api/customOrder";


const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    syncBridgeStatusLoading: false,
    params: {
      order_date: [moment().subtract(15, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      userinfo: [],
      account_ids: [],
      search_type: 'order_no',
      search_value: '',
      status: '',
    },
  },
  accountData: {},
  order_date: [moment().subtract(15, 'days'), moment()],
  orderStatus: [],
  orderStatusData: [],
  claimStatus: [],
  allStatus: [],
  claimStatusData: [],
  courierNameValues: {},
  invoiceNumberValues: {},
  marketDeliveryCompany: {},
  marketDetailUrls: {},
  syncStatusShow: false,
  is_bridge_sync: false,
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
  // if (state.tableData.params.account_ids.length === 0) {
  //   message.error('계정을 선택해주세요.새로운 계정이면 먼저 마켓 계정관리에서 등록해주세요.');
  //   return false;
  // }

  state.tableData.loading = true;
  await useCustomOrderApi().getCustomOrderList(state.tableData.params).then(res => {
    console.log(res)
    if (res.status !== "2000") {
      message.error(res.message);
      state.tableData.loading = false;
      return false;
    }

    state.tableData.data = res.data;

    // set courierNameValues default value
    state.tableData.data.forEach((item) => {
      if (item.courierName !== '' && item.invoiceNumber !== '') {
        state.courierNameValues[item.id] = item.courierName;
        state.invoiceNumberValues[item.id] = item.invoiceNumber;
      }
    });

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

    state.orderStatusData = res.data;
    state.orderStatus = Object.keys(state.orderStatusData).map((item, index) => {
      return {
        label: state.orderStatusData[item],
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
const uploadOrderWithExcel = () => {
  useMarketOrderApi().downloadOrder(state.tableData.params).then(res => {
    if (res === undefined) {
      message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
      return false;
    }
    // let blob = new Blob([res], { type: "charset=utf-8" });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = res.data.download_url;
    // a.download = 'x-plan-order.xlsx'; // 파일 이름을 설정합니다.
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);

    window.open(res.data.download_url, "_blank");
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
      const {is_bridge_sync} = res.data;
      state.is_bridge_sync = is_bridge_sync
    });
  } catch (error) {
    message.error(error.message);
    return false;
  }
}

const activateEdit = (record, field) => {
  const input = document.getElementById(`${field}${record.id}`);
  input.focus();
  input.style.backgroundColor = '#FFFFFF';
  input.readOnly = false;
};

const saveEdit = async (record, field) => {
  const input = document.getElementById(`${field}${record.id}`);
  input.style.backgroundColor = '#f0f0f0';
  input.readOnly = true;
  const inputValue = input.value;
  const originalValue = record[field];
  // 입력값과 원본값 비교 값이 변경되지 않았을 경우 아무것도 안함
  if (inputValue == originalValue) {
    return false;
  }
  const params = {
    id: record.id,
    [field]: inputValue,
  };

  await useCustomOrderApi().updateCustomOrder(params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    record[field] = input.value;
  });

};


onMounted(async () => {
  await Promise.all([getAccountData(), getUserInfoData(), getMarketStatusList(), getMarketClaimStatusList(), getMarketDetailUrls()])
      .then(() => {
        state.allStatus = [...state.orderStatus, ...state.claimStatus]
        getTableData()
      })
})

</script>

<style>
#header .ant-picker-input input {
  text-align: center;
}
</style>