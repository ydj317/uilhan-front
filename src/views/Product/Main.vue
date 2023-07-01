<template>
  <div id="container">

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

    <div class="line-2">
      <div class="box">
        <div class="title">총 판매액</div>
        <div class="data">₩ 1,026,560</div>
        <div class="content content-1">
          <div>어제 보다 12% <caret-up-filled :rotate="0" style="color:red;" /></div>
          <div>편균 보다 11% <caret-up-filled :rotate="180" style="color:green;" /></div>
        </div>
        <div class="sub">일일 판매액 ₩ 100,000</div>
      </div>

      <div class="box">
        <div class="title">10일 판매액</div>
        <div class="data">₩ 600,000</div>
        <div class="content content-2"><e-charts class="chart" :option="option" /></div>
        <div class="sub">10일 평균 판매액 ₩ 100,000</div>
      </div>

      <div class="box">
        <div class="title">제휴사 연동 상황</div>
        <div class="data">80%</div>
        <div class="content content-3">
          <div><div style="width: 80%;"></div></div>
        </div>
        <div class="sub-2">
          <div class="linked">연동중</div>
          <div class="no-linked">미연동</div>
        </div>
      </div>
    </div>

    <div class="line-3">
      <div class="box">
        <div class="title">상품 연동 상태</div>
        <div class="content"><e-charts class="chart-2" :option="option2" /></div>
      </div>

      <div class="box">
        <div class="title">주문 상태</div>
        <div class="content"><e-charts class="chart-3" :option="option3" /></div>
      </div>

      <div class="box">
        <div class="title">공지사항</div>
        <div class="content">
          <div class="scroll">
            <a-list item-layout="horizontal" :data-source="boardData">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :description="item.cont">
                    <template #title>
                      <a>{{ item.title }}</a>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </div>
      </div>
    </div>


  </div>

</template>

<script setup>
//icon
import { CaretUpFilled } from '@ant-design/icons-vue';

import { ref, onMounted } from "vue";
import { AuthRequest } from "@/util/request";

const boardData = [
  {
  title: '개인정보 처리 방침의 강화',
  cont: '개인정보 보호를 위해 서비스 이용과 관련된 개인정보 처리 방침이 보다 강화되었습니다. 자세한 내용은 개인정보 처리 방침 페이지를 참고해 주세요.',
}, {
  title: '서비스 이용에 대한 책임과 제한',
  cont: '이용자의 서비스 이용에 대한 책임과 제한에 대한 내용이 명확히 규정되었습니다. 이에 따라 서비스 이용 시 유의사항을 준수해 주시기 바랍니다.',
}, {
  title: '약관 동의의 필요성',
  cont: '변경된 이용약관에 동의하지 않을 경우 일부 서비스의 이용이 제한될 수 있으니 주의해 주세요.',
}, {
  title: '서비스 이용약관 개정 안내',
  cont: '저희 서비스를 이용해 주셔서 감사합니다. 이용약관 개정에 따라 공지사항을 작성하오니, 아래 내용을 주의 깊게 확인해주시기 바랍니다.',
}, {
  title: '서비스 이용약관 개정 안내',
  cont: '저희 서비스를 이용해 주셔서 감사합니다. 이용약관 개정에 따라 공지사항을 작성하오니, 아래 내용을 주의 깊게 확인해주시기 바랍니다.',
}, {
  title: '새로운 서비스 출시 안내',
  cont: '새로운 서비스는 "스마트 홈 관리 시스템"입니다. 이 시스템은 최신 기술을 활용하여 사용자의 스마트 홈을 효율적으로 관리할 수 있는 도구를 제공합니다. ',
}
];

let totalCount = ref(0);
let prdLinkedData = ref([]);

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
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
  },
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    },
    valueFormatter: (value) => value.toFixed(2) + '만'
  },
  xAxis: {
    show: false,
    type: 'category',
    boundaryGap: false,
    data: ['2023.06.04', '2023.06.05', '2023.06.06', '2023.06.07', '2023.06.08', '2023.06.09', '2023.06.10', '2023.06.11', '2023.06.12', '2023.06.13']
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  series: [
    {
      type: 'line',
      smooth: 0.3,
      symbol: 'none',
      lineStyle: {
        width: 0
      },
      areaStyle: {
        color: '#1890ff',
        opacity: 0.7
      },
      data: [20, 100, 20, 10, 20, 80, 30, 10, 50, 60]
    }
  ]
});

//chart2
const option2 = ref({
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        fontSize: 15,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 17,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true,
        lineStyle: {
          width: 3
        },
      },
      data: [
        {name: '11번가', value : 20},
        {name: '쿠팡', value : 30},
        {name: '옥션', value : 10},
        {name: '지마켓', value : 40},
        {name: '롯데온', value : 30},
        {name: '티몬', value : 30},
        {name: '위메프', value : 20},
      ]
    }
  ]
});

//chart3
const option3 = ref({
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        fontSize: 15,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 17,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true,
        lineStyle: {
          width: 3
        },
      },
      data: [
        { value: 1048, name: '발주확인' },
        { value: 735, name: '배송중' },
        { value: 580, name: '배송완료' },
        { value: 484, name: '취소주문' },
        { value: 300, name: '반품주문' }
      ]
    }
  ]
});

function getBoard() {
  const params = ''
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/list', params).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      return false;
    }

    console.log('==0==')
    console.log(res.data)

  }).catch((error) => {
    alert(error.message);
    return false;
  });
  // AuthRequest.get(process.env.VUE_APP_API_URL + "/api/board/list").then((res) => {
  //     if (res.status !== "2000") {
  //       alert(res.message);
  //       return false;
  //     }
  //
  //     console.log('==0==')
  //     console.log(res.data)
  //   }
  // );
}

onMounted(() => {
  getBoard();
});
</script>

<!----------style start---------->

<!--chart-->
<style scoped>
.chart {
  height: 400px;
}
</style>

<!--hello-->
<style scoped>
.hello {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
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

<!--line-2-->
<style scoped>
.line-2 {
  display: flex;
  justify-content: space-between;
}
.line-2 .box {
  padding: 20px;
  margin-top: 1.2%;
  width: 32.5%;
  height: 180px;
  background: #fff;
}
.line-2 .box .title {
  font-size: 14px;
  color: #999;
}
.line-2 .box .data {
  font-size: 24px;
  color: #333;
}
.line-2 .box .content {
  height: 60px;
}
.line-2 .box .content-1 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.line-2 .box .content-1 div {
  margin-right: 10px;
  font-size: 14px;
  color: #999
}
.line-2 .box .content-2 .chart {
  width: 100%;
  height: 100%;
}
.line-2 .box .content-3 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.line-2 .box .content-3>div {
  width: 100%;
  height: 10px;
  background: #ccc;
}
.line-2 .box .content-3>div>div {
  position: relative;
  height: 10px;
  background: #1890ff;
}
.line-2 .box .content-3>div>div:before {
  position: absolute;
  top:-4px;
  right: 0;
  display: block;
  content: '';
  width: 2px;
  height: 18px;
  background: #1890ff;
}
.line-2 .box .sub {
  font-size: 12px;
  color: #999;
  border-top: 1px solid #eee;
  padding-top: 10px;
}
.line-2 .box .sub-2 {
  display: flex;
  justify-content: flex-start;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #eee;
  padding-top: 10px;
}
.line-2 .box .sub-2>div {
  position: relative;
  padding: 0 10px 0 20px;
}
.line-2 .box .sub-2>div:before {
  position: absolute;
  top: 5px;
  left: 0;
  content: '';
  width: 15px;
  height: 10px;
  background: #000;
}
.line-2 .box .sub-2 .linked:before {
  background: #1890ff;
}
.line-2 .box .sub-2 .no-linked:before {
  background: #ccc;
}
</style>

<!--line-3-->
<style scoped>
.line-3 {
  display: flex;
  justify-content: space-between;
}
.line-3 .box {
  padding: 20px;
  margin-top: 1.2%;
  width: 32.5%;
  height: 450px;
  background: #fff;
}
.line-3 .box .title {
  font-size: 14px;
  color: #999;
}
.line-3 .box .content {
  height: 400px;
}

.line-3 .box .scroll {
  overflow-y: scroll; /* 仅显示垂直滚动条 */
  height: 390px;
  padding-right: 20px;
}

.line-3 .box .scroll h4 {
  font-weight: bold;
}

/* 滚动条整体样式 */
.line-3 .box .scroll::-webkit-scrollbar {
  width: 8px; /* 设置滚动条的宽度 */
}

/* 滚动条轨道样式 */
.line-3 .box .scroll::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
}

/* 滚动条滑块样式 */
.line-3 .box .scroll::-webkit-scrollbar-thumb {
  background-color: #888; /* 设置滚动条滑块的背景颜色 */
  border-radius: 4px; /* 设置滚动条滑块的圆角 */
}

/* 鼠标悬停在滚动条上的样式 */
.line-3 .box .scroll::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 设置滚动条滑块在鼠标悬停时的背景颜色 */
}
</style>
