<template>
  <div id="container">

    <a-card :bordered="false">
      <div class="hello">
        <div class="left">
          <div class="text-1">안녕하십니까!</div>
          <div class="text-2">저희 서비스를 이용해 주셔서 감사합니다.</div>
          <div class="text-3">문의사항이나 궁금한 점이 있으시면 오른쪽 아래 {챗아이콘}을 클릭하여 문의 부탁합니다.</div>
        </div>
      </div>
    </a-card>

    <a-row type="flex" justify="space-between" align="top" style="margin-top: 20px;" :gutter="10">
      <a-col :sm="24" :md="24" :lg="16">
        <div>
          <a-row :gutter="10">
            <a-col :span="8">
              <a-card style="position: relative;display: flex;justify-content: start;justify-items: center">
                <a-statistic
                    :value="state.headerCount.marketTotal"
                    :value-style="{ color: '#3f8600' }"
                    style="margin-right: 50px"
                >
                  <template #title>
                    <h3>마켓 연동</h3>
                  </template>
                </a-statistic>
                <div
                    style="position:absolute;right:20px;top:20px;display: flex; justify-content: center; align-items: center;">
                  <div
                      style="width: 80px; height: 80px; border-radius: 50%; background-color: rgba(199,236,208,0.5); display: flex; justify-content: center; align-items: center;">
                    <shopping-cart-outlined :style="{fontSize: '32px',color:'#17802c'}"/>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card style="position: relative;display: flex;justify-content: start;justify-items: center">
                <a-statistic
                    :value="state.headerCount.productTotal"
                    class="demo-class"
                    :value-style="{ color: '#cf1322' }"
                >
                  <template #title>
                    <h3>업로드 상품수</h3>
                  </template>
                </a-statistic>
                <div
                    style="position:absolute;right:20px;top:20px;display: flex; justify-content: center; align-items: center;">
                  <div
                      style="width: 80px; height: 80px; border-radius: 50%; background-color: rgba(236,199,205,0.5); display: flex; justify-content: center; align-items: center;">
                    <upload-outlined :style="{fontSize: '32px',color:'#ce1948'}"/>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card style="position: relative;display: flex;justify-content: start;justify-items: center">
                <a-statistic
                    :value="state.headerCount.orderTotal"
                    class="demo-class"
                    :value-style="{ color: '#1332cf' }"
                >
                  <template #title>
                    <h3>주문</h3>
                  </template>
                </a-statistic>
                <div
                    style="position:absolute;right:20px;top:20px;display: flex; justify-content: center; align-items: center;">
                  <div
                      style="width: 80px; height: 80px; border-radius: 50%; background-color: rgba(199,208,236,0.5); display: flex; justify-content: center; align-items: center;">
                    <shopping-outlined :style="{fontSize: '32px',color:'#2144b4'}"/>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>
        <a-card :loading="orderLoading" :bordered="false" title="주문현황" class="mt10 mb10">
          <template #extra>
            <a-tooltip>
              <template #title>
                <div>자동수집 체크박스를 클릭해주시면 실시간 주문현황을 확인 할수 있어요</div>
              </template>
              <QuestionCircleOutlined/>
            </a-tooltip>
            <a-checkbox v-model:checked="isAutoCollect" class="ml10">자동수집</a-checkbox>
          </template>
          <a-table :data-source="account.orderData.data" :pagination="false" size="small" summary>
            <a-table-column title="판매처" dataIndex="manage" key="manage">
              <template #default="{ record }">
                <div style="cursor: pointer;display: flex;align-items: center"
                     @click="openMarketAdminPage(record.market_code)">
                  <img :src="getLogoSrc('market-logo', record.market_code)" alt=""
                       style="width: 18px;border-radius: 50%;" class="mr10">{{ record.seller_id }}
                </div>
              </template>
            </a-table-column>
            <a-table-column title="결제완료" dataIndex="paid" key="paid" align="center">
              <template #default="{ record }">
                <span class="highlight" v-if="record.paidNew">{{ record.paidNew }}</span>
                <span style="color: #000000D9;" v-if="!record.paidNew">{{ record.paid }}</span>
              </template>
            </a-table-column>
            <a-table-column title="배송준비중" dataIndex="shippingAddress" key="shippingAddress" align="center">
              <template #default="{ record }">
                <span class="highlight" v-if="record.shippingAddressNew">{{ record.shippingAddressNew }}</span>
                <span style="color: #000000D9;" v-if="!record.shippingAddressNew">{{ record.shippingAddress }}</span>
              </template>
            </a-table-column>
            <a-table-column title="배송중" dataIndex="shipping" key="shipping" align="center">
              <template #default="{ record }">
                <span class="highlight" v-if="record.shippingNew">{{ record.shippingNew }}</span>
                <span style="color: #000000D9;" v-if="!record.shippingNew">{{ record.shipping }}</span>
              </template>
            </a-table-column>
            <a-table-column title="배송완료" dataIndex="shippingComplete" key="shippingComplete" align="center">
              <template #default="{ record }">
                <span class="highlight" v-if="record.shippingCompleteNew">{{ record.shippingCompleteNew }}</span>
                <span style="color: #000000D9;" v-if="!record.shippingCompleteNew">{{ record.shippingComplete }}</span>
              </template>
            </a-table-column>
            <a-table-column title="주문취소" dataIndex="cancelComplete" key="cancelComplete" align="center">
              <template #default="{ record }">
                <span class="highlight" v-if="record.cancelCompleteNew">{{ record.cancelCompleteNew }}</span>
                <span style="color: #000000D9;" v-if="!record.cancelCompleteNew">{{ record.cancelComplete }}</span>
              </template>
            </a-table-column>
            <a-table-column title="반품요청" dataIndex="returnRequest" key="returnRequest" align="center">
              <template #default="{ record }">
                <span class="highlight" v-if="record.returnRequestNew">{{ record.returnRequestNew }}</span>
                <span style="color: #000000D9;" v-if="!record.returnRequestNew">{{ record.returnRequest }}</span>
              </template>
            </a-table-column>
            <a-table-column title="반품완료" dataIndex="returnComplete" key="returnComplete" align="center">
              <template #default="{ record }">
                <span class="highlight" v-if="record.returnCompleteNew">{{ record.returnCompleteNew }}</span>
                <span style="color: #000000D9;" v-if="!record.returnCompleteNew">{{ record.returnComplete }}</span>
              </template>
            </a-table-column>
            <template #summary>
              <a-table-summary-row>
                <a-table-summary-cell>합계</a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{ account.orderData.totalPaid }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{ account.orderData.totalShippingAddress }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{ account.orderData.totalShipping }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{ account.orderData.totalShippingComplete }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{ account.orderData.totalCancelComplete }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{ account.orderData.totalReturnRequest }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell align="center">
                  <a-typography-text>{{ account.orderData.totalReturnComplete }}</a-typography-text>
                </a-table-summary-cell>
              </a-table-summary-row>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="24" :lg="8">
        <a-card :bordered="true" title="공지사항" :loading="boardLoading">
          <!-- more -->
          <template #extra>
            <router-link to="/board/notice">more</router-link>
          </template>
          <a-list>
            <a-list-item v-for="(item,index) in boardData" :key="index">
              <router-link :to="`/board/notice/view/${item.id}`">
                {{ item.title }}
              </router-link>
            </a-list-item>
          </a-list>
        </a-card>
        <a-card :loading="dailySaleLoading" :bordered="false" title="매출현황" class="mt10">
          <template #extra>
            <a-radio-group v-model:value="state.dailyData.params.period" class="right" @change="getSaleList"
                           size="small">
              <a-radio-button value="1week">일주일</a-radio-button>
              <a-radio-button value="1month">1개월</a-radio-button>
              <a-radio-button value="3month">3개월</a-radio-button>
            </a-radio-group>
          </template>
          <a-radio-group v-model:value="state.dailyData.params.type" @change="getSaleList" size="small">
            <a-radio-button value="amount">판매 금액</a-radio-button>
            <a-radio-button value="quantity">판매 수량</a-radio-button>
            <a-radio-button value="count">판매 건수</a-radio-button>
          </a-radio-group>
          <div class="dailySale" style="min-width: 460px;">
            <e-charts :option="dailySaleChart" autoresize/>
          </div>
        </a-card>
        <a-card :loading="productLoading" :bordered="false" title="수집가능 마켓" class="mt10">
          <div class="getMarketLogo">
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
    </a-row>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive, onBeforeUnmount} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import ECharts from 'vue-echarts';
import {useMarketOrderApi} from "@/api/order";
import {useMarketApi} from '@/api/market';
import {QuestionCircleOutlined, ShoppingCartOutlined, UploadOutlined, ShoppingOutlined} from "@ant-design/icons-vue";

const state = reactive({
  dailyData: {
    params: {
      period: '1week',
      type: 'amount'
    }
  },
  headerCount: {
    marketTotal: '0',
    productTotal: '0',
    orderTotal: '0'
  }
});
let productLoading = ref(false);
let orderLoading = ref(false);
let boardLoading = ref(false);
let dailySaleLoading = ref(false);
const isAutoCollect = ref(false);

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
      name: "값:",
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
    totalShipping: 0,
    totalShippingComplete: 0,
    totalCancelComplete: 0,
    totalReturnRequest: 0,
    totalReturnComplete: 0,
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
    return require(`../assets/img/list/${fileName}/${marketCode}.png`);
  } catch (error) {
    return require("assets/img/temp_image.png");
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

async function getBoard() {
  boardLoading.value = true
  const params = {params: {type: 'notice', page: 1, pageSize: 5}}
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/board/list", params).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }
        const {total, rows} = res.data
        boardData.value = rows;
        boardLoading.value = false
      }
  );
}


const getSaleList = async () => {
  dailySaleLoading.value = true;
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/dailySale", state.dailyData).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    dailySaleDaysData.value = res.data.days;
    dailySaleChartData.value = res.data.sales;
  }).catch((e) => {
    message.error(e.message);
    return false
  }).finally(() => {
    dailySaleLoading.value = false
  });
}

onMounted(() => {
  //getOrder();
  Promise.all([getBoard(), getTableList(), getSaleList(), getMarketAdminUrls(), getHeaderCount()])
      .catch((e) => {
        message.error(e.message)
        return false;
      });
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

// 마켓 연동,업로드 상품수,주문 토탕
const getHeaderCount = async () => {
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/getHearderCount").then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    const {marketTotal, productTotal} = res.data;
    state.headerCount.marketTotal = marketTotal;
    state.headerCount.productTotal = productTotal;
    //state.headerCount.orderTotal = orderTotal;
  });
}
const getTableList = async () => {
  orderLoading.value = true;
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/order2").then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const {
      list,
      total,
      totalPaid,
      totalShippingAddress,
      totalShipping,
      totalShippingComplete,
      totalCancelComplete,
      totalReturnRequest,
      totalReturnComplete
    } = res.data

    let orderDataView = [];
    // 데이터를 조회해올때마다 루프 돌리며 판단하여 데이터 변경이 있는 애들을 찾아냄
    const oldOrderData = sessionStorage.getItem('orderData');

    if (Array.isArray(oldOrderData) && oldOrderData.length > 0) {
      const oldOrderJson = JSON.parse(oldOrderData);
      oldOrderJson.forEach((item) => {
        const newData = findObjectById(item.id, list);
        let newQty = 0;
        newData.paidNew = '';
        if (!isNaN(item['paid']) && !isNaN(newData['paid']) && newData['paid'] - item['paid'] > 0) {
          newQty = newData['paid'] - item['paid'];
          newData.paidNew = item['paid'].toString() + ' + ' + newQty.toString();
        }
        newData.shippingAddressNew = '';
        if (!isNaN(item['shippingAddress']) && !isNaN(newData['shippingAddress']) && newData['shippingAddress'] - item['shippingAddress'] > 0) {
          newQty = newData['shippingAddress'] - item['shippingAddress'];
          newData.shippingAddressNew = item['shippingAddress'].toString() + ' + ' + newQty;
        }
        newData.shippingNew = '';
        if (!isNaN(item['shipping']) && !isNaN(newData['shipping']) && newData['shipping'] - item['shipping'] > 0) {
          newQty = newData['shipping'] - item['shipping'];
          newData.shippingNew = item['shipping'].toString() + ' + ' + newQty;
        }
        newData.shippingCompleteNew = '';
        if (!isNaN(item['shippingComplete']) && !isNaN(newData['shippingComplete']) && newData['shippingComplete'] - item['shippingComplete'] > 0) {
          newQty = newData['shippingComplete'] - item['shippingComplete'];
          newData.shippingCompleteNew = item['shippingComplete'].toString() + ' + ' + newQty;
        }
        newData.cancelCompleteNew = '';
        if (!isNaN(item['cancelComplete']) && !isNaN(newData['cancelComplete']) && newData['cancelComplete'] - item['cancelComplete'] > 0) {
          newQty = newData['cancelComplete'] - item['cancelComplete'];
          newData.cancelCompleteNew = item['cancelComplete'].toString() + ' + ' + newQty.toString();
        }
        newData.returnRequestNew = '';
        if (!isNaN(item['returnRequest']) && !isNaN(newData['returnRequest']) && newData['returnRequest'] - item['returnRequest'] > 0) {
          newQty = newData['returnRequest'] - item['returnRequest'];
          newData.returnRequestNew = item['returnRequest'].toString() + ' + ' + newQty.toString();
        }

        newData.returnCompleteNew = '';
        if (!isNaN(item['returnComplete']) && !isNaN(newData['returnComplete']) && newData['returnComplete'] - item['returnComplete'] > 0) {
          newQty = newData['returnComplete'] - item['returnComplete'];
          newData.returnCompleteNew = item['returnComplete'].toString() + ' + ' + newQty.toString();
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
    account.orderData.totalShipping = totalShipping;
    account.orderData.totalShippingComplete = totalShippingComplete;
    account.orderData.totalCancelComplete = totalCancelComplete;
    account.orderData.totalReturnRequest = totalReturnRequest;
    account.orderData.totalReturnComplete = totalReturnComplete;

    state.headerCount.orderTotal = totalPaid + totalShippingAddress + totalShipping + totalShippingComplete
    state.headerCount.claimTotal = totalCancelComplete + totalReturnRequest + totalReturnComplete

    // 리스트 데이터를 세션스토레이지에 넣어서 비교할때 사용함
    const newOrderData = JSON.stringify(list);
    sessionStorage.setItem('orderData', newOrderData);

  }).catch((e) => {
    message.error(e.message);
    return false
  }).finally(() => {
    orderLoading.value = false;
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

.hello .right > div {
  width: 80px;
  border-left: 1px solid #eee;
}

.hello .right > div:first-child {
  border: none;
}

.hello .right > div div:first-child {
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

<style>
.dailySale .echarts {
  transform: scale(0.95);
  transform-origin: center center;
  transition: transform 0.3s ease; /* 변환에 애니메이션 적용 */
  width: 100%;
  height: 300px;
  max-width: 490px;
}
</style>