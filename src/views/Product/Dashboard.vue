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

    <a-row type="flex" justify="space-between" align="bottom" style="margin-top: 20px;" :gutter="20">
      <a-col :span="8">
        <a-card :loading="orderLoading" :bordered="false" title="판매액">
          <div class="row1-content">
            <div style="font-size: 22px; color: #000; padding-bottom: 10px;">총 {{ allSales.toLocaleString() }}원</div>
            <div class="content content-1" style="display: flex; justify-content: flex-start; align-items: center;">
              <div style="margin-right: 10px; font-size: 14px; color: #999">전주 보다 {{ comparedToLastWeek }}%
                <CaretUpFilled :rotate="comparedToLastWeek >= 0 ? 0 : 180" :style="comparedToLastWeek >= 0 ? 'color:red' : 'color:green'" />
              </div>
              <div style="margin-right: 10px; font-size: 14px; color: #999">어제 보다 {{ comparedToYesterday }}%
                <CaretUpFilled :rotate="comparedToYesterday >= 0 ? 0 : 180" :style="comparedToYesterday >= 0 ? 'color:red' : 'color:green'" />
              </div>
            </div>
            <div style="font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;">
              오늘 판매액 {{ todaySales.toLocaleString() }}원
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
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
      <a-col :span="8">
        <a-card :loading="productLoading" :bordered="false" title="연동마켓">
          <div class="row1-content sendMarketLogo">
            <a-checkable-tag class="logo-tag" v-for="market in accountMarket" @click="onOpenMarketUrl(market.split('::')[0])">
              <img :src="getLogoSrc('market-logo', market.split('::')[0])" alt=""> <span>{{ market.split('::')[1] }}</span>
            </a-checkable-tag>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row type="flex" justify="space-between" align="bottom" style="margin-top: 20px;" :gutter="20">
      <a-col :span="8">
        <a-card :loading="productLoading" :bordered="false" title="상품 연동 상태">
          <div class="content2">
            <e-charts class="chart-2" :option="productChart" />
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :loading="orderLoading" :bordered="false" title="주문 상태">
          <div class="content2">
            <e-charts class="chart-3" :option="orderChart" />
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
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
      </a-col>
    </a-row>

  </div>

</template>

<script setup>
import { CaretUpFilled } from "@ant-design/icons-vue";
import { ref, onMounted } from "vue";
import { AuthRequest } from "@/util/request";
import { message } from "ant-design-vue";
import ECharts from 'vue-echarts';

const productLoading = ref(true);
const orderLoading = ref(true);
const boardLoading = ref(true);

const marketTotal = ref('-');
const productTotal = ref('-');
const orderTotal = ref('-');

const allSales = ref('-');
const todaySales = ref('-');
const comparedToYesterday = ref('-');
const comparedToLastWeek = ref('-');

const accountMarket = ref([]);
const marketSellerUrl = {
  '11st': 'https://login.11st.co.kr/auth/front/selleroffice/login.tmall',
  gmarket: 'https://www.esmplus.com/Member/SignIn/LogOn',
  esm_auction: 'https://www.esmplus.com/Member/SignIn/LogOn',
  auction: 'https://www.esmplus.com/Member/SignIn/LogOn',
  esm_gmarket: 'https://www.esmplus.com/Member/SignIn/LogOn',
  tmon: 'https://ps.tmon.co.kr/',
  lotteon: 'https://store.lotteon.com/cm/main/login_SO.wsp',
  coupang: 'https://xauth.coupang.com/auth/realms/seller/protocol/openid-connect/auth?response_type=code&client_id=wing&redirect_uri=https%3A%2F%2Fwing.coupang.com%2Fsso%2Flogin?returnUrl%3Dhttps%253A%252F%252Fwing.coupang.com%252F&state=07f8260c-b504-4d28-ad9f-b8a1110402b4&login=true&ui_locales=ko-KR&scope=openid',
  storefarm: 'https://accounts.commerce.naver.com/login?url=https%3A%2F%2Fsell.smartstore.naver.com%2F%23%2Flogin-callback',

  qoo10_sg: 'https://qsm.qoo10.sg/GMKT.INC.Gsm.Web/login.aspx?ReturnUrl=%2fgmkt.inc.gsm.web%2f',


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
  const params = {params: {type: 'notice'}}
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

onMounted(() => {
  getOrder();
  getProduct();
  getBoard();
});
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
  height: 110px;
  overflow: hidden;
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
</style>

<!--row 3-->
<style scoped>
.content2 {
  height: 400px;
}

.scroll {
  overflow-y: scroll; /* 仅显示垂直滚动条 */
  height: 390px;
  padding-right: 20px;
}

.scroll h4 {
  font-weight: bold;
}

/* 滚动条整体样式 */
.scroll::-webkit-scrollbar {
  width: 8px; /* 设置滚动条的宽度 */
}

/* 滚动条轨道样式 */
.scroll::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
}

/* 滚动条滑块样式 */
.scroll::-webkit-scrollbar-thumb {
  background-color: #888; /* 设置滚动条滑块的背景颜色 */
  border-radius: 4px; /* 设置滚动条滑块的圆角 */
}

/* 鼠标悬停在滚动条上的样式 */
.scroll::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 设置滚动条滑块在鼠标悬停时的背景颜色 */
}
</style>
