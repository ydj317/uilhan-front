<template>
  <loading v-model:active="state.loading" :can-cancel="false" :is-full-page="true"/>
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
      <a-descriptions bordered :column="1" :labelStyle="{ height: '50px',width: '150px',textAlign: 'right' }" :contentStyle="{ height: '50px' }">
        <a-descriptions-item label="마켓">
          <div>
            <a-checkbox v-model:checked="state.marketCheckAll"
                        :indeterminate="state.indeterminate"
                        @change="onCheckAllChange">전체
            </a-checkbox>
            <a-checkbox-group v-model:value="state.tableData.checkedMarket" @change="onCheckMarketChange">
              <a-checkbox v-for="(item, key) in state.marketList" :key="key" :value="key">{{ item }}</a-checkbox>
            </a-checkbox-group>
          </div>
        </a-descriptions-item>

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
              <a-range-picker size="middle" v-model:value="state.order_date" @change="onChangeDatePicker"/>
            </a-space>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="검색어">
          <a-input-group compact style="display: flex;">
            <a-select size="middle" v-model:value="state.tableData.params.search_type" style="width: 100px;">
              <a-select-option value="order_no">주문번호</a-select-option>
              <a-select-option value="prd_code">상품번호</a-select-option>
              <a-select-option value="prd_name">상품명</a-select-option>
              <a-select-option value="prd_option_no">옵션번호</a-select-option>
              <a-select-option value="prd_option_name">옵션명</a-select-option>
              <a-select-option value="orderer_name">주문자</a-select-option>
              <a-select-option value="receiver_name">수취인</a-select-option>
            </a-select>
            <a-input size="middle" v-model:value="state.tableData.params.search_value" style="width: 300px;"
                     allowClear/>
          </a-input-group>
        </a-descriptions-item>
      </a-descriptions>

      <div style="display: flex;justify-content: center;">
        <a-button type="primary" @click.prevent="handleSearch" class="mt15">검색</a-button>
        <a-button @click="getTableData" class="ml15 mt15">초기화</a-button>
      </div>
    </div>
  </a-card>

  <div style="display: flex; position: relative; top: 32px">
    <a-tabs
        id="order-status"
        size="small"
        v-model:activeKey="state.activeKey"
        type="card" :tabBarGutter="1"
        @change="statusTabChange">
      <a-tab-pane class="status_tab" v-for="pane in state.allStatus" :key="pane.value">
        <template #tab>
          <div :style="{color: state.activeKey === pane.value ? '#ffffff' : '#000000'}">
            {{ pane.label }}
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
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


        <a-button @click.prevent="downLoadSaleHistory">
          순수익 계산기
        </a-button>


        <a-button @click.prevent="excelDownload">
          주문내역 다운로드
        </a-button>
      </div>
    </div>

    <table border="1" style="border: 1px solid #eeeeee;width: 100%;" class="order_list">
      <tr>
        <th>
          <a-checkbox v-model:checked="orderCheckAll" :indeterminate="orderIndeterminate"
                      @change="onOrderCheckAllChange"></a-checkbox>
        </th>
        <th>판매처</th>
        <th>주문번호(주문시간)</th>
        <th>이미지</th>
        <th>상품명(옵션명)</th>
        <th>수량</th>
        <th>결제금액</th>
        <th>주문상태</th>
        <th>운송장정보</th>
        <th>주문관리</th>
      </tr>
      <tr v-if="state.tableData.loading">
        <td colspan="10" style="background-color: white; text-align: center; height: 200px">
          <a-spin size="large"/>
        </td>
      </tr>
      <template v-if="!state.tableData.loading" v-for="(order, key, index) in filterOrderData" :key="key">
        <tr v-for="(item, _key) in order.items" :key="_key" :class="getGroupClass(index)">
          <td :rowspan="order.items.length > 0 && _key === 0 ? order.items.length : 1" v-if="_key === 0"
              style="text-align: center;">
            <a-checkbox v-model:checked="order.checked"/>
          </td>
          <td :rowspan="order.items.length > 0 && _key === 0 ? order.items.length : 1" v-if="_key === 0">
            <div style="display: flex;flex-direction: column; align-items: center;gap: 5px;">
              <img :src="getLogoSrc(order.marketCode)" style="width: 18px;height: 18px;cursor: pointer;"
                   @click="openMarketAdminPage(order.marketCode)"/>
              {{ order.sellerId }}
            </div>
          </td>
          <td :rowspan="order.items.length > 0 && _key === 0 ? order.items.length : 1" v-if="_key === 0"
              style="text-align: center;">
            <div style="display: flex;flex-direction: column;gap: 3px;">
<!--              <span><a-button type="link" target="_blank" :href="`/order/info/${item.orderNo}`">{{ order.orderNo }} (old)</a-button></span>-->
              <a-popover placement="top" trigger="hover" :overlayStyle="{width: '140px'}">
                <template #content>
                  <a-button size="small" @click="openMarketAdminPage(order.marketCode)">판매처</a-button>
                  <a-button size="small" style="margin-left: 10px;" @click="showDetail(order)">유일</a-button>
                </template>
                <template #title>
                  <span>주문상세 바로가기</span>
                </template>
                <a style="color: #1890ff">{{ order.orderNo }}</a>
              </a-popover>
              <span style="color: #999999">({{ order.orderDate }})</span>
            </div>
          </td>
          <td>
            <a-image
                :src="item.prdImage"
                fallback="data:image/png;base64,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"
                style="width:60px;height:60px;border-radius: 10px;"/>
          </td>
          <td style="min-width: 350px">{{ item.prdName }} <br/> {{ item.prdOptionName }}</td>
          <td>{{ item.quantity }}</td>

          <td :rowspan="calculateRowspan(order, _key)"
              v-if="shouldDisplayRowspan(order, _key) || Object.keys(state.claimStatusData).includes(item.status) || !order.is_group">
            {{ item.totalPaymentAmount }}
          </td>
          <td :rowspan="calculateRowspan(order, _key)"
              v-if="shouldDisplayRowspan(order, _key) || Object.keys(state.claimStatusData).includes(item.status) || !order.is_group">
            <a-badge color="blue" :text="state.allStatus.filter(it => it.value === item.status)[0].label"
                     v-if="item.status === 'paid'"/>
            <a-badge color="yellow" :text="state.allStatus.filter(it => it.value === item.status)[0].label"
                     v-else-if="item.status === 'shippingAddress'"/>
            <a-badge color="orange" :text="state.allStatus.filter(it => it.value === item.status)[0].label"
                     v-else-if="item.status === 'shipping'"/>
            <a-badge color="green" :text="state.allStatus.filter(it => it.value === item.status)[0].label"
                     v-else-if="item.status === 'shippingComplete'"/>
            <a-badge color="red" :text="state.allStatus.filter(it => it.value === item.status)[0].label"
                     v-else/>
            <a-tag color="volcano" v-if="!item.prdImage">마켓상품</a-tag>
          </td>
          <td :rowspan="calculateRowspan(order, _key)"
              v-if="shouldDisplayRowspan(order, _key) || Object.keys(state.claimStatusData).includes(item.status) || !order.is_group">
            <div style="display: flex;flex-direction: column;gap: 5px;"
                 v-if="item.status === 'shippingAddress'">
              <a-select v-model:value="item.courierName" placeholder="택배사를 선택해주세요.">
                <a-select-option :value="key" :key="key"
                                 v-for="(company, key) in state.marketDeliveryCompany[order.marketCode]">
                  {{ company }}
                </a-select-option>
              </a-select>
              <a-input v-model:value="item.invoiceNumber" placeholder="송장번호를 입력해 주세요." allow-clear/>
            </div>
            <div v-else>
              {{ order.courierName }} - {{ order.invoiceNumber }}
            </div>
          </td>
          <td :rowspan="calculateRowspan(order, _key)"
              v-if="shouldDisplayRowspan(order, _key) || Object.keys(state.claimStatusData).includes(item.status) || !order.is_group">
            <div style="display: grid;">
              <a-space >
                <div >

                  <a-button size="small"
                            style="width: 70px;"
                            @click.prevent="showHistory({title: item.prdName + ' - ' + item.prdOptionName, type: 'order', index_id: item.id})">
                    히스토리
                  </a-button>
                  <a-button class="ml10" style="width: 70px;" size="small" v-if="item.status === 'paid' && item.marketCode !== 'interpark'"
                            type="primary" @click.prevent="receiverOneOrder(item.id)">발주
                  </a-button>
                  <a-button class="ml10" style="width: 70px;" type="primary" size="small" v-if="item.status === 'shippingAddress'"
                            @click.prevent="deliveryOrder(item.id, item.courierName, item.invoiceNumber)">배송
                  </a-button>

                </div>

              </a-space>
              <!--              <a-space class="mt10"-->
              <!--                       v-if="item.status === 'shippingAddress' && item.isSendBridge === 0 && state.is_bridge_sync === true && item.prdImage">-->
              <a-space class="mt10">
                <a-button size="small"
						  style="width: 70px;"
						  @click.prevent="showBridgeForm({record: item, type:'shipagent'})"
						  v-if="item['isSendBridge'] === 0"
				>배송대행</a-button>
                <a-button size="small"
                          style="width: 70px;"
                          v-if="(item.status === 'shippingAddress' || item.status === 'paid') && item.marketCode === 'sk11st'"
                          @click.prevent="openDelayForm(item)">발송지연
                </a-button>
              </a-space>

              <a-space class="mt10"
                       v-if="item.status === 'shippingAddress' && item.isSendBridge === 1 && state.is_bridge_sync === true && item.prdImage"
                       direction="vertical" align="center">
                <a-tag color="pink">- 신청서 작성완료 -</a-tag>
                <a-tag size="small" color="#15803d" v-if="state.syncStatusShow">{{ item.bridgeStatus }}</a-tag>
                <a-tag size="small" v-else> -</a-tag>
              </a-space>
            </div>
          </td>
        </tr>
      </template>
    </table>
    <a-pagination
        style="width: 100%;display: flex;justify-content: center;align-items: center;margin-top: 15px;"
        v-model:current="state.tableData.page"
        v-model:page-size="state.tableData.pageSize"
        @change="onPageChange"
        :total="state.tableData.total"
        :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
    />
  </a-card>
  <HistoryView :visible="historyVisible" @close="historyVisible = false" :historyData="historyData"/>
  <BridgeFormView :visible.sync="bridgeFormVisible" @close="bridgeFormVisible = false" :bridgeFormData="bridgeFormData"
                  @update="getTableData" :key="bridgeFormData.type"/>

  <div>
    <a-modal
        v-model:open="state.delayGuideData.showModal"
        :title="state.delayGuideData.title"
        @ok="sendDelayGuide"
        :closable="true"
        :maskClosable="false"
    >
      <div v-if="state.delayGuideData.formData.order_data.marketCode === 'sk11st'">
        <a-form ref="delayFormRef" :model="state.delayGuideData.formData" class="market_form">
          <a-form-item name="send_day" label="예상배송일" :rules="[{ required: true, message: '예상배송일을 선택해주세요.'}]">
            <a-date-picker :disabledDate="delayDisabledDate" v-model:value="state.delayGuideData.formData.send_day"/>
          </a-form-item>
          <a-form-item name="delay_reason" label="배송지연사유" :rules="[{ required: true, message: '배송지연사유를 선택해주세요.'}]">
            <a-select v-model:value="state.delayGuideData.formData.delay_reason">
              <a-select-option value="01">단기 재고 부족</a-select-option>
              <a-select-option value="02">주문폭주로 인한 작업지연</a-select-option>
              <a-select-option value="03">주문제작 시간이 필요</a-select-option>
              <a-select-option value="04">고객 요청</a-select-option>
              <a-select-option value="05">기타</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="detail_reason" label="상세사유"
                       :rules="[{ required: true, min:20, max:300, message: '상세사유 값은 20~300Byte 사이로 입력해 주세요.'}]">
            <a-textarea show-count :maxlength="300" :auto-size="{ minRows: 4 }"
                        v-model:value="state.delayGuideData.formData.detail_reason" placeholder="상세사유를 입력해주세요."/>
          </a-form-item>
        </a-form>
      </div>

      <template #footer>
        <a-button key="back" @click="resetDelayData">닫기</a-button>
        <a-button key="submit" type="primary" :loading="state.delayGuideData.loading" @click="sendDelayGuide">확인
        </a-button>
      </template>
    </a-modal>
  </div>

  <ModalDetail v-model:detail="orderDetail" :marketCode="openDetailMarketCode"/>
</template>

<script setup>

import {computed, onMounted, reactive, ref, toRaw, watch, watchEffect} from "vue";
import {useMarketAccountApi} from "@/api/marketAccount";
import {useMarketOrderApi} from "@/api/order";
import {useMarketApi} from "@/api/market";
import moment from "moment";
import {message} from "ant-design-vue";
import HistoryView from "@/components/HistoryView.vue";
import BridgeFormView from "@/components/BridgeFormView.vue";
import {
  ContainerOutlined,
  DownloadOutlined,
  ExportOutlined,
  FileSyncOutlined,
  QuestionCircleOutlined,
  RedoOutlined
} from "@ant-design/icons-vue";
import {useUserApi} from "@/api/user";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import ModalDetail from "@/views/Order/order/ModalDetail.vue";
import {OrderMapping} from "@/views/Order/order/mapping";

const orderDetail = ref({show: false, orderData: {}})
const openDetailMarketCode = ref('')

const state = reactive({
  tableData: {
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    params: {
      order_date: [moment().subtract(15, "days").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
      account_ids: [],
      search_type: "order_no",
      search_value: "",
      status: "",
    },
    checkedMarket: []
  },
  loading: false,
  accountList: [],
  order_date: [moment().subtract(15, "days"), moment()],
  orderStatus: [],
  orderStatusData: [],
  claimStatus: [],
  allStatus: [],
  activeKey: "",
  claimStatusData: [],
  courierNameValues: {},
  invoiceNumberValues: {},
  marketCheckAll: false,
  indeterminate: true,
  marketList: [],
  marketDeliveryCompany: {},
  marketDetailUrls: {},
  syncStatusShow: false,
  is_bridge_sync: false,
  delayGuideData: {
    formData: {
      order_data: {},
      send_day: moment(),
      delay_reason: "01",
      detail_reason: ""
    },
    title: "발송지연 안내",
    loading: false,
    showModal: false
  }
});

const showDetail = async (orderData) => {
  state.loading = true;
  await useMarketOrderApi().getOrderDetail({orderNo: orderData.orderNo}).then(res => {
    if (res.status !== "2000") {
      state.loading = false;
      message.error(res.message);
      return false;
    }
    state.loading = false;
    const {marketAccount, marketOrder} = res.data;
    const order = new OrderMapping(marketAccount.marketCode);
    orderDetail.value.orderData= order.mappingMarketOrder(marketOrder);
    // 마켓코드 설정
    openDetailMarketCode.value = marketAccount.marketCode.charAt(0).toUpperCase() + marketAccount.marketCode.slice(1);
    orderDetail.value.show = true;
  });

}

const statusTabChange = (key) => {
  rowSelection.value.selectedRowKeys = [];
  state.activeKey = key;
  state.tableData.params.status = key;

  getTableData();
};

const calculateRowspan = (order, key) => {
  return shouldDisplayRowspan(order, key) ? order.is_group ? order.items.filter(it => Object.keys(state.orderStatusData).includes(it.status)).length || 1 : 1 : 1;
};
const shouldDisplayRowspan = (order, key) => {
  if (order.items.filter(it => Object.keys(state.orderStatusData).includes(it.status)).length > 1) {
    return order.items.length > 0 && key === 0;
  } else {
    return order.items.length > 0;
  }
};
const getGroupClass = (key) => {
  return key % 2 === 0 ? "even-group" : "odd-group";
};

const delayFormRef = ref(null);

// 검색기간
const onChangeDatePicker = (value, dateString) => {
  state.tableData.params.order_date = [dateString[0], dateString[1]];
};

const onCheckMarketChange = () => {
  // state.accountList 에서 체크되여 있는 marketCode 의 id 를 state.tableData.param.accountIds 에 넣어준다.
  state.tableData.params.account_ids = state.accountList.filter(it => state.tableData.checkedMarket.includes(it.marketCode)).map(it => Number(it.id));
};

const onCheckAllChange = e => {
  state.indeterminate = false;
  state.tableData.checkedMarket = e.target.checked ? Object.keys(state.marketList) : [];
};
const getMarketList = async () => {
  try {
    let marketList = [];
    await useMarketApi().getMarketList({}).then(res => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
      marketList = res.data;
    });

    await useMarketAccountApi().getAccountList({'page': 'all', 'is_use': 1}).then(res => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
      state.accountList = res.data.list;
      state.marketList = res.data.list.reduce(
          (acc, cur) => ({
                ...acc,
                [cur.marketCode]: marketList[cur.marketCode]
              }
          ),
          {}
      );

      state.tableData.checkedMarket = Object.keys(state.marketList);
    });
  } catch (e) {
    console.error(e);
  }
};


watch(
    () => state.tableData.checkedMarket,
    val => {
      state.indeterminate = !!val.length && val.length < Object.keys(state.marketList).length;
      state.marketCheckAll = val.length === Object.keys(state.marketList).length;
    }
);

/** marketSetting [order:주문별, item:품주별] */
const marketSetting = {
  "11st": {
    orderType: "item"
  },
  "coupang": {
    orderType: "item"
  },
  "lotteon": {
    orderType: "item"
  },
  "smartstore": {
    orderType: "item"
  },
  "qoo10": {
    orderType: "item"
  },
  "tmon": {
    orderType: "order"
  },
  "interpark": {
    orderType: "item"
  }

};
// 주문 리스트
const getTableData = async () => {

  state.tableData.loading = true;
  await useMarketOrderApi().getOrderList(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.tableData.loading = false;
      return false;
    }

    const groupedByOrderNo = res.data.reduce((acc, cur) => {
      const {orderNo, sellerId, marketCode, orderDate, status, totalPaymentAmount} = cur;

      if (!acc[orderNo]) {
        acc[orderNo] = [];
        acc[orderNo]["totalPrice"] = 0;
        acc[orderNo]["is_group"] = false;
        acc[orderNo]["items"] = [];
      }
      if (marketSetting[marketCode] && marketSetting[marketCode].orderType === "order") {
        acc[orderNo]["is_group"] = true;
        acc[orderNo]["totalPrice"] = totalPaymentAmount;
      }

      acc[orderNo]["orderNo"] = orderNo;
      acc[orderNo]["orderDate"] = moment(orderDate).format("YYYY-MM-DD HH:mm:ss");
      acc[orderNo]["sellerId"] = sellerId;
      acc[orderNo]["marketCode"] = marketCode;
      acc[orderNo]["items"].push(cur);

      return acc;
    }, {});

    state.tableData.data = groupedByOrderNo;

    state.tableData.total = Object.keys(state.tableData.data).length;
    state.tableData.loading = false;
  });
};

const filterOrderData = computed(() => {
  return Object.fromEntries(Object.entries(state.tableData.data).slice((state.tableData.page - 1) * state.tableData.pageSize, state.tableData.page * state.tableData.pageSize));
});

const orderCheckAll = ref(false);
const orderIndeterminate = ref(true);

watchEffect(() => {

  if (Object.keys(filterOrderData.value).length === 0) {
    return;
  }
  const isCheckedAll = Object.values(filterOrderData.value).every((item) => {
    return item.checked;
  });

  const val = Object.values(filterOrderData.value).filter((item) => item.checked);

  orderIndeterminate.value = !!val.length && val.length < Object.keys(filterOrderData.value).length;
  orderCheckAll.value = !!isCheckedAll;
});
const onOrderCheckAllChange = e => {
  orderIndeterminate.value = false;
  Object.keys(filterOrderData.value).forEach((key) => {
    filterOrderData.value[key].checked = !!e.target.checked;
  });
};
const onPageChange = (page, pageSize) => {
  state.tableData.page = page;
  state.tableData.pageSize = pageSize;
};
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
        value: item
      };
    });
  });
};

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
        value: item
      };
    });
  });
};

// 주문 선택
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys;
  }
});

const handleStatusChange = (e) => {
  rowSelection.value.selectedRowKeys = [];

  getTableData();
};

// 로고 이미지
const getLogoSrc = (marketCode) => {
  try {
    return require(`../../../assets/img/list/market-logo/${marketCode}.png`);
  } catch (error) {
    return "../../../assets/img/temp_image.png";
  }
};

/**
 * 선택주문처리
 */
const receiverOrderSelected = () => {
  const selectedRowKeys = rowSelection.value.selectedRowKeys;

  if (!selectedRowKeys) {
    message.error("주문처리할 주문을 선택해주세요.");
    return false;
  }

  receiverOrderApi(selectedRowKeys);
};

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
};

const receiverOneOrder = (id) => {
  receiverOrderApi([id]);
};

// 배송처리
const deliveryOrder = (id, courierName, invoiceNumber) => {
  if (!courierName) {
    message.error("택배사를 선택해주세요.");
    return false;
  }

  if (!invoiceNumber) {
    message.error("운송장번호를 입력해주세요.");
    return false;
  }

  useMarketOrderApi().deliveryOrder({
    id: id,
    courierName: courierName,
    invoiceNumber: invoiceNumber
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.data.message);
      return false;
    }

    message.success(res.data.message === "" ? "배송처리 성공 하었습니다." : res.data.message);
  }).finally(() => {
    getTableData();
  });
};

const openDelayForm = (orderData) => {
  state.delayGuideData.formData.order_data = orderData;
  // 타이틀 설정
  if (orderData.marketCode === "sk11st") {
    state.delayGuideData.title = "[11번가 발송지연안내 처리]";
  } else {
    state.delayGuideData.title = "발송지연 안내";
  }

  state.delayGuideData.showModal = true;
};

const delayDisabledDate = (current) => {
  // 지나간 날짜는와 미래 30일 이후의 날자 선택불가
  return current && (current < moment().subtract(1, "days") || current > moment().add(30, "days"));
};

// 배송지연 안내
const sendDelayGuide = () => {
  delayFormRef.value.validate().then(() => {
    state.loading = true;
    state.delayGuideData.loading = true;
    useMarketOrderApi().sendDelayGuide(toRaw(state.delayGuideData.formData)).then(res => {
      if (res.status !== "2000") {
        message.error(res.message);
        state.delayGuideData.loading = false;
        state.loading = false;
        return false;
      }

      message.success(res.message === "" ? "발송지연안내 성공 하었습니다." : res.data.message);
      state.delayGuideData.loading = false;
      state.loading = false;
      resetDelayData();
    }).finally(() => {
      getTableData();
    });
  }).catch(() => {
    message.error("필수항목을 입력해주세요.");
  });

};

const resetDelayData = () => {
  state.delayGuideData.showModal = false;
  state.delayGuideData.formData = {
    order_data: {},
    send_day: moment(),
    delay_reason: "01",
    detail_reason: ""
  };
};

// 마켓 관리자 페이지 열기
const openMarketAdminPage = (marketCode) => {
  const url = state.marketAdminUrls[marketCode]["order"];
  if (!url) {
    message.error("마켓 관리자 페이지가 등록되지 않았습니다.");
    return false;
  }

  window.open(url);
};

// 마켓 관리자 페이지 URL
const getMarketAdminUrls = async () => {
  await useMarketApi().getMarketAdminUrls({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketAdminUrls = res.data;
  });
};

// 택배사 목록
const getMarketDeliveryCompany = async () => {
  await useMarketApi().getMarketDeliveryCompany({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketDeliveryCompany = res.data;
  });
};

// 구매 페이지 열기
const purchaseProduct = (item) => {
  if (!item.prdUrl) {
    message.error("구매 페이지가 등록되지 않았습니다.");
    return false;
  }
  window.open(item.prdUrl);
};

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
};

const downLoadSaleHistory = () => {
  useMarketOrderApi().downLoadSaleHistory(state.tableData.params).then(res => {
    if (res === undefined) {
      message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
      return false;
    }

    let downloadElement = document.createElement("a");
    let url = window.URL || window.webkitURL || window.moxURL;
    let href = process.env.VUE_APP_API_URL + "/uploads/cache/order-sale-history.xlsx?t=" + new Date().getTime();
    downloadElement.href = href;
    downloadElement.download = decodeURI("order-sale-history.xlsx"); // 下载后文件名
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    url.revokeObjectURL(href);
  });
};

const handleSearch = () => {
  if (!state.tableData.params.order_date) {
    message.error("검색기간을 선택해주세요.");
    return false;
  }

  // state.tableData.params.order_date 30일 이상 검색 불가
  if (moment(state.tableData.params.order_date[1]).diff(moment(state.tableData.params.order_date[0]), "days") > 30) {
    message.error("검색기간은 30일 이상 설정할 수 없습니다.");
    return false;
  }

  getTableData();
};

const handleCollect = () => {
  useMarketOrderApi().collectMarketOrder({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success("수집처리중 입니다. 잠시만 기다려 주세요.");
  });
};

const getMarketDetailUrls = async () => {
  await useMarketApi().getMarketDetailUrls({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.marketDetailUrls = res.data;
  });
};

const handleOpenMarketProduct = ({marketCode, prdCode, marketData}) => {
  let url = "";
  if (marketCode === "smartstore") {
    if (!marketData.channel_info) {
      message.error("상품 상세 페이지가 등록되지 않았습니다.마켓계정관리에서 연동확인을 다시 해주세요.");
      return false;
    }
    url = marketData.channel_info.url + "/products/" + prdCode;
  } else {
    url = state.marketDetailUrls[marketCode] + prdCode;
  }

  if (!url) {
    message.error("상품 상세 페이지가 등록되지 않았습니다.");
    return false;
  }


  window.open(url);
};

const historyVisible = ref(false);
const historyData = ref({});

const showHistory = (param) => {
  historyData.value = param;
  historyVisible.value = true;
};


const bridgeFormVisible = ref(false);
const bridgeFormData = ref({record:{orderId:""}});
const showBridgeForm = (param) => {
  bridgeFormData.value = param;
  bridgeFormVisible.value = true;
};


const getUserInfoData = async () => {
  try {
    await useUserApi().getUserInfoData({}).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }

      const {is_bridge_sync} = res.data;
      state.is_bridge_sync = is_bridge_sync;
    });
  } catch (error) {
    message.error(error.message);
    return false;
  }
};

onMounted(async () => {
  await Promise.all([getMarketList(), getUserInfoData(), getMarketStatusList(), getMarketClaimStatusList(), getMarketDeliveryCompany(), getMarketAdminUrls(), getMarketDetailUrls()])
      .then(() => {
        state.allStatus = [{label: '전체', value: ''}, ...state.orderStatus, ...state.claimStatus];
        onCheckMarketChange();
        getTableData();
      });
});

</script>

<style>
#header .ant-picker-input input {
  text-align: center;
}

.market_form .ant-form-item {
  margin-bottom: 0;
}

.market_form .ant-form-item-label {
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.market_form .ant-form-item-control {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.market_form .ant-form-item-control:nth-last-child {
  border-bottom: 1px solid #eeeeee;
}

.ant-radio-group .ant-radio-button-wrapper-checked span {
  color: #000;
}

#order-status .ant-tabs-tab.ant-tabs-tab-active {
  background-color: #ffd117 !important;
}
</style>

<style scoped>
.order_list {
  border-collapse: collapse;
  border: 1px solid #eeeeee;
  width: 100%;
}

.order_list th {
  text-align: center;
  padding: 10px;
  background-color: #fafafa;
}

.order_list td {
  text-align: left;
  padding: 5px;
}

.odd-group {
  background-color: #fffbeb;
}

.even-group {
  background-color: #fff;
}
</style>