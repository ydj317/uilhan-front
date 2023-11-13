<template>
  <div id="container">

    <a-card :bordered="false">
      <div class="hello">
        <div class="left">
          <div class="text-1">안녕하십니까!</div>
          <div class="text-2">저희 서비스를 이용해 주셔서 감사합니다.</div>
          <div class="text-3">문의사항이나 궁금한 점이 있으시면 오른쪽 아래 {챗아이콘}을 클릭하여 문의 부탁합니다.</div>
        </div>
        <div class="right">
          <div>
            <div>연동마켓</div>
            <div>{{ marketTotal }}</div>
          </div>
          <div>
            <div>상품</div>
            <div>{{ productTotal }}</div>
          </div>
          <div>
            <div>주문</div>
            <div>{{ orderTotal }}</div>
          </div>
        </div>
      </div>
    </a-card>
    <a-row>
      <a-col style="width: 60%">
        <a-row type="flex" justify="space-between" align="bottom" style="margin-top: 20px;" :gutter="20">
          <a-col :span="12">
            <a-card :loading="dailySaleLoading" :bordered="false" title="매출현황">
              <template #extra>
                <a-radio-group v-model:value="state.dailyData.params.period" class="right" @change="getSaleList" size="small">
                  <a-radio-button value="1week">일주일</a-radio-button>
                  <a-radio-button value="1month">1개월</a-radio-button>
                  <a-radio-button value="3month">3개월</a-radio-button>
                </a-radio-group>
              </template>
              <div class="row1-content">
                <a-radio-group v-model:value="state.dailyData.params.type" @change="getSaleList" size="small">
                  <a-radio-button value="amount">판매 금액</a-radio-button>
                  <a-radio-button value="quantity">판매 수량</a-radio-button>
                  <a-radio-button value="count">판매 건수</a-radio-button>
                </a-radio-group>
                <e-charts class="chart-2" :option="dailySaleChart" />
              </div>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card :loading="productLoading" :bordered="false" title="수집가능 마켓">
              <div class="row1-content getMarketLogo">
                <a href="https://www.taobao.com/" target="_blank">
                  <a-tag class="logo-tag">
                    <img :src="getLogoSrc('get-logo', 'taobao')" alt=""> <span>타오바오</span>
                  </a-tag>
                </a>

                <a href="https://www.tmall.com/" target="_blank">
                  <a-tag class="logo-tag">
                    <img :src="getLogoSrc('get-logo', 'tmall')" alt=""> <span>티몰</span>
                  </a-tag>
                </a>

                <a href="https://p4psearch.1688.com/" target="_blank">
                  <a-tag class="logo-tag">
                    <img :src="getLogoSrc('get-logo', 'alibaba')" alt=""> <span>알리바바</span>
                  </a-tag>
                </a>

                <a href="https://www.aliexpress.com/" target="_blank">
                  <a-tag class="logo-tag">
                    <img :src="getLogoSrc('get-logo', 'aliexpress')" alt=""> <span>알리익스프레스</span>
                  </a-tag>
                </a>

                <a href="https://domeggook.com/" target="_blank">
                  <a-tag class="logo-tag">
                    <img :src="getLogoSrc('get-logo', 'domeggook')" alt=""> <span>도매꾹</span>
                  </a-tag>
                </a>
              </div>
            </a-card>
          </a-col>
          <!--<a-col :span="8">
            <a-card :loading="productLoading" :bordered="false" title="연동마켓">
              <div class="row1-content sendMarketLogo">
                <a-checkable-tag class="logo-tag" v-for="market in accountMarket"
                                 @click="onOpenMarketUrl(market.split('::')[0])">
                  <img :src="getLogoSrc('market-logo', market.split('::')[0])" alt=""> <span>{{ market.split('::')[1]
                  }}</span>
                </a-checkable-tag>
              </div>
            </a-card>
          </a-col>-->
        </a-row>

        <a-row type="flex" justify="space-between" align="bottom" style="margin-top: 20px;" :gutter="20">
          <a-col :span="12">
            <a-card :loading="productLoading" :bordered="false" title="상품 연동 상태">
              <div class="content2">
                <e-charts class="chart-2" :option="productChart" />
              </div>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card :loading="orderLoading" :bordered="false" title="주문 상태">
              <div class="content2">
                <e-charts class="chart-3" :option="orderChart" />
              </div>
            </a-card>
          </a-col>
          <!--<a-col :span="8">
          <a-card :loading="boardLoading" :bordered="false" title="공지사항">
              <div class="content2">
                <div class="scroll">
                  <template v-for="item in boardData">
                    <div v-if="item.type === 'notice'" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                      <router-link :to="`/board/notice/view/${item.id}`">
                        <h4>{{ item.title }}</h4>
                        <span style="color: #999">{{ parseHTML(item.content) }}</span>
                      </router-link>
                    </div>
                  </template>
                </div>
              </div>
            </a-card>
          </a-col>-->
        </a-row>
      </a-col>
      <a-col style="width: 38%; margin-top: 20px; margin-left: 20px" :gutter="20">
        <a-card :loading="boardLoading" :bordered="false" title="주문현황" style="height: 100%">
          <template #extra>
            <a-checkbox v-model:checked="isAutoCollect">자동수집</a-checkbox>
          </template>
          <a-table :data-source="account.orderData.data" :loading="accountLoading"
                   :pagination="false" size="small">
            <a-table-column title="판매처" dataIndex="manage" key="manage">
              <template #default="{ record }">
                <div  style="cursor: pointer;" @click="openMarketAdminPage(record.market_code)">
                  <img :src="getLogoSrc('market-logo', record.market_code)" alt="" style="width: 18px">{{ record.seller_id }}
                </div>
              </template>
            </a-table-column>
            <a-table-column title="결제완료" dataIndex="paid" key="paid" align="center">
              <template #default="{ record }">
                <span class="highlight" v-if="record.paidNew">{{ record.paidNew }}</span>
                <span style="color: #000000D9;" v-if="!record.paidNew">{{ record.paid }}</span>
              </template>
            </a-table-column>
            <a-table-column title="배송준비중 " dataIndex="shippingAddress" key="shippingAddress" align="center" >
              <template #default="{ record }">
                <span class="highlight" v-if="record.shippingAddressNew">{{ record.shippingAddressNew }}</span>
                <span style="color: #000000D9;" v-if="!record.shippingAddressNew">{{ record.shippingAddress }}</span>
              </template>
            </a-table-column>
            <a-table-column title="주문취소" dataIndex="cancelComplete" key="cancelComplete" align="center" >
              <template #default="{ record }">
                <span class="highlight" v-if="record.cancelCompleteNew">{{ record.cancelCompleteNew }}</span>
                <span style="color: #000000D9;" v-if="!record.cancelCompleteNew">{{ record.cancelComplete }}</span>
              </template>
            </a-table-column>
            <a-table-column title="반품요청" dataIndex="returnRequest" key="returnRequest" align="center" >
              <template #default="{ record }">
                <span class="highlight" v-if="record.returnRequestNew">{{ record.returnRequestNew }}</span>
                <span style="color: #000000D9;" v-if="!record.returnRequestNew">{{ record.returnRequest }}</span>
              </template>
            </a-table-column>
            <template #summary>
              <a-table-summary-row>
                <a-table-summary-cell>합계</a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{account.orderData.totalPaid}}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{account.orderData.totalShippingAddress}}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{account.orderData.totalCancelComplete}}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{account.orderData.totalReturnRequest}}</a-typography-text>
                </a-table-summary-cell>
              </a-table-summary-row>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

  </div>
</template>

<script setup>
import {ref, onMounted, reactive, onBeforeUnmount } from "vue";
import { AuthRequest } from "@/util/request";
import { message } from "ant-design-vue";
import ECharts from 'vue-echarts';
import {useMarketOrderApi} from "@/api/order";
import { useMarketApi } from '@/api/market';
const state = reactive({
  dailyData: {
    params: {
      period : '1week',
      type : 'amount'
    }
  }
});
const productLoading = ref(true);
const orderLoading = ref(true);
const boardLoading = ref(true);
const dailySaleLoading = ref(true);
const accountLoading = ref(true);
const isAutoCollect = ref(false);

const marketTotal = ref('-');
const productTotal = ref('-');
const orderTotal = ref('-');

const allSales = ref('-');
const todaySales = ref('-');
const comparedToYesterday = ref('-');
const comparedToLastWeek = ref('-');

const accountMarket = ref([]);
const marketSellerUrl = {
  "11st": 'https://login.11st.co.kr/auth/front/selleroffice/login.tmall',
  "gmarket": 'https://www.esmplus.com/Member/SignIn/LogOn',
  "esm_auction": 'https://www.esmplus.com/Member/SignIn/LogOn',
  "auction": 'https://www.esmplus.com/Member/SignIn/LogOn',
  "esm_gmarket": 'https://www.esmplus.com/Member/SignIn/LogOn',
  "tmon": 'https://ps.tmon.co.kr/',
  "lotteon": 'https://store.lotteon.com/cm/main/login_SO.wsp',
  "coupang": 'https://xauth.coupang.com/auth/realms/seller/protocol/openid-connect/auth?response_type=code&client_id=wing&redirect_uri=https%3A%2F%2Fwing.coupang.com%2Fsso%2Flogin?returnUrl%3Dhttps%253A%252F%252Fwing.coupang.com%252F&state=07f8260c-b504-4d28-ad9f-b8a1110402b4&login=true&ui_locales=ko-KR&scope=openid',
  "smartstore": 'https://accounts.commerce.naver.com/login?url=https%3A%2F%2Fsell.smartstore.naver.com%2F%23%2Flogin-callback',
  "qoo10_sg": 'https://qsm.qoo10.sg/GMKT.INC.Gsm.Web/login.aspx?ReturnUrl=%2fgmkt.inc.gsm.web%2f',
  "wemakeprice": 'https://wpartner.wemakeprice.com/login',
  "interpark": 'https://seller.interpark.com/login/loginForm.do',
}
const boardData = ref([]);

const productChartData = ref([]);
const productChart = ref({
  tooltip: {
    trigger: "item"
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        fontSize: 15
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 17,
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: true,
        lineStyle: {
          width: 3
        }
      },
      data: productChartData
    }
  ]
});

const dailySaleChartData = ref([]);
const dailySaleDaysData = ref([]);
const dailySaleChart = ref({
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: dailySaleDaysData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "示例数据",
        type: "bar",
        data: dailySaleChartData,
      },
    ],
});

const orderChartData = ref([]);
const orderChart = ref({
  tooltip: {
    trigger: "item"
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        fontSize: 15
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 17,
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: true,
        lineStyle: {
          width: 3
        }
      },
      data: orderChartData
    }
  ]
});

const account = reactive({
  orderData: {
    data: [],
    list: [],
    total: 0,
    totalPaid: 0,
    totalShippingAddress: 0,
    totalCancelComplete: 0,
    totalReturnRequest: 0,
    loading: false,
    params: {
      page: 1,
      pageSize: 20,
    },
  },
  marketList: [],
  rowData: {},
  isModalVisible: false,
});

const onOpenMarketUrl = (marketCode) => {
  window.open(marketSellerUrl[marketCode], '_blank');
}

function getLogoSrc(fileName, marketCode) {
  try {
    return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
  } catch (error) {
    return require("../../assets/img/temp_image.png");
  }
}

function parseHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;

  if (div.innerHTML.length > 100) {
    div.innerHTML = div.innerHTML.slice(0, 100) + "...";
  }

  return div.textContent;
}

function getBoard() {
  const params = { params: { type: 'notice' } }
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/board/list", params).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    boardData.value = res.data;

    boardLoading.value = false
  }
  );
}

function getProduct() {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/product").then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
    }

    productChartData.value = res.data.marketSyncList
    accountMarket.value = res.data.accountMarket
    marketTotal.value = res.data.accountMarket.length
    productTotal.value = res.data.productTotal

    productLoading.value = false
  });
}

function getOrder() {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/order").then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
    }

    orderChartData.value = res.data.orderStatusList
    orderTotal.value = res.data.orderTotal
    allSales.value = res.data.allSales
    todaySales.value = res.data.todaySales
    comparedToYesterday.value = res.data.comparedToYesterday.toFixed(2)
    comparedToLastWeek.value = res.data.comparedToLastWeek.toFixed(2)

    orderLoading.value = false
  });
}

const getSaleList = () => {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/dailySale", state.dailyData).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
    }
    dailySaleDaysData.value = res.data.days;
    dailySaleChartData.value = res.data.sales;

    dailySaleLoading.value = false
  });
}

onMounted(() => {
  getOrder();
  getProduct();
  getBoard();
  getTableList();
  getSaleList();
  getMarketAdminUrls();
});

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

const getTableList = () => {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/order2").then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
    }

    const { list, total, totalPaid, totalShippingAddress, totalCancelComplete, totalReturnRequest } = res.data

    let orderDataView = [];
    // 데이터를 조회해올때마다 루프 돌리며 판단하여 데이터 변경이 있는 애들을 찾아냄
    const oldOrderData = sessionStorage.getItem('orderData');
    if (oldOrderData) {
      const oldOrderJson = JSON.parse(oldOrderData);
      oldOrderJson.forEach((item) => {
        const newData = findObjectById(item.id, list);
        let newQty = 0;
        newData.paidNew = '';
        if(!isNaN(item['paid']) && !isNaN(newData['paid']) && newData['paid'] - item['paid'] > 0) {
          newQty  = newData['paid'] - item['paid'];
          newData.paidNew = item['paid'].toString() + ' + ' + newQty.toString();
        }
        newData.shippingAddressNew = '';
        if(!isNaN(item['shippingAddress']) && !isNaN(newData['shippingAddress']) && newData['shippingAddress'] - item['shippingAddress'] > 0) {
          newQty  = newData['shippingAddress'] - item['shippingAddress'];
          newData.shippingAddressNew = item['shippingAddress'].toString() + ' + ' + newQty;
        }
        newData.cancelCompleteNew = '';
        if(!isNaN(item['cancelComplete']) && !isNaN(newData['cancelComplete']) && newData['cancelComplete'] - item['cancelComplete'] > 0) {
          newQty  = newData['cancelComplete'] - item['cancelComplete'];
          newData.cancelCompleteNew = item['cancelComplete'].toString() + ' + ' + newQty.toString();
        }
        newData.returnRequestNew = '';
        if(!isNaN(item['returnRequest']) && !isNaN(newData['returnRequest']) && newData['returnRequest'] - item['returnRequest'] > 0) {
          newQty  = newData['returnRequest'] - item['returnRequest'];
          newData.returnRequestNew = item['returnRequest'].toString() + ' + ' + newQty.toString();
        }
        orderDataView.push(newData);
      });
    } else {
      orderDataView = list
    }

    account.orderData.data = orderDataView;
    account.orderData.list = list
    account.orderData.total = total;
    account.orderData.totalPaid = totalPaid;
    account.orderData.totalShippingAddress = totalShippingAddress;
    account.orderData.totalCancelComplete = totalCancelComplete;
    account.orderData.totalReturnRequest = totalReturnRequest;

    // 리스트 데이터를 세션스토레이지에 넣어서 비교할때 사용함
    const newOrderData = JSON.stringify(list);
    sessionStorage.setItem('orderData', newOrderData);

    accountLoading.value = false
  });
};

// id에 근거하여 object 찾아서 리턴
const findObjectById = (id, list) => {
  const object = list.find(obj => obj.id === id);
  if (object) {
    return object;
  } else {
    return null;
  }
};

//주문수집 소스
const handleCollect = () => {
  useMarketOrderApi().collectMarketOrder({}).then(res => {
    if (res.status !== "2000") {
      return false;
    }
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

// 监听页面关闭事件
const handleBeforeUnload = (event) => {
  event.preventDefault();
  // 在页面关闭前执行操作
  const newOrderData = JSON.stringify(account.orderData.list);
  sessionStorage.setItem('orderData', newOrderData);
};

onBeforeUnmount(() => {
  // 移除 beforeunload 事件监听器，确保页面关闭时不会再触发
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// 添加 beforeunload 事件监听器
window.addEventListener('beforeunload', handleBeforeUnload);

// 주기적으로 주문현황을 리프래시 해줌
const minute = 1;
setInterval(() => {
  if (isAutoCollect.value === true) {
    getTableList();
    handleCollect();
  }
}, minute * 60 * 1000);
</script>

<!--hello-->
<style scoped>
.hello {
  display: flex;
  justify-content: space-between;
}

.hello .left {
  display: flex;
  flex-direction: column;
  font-family: Nunito, sans-serif;
}

.hello .left .text-1 {
  font-size: 22px;
  color: #333;
  font-weight: bold;
}

.hello .left .text-2 {
  font-size: 20px;
  color: #333;
  padding-top: 10px;
}

.hello .left .text-3 {
  font-size: 14px;
  color: #999;
}

.hello .right {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #999;
  text-align: center;
}

.hello .right>div {
  width: 80px;
  border-left: 1px solid #eee;
}

.hello .right>div:first-child {
  border: none;
}

.hello .right>div div:first-child {
  color: #333;
  font-weight: bold;
}
</style>

<!--row 2-->
<style scoped>
.row1-content {
  position: relative;
  height: 220px;
  overflow: hidden;
  width: 100%;
}

.getMarketLogo .logo-tag {
  padding: 5px 10px 8px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.getMarketLogo img {
  width: 16px;
  height: 16px;
}

.getMarketLogo span {
  padding-left: 5px;
}

.sendMarketLogo .logo-tag {
  padding: 2px 10px 5px;
  margin-right: 10px;
  margin-bottom: 10px;
  background: #fff;
}

.sendMarketLogo img {
  width: 16px;
  height: 16px;
}

.sendMarketLogo span {
  padding-left: 5px;
}

.highlight {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    color: red;
    opacity: 1;
  }
  50% {
    color: red;
    opacity: 0;
  }
}
</style>

<!--row 3-->
<style scoped>
.content2 {
  height: 400px;
}

.scroll {
  overflow-y: scroll;
  /* 仅显示垂直滚动条 */
  height: 390px;
  padding-right: 20px;
}

.scroll h4 {
  font-weight: bold;
}

/* 滚动条整体样式 */
.scroll::-webkit-scrollbar {
  width: 8px;
  /* 设置滚动条的宽度 */
}

/* 滚动条轨道样式 */
.scroll::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  /* 设置滚动条轨道的背景颜色 */
}

/* 滚动条滑块样式 */
.scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  /* 设置滚动条滑块的背景颜色 */
  border-radius: 4px;
  /* 设置滚动条滑块的圆角 */
}

/* 鼠标悬停在滚动条上的样式 */
.scroll::-webkit-scrollbar-thumb:hover {
  background-color: #555;
  /* 设置滚动条滑块在鼠标悬停时的背景颜色 */
}</style>
