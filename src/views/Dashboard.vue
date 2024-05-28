<template>

  <!--인사말-->
  <div class="hello_area">
    안녕하세요  {{ account.userName }}님,
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
        <a href="/board/notice" class="more">more</a>
        <div class="title">공지사항</div>
        <div v-if="boardData.length === 0" style="display: flex;align-items: center;color: #939393">
          등록된 공지사항이 없습니다.
        </div>
        <ul v-else class="list">
          <li v-for="(notice,key) in boardData"><a :href="`/board/notice/view/${notice.id}`">{{ notice.title }}</a></li>
        </ul>
      </div>
    </a-col>
  </a-row>

  <!--주문현황-->
  <div class="stats_area">
    <div class="title" style="display: flex;justify-content: space-between">
      <div>
      주문현황
      </div>
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
<!--              <span class="highlight" v-if="record?.paidNew">{{ record?.paidNew }}</span>-->
              <span style="color: #000000D9;" >{{ record.paid }}</span>
            </template>
          </a-table-column>
          <a-table-column title="배송준비중" dataIndex="shippingAddress" key="shippingAddress" align="center">
            <template #default="{ record }">
<!--              <span class="highlight" v-if="record.shippingAddressNew">{{ record.shippingAddressNew }}</span>-->
              <span style="color: #000000D9;" >{{ record.shippingAddress }}</span>
            </template>
          </a-table-column>
          <a-table-column title="배송중" dataIndex="shipping" key="shipping" :align="'center'">
            <template #default="{ record }">
<!--              <span class="highlight" v-if="record.shippingNew">{{ record.shippingNew }}</span>-->
              <span style="color: #000000D9;" >{{ record.shipping }}</span>
            </template>
          </a-table-column>
          <a-table-column title="배송완료" dataIndex="shippingComplete" key="shippingComplete" :align="'center'">
            <template #default="{ record }">
<!--              <span class="highlight" v-if="record.shippingCompleteNew">{{ record.shippingCompleteNew }}</span>-->
              <span style="color: #000000D9;" >{{ record.shippingComplete }}</span>
            </template>
          </a-table-column>
          <a-table-column title="취소요청" dataIndex="cancelRequest" key="cancelRequest" :align="'center'">
            <template #default="{ record }">
<!--              <span class="highlight" v-if="record.cancelRequestNew">{{ record.cancelRequestNew }}</span>-->
              <span style="color: #000000D9;" >{{ record.cancelRequest }}</span>
            </template>
          </a-table-column>
          <a-table-column title="취소완료" dataIndex="cancelComplete" key="cancelComplete" :align="'center'">
            <template #default="{ record }">
<!--              <span class="highlight" v-if="record.cancelCompleteNew">{{ record.cancelCompleteNew }}</span>-->
              <span style="color: #000000D9;" >{{ record.cancelComplete }}</span>
            </template>
          </a-table-column>
          <a-table-column title="반품요청" dataIndex="returnRequest" key="returnRequest" :align="'center'">
            <template #default="{ record }">
<!--              <span class="highlight" v-if="record.returnRequestNew">{{ record.returnRequestNew }}</span>-->
              <span style="color: #000000D9;" >{{ record.returnRequest }}</span>
            </template>
          </a-table-column>
          <a-table-column title="반품완료" dataIndex="returnComplete" key="returnComplete" :align="'center'">
            <template #default="{ record }">
<!--              <span class="highlight" v-if="record.returnCompleteNew">{{ record.returnCompleteNew }}</span>-->
              <span style="color: #000000D9;" >{{ record.returnComplete }}</span>
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

  <a-row class="chart_area" :gutter="20">
    <a-col :span="8">
      <a-card style="background-color: #f0f0f0;height: 370px;" :body-style="{padding:20}">
        <template #title>
          <p style="font-size: 20px;font-weight: bold;margin: 20px 0;">마켓별 유입현황</p>
        </template>
        <div class="box">
          <div class="content" style="display: flex; justify-content: center; align-items: center; height: 240px;">
            <e-charts :option="radarChart" v-if="hasData" />
            <div v-if="!hasData" style="font-size:18px;color:#000">데이터가 없습니다.</div>
          </div>
        </div>
        <div id="main" style="width: 600px;height:400px;"></div>
        <div id="customLegend"></div>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card style="background-color: #f0f0f0;height: 370px;" :body-style="{padding:20}">
        <template #title>
          <p style="font-size: 20px;font-weight: bold;margin: 20px 0;">직원 업로드현황</p>
        </template>
        <template #extra>
          <div style="display: flex;gap: 3px">
          <a-radio-group class="right" size="small" v-model:value="pieChartOtion">
            <a-radio-button value="day">일별</a-radio-button>
            <a-radio-button value="week">주별</a-radio-button>
          </a-radio-group>
          </div>
        </template>
        <div class="box">
          <div class="content" style="display: flex; justify-content: center; align-items: center; height: 240px;">
            <e-charts :option="pieChartOption"/>
          </div>
        </div>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card :loading="dailySaleLoading" style="background-color: #f0f0f0;height: 370px;overflow: hidden" :body-style="{padding:20}">
        <template #title>
          <p style="font-size: 20px;font-weight: bold;margin: 20px 0;">매출현황</p>
        </template>
        <template #extra>
          <div style="display: flex;gap: 3px">
            <a-radio-group v-model:value="state.dailyData.params.period" class="right" @change="handleSaleChange" size="small">
              <a-radio-button value="1week">일주일</a-radio-button>
              <a-radio-button value="1month">1개월</a-radio-button>
            </a-radio-group>
          </div>
        </template>
        <div class="box">
          <div class="content" style="height: 290px; position: relative;bottom:0;margin-top: 0;overflow: hidden">
            <e-charts ref="barChartOptionRef" :option="barChartOption" style="position: absolute;bottom: 0 !important;"/>
          </div>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import ECharts from 'vue-echarts';
import {useMarketOrderApi} from "@/api/order";
import {useMarketApi} from '@/api/market';
import {useMarketAccountApi} from '@/api/marketAccount';
import {QuestionCircleOutlined} from "@ant-design/icons-vue";
import {useRouter} from "vue-router";
import Cookie from "js-cookie";
import dayjs from "dayjs";

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
  },

  marketList:[],

  radarData: {
    data: [],
    total: 0,

    loading: false,
    params: {
      market: [],
      account_ids: [],
      tansName: []
    }
  },

});
let productLoading = ref(false);
let orderLoading = ref(false);
let boardLoading = ref(false);
let dailySaleLoading = ref(false);

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
  "qoo10sg": 'https://qsm.qoo10.sg/GMKT.INC.Gsm.Web/login.aspx?ReturnUrl=%2fgmkt.inc.gsm.web%2f',
  "wemakeprice": 'https://wpartner.wemakeprice.com/login',
  "interpark": 'https://seller.interpark.com/login/loginForm.do',
}
const boardData = ref([]);

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
  userName: Cookie.get("member_name")
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

const handleSaleChange = () => {
  barChartSeriesData.value = [];
  getSaleList();
}
const getSaleList = async () => {

  dailySaleLoading.value = true;

  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/dailySale", state.dailyData).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    barChartSeriesData.value = [];

    for (const item in res.data) {

      let seriesName = '';
      if(item === 'amount') {
        seriesName = '판매금액';
      }
      // else if(item === 'count') {
      //   seriesName = '판매건수';
      // }
      else if(item === 'quantity') {
        seriesName = '판매수량';
      }

      const seriesData = [];
      barChartxAxisData.value.forEach((date) => {
        const dateStr = dayjs(date).format('YYYY-MM-DD');
        const value = res.data[item][dateStr] || 0;
        seriesData.push([date, value]);
      });

      const series = {
        data: seriesData,
        type: 'bar',
        name: seriesName
      }

      barChartSeriesData.value.push(series);
    }
    barChartOption.value.series = barChartSeriesData.value;
  }).catch((e) => {
    message.error(e.message);
    return false
  }).finally(() => {
    dailySaleLoading.value = false
  });
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

    if (!!oldOrderData) {
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

const barChartxAxisData = computed(() => {
  const xAxisData = [];
  const period = state.dailyData.params.period;
  if (period === '1week') {
    for (let i = 0; i < 7; i++) {
      xAxisData.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
    }
  } else if (period === '1month') {
    for (let i = 0; i < 30; i++) {
      xAxisData.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
    }
  }
  return xAxisData.reverse();
})
const barChartOptionRef = ref(null);
const resetBarChartOption = () => {
  barChartOptionRef.value.clear();
  barChartOptionRef.value.setOption(barChartOption);
}
const barChartSeriesData = ref([]);
const barChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '5%',
    containLabel: true
  },

  legend: {
    orient: 'horizontal',
    data: ['판매금액', '판매수량'],
    left: 'left',
    top: 'top',
    selectedMode: 'single'
  },
  xAxis: {
    type: 'time',
    data: barChartxAxisData.value,
    axisLabel: {
      formatter: function (value) {
        return dayjs(value).format('MM-DD');
      },
    },
  },
  yAxis: {
    type: 'value'
  },
  series: barChartSeriesData.value
});


const radarChart = ref({
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      const maxLength = 15;
      let displayName = params.name;
      if (displayName.length > maxLength) {
        displayName = displayName.substring(0, maxLength) + '...';
      }

      let tooltipContent = `<div><strong>${displayName}</strong><br>
        <table style="width:100%;">`;

      if (params.value && Array.isArray(params.value)) {
        params.value.forEach((value, index) => {
          if (params.componentType === 'series' && radarChart.value.radar.indicator[index]) {
            tooltipContent += `<tr>
              <td style="text-align: left;">${params.marker}${radarChart.value.radar.indicator[index].name}:</td>
              <td style="text-align: right;">${value}</td>
              </tr>`;
          }
        });
      }

      if (params.componentType === 'legend') {
        return params.name;
      }

      tooltipContent += "</table></div>";
      return tooltipContent;
    },
    position: function (point, params, dom, rect, size) {
      // 获取tooltip的宽度和高度
      const tooltipWidth = size.contentSize[0];
      const tooltipHeight = size.contentSize[1];

      const mouseX = point[0];
      const mouseY = point[1];

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let posX = mouseX;
      let posY = mouseY;

      if (posX + tooltipWidth > windowWidth) {
        posX -= tooltipWidth;
      }

      if (posY + tooltipHeight > windowHeight) {
        posY -= tooltipHeight;
      }

      return [posX, posY];
    }
  },

  legend: {
    orient: 'vertical',

    //商品名
    data: [],
    left: 'left',
    top: 'bottom',
    textStyle: {
      overflow: 'truncate',
      ellipsis: '...',
      width: 80
    },
    tooltip: {
      show: true
    }
  },
  radar: {
    // shape: 'circle',

    //market_code名
    indicator: []
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',

      //商品名&&market总浏览量
      data: [],
    }
  ]
});

const pieChartOtion = ref('day')
const pieChartOption = {

  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'bottom',
  },
  series: [
    {
      name: '업로드 현황',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'admin' },
        { value: 735, name: 'user_iweou' },
        { value: 580, name: '직원3' },
        { value: 484, name: '직원4' },
        { value: 300, name: '직원5' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

const getMarketList = async () => {
  await useMarketApi().getMarketList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketList = res.data;
  });
}

const getAccountList = async () => {
  await useMarketAccountApi().getAccountList({page:'all'}).then(async res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    radarChart.value.radar.indicator = [];
    res.data.list.reduce((acc, cur) => {
      if (!acc.includes(cur.marketCode)) {
        acc.push(cur.marketCode);
        radarChart.value.radar.indicator.push({name: state.marketList[cur.marketCode], code : cur.marketCode});
      }
      return acc;
    },[])

  });
}

const hasData = ref(true);

const  getProductVisitRadar = async () => {
  state.radarData.loading = true;

   await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/radarProductInfo").then(
      (res) => {
        if (res.status !== "2000" || res.data === undefined) {
          message.error(res.message);
          return false;
        }

        hasData.value = hasData.value === res.data.length > 0;

        const formatResData = res.data.reduce((acc, { prd_id, market_code, visit_count, prd_trans_name }) => {
          // 如果当前prd_id还没有对应的条目，初始化
          if (!acc[prd_id]) {
            acc[prd_id] = { name: prd_trans_name, visit: {} };
          }

          // 添加或更新当前市场的访问量
          acc[prd_id].visit[market_code] = visit_count;

          return acc;
        }, {});

        //legend.data商品名
        radarChart.value.legend.data = Object.values(formatResData).map(item => {
          return item.name;
        });

        radarChart.value.series[0].data = Object.values(formatResData).map(item => {
          const marketValues = radarChart.value.radar.indicator.map(() => 0);
          Object.keys(item.visit).forEach(marketCode => {
            const marketIndex = radarChart.value.radar.indicator.findIndex(market => market.code === marketCode);
            if (marketIndex !== -1) {
              marketValues[marketIndex] = item.visit[marketCode];
            }
          });
          return {
            name: item.name,
            value: marketValues
          };
        });

      }
  );
}


onMounted(async () => {
  await getTableList()
  await getMarketList()
  handleBeforeUnload();
  //getOrder();
  Promise.all([getBoard(), getSaleList(), getMarketAdminUrls(), getHeaderCount(), getAccountList()])
    .catch((e) => {
      message.error(e.message)
      return false;
    });

  await getProductVisitRadar();
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style>
.ant-col .ant-radio-button-wrapper.ant-radio-button-wrapper-checked{
  background-color: #3377e4;
  color: #fff;
  border-color: #3377e4;
}
.ant-col .ant-radio-button-wrapper.ant-radio-button-wrapper-checked span{
  color: #fff;
}

.ant-col .ant-radio-button-wrapper.ant-radio-button-wrapper-checked span:hover{
  color: #fff;
}
.ant-col .ant-radio-button-wrapper span:hover{
  color: #3377e4;
}
.ant-col .ant-radio-button-wrapper:hover{
  color: #3377e4;
}
</style>
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
  width: 400px;
}

.dailySale .echarts {
  transform: scale(0.95);
  transform-origin: center center;
  transition: transform 0.3s ease;
  width: 80%;
  height: 250px;
}

</style>