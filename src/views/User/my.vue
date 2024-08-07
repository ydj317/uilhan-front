<template>
  <Loading
    v-model:active="loading"
    :can-cancel="false"
    :is-full-page="true"
  />

  <div class="my mlr60">
    <a-flex class="font-SCDream6 fs18">마이페이지</a-flex>
    <a-flex class="info-wrap mt32 plr44 br10 primary-bg-color" justify="space-between" align="center">
      <a-flex class="name fl00" vertical justify="flex-end">
        <span class="font-SCDream5 fs30">{{ Cookie.get('member_name') }}님, 안녕하세요.</span>
        <a-button class="btn font-SCDream4 fs12 br15 mt35 bor-black" href="/setting/AccountManage">내 정보 관리</a-button>
      </a-flex>
      <a-flex class="money-wrap br15 box-sha" justify="center" vertical>
        <a-flex class="bottom-border-f0f0f0 pb25 font-SCDream6 fs30" align="center" justify="space-between">
          <a-flex align="center">
            <img src="@/assets/img/logo.png">
            <span class="ml10 fw font-SCDream6 fs30">PAY</span>
          </a-flex>
          <span class="number color-FB6F3E">{{ payStr }} 원</span>
        </a-flex>
        <a-flex class="font-SCDream4 fs12 color-bababa mt10 cp" justify="flex-end">
          <!--          <span @click="toServicePay">AI 프리미엄을 시작해보세요!&nbsp;&nbsp;></span>-->
          <a-button type="link" class="btn font-SCDream4" href="/user/servicesPay">AI 프리미엄을 시작해보세요!&nbsp;&nbsp;></a-button>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-divider class="bg-f0f0f0 h2"></a-divider>
    <!--    <a-flex class="card-wrap bg-fafafa br10" align="center" gap="40">-->
    <!--      <a-card :bordered="false">-->
    <!--        <a-flex align="center">-->
    <!--          <a-flex class="bg-round br50 bg-f0f0f0 center"><img src="@/assets/img/order.png"></a-flex>-->
    <!--          <a-flex vertical class="ml15">-->
    <!--            <div class="font-SCDream6 fs18">주문내역</div>-->
    <!--            <div class="font-SCDream6 fs16 primary-color">1,890원</div>-->
    <!--          </a-flex>-->
    <!--        </a-flex>-->
    <!--      </a-card>-->
    <!--      <a-card :bordered="false" >-->
    <!--        <a-flex align="center">-->
    <!--          <a-flex class="bg-round br50 bg-f0f0f0 center"><img src="@/assets/img/cart.png"></a-flex>-->
    <!--          <a-flex vertical class="ml15">-->
    <!--            <div class="font-SCDream6 fs18">주문내역</div>-->
    <!--            <div class="font-SCDream6 fs16 primary-color">1,890원</div>-->
    <!--          </a-flex>-->
    <!--        </a-flex>-->
    <!--      </a-card>-->
    <!--      <a-card :bordered="false">-->
    <!--        <a-flex align="center">-->
    <!--          <a-flex class="bg-round br50 bg-f0f0f0 center"><img src="@/assets/img/send.png"></a-flex>-->
    <!--          <a-flex vertical class="ml15">-->
    <!--            <div class="font-SCDream6 fs18">주문내역</div>-->
    <!--            <div class="font-SCDream6 fs16 primary-color">1,890원</div>-->
    <!--          </a-flex>-->
    <!--        </a-flex>-->
    <!--      </a-card>-->
    <!--      <a-card :bordered="false">-->
    <!--        <a-flex align="center">-->
    <!--          <a-flex class="bg-round br50 bg-f0f0f0 center"><img src="@/assets/img/coupon.png"></a-flex>-->
    <!--          <a-flex vertical class="ml15">-->
    <!--            <div class="font-SCDream6 fs18">주문내역</div>-->
    <!--            <div class="font-SCDream6 fs16 primary-color">1,890원</div>-->
    <!--          </a-flex>-->
    <!--        </a-flex>-->
    <!--      </a-card>-->
    <!--    </a-flex>-->
    <a-flex class="intro-wrap mt30 fs18 font-SCDream6" gap="30">
      <a-card :bordered="false" class="bg-fafafa">
        <template #title>
          <div class="title-container">
            <div class="left-content">
              <img src="@/assets/img/order-small.png">
              <span class="ml20">주문내역</span>
            </div>
            <div class="right-content">
              <a-button class="detail bg-FEDB41" @click="orderDetail(true)">상세보기</a-button>
            </div>
          </div>
        </template>
        <div class="text fs16 font-SCDream4">
          <template v-if="purchasedOrders.length > 0">
            <template v-for="(v,k) in purchasedOrders" :key="k">
              {{ v.title }} : {{ v.time }}<br>
            </template>
          </template>
          <template v-else>
            <p>주문내역이 없습니다.</p>
          </template>

        </div>
      </a-card>
      <a-modal v-model:open="orderModel"
               :title="OrderTitle"
               :footer="null"
               width="100%"
               :bodyStyle="{height:'60vh',overflow:'auto'}">

        <a-table :bordered="false"
                 :columns="curModal === 'order' ? columns_order : columns_refund"
                 :row-key="record => record.id"
                 :data-source="orderSource"
                 :pagination="{ hideOnSinglePage: true, disabled: true, pageSize: pageSize }"
                 class="mt20"
                 :indent-size="30"
                 :expandRowByClick="true"
                 :scroll="{ x: 'max-content' }"
                 :defaultExpandAllRows="true">
          <template v-slot:bodyCell="{ text, record, index, column }">

            <!--          <template v-if="column.key === 'auto_trans_image'">-->
            <!--            <span>{{ text === true ? '사용함' : '사용안함'}}</span>-->
            <!--          </template>-->

            <!--        <template v-if="column.key === 'plan_type_label'">-->
            <!--          <a-tooltip :title="text">-->
            <!--            <span style="width: 120px;display: block;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;">{{ text }}</span>-->
            <!--          </a-tooltip>-->
            <!--        </template>-->
            <template v-if="column.key === 'id' && record.hasOwnProperty('children')">
              <span class="color-2171E2">{{ text }}</span>
            </template>

            <!--        <template v-if="column.key === 'operation' && record.hasOwnProperty('children')"><a @click="editData(index,record)">详情</a></template>-->
            <template v-if="curModal === 'order' && column.key === 'operation' && record.status === 'Completed'">
              <a-button danger @click="(event) => refundRequests(event, record)">환불신청</a-button>
            </template>

            <template v-if="curModal === 'refund' && column.key === 'statusStr'">
              <a-tooltip v-if="record.status === 'Fail' && record.denialMemo.trim() !== ''" :title="record.denialMemo.trim()">
                <a-button type="link" danger>
                  {{ text }}
                  <ExclamationCircleFilled />
                </a-button>
              </a-tooltip>
            </template>
            <template v-if="curModal === 'refund' && column.key === 'statusStr' && record.status === 'Fail' && record.denialMemo.trim() === '' ">
              <a-button type="link" danger>{{ text }}</a-button>
            </template>

          </template>

        </a-table>

        <!--paging-->
        <div class="w100 center top h50" style="background-color: white">
          <a-pagination
            v-model:current="current"
            :page-size-options="pageSizeOptions"
            :total="total"
            show-size-changer
            :page-size="pageSize"
            @change="onChange"
          >
          </a-pagination>
        </div>

      </a-modal>
      <a-card :bordered="false" class="bg-fafafa">
        <template #title>
          <div class="title-container">
            <div class="left-content">
              <img src="@/assets/img/cart-small.png">
              <span class="ml20">장바구니</span>
            </div>
            <div class="fl-te ml10" v-if="Object.keys(selectedServices).length > 0">
              <div class="right-content">
                <a-button class="pay bg-FB6F3E" @click="goServicesPay">결제페이지로 이동</a-button>
              </div>
              <div class="right-content ml3">
                <a-button class="pay bg-434343" @click="emptyYourShoppingCart">초기화</a-button>
              </div>
            </div>
          </div>
        </template>
        <div class="text fs16 font-SCDream4">
          <template v-if="Object.keys(selectedServices).length > 0">
            <template v-for="(v,k) in selectedServices" :key="k">
              <template v-if="v !== ''">{{ servicesMapping[k] }} : {{ v.title || v.text }}<br></template>
            </template>
          </template>
          <template v-else>
            <p>장바구니가 비어있습니다.</p>
          </template>
        </div>
      </a-card>
      <a-card :bordered="false" class="bg-fafafa">
        <template #title>
          <div class="title-container">
            <div class="left-content">
              <img src="@/assets/img/clock-small.png">
              <span class="ml20">환불내역</span>
            </div>
            <div class="right-content">
              <a-button class="detail bg-FEDB41" @click="refundDetail(true)">상세보기</a-button>
            </div>
          </div>
        </template>
        <div class="text fs16 font-SCDream4">
          <template v-if="refundOrders.length > 0">
            <template v-for="(v,k) in refundOrders" :key="k">
              {{ v.title }} : {{ v.time }}<br>
            </template>
          </template>
          <template v-else>
            <p>환불내역이 없습니다.</p>
          </template>
        </div>
      </a-card>
    </a-flex>
    <a-flex class="question-wrap mt30" gap="28">
      <a-card :bordered="false">
        <template #title>
          <img src="@/assets/img/free.png">
          <span class="ml20 font-SCDream6 fs18">무료플랜</span>
        </template>
        <div class="font-SCDream4 fs16">무료플랜 사용기간 : {{ preview_plan }}</div>
      </a-card>
      <a-card :bordered="false">
        <template #title>
          <img src="@/assets/img/question.png">
          <span class="ml20 font-SCDream6 fs18">Q&A</span>
        </template>
        <div class="font-SCDream4 fs16">*배송대행지 문의는 배송대행지 채널 톡으로 문의부탁드립니다.</div>
      </a-card>
    </a-flex>
  </div>
</template>

<script setup>
import Cookie from "js-cookie";
import { onMounted, ref, reactive, createVNode } from "vue";
import { ClockCircleOutlined, ExclamationCircleOutlined, ExclamationCircleFilled } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { AuthRequest } from "@/util/request";
import { message, Modal } from "ant-design-vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";


const loading = ref(false);
const selectedServices = ref({});
const purchasedOrders = ref({});
const refundOrders = ref({});
const payStr = ref(0);
const preview_plan = ref(null);
const router = useRouter();

//订单详情modal
const curModal = ref('');
const OrderTitle = ref('');
const orderModel = ref(false);
const orderSource = ref([]);
// const expandedRowKeys = ref([]);

//分页
const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const pageSizeOptions = ref(["10", "20", "30", "40", "50"]);

const columns_order = [
  {
    title: "No.",
    dataIndex: "No",
    key: "No",
    align: "center",
  },
  {
    title: "주문번호",
    dataIndex: "id",
    key: "id",
    // width: 80,
    align: "center",
  },
  {
    title: "결제일시",
    dataIndex: "paymentTime",
    key: "paymentTime",
    align: "center",
  },
  {
    title: "결제서비스",
    dataIndex: ['historyQuota','quotaDetail','show_name'],
    key: "quotaName",
    align: "center",
  },
  {
    title: "사용기간",
    dataIndex: "usageTime",
    key: "usageTime",
    align: "center",
  },
  {
    title: "결제금액(vat포함)",
    dataIndex: "paymentAmountStr",
    key: "paymentAmountStr",
    align: "center",
  },
  {
    title: "결제상태",
    dataIndex: "statusStr",
    key: "statusStr",
    align: "center",
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    align: "center",
  },
];

const columns_refund = [
  {
    title: "No.",
    dataIndex: "No",
    key: "No",
    align: "center",
  },
  {
    title: "주문번호",
    dataIndex: ['order','id'],
    key: "id",
    // width: 80,
    align: "center",
  },
  {
    title: "환불요청일자",
    dataIndex: "refundStartDate",
    key: "refundStartDate",
    align: "center",
  },
  {
    title: "환불완료일자",
    dataIndex: "refundEndDate",
    key: "refundEndDate",
    align: "center",
  },
  {
    title: "환불서비스",
    dataIndex: ['order','show_name'],
    key: "quotaName",
    align: "center",
  },
  {
    title: "실 사용기간",
    dataIndex: "actualPeriodOfUse",
    key: "actualPeriodOfUse",
    align: "center",
  },
  {
    title: "환불금액",
    dataIndex: "realAmountStr",
    key: "realAmountStr",
    align: "center",
  },
  {
    title: "환불상태",
    dataIndex: "statusStr",
    key: "statusStr",
    align: "center",
  },
];


//切换页码回调
const onChange = (iCurrent, iPageSize) => {
  current.value = iCurrent;
  pageSize.value = iPageSize;

  if (curModal.value === 'order'){
    orderDetail();
  }else {
    refundDetail();
  }
};

//点击展开图标时触发
// const handleExpand = (expanded, record) => {
//   if (expanded){
//     expandedRowKeys.value.push(record.id);
//   }else {
//     expandedRowKeys.value = expandedRowKeys.value.filter((item) => {
//       return item !== record.id;
//     })
//   }
// }

const servicesMapping = {
  'basic' : '메인서비스',
  'autoTranslateImg' : '이미지 자동번역',
  'gptAutomaticTitle' : 'GPT 자동화',
  'autoESMSalesData' : 'ESM 판매데이터 자동수집'
}

const state = reactive({
  cardList:[
    {img:'@/assets/img/order.png',title:'주문내역',money:'1,890원'},
    {img:'@/assets/img/cart.png',title:'장바구니',money:'100원'},
    {img:'@/assets/img/send.png',title:'배송대행지 포인트',money:'18,000원'},
    {img:'@/assets/img/coupon.png',title:'보유쿠폰',money:'1,000원'},
  ]
});

onMounted(() => {
  const jsonString = localStorage.getItem('selectedServices');
  if (jsonString) {
    selectedServices.value = JSON.parse(jsonString);
  }

  getOrderInfo();

})

//购物车跳转到订购页面
const goServicesPay = () => {

  const seviceObj = {};
  if (selectedServices.value.basic !== undefined){
    seviceObj.basic = selectedServices.value.basic.value;
  }
  if (selectedServices.value.autoTranslateImg !== undefined){
    seviceObj.autoTranslateImg = selectedServices.value.autoTranslateImg.planName;
  }
  if (selectedServices.value.gptAutomaticTitle !== undefined){
    seviceObj.gptAutomaticTitle = selectedServices.value.gptAutomaticTitle.planName;
  }
  if (selectedServices.value.autoESMSalesData !== undefined){
    seviceObj.autoESMSalesData = selectedServices.value.autoESMSalesData.planName;
  }

  router.push({
    name:'user_services_pay',
    query:{
      ...seviceObj
    }
  })
}

//获取页面订单明细
const getOrderInfo = () => {

  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/user/my/page/info').then((res) => {

    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }


    purchasedOrders.value = res.data.completed_orders.map((item) => {
      return {
        title: item.name,
        time: formatDate(item.start_time) + ' - ' + formatDate(item.end_time)
      }
    })

    refundOrders.value = res.data.refund_orders.map((item) => {
      return {
        title: item.name,
        time: formatDate(item.start_time) + ' - ' + formatDate(item.end_time)
      }
    })

    if (res.data.preview_plan){
      preview_plan.value = formatDate(res.data.preview_plan.start_time) + ' - ' + formatDate(res.data.preview_plan.end_time);
    }else {
      preview_plan.value = '데이터가 없습니다.';
    }

    payStr.value = res.data.total_price_str;

  }).catch((error) => {
    message.error(error.message);
    return false;
  });

}

//支付成功订单列表
const orderDetail = (flag=false) => {

  //点击btn 初始化
  if (flag === true){
    current.value = 1;
    pageSize.value = 10;
    curModal.value = 'order';
    OrderTitle.value = '주문내역 상세보기'
  }

  const oParam = {
    page: current.value,
    page_size: pageSize.value,

  }
  loading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/user/all/order/completed', {
    params:{
      ...oParam
    }
  }).then((res) => {
    loading.value = false;
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }


    const data = res.data;

    total.value = data.total;

    orderSource.value = data.data.map((item,key) => {
      item.No = total.value - (current.value - 1) * pageSize.value - key;
      item.usageTime = formatDateSort(item.historyQuota.startDate) + ' - ' + formatDateSort(item.historyQuota.endDate)
      if(item.children.length > 0){
        item.children = item.children.map((ele, k) => {
          ele.usageTime = formatDateSort(ele.historyQuota.startDate) + ' - ' + formatDateSort(ele.historyQuota.endDate)
          delete ele.children;
          return { ...ele };
        })
      }else{
        delete item.children;
      }
      return {...item};
    })

    orderModel.value = true;


  }).catch((error) => {
    loading.value = false;
    message.error(error.message);
    return false;
  });

}

const emptyYourShoppingCart = () => {

  localStorage.removeItem('selectedServices');
  selectedServices.value = {};
}

//退款订单列表
const refundDetail = (flag=false) => {


  //点击btn 初始化
  if (flag === true){
    current.value = 1;
    pageSize.value = 10;
    curModal.value = 'refund';
    OrderTitle.value = '환불내역 상세보기'
  }


  const oParam = {
    page: current.value,
    page_size: pageSize.value,

  }
  loading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/user/all/refund', {
    params:{
      ...oParam
    }
  }).then((res) => {
    loading.value = false;
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }

    const data = res.data;

    total.value = data.total;

    orderSource.value = data.data.map((item,key) => {

      const startDate = new Date(item.history.startDate);
      const endDate = new Date(item.refundStartDate);

      let actualPeriodOfUse;

      if (startDate > endDate){
        actualPeriodOfUse = '사용안함';
      }else {
        actualPeriodOfUse = formatDateSort(item.history.startDate) + ' - ' + formatDateSort(item.refundStartDate);
      }

      item.No = total.value - (current.value - 1) * pageSize.value - key;
      item.refundStartDate = formatDateSort(item.refundStartDate);
      item.refundEndDate = item.refundEndDate ? formatDateSort(item.refundEndDate) : '-';
      item.actualPeriodOfUse = actualPeriodOfUse;
      item.realAmountStr = item.realAmountStr == 0 ? '-' : item.realAmountStr;

      return {...item};
    })

    orderModel.value = true;


  }).catch((error) => {
    loading.value = false;
    message.error(error.message);
    return false;
  });


}

//点击退款申请回调
const refundRequests = (event,record) => {
  // 阻止事件冒泡
  event.stopPropagation();

  let content ='환불신청을 하시겠습니까?';
  if (record.isParentOrder && record.children !== undefined){
    content += ' 기본서비스와 함께 사용중인 모든 추가서비스도 함께 환불됩니다!';
  }

  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: content,
    okText: '확인',
    cancelText: '취소',
    centered:true,
    onOk: () => {
      handleRefund(record.id);
    }
  });

}

//调用退款处理接口 回调
const handleRefund = (id) => {

  if (!id){
    return false;
  }

  const oParam = {
    order_id:id
  }

  requestPost('/api/user/quota/order/request/refund',oParam, (data) => {

    data.forEach((item,key) => {
      let shouldBreak = false;
      orderSource.value.forEach((ele,k) => {
        if (shouldBreak) return; // 如果标志变量为 true，终止中间层循环
        if (item.order.id === ele.id){
          ele.statusStr = item.order.statusStr;
          ele.status = item.order.status;
          shouldBreak = true; // 设置标志变量
          return;
        }else {
          if (ele.children !== undefined){
            ele.children.forEach((val) => {
              if (item.order.id === val.id){
                val.statusStr = item.order.statusStr;
                val.status = item.order.status;
                shouldBreak = true; // 设置标志变量
                return;
              }
            })
          }
        }
      })
    })

    getOrderInfo();

  })

}


const requestPost = (url, params, callback) => {

  loading.value = true;

  AuthRequest.post(process.env.VUE_APP_API_URL + url,
    params
  ).then((res) => {

    loading.value = false;
    /* fail */
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    callback(res.data);

  }).catch((error) => {
    loading.value = false;
    message.error('Error fetching data:', error);
  })

}


function formatDate(inputDate) {
  // 将字符串转换为 Date 对象
  const date = new Date(inputDate);

  // 获取年、月、日
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，因此需要+1
  const day = date.getDate().toString().padStart(2, '0');

  // 格式化为 yyyy.mm.dd
  return `${year}.${month}.${day}`;
}

function formatDateSort(inputDate) {
  // 将字符串转换为 Date 对象
  const date = new Date(inputDate);

  // 获取年、月、日
  const year = date.getFullYear();
  const month = (date.getMonth() + 1); // 月份从0开始，因此需要+1
  const day = date.getDate();

  // 格式化为 yyyy.mm.dd
  return `${year}.${month}.${day}`;
}


</script>
<style>
.my .card-wrap .ant-card{
  flex: 1 1 25%;
}
.my .card-wrap .ant-card-body{
  display: flex;
  align-items: center;
  padding: 42px 50px;
}
.my .intro-wrap .ant-card{
  flex: 1 1 33%;
  padding: 45px;
}
.my .intro-wrap .ant-card-head{
  display: flex;
  border-bottom: 2px solid #000;
  padding: 0 0 20px 0;
  min-height: inherit;
}
.my .intro-wrap .ant-card-body{
  padding: 0;
  margin-top: 35px;
}
.my .question-wrap .ant-card{
  flex: 1 1 50%;
  border: 1px solid #FFDB41;
  padding: 45px;
}
.my .question-wrap .ant-card-head{
  border:0;
  padding: 0;
  min-height: inherit;
}
.my .question-wrap .ant-card-body{
  padding: 0;
  margin-top: 35px;
}
</style>
<style scoped>
.bottom-border-f0f0f0{
  border-bottom: 2px solid #f0f0f0;
}
.my .info-wrap{
  height: 244px;
}
.my .name{
  height: inherit;
  padding-bottom: 50px;
}
.my .name .btn{
  width: fit-content;
  height:24px;
  padding: 2px 6px;
  color:#000;
  border-color:#000;
  background-color: transparent;
}
.my .money-wrap{
  width: 780px;
  height: 150px;
  background: #fff;
  padding: 0 60px;
}
.my .money-wrap img{
  width: 24px;
  height: 25px;
}
.my .money-wrap .color-bababa .btn{
  padding:0;
  font-size: 12px;
  color: #bababa;
}
.my .card-wrap{
  height: 250px;
  padding: 0 44px;
}
.my .card-wrap .bg-round{
  width: 73px;
  height: 73px;
}

.my .intro-wrap .text{
  line-height: 2.5;
}
.my .intro-wrap img,.my .question-wrap img{
  width: 18px;
  height: 18px;
}
.my .intro-wrap .ant-card-head{
  border-bottom: 2px solid #000!important;
}
.my .question-wrap{
  margin-bottom: 130px;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-content {
  display: flex;
  align-items: center;
}

.right-content .detail{
  color: #000;
}

.right-content .pay{
  color: #fff;
}

.right-content .ant-btn{
  height:26px;
  padding:3px 15px;
  font-weight:bold;
  border:none;
  border-radius: 20px;
}
.box-sha{
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>