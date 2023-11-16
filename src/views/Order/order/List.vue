<template>
  <a-card title="주문관리">
    <template #extra>
      <a-tooltip>
        <template #title>
          <div>주문수집 버튼을 누른 후 주문건 수집까지 1~2분정도 소요됩니다.</div>
        </template>
        <QuestionCircleOutlined/>
      </a-tooltip>
      <a-button class="ml10" @click.prevent="handleCollect">
        <template #icon>
          <FileSyncOutlined/>
        </template>
        주문수집
      </a-button>
    </template>
    <div id="header">
      <a-descriptions bordered :column="1" size="middle">
        <a-descriptions-item label="검색기간">
          <a-input-group compact>
            <a-space direction="vertical" :size="12">
              <a-range-picker v-model:value="state.order_date" @change="onChangeDatePicker"/>
            </a-space>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="계정">
          <a-input-group compact style="display: flex;">
            <a-select v-model:value="state.tableData.params.account_ids" mode="multiple" style="width: 100%"
                      placeholder="계정 선택">
              <a-select-option v-for="value in state.accountData" :value="value.value" :label="value.value">
                <img :src="getLogoSrc(value.marketCode)"
                     style="width: 18px; height: 18px;"/>&nbsp;&nbsp;{{ value.sellerId }}
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
            <a-input v-model:value="state.tableData.params.search_value" style="width: 300px;" allowClear/>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문상태">
          <a-space>
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
      <div class="left-div">
        <a-space>
          <a-button @click.prevent="receiverOrderSelected" v-if="state.tableData.params.status === 'paid'">
            <template #icon>
              <ContainerOutlined/>
            </template>
            선택 주문처리
          </a-button>
        </a-space>
      </div>
      <div class="right-div" style="display: flex;align-items: center;gap: 5px">
        <a-tooltip>
          <template #title>EXCEL 다운로드</template>
          <a-button @click.prevent="excelDownload">
            <template #icon>
              <DownloadOutlined/>
            </template>
          </a-button>
        </a-tooltip>

        <a-button @click.prevent="syncBridgeStatus" :loading="state.tableData.syncBridgeStatusLoading"
                  v-if="state.tableData.params.status === 'shippingAddress'">
          <template #icon>
            <RedoOutlined/>
          </template>
          배대지 상태 동기화
        </a-button>
      </div>
    </div>

    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
             :pagination="false" :defaultExpandAllRows="true" size="small" :scroll="{ x: 1300}"
    >
      <a-table-column title="마켓" dataIndex="id" key="id">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column; align-items: center;gap: 5px;">
            <img :src="getLogoSrc(record.marketCode)" style="width: 18px;height: 18px;cursor: pointer;"
                 @click="openMarketAdminPage(record.marketCode)"/>
            {{ record.sellerId }}
          </div>
        </template>
      </a-table-column>
      <a-table-column :width="160" title="주문번호/주문시간" dataIndex="orderNo" key="orderNo">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column; align-items: center;gap: 5px;">
            <span>{{ record.orderNo }}</span>
            <span style="color: #999999;">({{ moment(record.orderDate).format('YYYY-MM-DD HH:mm:ss') }})</span>
          </div>
        </template>
      </a-table-column>
      <a-table-column :width="100" title="원본상품" dataIndex="prdCode" key="prdCode">
        <template #default="{ record }">
          <a-space>
            <a-button type="link" size="small" @click.prevent="purchaseProduct(record)">
              <template #icon>
                <ExportOutlined/>
              </template>
              열기
            </a-button>
          </a-space>
        </template>
      </a-table-column>
      <a-table-column title="상품명" dataIndex="prdName" key="prdName">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column;gap: 10px;">
            <h4>{{ record.prdName }}</h4>
            <div style="display: flex;align-items: center;gap: 10px;">
              <a-image
                  :src="record.prdImage"
                  fallback="data:image/png;base64,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"
                  style="width:60px;height:60px;border-radius: 10px;"/>
              <div style="display: flex;flex-direction: column; align-items: start;gap: 10px;">
                <span>{{ record.prdOptionName.split('/')[0] }}</span>
                <span v-if="record.prdOptionName.split('/')[1]">{{ record.prdOptionName.split('/')[1] }}</span>
                <span v-if="record.prdOptionName.split('/')[2]">{{ record.prdOptionName.split('/')[2] }}</span>
              </div>
            </div>
          </div>
        </template>
      </a-table-column>
      <a-table-column :width="80" title="수량" dataIndex="quantity" key="quantity">
        <template #default="{ record }">
          <span
              v-if="Object.keys(state.orderStatusData).length > 0 && Object.keys(state.orderStatusData).includes(state.tableData.params.status)">{{
              record.quantity - record.claimQuantity
            }}</span>
          <span v-else>{{ record.quantity }}</span>
        </template>
      </a-table-column>
      <a-table-column :width="110" title="최종결제 금액" dataIndex="totalPaymentAmount" key="totalPaymentAmount"
                      v-if="!Object.keys(state.claimStatusData).includes(state.tableData.params.status)"/>
      <a-table-column :width="100" title="상태">
        <template #default="{ record }">
          <a-badge color="blue" :text="state.allStatus.filter(it => it.value === record.status)[0].label"
                   v-if="record.status === 'paid'"/>
          <a-badge color="yellow" :text="state.allStatus.filter(it => it.value === record.status)[0].label"
                   v-else-if="record.status === 'shippingAddress'"/>
          <a-badge color="orange" :text="state.allStatus.filter(it => it.value === record.status)[0].label"
                   v-else-if="record.status === 'shipping'"/>
          <a-badge color="green" :text="state.allStatus.filter(it => it.value === record.status)[0].label"
                   v-else-if="record.status === 'shippingComplete'"/>
          <a-badge color="red" :text="state.allStatus.filter(it => it.value === record.status)[0].label"
                   v-else/>
          <a-tag color="volcano" v-if="!record.prdImage">마켓상품</a-tag>
        </template>
      </a-table-column>

      <a-table-column :width="200" title="운송장정보" dataIndex="invoiceNumber" key="invoiceNumber"
                      v-if="state.tableData.params.status !== 'paid'">
        <template #default="{ record }">
          <div style="display: flex;flex-direction: column;gap: 5px;"
               v-if="state.tableData.params.status === 'shippingAddress'">
            <a-select v-model:value="state.courierNameValues[record.id]" placeholder="택배사를 선택해주세요.">
              <a-select-option :value="key" :key="key"
                               v-for="(company, key) in state.marketDeliveryCompany[record.marketCode]">
                {{ company }}
              </a-select-option>
            </a-select>
            <a-input v-model:value="state.invoiceNumberValues[record.id]" placeholder="송장번호를 입력해 주세요." allow-clear/>
          </div>
          <div v-else>
            {{ record.courierName }} - {{ record.invoiceNumber }}
          </div>

        </template>
      </a-table-column>

      <a-table-column title="" :width="200" fixed="right" dataIndex="manage" key="manage"
                      v-if="!Object.keys(state.claimStatusData).includes(state.tableData.params.status)">
        <template #default="{ record }">
          <div style="display: grid;">
            <a-space>
              <RouterLink :to="`/order/info/${record['id']}`" v-if="record['id']">
                <a-button size="small">상세</a-button>
              </RouterLink>
              <a-button size="small"
                        @click.prevent="showHistory({title: record.prdName + ' - ' + record.prdOptionName, type: 'order', index_id: record.id})">
                히스토리
              </a-button>
              <a-button type="info" size="small" v-if="state.tableData.params.status === 'paid'"
                        @click.prevent="receiverOneOrder(record.id)">발주
              </a-button>
              <a-button type="primary" size="small" v-if="state.tableData.params.status === 'shippingAddress'"
                        @click.prevent="deliveryOrder(record.id)">배송
              </a-button>
            </a-space>
            <a-space class="mt10"
                     v-if="state.tableData.params.status === 'shippingAddress' && record.isSendBridge === 0 && state.is_bridge_sync === true && record.prdImage">
              <a-button size="small" @click.prevent="showBridgeForm({record: record, type:'puragent'})">구매대행</a-button>
              <a-button size="small" @click.prevent="showBridgeForm({record: record, type:'shipagent'})">배송대행</a-button>
            </a-space>

            <a-space class="mt10"
                     v-if="state.tableData.params.status === 'shippingAddress' && record.isSendBridge === 1 && state.is_bridge_sync === true && record.prdImage"
                     direction="vertical" align="center">
              <a-tag color="pink">- 신청서 작성완료 -</a-tag>
              <a-tag size="small" color="#15803d" v-if="state.syncStatusShow">{{ record.bridgeStatus }}</a-tag>
              <a-tag size="small" v-else> -</a-tag>
            </a-space>
          </div>
        </template>
      </a-table-column>
    </a-table>
  </a-card>
  <HistoryView :visible="historyVisible" @close="historyVisible = false" :historyData="historyData"/>
  <BridgeFormView :visible.sync="bridgeFormVisible" @close="bridgeFormVisible = false" :bridgeFormData="bridgeFormData"
                  @update="getTableData" :key="bridgeFormData.type"/>

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
import {
  ContainerOutlined,
  DownloadOutlined,
  ExportOutlined,
  FileSyncOutlined,
  QuestionCircleOutlined,
  RedoOutlined
} from '@ant-design/icons-vue';
import {useUserApi} from "@/api/user";


const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    syncBridgeStatusLoading: false,
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
  if (state.tableData.params.account_ids.length === 0) {
    message.error('계정을 선택해주세요.새로운 계정이면 먼저 마켓 계정관리에서 등록해주세요.');
    return false;
  }

  state.tableData.loading = true;
  await useMarketOrderApi().getOrderList(state.tableData.params).then(res => {
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
 * 선택주문처리
 */
const receiverOrderSelected = () => {
  const selectedRowKeys = rowSelection.value.selectedRowKeys;

  if (!selectedRowKeys) {
    message.error('주문처리할 주문을 선택해주세요.');
    return false;
  }

  receiverOrderApi(selectedRowKeys);
}

// 주문처리
const receiverOrderApi = (ids) => {
  useMarketOrderApi().receiverOrder({
    ids
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success(res.data.message);
  }).finally(() => {
    getTableData();
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
  }).finally(() => {
    getTableData();
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
    // a.href = res.data.download_url;
    // a.download = 'x-plan-order.xlsx'; // 파일 이름을 설정합니다.
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);

    window.open(res.data.download_url, "_blank");
  });
}

const syncBridgeStatus = () => {
  state.tableData.syncBridgeStatusLoading = true;
  useMarketOrderApi().syncBridgeStatus({}).then(res => {
    state.tableData.syncBridgeStatusLoading = false;
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.syncStatusShow = true;
    message.success('수집완료 되였습니다.');
    getTableData();
  }).catch(() => {
    message.success('서버연결에 실패 하였습니다.');
    return false;
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

const getMarketDetailUrls = async () => {
  await useMarketApi().getMarketDetailUrls({}).then((res) => {
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
    if (!marketData.channel_info) {
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


const bridgeFormVisible = ref(false);
const bridgeFormData = ref({});
const showBridgeForm = (param) => {
  bridgeFormData.value = param;
  bridgeFormVisible.value = true;
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

onMounted(async () => {
  await getAccountData()
  await Promise.all([getUserInfoData(), getMarketStatusList().then(() =>{
    state.allStatus = [...state.orderStatus, ...state.claimStatus]
  }), getMarketClaimStatusList(), getMarketAdminUrls(), getMarketDetailUrls()])
  await getTableData()
})

</script>

<style>
#header .ant-picker-input input {
  text-align: center;
}
</style>