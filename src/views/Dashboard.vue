<template>
  <a-flex class="dashboard">
    <a-flex vertical class="dashboard-left mb40">
      <div class="slide-wrap">
        <a-carousel autoplay ref="carousel">
                    <div v-for="image in formState.bannerList" class="fl-tc carousel-slide"><img :src="image"/></div>
        </a-carousel>
        <div class="slide-dot-wrap fl-c fl-te" style="gap: 10px;display: none;" ref="scrollContainer">
          <div class="slide-dot" :class="{'active':i == formState.slideActive}" v-for="(v,i) in formState.bannerList" @click="toggleSlide(i)">
            <img :src="v"/>
          </div>
        </div>
      </div>
      <a-flex justify="space-between" class="intro-wrap mt30" gap="16">
        <template v-for="v in formState.introList">
          <a-flex justify="space-between" class="intro" :class="v.status">
            <a-flex vertical>
              <div class="title fw fs20">{{ v.title }}</div>
              <div class="content mt10" v-html="v.content"></div>
            </a-flex>
            <img :src="v.img" class="ml20"/>
            <a-tag :bordered="false" color="error" class="coming fl-cc" v-if="v.status == 'off'">coming soon</a-tag>
          </a-flex>
        </template>
      </a-flex>
      <a-flex vertical class="table-wrap mt30">
        <a-flex align="center" class="title h42">
          <img src="@/assets/img/dashboard/table.png"/>
          <span class="ml10 fs20 fw">주문현황</span>
        </a-flex>
        <a-skeleton :loading="formState.tableList.loading" active>
          <a-table :columns="tableColumns" :data-source="formState.tableList.data" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'manage'">
                <div class="cp fl-tc"
                     @click="openMarketAdminPage(record.market_code)">
                  <img :src="getLogoSrc('market-logo', record.market_code)"
                       style="width: 34px;border-radius: 50%;" class="mr10">{{ record.seller_id }}
                </div>
              </template>
              <template v-else>
              <span :class="{ 'color-b9bdc9':record[column.dataIndex] == 0}">
                {{ record[column.dataIndex] }}
              </span>
              </template>
            </template>
            <template #summary style="background: #F1F3F8">
              <a-table-summary-row>
                <a-table-summary-cell>합계</a-table-summary-cell>
                <a-table-summary-cell>
                  <a-typography-text :class="{'color-b9bdc9':formState.tableList.totalPaid == 0}">{{ formState.tableList.totalPaid }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell>
                  <a-typography-text :class="{'color-b9bdc9':formState.tableList.totalShippingAddress == 0}">{{ formState.tableList.totalShippingAddress }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell>
                  <a-typography-text :class="{'color-b9bdc9':formState.tableList.totalShipping == 0}">{{ formState.tableList.totalShipping }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell>
                  <a-typography-text :class="{'color-b9bdc9':formState.tableList.totalShippingComplete == 0}">{{ formState.tableList.totalShippingComplete }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell>
                  <a-typography-text :class="{'color-b9bdc9':formState.tableList.totalCancelRequest == 0}">{{ formState.tableList.totalCancelRequest }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell>
                  <a-typography-text :class="{'color-b9bdc9':formState.tableList.totalCancelComplete == 0}">{{ formState.tableList.totalCancelComplete }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell>
                  <a-typography-text :class="{'color-b9bdc9':formState.tableList.totalReturnRequest == 0}">{{ formState.tableList.totalReturnRequest }}</a-typography-text>
                </a-table-summary-cell>
                <a-table-summary-cell>
                  <a-typography-text :class="{'color-b9bdc9':formState.tableList.totalReturnComplete == 0}">{{ formState.tableList.totalReturnComplete }}</a-typography-text>
                </a-table-summary-cell>
              </a-table-summary-row>
            </template>
          </a-table>
        </a-skeleton>
      </a-flex>
    </a-flex>
    <a-flex vertical class="dashboard-right ml40">
      <div class="notice-wrap fs14">
        <a-tabs v-model:activeKey="formState.noticeActiveTab">
          <a-tab-pane key="1" tab="유일 공지">
            <a-skeleton :loading="formState.noticeLoading" active>
            <template v-for="(v,i) in formState.noticeList" >
              <div @click="goNoticeView(v.id)">
                <a-flex align="center" class="notice-list cp h44 p10" v-if="i<6" >
                  <div class="content fs15 dot">{{ v.title }}</div>
                  <div class="rq ml10 fs14 color-969DAE">{{ v.rq }}</div>
                </a-flex>
              </div>
            </template>
            </a-skeleton>
          </a-tab-pane>
          <a-tab-pane key="2" tab="배송대행 공지">
            <template v-for="(v,i) in formState.expressList">
              <a-flex align="center" justify="space-between" class="notice-list cp h44 p10" :class="v.color" v-if="i<6">
                <img :src="v.img" class="mr10"/>
                <div class="content fs15 dot">{{ v.title}}</div>
                <div class="rq ml10 fs14 color-969DAE">{{ v.rq}}</div>
              </a-flex>
            </template>
          </a-tab-pane>
          <template #rightExtra>
            <span class="cp" @click="goNoticeUrl">이동 <RightOutlined /></span>
          </template>
        </a-tabs>
      </div>
      <div class="collect-wrap mt40">
        <a-collapse :bordered="false" expandIconPosition="end" ghost v-model:activeKey="formState.collectActive">
          <template #expandIcon="props">
            <div class="fl-tc">
              <span class="mr8 color-2755f9 fs16">{{collectCount}}</span>
              <DownOutlined :style="{ transform: props.isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }" />
            </div>
          </template>
          <a-collapse-panel key="1" header="오늘 수집한 상품" >
            <a-divider class="m0 mb16"></a-divider>
            <a-flex wrap="wrap" class="collect-list color-2755f9" gap="16">
              <a-flex vertical align="center" class="collect-main cp" v-for="v in formState.collectList">
                <img :src="v.img"/>
                <div class="number mt6" :class="{'color-b9bdc9':v.count==0,'fs14':v.count==0}">{{ v.count }}</div>
              </a-flex>
            </a-flex>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="upload-wrap mt40">
        <a-collapse :bordered="false" expandIconPosition="end" ghost v-model:activeKey="formState.uploadActive">
          <template #expandIcon="props">
            <div class="fl-tc">
              <template v-if="props.isActive">
                <span  class="mr8 color-2755f9 fs16">{{uploadCount}}</span>
              </template>
              <template v-else>
                <div class="avatar-group-wrap mr10">
                  <a-avatar-group  :size="34">
                    <template v-for="(v,i) in formState.uploadAvatar">
                      <a-avatar :src="v"  v-if="i<3" />
                    </template>
                  </a-avatar-group>
                  <a-flex class="more fl-cc" gap="2" v-if="formState.uploadAvatar.length > 3">
                    <div></div>
                    <div></div>
                    <div></div>
                  </a-flex>
                </div>
              </template>
              <DownOutlined :style="{ transform: props.isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }" />
            </div>
          </template>
          <a-collapse-panel key="1" header="전체 연동 마켓 업로드 현황" class="fs16 color-3F4249">
            <a-flex>
              <a-tabs v-model:activeKey="formState.uploadActiveTab">
                <a-tab-pane key="1" tab="오늘 업로드 상품수">
                  <a-flex wrap="wrap" class="collect-list color-2755f9" gap="16">
                    <a-flex vertical align="center" class="collect-main cp" v-for="v in formState.MarketList">
                      <img :src="getLogoSrc('market-logo', v.market)">
                      <div class="number mt6" :class="{'color-b9bdc9':v.todayCount==0,'fs14':v.todayCount==0}" >{{v.todayCount}}</div>
                    </a-flex>
                  </a-flex>
                </a-tab-pane>
                <a-tab-pane key="2" tab="전체 업로드 상품수">
                  <a-flex wrap="wrap" class="collect-list color-2755f9" gap="16">
                    <a-flex vertical align="center" class="collect-main cp" v-for="v in formState.MarketList">
                      <img :src="getLogoSrc('market-logo', v.market)">
                      <div class="number mt6" :class="{'color-b9bdc9':v.count==0,'fs14':v.count==0}">{{v.count}}</div>
                    </a-flex>
                  </a-flex>
                </a-tab-pane>
              </a-tabs>
            </a-flex>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <a-flex align="center" justify="end" class="money-wrap p20 mt40">
        <a-flex vertical align="end">
          <div class="title fs14 color-b9bdc9">최근 7일간 판매금액</div>
          <div class="money t-white fs16 mt5">+{{ numberFormat(formState.saleMoney) }}원</div>
        </a-flex>
      </a-flex>
    </a-flex>
  </a-flex>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { AuthRequest } from "@/util/request";
import { message} from "ant-design-vue";
import { QuestionCircleOutlined,DownOutlined,RightOutlined} from "@ant-design/icons-vue";
import { useMarketApi } from "@/api/market";
import { useMarketAccountApi } from "@/api/marketAccount";
const router = useRouter();


const formState = reactive({
  bannerList:[
    require('@/assets/img/dashboard/dashboard_0.png'),
    require('@/assets/img/dashboard/dashboard_1.png'),
    require('@/assets/img/dashboard/dashboard_2.png'),
    require('@/assets/img/dashboard/dashboard_3.png'),
    require('@/assets/img/dashboard/dashboard_4.png'),
    require('@/assets/img/dashboard/dashboard_5.png'),
    require('@/assets/img/dashboard/dashboard_6.png'),
  ],
  slideList:[
    {title:'이벤트',content:'유일 솔루션 신규 이벤트'},
    {title:'이벤트2',content:'유일 솔루션 신규 이벤트'},
    {title:'이벤트3',content:'유일 솔루션 신규 이벤트'},
    {title:'이벤트4',content:'유일 솔루션 신규 이벤트'},
    {title:'이벤트5',content:'유일 솔루션 신규 이벤트'},
  ],
  slideActive:0,
  introList:[
    {title:'아카데미',content:'연매출 100억 만들기 프로젝트<br> 모든 노하우를 공유하세요.',img:require('@/assets/img/dashboard/intro1.png'),status:'on'},
    {title:'중국시장 10억 찾기',content:'박람회, 이우시장 탐험 프로젝트<br>혼자 사입이 어렵다면 10명이서 같이 해보세요.',img:require('@/assets/img/dashboard/intro2.png'),status:'on'},
    {title:'체험단',content:'머니를 받고 매장이나 제품을 체험하고 홍보해주세요.',img:require('@/assets/img/dashboard/intro3.png'),status:'off'},
  ],
  marketAdminUrls:[],
  MarketList:[],
  tableList: {
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
  },
  noticeList:[],
  expressList:[
    {img:require(`@/assets/img/dashboard/notice2.png`),title:'웨이하이 - 변경 전 주소로 배송된 화물 처리 안내',rq:'7.28',color:'7390F8'},
    {img:require(`@/assets/img/dashboard/notice2.png`),title:'CJ대한통운 - 폭우로 인한 배송지연 지역 안내',rq:'7.26',color:'7390F8'},
    {img:require(`@/assets/img/dashboard/notice1.png`),title:'도쿄점 - 휴무 안내',rq:'7.22',color:'FA794D'},
    {img:require(`@/assets/img/dashboard/notice1.png`),title:'중국 -FTA제율 적용 관련 추가 안내',rq:'7.18',color:'FA794D'},
    {img:require(`@/assets/img/dashboard/notice2.png`),title:'웨이하이 B2B - 로켓그로스 출고 지원',rq:'7.17',color:'7390F8'},
    {img:require(`@/assets/img/dashboard/notice1.png`),title:'도쿄 - 대금상환 거래 수취거부 안내',rq:'7.15',color:'FA794D'},
  ],
  noticeActiveTab:'1',
  noticeLoading:false,
  collectList:[
    {img:require(`@/assets/img/dashboard/collect1.png`),market:'Taobao',count:0},
    {img:require(`@/assets/img/dashboard/collect2.png`),market:'Tmall',count:0},
    {img:require(`@/assets/img/dashboard/collect3.png`),market:'Aliexpress',count:0},
    {img:require(`@/assets/img/dashboard/collect4.png`),market:'Alibaba',count:0},
  ],
  collectActive:'1',
  uploadActive:'1',
  uploadActiveTab:'1',
  uploadAvatar:[],
  saleMoney:0,
  saleParams: {
    params: {
      period: '1week',
      type: 'amount'
    }
  },
});
//表格部分start
const tableColumns = [
  {
    title: '판매처',
    dataIndex: 'manage',
  },
  {
    title: '결제완료',
    dataIndex: 'paid',
  },
  {
    title: '배송준비중',
    dataIndex: 'shippingAddress',
  },
  {
    title: '배송중',
    dataIndex: 'shipping',
  },
  {
    title: '배송완료',
    dataIndex: 'shippingComplete',
  },
  {
    title: '취소요청',
    dataIndex: 'cancelRequest',
  },
  {
    title: '취소완료',
    dataIndex: 'cancelComplete',
  },
  {
    title: '반품요청',
    dataIndex: 'returnRequest',
  },
  {
    title: '반품완료',
    dataIndex: 'returnComplete',
  },
];
const getTableList = async () => {
  formState.tableList.loading = true;
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
    const oldTableList = sessionStorage.getItem('tableList');

    if (isValidJson(oldTableList)) {
      const oldOrderJson = JSON.parse(oldTableList);
      oldOrderJson.forEach((item) => {
        const newData = findObjectById(item.id, list);
        if (newData) {
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
        }else {
          console.error(`Could not find object with id ${item.id}`);
        }
      });
    } else {
      orderDataView = list
    }

    formState.tableList.data = orderDataView;
    formState.tableList.list = list
    formState.tableList.total = total;
    formState.tableList.totalPaid = totalPaid;
    formState.tableList.totalShippingAddress = totalShippingAddress;
    formState.tableList.totalShipping = totalShipping;
    formState.tableList.totalShippingComplete = totalShippingComplete;
    formState.tableList.totalCancelRequest = totalCancelRequest;
    formState.tableList.totalCancelComplete = totalCancelComplete;
    formState.tableList.totalReturnRequest = totalReturnRequest;
    formState.tableList.totalReturnComplete = totalReturnComplete;
  }).catch((e) => {
    message.error(e.message);
    return false
  }).finally(() => {
    formState.tableList.loading = false;
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
const isValidJson = (str) => {
  if (str === null || str === undefined) {
    return false;
  }

  try {
    const parsed = JSON.parse(str);
    // 检查解析后的结果是否为非空对象或数组
    if (typeof parsed === 'object' && parsed !== null) {
      // 检查是否是空对象或空数组
      if (Array.isArray(parsed)) {
        return parsed.length > 0; // 非空数组
      } else {
        return Object.keys(parsed).length > 0; // 非空对象
      }
    }
    return true; // 是有效的 JSON 字符串，但不是对象或数组
  } catch (e) {
    return false;
  }
}
//表格部分end
// 监听页面关闭事件
const handleBeforeUnload = () => {
  // 在页面关闭前执行操作
  const newOrderData = JSON.stringify(formState.tableList.list);
  sessionStorage.setItem('tableList', newOrderData);
};

//market市场url地址
const getMarketAdminUrls = async () => {
  await useMarketApi().getMarketAdminUrls({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    formState.marketAdminUrls = res.data;
  });
}
//market图标
function getLogoSrc(fileName, marketCode) {
  try {
    return require(`../assets/img/list/${fileName}/${marketCode}.png`);
  } catch (error) {
    return require("assets/img/temp_image.png");
  }
}
// 跳转market市场
const openMarketAdminPage = (marketCode) => {
  const url = formState.marketAdminUrls[marketCode]['order'];
  if (!url) {
    message.error("마켓 관리자 페이지가 등록되지 않았습니다.");
    return false;
  }
  window.open(url);
}

//消息
async function getBoard() {
  formState.noticeLoading = true
  const params = {params: {type: 'notice', page: 1, pageSize: 5}}
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/board/list", params).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
      const {total, rows} = res.data
    rows.map((item)=>{
      let date = new Date(item.insDate);
      let month = date.getMonth() + 1; // getMonth() 返回的是0-11，所以需要+1
      let day = date.getDate();
      item.rq = `${month}.${day}`;
      return item;
    })
    formState.noticeList = rows;
    formState.noticeLoading = false
    }
  );
}

const goNoticeUrl = () => {
  if(formState.noticeActiveTab == 1){
    location.href = '/board/notice';
  }else{
  }
};
const goNoticeView = (id) => {
    location.href = '/board/notice/view/'+id;
};
const getCollectCount = async () => {
  await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/collectCount", {}).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
      formState.collectList.map((v)=>{
        res.data.filter((v2)=>{
          if(v.market==v2.market){
            v.count = v2.count;
          }
        })
      });
    }
  );
}
//收集总量
const collectCount = computed(()=>{
  let tmp = 0;
  formState.collectList.map((v)=>{
    tmp += v.count;
  });
  return tmp;
})
const getMarketList = async () => {
  await useMarketAccountApi().getAccountList({page: 1, pageSize: 20}).then(res => {
    const { list, total } = res.data
    list.map((v)=>{
      formState.MarketList.push({ market:v.marketCode,todayCount:0,count:0 });
      formState.uploadAvatar.push(getLogoSrc('market-logo',v.marketCode));
    });
    getUploadCount();
  });
};
const getUploadCount = async () => {
  await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/uploadCount", {}).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
      formState.MarketList.map((v)=>{
        res.data.filter((v2)=>{
          if(v.market==v2.market){
            v.count = v2.count;
            v.todayCount = v2.todayCount;
          }
        })
      });
    }
  );
}
//上传总量
const uploadCount = computed(()=>{
  let tmp = 0;
  formState.MarketList.map((v)=>{
    if(formState.uploadActiveTab == 1){
      tmp += v.todayCount;
    }else{
      tmp += v.count;
    }
  });
  return tmp;
})

//近七天销售额
const getSaleList = async () => {
  await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/dashboard/dailySale", formState.saleParams).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    for (const v in res.data.amount) {
      formState.saleMoney += parseFloat(res.data.amount[v]);
    }
  }).catch((e) => {
    message.error(e.message);
    return false
  }).finally(() => {
  });
}

//轮播图滚动
const carousel = ref(null);
const scrollContainer = ref(null);
let isDragging = false;
let startY = 0;
let scrollTop = 0;

const toggleSlide = (i) => {
  formState.slideActive = i;
  if (carousel.value) {
    carousel.value.goTo(i);
  }
};

const onMouseDown = (event) => {
  isDragging = true;
  startY = event.clientY;
  scrollTop = scrollContainer.value.scrollTop;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (event) => {
  if (!isDragging) return;
  const deltaY = event.clientY - startY;
  scrollContainer.value.scrollTop = scrollTop - deltaY;
};

const onMouseUp = () => {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};
const  numberFormat= (num) => {
  return parseFloat(num).toLocaleString();
};
onMounted(async () => {
  await getTableList()
  handleBeforeUnload();
  Promise.all([getBoard(), getMarketAdminUrls(),getCollectCount(),getMarketList(),getSaleList()])
    .catch((e) => {
      message.error(e.message)
      return false;
    });
  scrollContainer.value.addEventListener('mousedown', onMouseDown);
});
onBeforeUnmount(() => {
  scrollContainer.value.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});
</script>
<style scoped>
:deep(.slide-wrap .slick-slide) {
  width: 100%;
  height: 430px;
}
:deep(.slide-wrap .slick-dots li) {
  background: #e3e3e3;
}
:deep(.slide-wrap .slick-dots li.slick-active button) {
  background: #cecbcb;
}
:deep(.table-wrap .ant-table-cell) {
  text-align: center!important;
}
:deep(.table-wrap .ant-table-thead .ant-table-cell) {
  background: none!important;
}
:deep(.table-wrap .ant-table-thead .ant-table-cell:before) {
  width: 0!important;
}
:deep(.table-wrap .ant-table-thead th:first-child) {
  width: 10%;
}
:deep(.table-wrap .ant-table-summary .ant-table-cell) {
  background: #fafafa;
}
:deep(.notice-wrap .ant-tabs-nav) {
  height: 80px;
  padding: 16px 12px;
}
:deep(.notice-wrap .ant-tabs-tab) {
  font-size: 14px;
  color: #898F9E!important;
}
:deep(.notice-wrap .ant-tabs-tab-active .ant-tabs-tab-btn) {
  font-size: 20px;
  color: #3F4249!important;
}
:deep(.upload-wrap .ant-tabs-tab) {
  font-size: 12px;
  color: #898F9E!important;
}
:deep(.upload-wrap .ant-tabs-tab-active .ant-tabs-tab-btn) {
  font-size: 14px;
  color: #3F4249!important;
}
:deep(.ant-tabs-tab.ant-tabs-tab-active) {
  background: none!important;
}
:deep(.ant-tabs-ink-bar) {
  height: 0!important;
}
:deep(.collect-wrap .ant-collapse-header-text) {
  font-size: 16px;
  color: #3F4249;
}
:deep(.upload-wrap .ant-collapse-header) {
  padding: 6px 16px;
}
:deep(.upload-wrap .ant-collapse-content-box) {
  padding-block: 0!important;
}
 .dashboard-left{
  width: calc(100% - 400px);
}
 .slide-wrap{
   position: relative;
 }
 .carousel-slide{
   height: 430px;
 }
.slide-wrap img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
 .slide-dot-wrap{
   position: absolute;
   right: 20px;
   top: 20px;
   width: 280px;
   height: calc(100% - 40px);
   overflow: hidden;
   overflow-y: scroll;
   padding-right: 10px;
 }
.slide-dot-wrap::-webkit-scrollbar {
  width: 0;
}
 .slide-dot{
   width: 240px;
   min-height: 83px;
   line-height: 150%;
   font-size: 16px;
   border-radius: 16px;
   cursor: pointer;
   transition: width 0.3s ease, min-height 0.3s ease, padding 0.3s ease, background-color 0.3s ease;
   position: relative;
   background: #fff;
   color: black;
   border: 1px solid #e3e3e3;
   opacity: 0.6;
 }
.slide-dot:hover,.slide-dot.active{
  width: 260px;
  min-height: 103px;
  overflow: hidden;
  opacity: 1;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.40);
}
.slide-dot.active:after{
  position: absolute;
  content: '';
  width: 182px;
  height: 3px;
  bottom: 0;
  left: 0;
  background: #fff;
}
.slide-dot img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}
.intro-wrap img{
  width: 80px;
  height: 60px;
}
.intro-wrap .intro{
  background: #F1F3F8;
  border-radius: 24px;
  padding: 30px 20px;
  flex: 1;
  //height: 136px;
  cursor: pointer;
}
.intro-wrap .intro:hover{
  background: #E4E7EC;
}
.intro-wrap .intro:hover .title{
  color: #2755f9;
}
.intro-wrap .intro.off{
  position: relative;
}
.intro-wrap .intro.off::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  z-index: 1;
}
.intro-wrap .intro.off .coming{
  width: 100px;
  height: 30px;
  font-size: 13px;
  position: absolute;
  border-radius: 24px;
  right: 0;
  top: 0;
  z-index: 2;
  opacity: 1;
}
.table-wrap .title img{
  width: 30px;
  height: 30px;
}
.dashboard-right{
  width: 400px;
  display: flex;
  justify-content: inherit!important;
}
.notice-wrap{
  width: 100%;
  min-height: 360px;
}
.notice-wrap .notice-list:hover{
  color: #2755f9;
  background: #F1F3F8;
  border-radius: 16px;
}
.notice-wrap .notice-list.7390F8:hover{
  color: #7390F8;
}
.notice-wrap .notice-list.FA794D:hover{
  color: #FA794D;
}
.notice-wrap img{
 width: 24px;
 height: 24px;
}
.notice-wrap .content{
 width: calc(100% - 64px);
}
.notice-wrap .rq{
  width: 40px;
}
.avatar-group-wrap{
  position: relative;
}
.avatar-group-wrap .more{
  position: absolute;
  right: 0;
  bottom: 0;
  content: '';
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #969DAE;
}
.avatar-group-wrap .more > div{
  width: 1px;
  height: 1px;
  border-radius: 50%;
  background: #fff;
}
.avatar-group-wrap span:nth-child(2),.avatar-group-wrap span:nth-child(3){
  margin-left: -16px;
}
 .collect-list img{
   width: 34px;
   height: 34px;
   border-radius: 50%;
 }
 .collect-main{
   width: 60px;
   height: 93px;
   padding: 16px;
 }
.collect-main:hover{
  background: #F1F3F8;
  border-radius: 10px;
}
 .money-wrap{
   width: 100%;
   height: 85px;
   border-radius: 16px;
   background: #3F4249;
   box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.10);
 }
 .money-wrap img{
   width: 24px;
   height: 24px;
 }
@media (max-width: 1600px) {
  :deep(.ant-table) {
    font-size: 11px;
  }
  :deep(.notice-wrap .ant-tabs-tab) {
    font-size: 12px;
  }
  :deep(.notice-wrap .ant-tabs-tab-active .ant-tabs-tab-btn) {
    font-size: 14px;
  }
  :deep(.notice-wrap .ant-tabs) {
    font-size: 12px;
  }
  :deep(.ant-collapse-header-text) {
    font-size: 14px!important;
  }
  :deep(.upload-wrap .ant-tabs-tab) {
    font-size: 10px;
  }
  :deep(.upload-wrap .ant-tabs-tab-active .ant-tabs-tab-btn) {
    font-size: 12px;
  }
  :deep(.ant-collapse-arrow span) {
    font-size: 14px;
  }



  .intro-wrap .title,.intro-wrap .content{
    font-size: 12px;
  }
  .intro-wrap .intro.off .coming{
    width: 80px;
    height: 20px;
    font-size: 10px;
  }
  .table-wrap .title img{
    width: 20px;
    height: 20px;
  }
  .table-wrap .title span{
    font-size: 14px;
  }
  .notice-wrap .content,.notice-wrap .rq{
    font-size: 12px;
  }
}
</style>
