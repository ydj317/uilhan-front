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
          <div>제휴사</div>
          <div>9</div>
        </div>
        <div>
          <div>상품</div>
          <div>98</div>
        </div>
        <div>
          <div>주문</div>
          <div>318</div>
        </div>
      </div>
    </div>
    </a-card>

    <a-card :bordered="false" title="수집가능 마켓" class="setting-page-margin" style="margin-top: 20px;">
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

    <a-row type="flex" justify="space-between" align="bottom" style="margin-top: 20px;"  :gutter="20">
      <a-col :span="8">
        <a-card :bordered="false" title="총 판매액">
            <div class="data">1,026,560원</div>
            <div class="content content-1">
            <div>어제 보다 12%
              <caret-up-filled :rotate="0" style="color:red;" />
            </div>
            <div>편균 보다 11%
              <caret-up-filled :rotate="180" style="color:green;" />
            </div>
          </div>
            <div class="sub">일일 판매액 ₩ 100,000</div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" title="10일 판매액">
          <div class="data">600,000원</div>
          <div class="content content-2">
            <e-charts class="chart" :option="option" />
          </div>
          <div class="sub">10일 평균 판매액 ₩ 100,000</div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" title="제휴사 연동 상황">
          <div class="data">80%</div>
          <div class="content content-3">
            <div>
              <div style="width: 80%;"></div>
            </div>
          </div>
          <div class="sub-2">
            <div class="linked">연동중</div>
            <div class="no-linked">미연동</div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row type="flex" justify="space-between" align="bottom" style="margin-top: 20px;"  :gutter="20">
      <a-col :span="8">
        <a-card :bordered="false" title="상품 연동 상태">
          <div class="content2">
            <e-charts class="chart-2" :option="option2" />
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" title="주문 상태">
          <div class="content2">
            <e-charts class="chart-3" :option="option3" />
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" title="공지사항">
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
//icon
import { CaretUpFilled, DoubleRightOutlined } from "@ant-design/icons-vue";

import { ref, onMounted } from "vue";
import { AuthRequest } from "@/util/request";
import moment from "moment/moment";
import Loading from "vue-loading-overlay";
import { message } from "ant-design-vue";

const boardData = ref([]);

let totalCount = ref(0);
let prdLinkedData = ref([]);

function getLogoSrc(fileName, marketCode) {
  try {
    return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
  } catch (error) {
    return require("../../assets/img/temp_image.png");
  }
};

// 상품연동상태 데이타
function getLinkedData(data) {
  let transformedData = {};
  data.list.forEach(item => {
    item.item_sync_market.forEach(syncMarket => {
      const name = syncMarket.market_account.split("::")[0];
      if (transformedData.hasOwnProperty(name)) {
        if (syncMarket.status === "unsync") {
          transformedData[name] += 1;
        }
      } else {
        transformedData[name] = 0;
      }
    });
  });

  return Object.keys(transformedData).map(name => {
    return {
      name: name,
      value: transformedData[name]
    };
  });
}

//chart
const option = ref({
  grid: {
    top: "0",
    bottom: "0",
    left: "0",
    right: "0"
  },
  tooltip: {
    trigger: "axis",
    position: function(pt) {
      return [pt[0], "10%"];
    },
    valueFormatter: (value) => value.toFixed(2) + "만"
  },
  xAxis: {
    show: false,
    type: "category",
    boundaryGap: false,
    data: ["2023.06.04", "2023.06.05", "2023.06.06", "2023.06.07", "2023.06.08", "2023.06.09", "2023.06.10", "2023.06.11", "2023.06.12", "2023.06.13"]
  },
  yAxis: {
    show: false,
    type: "value"
  },
  series: [
    {
      type: "line",
      smooth: 0.3,
      symbol: "none",
      lineStyle: {
        width: 0
      },
      areaStyle: {
        color: "#1890ff",
        opacity: 0.7
      },
      data: [20, 100, 20, 10, 20, 80, 30, 10, 50, 60]
    }
  ]
});

//chart2
const option2 = ref({
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
      data: [
        { name: "11번가", value: 20 },
        { name: "쿠팡", value: 30 },
        { name: "옥션", value: 10 },
        { name: "지마켓", value: 40 },
        { name: "롯데온", value: 30 },
        { name: "티몬", value: 30 },
        { name: "위메프", value: 20 }
      ]
    }
  ]
});

//chart3
const option3 = ref({
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
      data: [
        { value: 1048, name: "발주확인" },
        { value: 735, name: "배송중" },
        { value: 580, name: "배송완료" },
        { value: 484, name: "취소주문" },
        { value: 300, name: "반품주문" }
      ]
    }
  ]
});

function parseHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;

  if (div.innerHTML.length > 100) {
    div.innerHTML = div.innerHTML.slice(0, 100) + "...";
  }

  return div.textContent;
}

function getBoard() {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/board/list", "").then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }

      boardData.value = res.data;
    }
  );
}

function getList() {
  let param = {
    "market_code": "all",
    "date_type": "insert_date",
    "start_time": "",
    "end_time": "",
    "search_key": "item_code",
    "search_value": "",
    "trans_status": "",
    "sync_status": "all",
    "limit": 10,
    "page": 1
  };
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prdlist", { params: param }).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
    }

    console.log("==0==");
    console.log(res.data);
  });
}

onMounted(() => {
  // getList();
  getBoard();
});
</script>

<!----------style start---------->

<!--chart-->
<style scoped>
.chart {
  height: 400px;
}

.getMarketLogo .logo-tag {
  padding: 5px 10px 8px;
  margin-right: 10px;
}

.getMarketLogo img {
  width: 16px;
  height: 16px;
}

.getMarketLogo span {
  padding-left: 5px;
}

</style>

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

<!--line-2-->
<style scoped>
.data {
  font-size: 24px;
  color: #333;
}

.content {
  height: 60px;
}

.content-1 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.content-1 div {
  margin-right: 10px;
  font-size: 14px;
  color: #999
}

.content-2 .chart {
  width: 100%;
  height: 100%;
}

.content-3 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.content-3 > div {
  width: 100%;
  height: 10px;
  background: #ccc;
}

.content-3 > div > div {
  position: relative;
  height: 10px;
  background: #1890ff;
}

.content-3 > div > div:before {
  position: absolute;
  top: -4px;
  right: 0;
  display: block;
  content: '';
  width: 2px;
  height: 18px;
  background: #1890ff;
}

.sub {
  font-size: 12px;
  color: #999;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.sub-2 {
  display: flex;
  justify-content: flex-start;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.sub-2 > div {
  position: relative;
  padding: 0 10px 0 20px;
}

.sub-2 > div:before {
  position: absolute;
  top: 5px;
  left: 0;
  content: '';
  width: 15px;
  height: 10px;
}

.sub-2 .linked:before {
  background: #1890ff;
}

.no-linked:before {
  background: #ccc;
}
</style>

<!--line-3-->
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
