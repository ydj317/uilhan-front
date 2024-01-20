<template>

  <!--인사말-->
  <div class="hello_area">
    안녕하세요  yuil님,
  </div>

  <!--배너, 수집현황, 월통계, 공지사항-->
  <a-row :gutter="20">
    <a-col :span="6">
      <div class="dashboard_img1">
        <img src="@/assets/img/dashboard_img1.jpg" alt="">
      </div>
    </a-col>
    <a-col :span="6">
      <div class="data_count1">
        <div class="collect">
          <div class="title">수집</div>
          <div class="name"><span class="point">35</span> / 76</div>
        </div>
        <div class="upload">
          <div class="title">업로드</div>
          <div class="name"><span class="point">109</span> / 120</div>
        </div>
      </div>
    </a-col>
    <a-col :span="6">
      <div class="data_count2">
        <div class="title">이번달 합계</div>
        <div class="data_area">
          <div class="collect">
            <div class="point">35</div>
            <div class="name">수집</div>
          </div>
          <div class="upload">
            <div class="point">109</div>
            <div class="name">업로드</div>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="6">
      <div class="notice">
        <a href="##" class="more">more</a>
        <div class="title">공지사항</div>
        <ul class="list">
          <li><a href="##">[유일공지] 배송지연안내</a></li>
          <li><a href="##">[유일공지] 송장번호오류안내</a></li>
          <li><a href="##">[유일공지] 마켓연동안내</a></li>
          <li><a href="##">[유일공지] 마켓연동안내</a></li>
          <li><a href="##">[유일공지] 마켓연동안내</a></li>
        </ul>
      </div>
    </a-col>
  </a-row>

  <!--주문현황-->
  <div class="stats_area">
    <div class="title">
      주문현황
      <a-tooltip>
        <template #title>
          <div>자동수집 체크박스를 클릭해주시면 실시간 주문현황을 확인 할수 있어요</div>
        </template>
        <QuestionCircleOutlined/>
      </a-tooltip>
      <a-checkbox v-model:checked="isAutoCollect" class="ml10" @change="handleAutoCollectChange">자동수집</a-checkbox>
    </div>
    <a-card :loading="orderLoading" :bodyStyle="orderLoading ? {overflow: 'hidden'} : {padding: 0, overflow: 'hidden'}">
        <a-table :data-source="account.orderData.data" :pagination="false" class="table">
          <a-table-column title="판매처" dataIndex="manage" key="manage" :align="'center'">
            <template #default="{ record }">
              <div style="cursor: pointer;display: flex; align-items: center"
                   @click="openMarketAdminPage(record.market_code)">
                <img :src="getLogoSrc('market-logo', record.market_code)" alt=""
                     style="width: 18px;border-radius: 50%;" class="mr10">{{ record.seller_id }}
              </div>
            </template>
          </a-table-column>
          <a-table-column title="결제완료" dataIndex="paid" key="paid" :align="'center'">
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
          <a-table-column title="배송중" dataIndex="shipping" key="shipping" :align="'center'">
            <template #default="{ record }">
              <span class="highlight" v-if="record.shippingNew">{{ record.shippingNew }}</span>
              <span style="color: #000000D9;" v-if="!record.shippingNew">{{ record.shipping }}</span>
            </template>
          </a-table-column>
          <a-table-column title="배송완료" dataIndex="shippingComplete" key="shippingComplete" :align="'center'">
            <template #default="{ record }">
              <span class="highlight" v-if="record.shippingCompleteNew">{{ record.shippingCompleteNew }}</span>
              <span style="color: #000000D9;" v-if="!record.shippingCompleteNew">{{ record.shippingComplete }}</span>
            </template>
          </a-table-column>
          <a-table-column title="취소요청" dataIndex="cancelRequest" key="cancelRequest" :align="'center'">
            <template #default="{ record }">
              <span class="highlight" v-if="record.cancelRequestNew">{{ record.cancelRequestNew }}</span>
              <span style="color: #000000D9;" v-if="!record.cancelRequestNew">{{ record.cancelRequest }}</span>
            </template>
          </a-table-column>
          <a-table-column title="취소완료" dataIndex="cancelComplete" key="cancelComplete" :align="'center'">
            <template #default="{ record }">
              <span class="highlight" v-if="record.cancelCompleteNew">{{ record.cancelCompleteNew }}</span>
              <span style="color: #000000D9;" v-if="!record.cancelCompleteNew">{{ record.cancelComplete }}</span>
            </template>
          </a-table-column>
          <a-table-column title="반품요청" dataIndex="returnRequest" key="returnRequest" :align="'center'">
            <template #default="{ record }">
              <span class="highlight" v-if="record.returnRequestNew">{{ record.returnRequestNew }}</span>
              <span style="color: #000000D9;" v-if="!record.returnRequestNew">{{ record.returnRequest }}</span>
            </template>
          </a-table-column>
          <a-table-column title="반품완료" dataIndex="returnComplete" key="returnComplete" :align="'center'">
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
                <a-typography-text>{{ account.orderData.totalCancelRequest }}</a-typography-text>
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
  </div>

  <!--데이타 도표-->
  <a-row class="chart_area" :gutter="20">
    <a-col :span="8">
      <div class="box">
        <div class="title">마켓별 유입현황</div>
        <div class="content" style="display: flex; justify-content: center; align-items: center; height: 240px;">
          <img src="@/assets/img/chart1.jpg" alt="">
        </div>
      </div>
    </a-col>
    <a-col :span="8">
      <div class="box">
        <div class="title">알바생 업로드현황</div>
        <div class="content" style="display: flex; justify-content: center; align-items: center; height: 240px;">
          <img src="@/assets/img/chart2.jpg" alt="">
        </div>
      </div>
    </a-col>
    <a-col :span="8">
      <div class="box" style="background: #f9f9f9;">
        <div class="title" v-if="!dailySaleLoading">매출현황</div>
        <div class="content">
          <a-card :loading="dailySaleLoading" :body-style="{background: '#f9f9f9'}" style=" border: none">
            <div class="mt10">
              <a-radio-group v-model:value="state.dailyData.params.period" class="right" @change="getSaleList('')" size="small">
                <a-radio-button value="1week">일주일</a-radio-button>
                <a-radio-button value="1month">1개월</a-radio-button>
                <a-radio-button value="3month">3개월</a-radio-button>
              </a-radio-group>
            </div>
            <div class="mt30">
              <div>
                <a-button size="small" :type="state.dailyData.params.type === 'amount' ? 'primary' : 'default'" :style="state.dailyData.params.type === 'amount' ? 'background: #fff' : ''" :ghost="state.dailyData.params.type === 'amount'" @click="getSaleList('amount')">판매 금액</a-button>
              </div>
              <div class="mt10">
                <a-button size="small" :type="state.dailyData.params.type === 'quantity' ? 'primary' : 'default'"  @click="getSaleList('quantity')">판매 수량</a-button><br>
              </div>
              <div class="mt10">
                <a-button size="small" :type="state.dailyData.params.type === 'count' ? 'primary' : 'default'"  @click="getSaleList('count')">판매 건수</a-button>
              </div>
            </div>
            <div class="dailySale" style="min-width: 460px;">
              <e-charts :option="dailySaleChart" autoresize/>
            </div>
          </a-card>
        </div>
      </div>
    </a-col>
  </a-row>

  <div style="height: 100px;"></div>
</template>

<script setup>
import {ref, onMounted, reactive, onBeforeUnmount, watch} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import ECharts from 'vue-echarts';
import {useMarketOrderApi} from "@/api/order";
import {useMarketApi} from '@/api/market';
import {QuestionCircleOutlined, ShoppingCartOutlined, UploadOutlined, ShoppingOutlined} from "@ant-design/icons-vue";
import {useRouter} from "vue-router";

const router = useRouter();

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

const goLinkPage = (path) => {
  window.location.href=path
};

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


const getSaleList = async (value) => {
  dailySaleLoading.value = true;
  if (value !== '') {
    state.dailyData.params.type = value
  }
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
  Promise.all([getBoard(), getTableList().then(() => {
    handleBeforeUnload();
  }), getSaleList(''), getMarketAdminUrls(), getHeaderCount()])
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
      totalCancelRequest,
      totalCancelComplete,
      totalReturnRequest,
      totalReturnComplete
    } = res.data

    let orderDataView = [];
    // 데이터를 조회해올때마다 루프 돌리며 판단하여 데이터 변경이 있는 애들을 찾아냄
    const oldOrderData = sessionStorage.getItem('orderData');

    if (oldOrderData) {
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

        newData.cancelRequestNew = '';
        if (!isNaN(item['cancelRequest']) && !isNaN(newData['cancelRequest']) && newData['cancelRequest'] - item['cancelRequest'] > 0) {
          newQty = newData['cancelRequest'] - item['cancelRequest'];
          newData.cancelRequestNew = item['cancelRequest'].toString() + ' + ' + newQty.toString();
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
    account.orderData.totalCancelRequest = totalCancelRequest;
    account.orderData.totalCancelComplete = totalCancelComplete;
    account.orderData.totalReturnRequest = totalReturnRequest;
    account.orderData.totalReturnComplete = totalReturnComplete;

    state.headerCount.orderTotal = totalPaid + totalShippingAddress + totalShipping + totalShippingComplete
    state.headerCount.claimTotal = totalCancelRequest + totalCancelComplete + totalReturnRequest + totalReturnComplete

    // 리스트 데이터를 세션스토레이지에 넣어서 비교할때 사용함
    // const newOrderData = JSON.stringify(list);
    // sessionStorage.setItem('orderData', newOrderData);

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
const handleBeforeUnload = () => {
  // 在页面关闭前执行操作
  const newOrderData = JSON.stringify(account.orderData.list);
  sessionStorage.setItem('orderData', newOrderData);
};

let intervalId = null;
const handleAutoCollectChange = (e) => {
  const minute = 1;
  if(e.target.checked === true) {
    intervalId = setInterval(() => {
      getTableList();
      handleCollect();
    }, minute * 60 * 1000);
  } else {
    clearInterval(intervalId);
  }
}

onBeforeUnmount(() => {
  clearInterval(intervalId);
  handleBeforeUnload();
});
</script>

<style scoped>

.hello_area {
  font-size: 24px;
  margin-bottom: 20px;
}

.dashboard_img1 {
  height: 190px;
}

.dashboard_img1 img {
  width: 100%;
  height: 190px;
  border-radius: 20px;
}

.data_count1 .collect, .data_count1 .upload {
  background: #ffd117;
  border-radius: 20px;
  height: 90px;
  padding: 0 32px;
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 左右对齐，两个子元素分别位于容器的两侧 */
  align-items: center; /* 垂直居中对齐，可选 */
}

.data_count1 .title {
  font-size: 18px;
  font-weight: bold;
}

.data_count1 .name {
  font-size: 14px;
}

.data_count1 .point {
  font-size: 48px;
  font-weight: bold;
}

.data_count1 .collect .point {
  color: #ff6700;
}

.data_count1 .upload .point {
  color: #2071e1;
}

.data_count1 .upload {
  margin-top: 10px;
}

.data_count2 {
  background: #f0f0f0;
  border-radius: 20px;
  height: 190px;
  padding: 32px;
}

.data_count2 .title {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 35px;
}

.data_count2 .data_area {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 左右对齐，两个子元素分别位于容器的两侧 */
}

.data_count2 .data_area>div {
  width: 30%;
  text-align: center;
}

.data_count2 .point {
  font-size: 48px;
  font-weight: bold;
}

.data_count2 .name {
  font-size: 14px;
}


.data_count2 .collect .point {
  color: #ff6700;
}

.data_count2 .upload .point {
  color: #2071e1;
}

.notice {
  position: relative;
  border: 2px solid #f9f9f9;
  border-radius: 20px;
  padding: 32px 32px 10px 32px;
  height: 190px;
}

.notice .more {
  position: absolute;
  top: 35px;
  right: 35px;
  display: block;
  font-size: 12px;
  color: #ff6700;
}

.notice .title {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 20px;
}

.notice .list {
  height: 100px;
  overflow: hidden;
}

.notice .list li {
  list-style-type: none;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden;    /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 使用省略号来表示被省略的文本 */
}
.notice .list li a {
  font-size: 14px;
  line-height: 26px;
  color: #828282;
}

.notice .list li a:hover {
  color: #ff6700;
}

.stats_area {
  margin-top: 40px;
}

.stats_area .title {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 10px;
}

.chart_area {
  margin-top: 40px;
}

.chart_area .box {
  position: relative;
  background: #f0f0f0;
  border-radius: 20px;
  height: 240px;
  overflow: hidden;
}

.chart_area .title {
  position: absolute;
  top: 32px;
  left: 30px;
  font-size: 18px;
  font-weight: bold;
  z-index: 1;
}

.table .ant-table-summary td {
  border-bottom: none;
}

.chart_area .content {
  position: relative;
}
.dailySale {
  position: absolute;
  top: 20px;
  right: -20px;
  width: 400px;
}
.dailySale .echarts {
  transform: scale(0.95);
  transform-origin: center center;
  transition: transform 0.3s ease; /* 변환에 애니메이션 적용 */
  width: 100%;
  height: 250px;
}

</style>