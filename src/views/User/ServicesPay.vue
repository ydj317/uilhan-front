<template>

  <Loading
      v-model:active="loading"
      :can-cancel="false"
      :is-full-page="true"
  />

  <div class="pay-wrap">
    <a-page-header title="유일 AI 플랜" class="font-SCDream6 fs16" />
    <a-flex align="center" justify="space-between" class="title bg-fafafa">
      <span class="fs18">AI 플랜 기능설명</span>
<!--      <span class="font-SCDream4 fs14 color-2171E2">[사용중 : 2024.03.01 ~ 2024.03.31]</span>-->
    </a-flex>
    <a-flex class="check-wrap mt30" wrap="wrap">
      <a-flex align="center" class="check-list" v-for="v in state.checkList">
        <img src="@/assets/img/pay-yes.png" class="check">
        <div class="btn font-SCDream5 fs12 color-2171E2 ml15 bg-F0F8FE fl-cc br5 fl1">{{ v }}</div>
      </a-flex>
    </a-flex>
    <a-flex class="rq-wrap mt30">
      <a-radio-group v-model:value="state.selectedList.basic" name="basic" class="radio-wrap w100 fl">
        <template v-for="(v,i) in state.basicList">
          <a-radio :value="i" :class="{'bg-FEDB41':i == state.selectedList.basic,'bg-FB6F3E color-f0f0f0': i === 0 && !state.isPay}" :disabled="!state.isPay">
            <template v-if="v.value !== 0">
              <a-flex vertical class="font-SCDream5">
                <a-flex align="center" class="fs30">
                  <div class="ml10 font-SCDream5">{{v.title}}</div>
                  <div class="ml10 color-FB6F3E font-SCDream4 fs14 bg-f0f0f0 br15 p8" v-if="v.subTitle">{{v.subTitle}}</div>
                </a-flex>
                <a-flex vertical align="flex-end" class="fs30">
                  <div class="font-SCDream5 fs26">{{numberFormat(v.money)}}원</div>
                  <div class="font-SCDream4 fs20" v-if="v.monthMoney">월&nbsp;{{numberFormat(v.monthMoney)}}원</div>
                </a-flex>
              </a-flex>
            </template>
            <template v-else-if="v.value === 0">
              <a-flex vertical class="font-SCDream5">
                <a-flex align="center" class="fs22">
                  <div class="ml10 font-SCDream5">{{v.title}}</div>
                </a-flex>
                <a-flex vertical justify="flex-end" class="ml60 fs14 ml10 color-FB6F3E font-SCDream4 bg-f0f0f0 br15 p8">
                  <div v-if="v.subTitle">{{v.subTitle}}</div>
                  <div v-if="v.time">{{v.time}}</div>
                </a-flex>
              </a-flex>
            </template>
          </a-radio>
        </template>
      </a-radio-group>
    </a-flex>
    <a-divider class="mt30 bg-black h2 mb0" />
    <a-flex class="total-wrap">
      <a-flex vertical class="left mt30">
        <a-flex align="center" justify="space-between" class="h68 bg-fafafa w100 font-SCDream6 fs14 fl-tc plr30">
          <span class="fs14 font-SCDream6">프리미엄 AI 기능</span>
          <span class="font-SCDream4 fs14 color-2171E2">[추가서비스는 1개월 기준입니다]</span>
        </a-flex>
        <a-flex vertical class="advanced-list ml30 bottom-border-f0f0f0 pb20" v-for="(v,i) in state.advancedList">
          <div class="font-SCDream4 fs20 mt30">{{ v.title }}</div>
          <a-flex wrap="wrap" gap="20" class="mt30">
            <a-flex align="center" class="check-list" v-if="v.checkList" v-for="v2 in v.checkList">
              <img src="@/assets/img/pay-yes.png" class="check">
              <div class="btn font-SCDream5 fs12 color-2171E2 ml15 bg-F0F8FE fl-cc br5 fl1">{{ v2 }}</div>
            </a-flex>
          </a-flex>
          <a-flex wrap="wrap" gap="30" class="mt30" v-if="v.radioList">
            <a-radio-group v-model:value="state.selectedList['advanced'+(i+1)]" :name="'advanced'+i" class="radio-wrap w100 fl-w">
              <template v-for="(v3,i3) in v.radioList">
                <a-radio :value="i3" :class="{'bg-FEDB41':i3 == state.selectedList['advanced'+(i+1)]}" :disabled="!state.isPay">
                  <a-flex vertical class="font-SCDream5">
                    <a-flex align="center" class="fs14">
                      <div class="ml10 font-SCDream4">{{v3.text}}</div>
                    </a-flex>
                  </a-flex>
                </a-radio>
              </template>
            </a-radio-group>
          </a-flex>
        </a-flex>
      </a-flex>
      <a-flex vertical class="right ml30">
        <a-flex vertical>
          <a-flex align="center" class="font-SCDream6 fs14 h50 pl20 text border-bottom-f0f0f0-2">플랜신청내역</a-flex>
          <a-flex vertical class="text-list-wrap font-SCDream4 fs12 plr20 bg-fafafa border-bottom-f0f0f0-2">
            <a-flex align="center" justify="space-between" class="text-list h50 border-bottom-f0f0f0-2" v-if="state.isPay">
              <span>AI플랜 - 기본서비스</span>
              <span>{{ state.basicList[state.selectedList.basic]['title'] }}</span>
            </a-flex>
            <a-flex align="center" justify="space-between" class="text-list h50 border-bottom-f0f0f0-2">
              <span>프리미엄 AI기능 - 추가서비스</span>
              <span v-if="isNotAdvancedConditionsMet">1개월</span>
            </a-flex>
            <a-flex align="center" justify="space-between" class="text-list h50 border-bottom-f0f0f0-2 pl20" v-if="state.selectedList.advanced1 != 3">
              <span>{{ state.advancedList[0]['title'] + ' - ' + state.advancedList[0]['radioList'][state.selectedList.advanced1]['text'] }}</span>
              <span>{{numberFormat(state.advancedList[0]['radioList'][state.selectedList.advanced1]['value']) }}원</span>
            </a-flex>
            <a-flex align="center" justify="space-between" class="text-list h50 border-bottom-f0f0f0-2 pl20" v-if="state.selectedList.advanced2 != 5">
              <span>{{ state.advancedList[1]['title'] + ' - ' + state.advancedList[1]['radioList'][state.selectedList.advanced2]['text'] }}</span>
              <span>{{numberFormat(state.advancedList[1]['radioList'][state.selectedList.advanced2]['value']) }}원</span>
            </a-flex>
            <a-flex align="center" justify="space-between" class="text-list h50 border-bottom-f0f0f0-2 pl20" v-if="state.selectedList.advanced3 != 5">
              <span>{{ state.advancedList[2]['title'] + ' - ' + state.advancedList[2]['radioList'][state.selectedList.advanced3]['text'] }}</span>
              <span>{{numberFormat(state.advancedList[2]['radioList'][state.selectedList.advanced3]['value']) }}원</span>
            </a-flex>
          </a-flex>
        </a-flex>
        <a-flex vertical class="mt12 border-top-f0f0f0-2 border-bottom-f0f0f0-2">
          <a-flex align="center" class="font-SCDream6 fs14 h50 pl20 text border-bottom-f0f0f0-2">Tatal 결제금액</a-flex>
          <a-flex vertical justify="center" gap="10" class="p20 font-SCDream4 fs12 border-bottom-f0f0f0-2">
            <a-flex align="center" justify="space-between">
              <span>* AI 플랜</span>
              <span>{{ numberFormat(getBasicMoney) }} 원</span>
            </a-flex>
            <a-flex align="center" justify="space-between">
              <span>* 프리미엄 AI 기능</span>
              <span>{{numberFormat(getAdvancedMoney)}} 원</span>
            </a-flex>
          </a-flex>
          <a-flex vertical justify="center" class="p20 font-SCDream6 fs12 bg-fafafa border-bottom-f0f0f0-2">
            <a-flex align="center" justify="space-between" class="pb10 border-bottom-f0f0f0-2">
              <span>합계</span>
              <span>{{ numberFormat(getTotalMoney) }} 원</span>
            </a-flex>
            <a-flex align="center" justify="space-between" class="pt10">
              <span>부가세 (10%)</span>
              <span>{{ numberFormat(getTotalMoney* 0.1) }} 원</span>
            </a-flex>
          </a-flex>
          <a-flex vertical class="p20">
            <a-flex class="fs14 font-SCDream6">최종 결제금액</a-flex>
            <a-flex align="flex-end" justify="flex-end">
              <span class="fs24 color-2171E2 fw">{{ numberFormat(getTotalMoney* 0.1 + getTotalMoney) }}</span><span class="fs12 ml5">원</span>
            </a-flex>
          </a-flex>
        </a-flex>
        <a-flex vertical class="p20">
          <a-flex vertical class="w100 pay-type br5 p10">
            <a-flex class="font-SCDream6 fs14">결제방법</a-flex>
            <a-flex class="mt10">
              <a-radio-group v-model:value="state.selectedList.payType" name="payType">
                <a-radio value="1"  class="font-SCDream4">카드</a-radio>
                <a-radio value="2"  class="font-SCDream4" v-show="false">무통장입금</a-radio>
              </a-radio-group>
            </a-flex>
          </a-flex>
          <a-flex vertical class="w100 pay-type br5 p10 mt20">
            <a-flex class="font-SCDream6 fs14">이용약관</a-flex>
            <a-flex vertical class="mt10">
              <a-checkbox v-model:checked="state.selectedList.book2">취소/환불 규정에 동의합니다.  <a-button class="color-2171E2" @click="openRefundRuleModal">[약관보기]</a-button></a-checkbox>
              <a-checkbox v-model:checked="state.selectedList.book1">서비스 이용약관에 동의합니다.  <a-button class="color-2171E2" @click="openPolicyModal">[약관보기]</a-button></a-checkbox>
              <refundRule @agree2="onAgree2" />
              <policy @agree="onAgree1" />
            </a-flex>
          </a-flex>
          <a-flex vertical align="center" class="mt30">
            <template v-if="getTotalMoney > 0">
              <a-button class="font-SCDream6 fs14 t-white bg-black fl-cc w60 h40" @click="submit">결제하기</a-button>
              <a-button class="font-SCDream6 fs14 fl-cc w60 mt20 h40" @click="addToCart">장바구니 담기</a-button>
            </template>
            <template v-else>
              <a-button class="font-SCDream6 fs14 t-white fl-cc w60 h40" disabled>결제하기</a-button>
              <a-button class="font-SCDream6 fs14 fl-cc w60 mt20 h40" disabled>장바구니 담기</a-button>
            </template>
          </a-flex>
          <a-modal v-model:open="open"
                   title="서비스 결제중입니다."
                   @ok="handleOk"
                   okText="결제완료"
                   cancelText=결제취소
                   @cancel="handleCancel"
                   :maskClosable="false">

          </a-modal>
        </a-flex>
      </a-flex>
    </a-flex>
  </div>

</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref, onUnmounted } from "vue";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { AuthRequest } from "@/util/request";
import Loading from "vue-loading-overlay";
import {useStore} from "vuex";

import Policy from "@/components/Detail/policy.vue";
import RefundRule from "@/components/Detail/refundRule.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const open = ref(false);

const checkPayTime = 5000;
let intervalId;

const state = reactive({
  checkList:[
    '무제한 상품등록', '상품명 자동추천', '상품 데이터 AI 조회','상품수집',
    '브랜드 키워드 표시','원클릭 번역','주문수집 / 관리','자동 카테고리매칭',
    '고급 이미지 편집','배송대행지 연동','직원 계정 / 데이터','9대 마켓 입점'],
  basicList: [
    {value:1,title:'1개월',subTitle:'',money:'200000',monthMoney:'', planName: "BasicPlan1Month"},
    {value:2,title:'6개월',subTitle:'20% 할인',money:'960000',monthMoney:'160000', planName: "BasicPlan6Month"},
    {value:3,title:'12개월',subTitle:'30% 할인',money:'1680000',monthMoney:'140000', planName: "BasicPlan12Month"}
  ],
  advancedList:[
    {
      title:'이미지 자동 번역',
      checkList:['상세페이지 전체 자동번역','옵션 이미지 10장 자동번역'],
      radioList:[
        {text:'100개/일',value:'100000', planName: "Extra1PlanAutoImageCount100"},
        {text:'200개/일',value:'200000', planName: "Extra1PlanAutoImageCount200"},
        {text:'300개/일',value:'300000', planName: "Extra1PlanAutoImageCount300"},
        {text:'선택안함',value:0, planName: ""},
      ]
    },
    {
      title:'GPT AI 자동 상품명',
      checkList:['제품사진으로 GPT 자동 AI 상품명 완성'],
      radioList:[
        {text:'100개/일',value:'100000', planName: "Extra2PlanGPT100"},
        {text:'150개/일',value:'150000', planName: "Extra2PlanGPT150"},
        {text:'200개/일',value:'200000', planName: "Extra2PlanGPT200"},
        {text:'250개/일',value:'250000', planName: "Extra2PlanGPT250"},
        {text:'300개/일',value:'300000', planName: "Extra2PlanGPT300"},
        {text:'선택안함',value:0, planName: ""},
      ]
    },
    {
      title:'ESM 판매데이터 자동수집',
      checkList:['옥션,G마켓 판매 데이터 버튼 클릭시 자동 수집 기능'],
      radioList:[
        {text:'100개/일',value:'100000', planName: "Extra3PlanMarketCollect100"},
        {text:'150개/일',value:'150000', planName: "Extra3PlanMarketCollect150"},
        {text:'200개/일',value:'200000', planName: "Extra3PlanMarketCollect200"},
        {text:'250개/일',value:'250000', planName: "Extra3PlanMarketCollect250"},
        {text:'300개/일',value:'300000', planName: "Extra3PlanMarketCollect300"},
        {text:'선택안함',value:0, planName: ""},
      ]
    },
  ],
  selectedList: { basic:0,advanced1:3,advanced2:5,advanced3:5,payType:"1",book1:false,book2:false },

  basicInfo:{},//基础服务数据
  isPay : true
});



onBeforeMount(() => {

  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/user/is/pay/plan').then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
    const allPlanData = res.data;
    //设置基本服务 (主/子账号,推荐码)
   state.basicList =  allPlanData.allPlanDetail.basic.map((item,index) => {

      let title;
      let subTitle = '';
      let money;
      let monthMoney = '';

      if (allPlanData.isParent){
        money = allPlanData.recommend_code ? item.discount_price_code : item.discount_price;
      }else {
        money = item.sub_account_price;
      }

      switch (item.name){
        case 'BasicPlan1Month':
          title = '1개월';
          break;
        case 'BasicPlan6Month':
          title = '6개월';
          subTitle = '20% 할인';
          monthMoney = parseFloat(money) / 6;
          break;
        case 'BasicPlan12Month':
          title = '12개월';
          subTitle = '30% 할인';
          monthMoney = parseFloat(money) / 12;
          break;
      }

      return {
        value : index + 1,
        title : title,
        subTitle : subTitle,
        money : money,
        monthMoney : monthMoney,
        planName : item.name
      }

    })

    //设置其他服务 (主/子账号,推荐码)
    state.advancedList = allPlanData.allPlanDetail.other.map((item,index) => {

      const radioList =  item.map((ele) => {

        let text;
        let money;

        if (allPlanData.isParent){
          money = allPlanData.recommend_code ? ele.discount_price_code : ele.discount_price;
        }else {
          money = ele.sub_account_price;
        }

        switch (ele.name){

          case 'Extra1PlanAutoImageCount100':
            text = '100개/일';
            break;
          case 'Extra1PlanAutoImageCount200':
            text = '200개/일';
            break;
          case 'Extra1PlanAutoImageCount300':
            text = '300개/일';
            break;
          case 'Extra2PlanGPT100':
            text = '100개/일';
            break;
          case 'Extra2PlanGPT150':
            text = '150개/일';
            break;
          case 'Extra2PlanGPT200':
            text = '200개/일';
            break;
          case 'Extra2PlanGPT250':
            text = '250개/일';
            break;
          case 'Extra2PlanGPT300':
            text = '300개/일';
            break;
          case 'Extra3PlanMarketCollect100':
            text = '100개/일';
            break;
          case 'Extra3PlanMarketCollect150':
            text = '150개/일';
            break;
          case 'Extra3PlanMarketCollect200':
            text = '200개/일';
            break;
          case 'Extra3PlanMarketCollect250':
            text = '250개/일';
            break;
          case 'Extra3PlanMarketCollect300':
            text = '300개/일';
            break;

        }

        return {
          text : text,
          value : money,
          planName: ele.name
        }

      })

      radioList.push({text:'선택안함',value:0, planName: ""})

      let title;
      let checkList = [];
      switch (index){
        case 0:
          title = '이미지 자동 번역';
          checkList = ['상세페이지 전체 자동번역','옵션 이미지 10장 자동번역'];
          break;
        case 1:
          title = 'GPT AI 자동 상품명';
          checkList = ['제품사진으로 GPT 자동 AI 상품명 완성'];
          break;
        case 2:
          title = 'ESM 판매데이터 자동수집';
          checkList = ['옥션,G마켓 판매 데이터 버튼 클릭시 자동 수집 기능'];
          break;
      }

      return  {
        title : title,
        checkList : checkList,
        radioList : radioList
      }
    })


    //如果是主账号肯定可以购买,如果是子账号 主账号有基础套餐 才能购买
    state.isPay = allPlanData.isPay;

    //当前账号是子账号 则只能购买一个月套餐
    if (!allPlanData.isParent) {
      state.basicList.splice(-2, 2);
    }

    //如果可以购买 且当前账号有套餐 正常显示
    if (state.isPay && allPlanData.currPlan){
      const basicObj = {
        value:0,
        title:'사용중',
        subTitle:'기본서비스 만료일시: ',
        time: allPlanData.currPlan.end_time,
        money:'0',
        monthMoney:'0',
        planName: "BasicPlan"
      }
      state.basicList.unshift(basicObj);
    }
    //不能购买 且是子账号 且主账号无基本套餐 且子账号有套餐
    if (!state.isPay && !allPlanData.isParent && !allPlanData.parentPlan && allPlanData.currPlan ){
      const basicObj = {
        value:0,
        title:'메인계정의 서비스가 만료되었습니다. 구매후 사용하시기 바랍니다.',
        subTitle:'서비스 만료일시: ',
        time : allPlanData.currPlan.end_time,
        money:'0',
        monthMoney:'0',
        planName: "BasicPlan"
      }
      state.basicList.unshift(basicObj);
    }

    //不能购买 且是子账号 且主账号无基本套餐 且子账号无套餐
    if (!state.isPay && !allPlanData.isParent && !allPlanData.parentPlan && !allPlanData.currPlan ){
      const basicObj = {
        value:0,
        title:'메인계정의 서비스가 만료되었습니다. 구매후 사용하시기 바랍니다.',
        subTitle:'' ,
        money:'0',
        monthMoney:'0',
        planName: "BasicPlan"
      }
      state.basicList.unshift(basicObj);
    }

    initRouteCheckPlan();

  }).catch((error) => {
    message.error(error.message);
    return false;
  });
})

// 清除定时器
onUnmounted(() => {
  clearInterval(intervalId);
});

onMounted(() => {


})

const initRouteCheckPlan = () => {

  if (route.query.basic){
    state.selectedList.basic = state.basicList.findIndex(item => item.value == route.query.basic);
  }
  if (route.query.autoTranslateImg){
    state.selectedList['advanced1'] = state.advancedList[0].radioList.findIndex(item => item.planName === route.query.autoTranslateImg);
  }
  if (route.query.gptAutomaticTitle){
    state.selectedList['advanced2']= state.advancedList[1].radioList.findIndex(item => item.planName === route.query.gptAutomaticTitle);
  }
  if (route.query.autoESMSalesData){
    state.selectedList['advanced3']= state.advancedList[2].radioList.findIndex(item => item.planName === route.query.autoESMSalesData);
  }
}

// onMounted(() => {
//   const jsonString = localStorage.getItem('selectedServices');
//   if (jsonString) {
//     const selectedServices = JSON.parse(jsonString);
//     if (selectedServices.basic){
//       state.selectedList.basic = state.basicList.findIndex(item => item.value === selectedServices.basic.value);
//     }
//     if (selectedServices.autoTranslateImg){
//       state.selectedList['advanced1'] = state.advancedList[0].radioList.findIndex(item => item.value === selectedServices.autoTranslateImg.value);
//     }
//     if (selectedServices.gptAutomaticTitle){
//       state.selectedList['advanced2']= state.advancedList[1].radioList.findIndex(item => item.value === selectedServices.gptAutomaticTitle.value);
//     }
//     if (selectedServices.autoESMSalesData){
//       state.selectedList['advanced3']= state.advancedList[2].radioList.findIndex(item => item.value === selectedServices.autoESMSalesData.value);
//     }
//   }
// })

const getBasicMoney = computed(() => {
  return parseFloat(state.basicList[state.selectedList.basic]['money']);
})
const getAdvancedMoney = computed(() => {
  return parseFloat(state.advancedList[0]['radioList'][state.selectedList.advanced1]['value']) + parseFloat(state.advancedList[1]['radioList'][state.selectedList.advanced2]['value']) + parseFloat(state.advancedList[2]['radioList'][state.selectedList.advanced3]['value']);
})
const getTotalMoney = computed(() => {
  return getBasicMoney.value + getAdvancedMoney.value;
})
const isNotAdvancedConditionsMet = computed(() => {
  return state.selectedList.advanced1 !== 3 || state.selectedList.advanced2 !== 5 || state.selectedList.advanced3 !== 5;
})
const  numberFormat= (num) => {
  return parseFloat(num).toLocaleString();
};

const addToCart = () => {
  const selectedServices = {
    'basic' : state.basicList[state.selectedList.basic],
    'autoTranslateImg' : state.advancedList[0].radioList[state.selectedList['advanced1']].value !== 0 ? state.advancedList[0].radioList[state.selectedList['advanced1']] : '' ,
    'gptAutomaticTitle' : state.advancedList[1].radioList[state.selectedList['advanced2']].value !== 0 ? state.advancedList[1].radioList[state.selectedList['advanced2']] : '' ,
    'autoESMSalesData' : state.advancedList[2].radioList[state.selectedList['advanced3']].value !== 0 ? state.advancedList[2].radioList[state.selectedList['advanced3']] : ''
  };
  localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  router.push('/user/mypage');
  return false;
}

const submit = () => {
  if (!state.selectedList.book1) {
    message.warn("이용약관에 동의하여 주세요.")
    return
  }

  if (!state.selectedList.book2) {
    message.warn("이용약관에 동의하여 주세요.")
    return
  }

  const payPlanList = []
  if (state.basicList[state.selectedList.basic]['planName'] !== 'BasicPlan'){
    payPlanList.push(state.basicList[state.selectedList.basic]['planName'])
  }
  if (state.selectedList.advanced1 !== 3) {
    payPlanList.push(state.advancedList[0]['radioList'][state.selectedList.advanced1]['planName'])
  }
  if (state.selectedList.advanced2 !== 5) {
    payPlanList.push(state.advancedList[1]['radioList'][state.selectedList.advanced2]['planName'])
  }
  if (state.selectedList.advanced3 !== 5) {
    payPlanList.push(state.advancedList[2]['radioList'][state.selectedList.advanced3]['planName'])
  }

  const payType = state.selectedList.payType === "1" ? "BankCard" : "Passbook"

  // console.log('我买了啥', payPlanList, payType);

  requestPost('/api/user/quota/order/create', {'plans':[...payPlanList],'paymentMethod':payType}, (data) => {
    if (data.orders.length > 0){


      if (data.isDebug === undefined || data.isDebug === false){

        // 调用结算界面
        const pay_data = {
          ordr_idxx: data.payInfo.ordr_idxx, // 상점관리 주문번호
          good_name: data.payInfo.good_name, // 상품명
          good_mny: data.payInfo.good_mny , // 주문요청금액
          shop_user_id: data.payInfo.shop_user_id, // 쇼핑몰에서 관리하는 회원 ID
          // buyr_name: data.payInfo.buyr_name, // 주문자이름(선택)
          // buyr_tel2: "010-0000-0000", // 주문자 휴대폰번호(선택)
          // buyr_mail: "test@test.co.kr", // 주문자 이메일(선택)
          site_cd: data.payInfo.site_cd, // 가맹점 정보 설정
          site_name: data.payInfo.site_name, // 가맹점 정보 설정
          pay_method: data.payInfo.pay_method, // 100000000000 신용카드 | 001000000000 가상계좌
          quotaopt: '1',
          // 필수 항목 : 결제 금액/화폐단위
          currency: 'WON',
          module_type: '01',
          res_cd: '',
          res_msg: '',
          enc_info: '',
          enc_data: '',
          ret_pay_method: '',
          tran_cd: '',
          use_pay_method: '',
          ordr_chk: '',
          cash_yn: '',
          cash_tr_code: '',
          cash_id_info: '',
          good_expr: '0',

          tax_flag: 'TG03',
          comm_tax_mny: '',
          comm_vat_mny: '',
          comm_free_mny: '',
          skin_indx: '1',
          kcp_pay_title: 'NHN KCP TEST',
          disp_tax_yn: 'N',
        }
        // const pay_data = {
        //     ordr_idxx: data.payInfo.ordr_idxx, // 상점관리 주문번호
        //     good_name: 'test_good', // 상품명
        //     good_mny: data.payInfo.good_mny , // 주문요청금액
        //     shop_user_id: 'test', // 쇼핑몰에서 관리하는 회원 ID
        //     // buyr_name: data.payInfo.buyr_name, // 주문자이름(선택)
        //     // buyr_tel2: "010-0000-0000", // 주문자 휴대폰번호(선택)
        //     // buyr_mail: "test@test.co.kr", // 주문자 이메일(선택)
        //     site_cd: 'T0000', // 가맹점 정보 설정
        //     site_name: 'KCP TEST SHOP', // 가맹점 정보 설정
        //     pay_method: '001000000000', // 100000000000 신용카드 | 001000000000 가상계좌
        //   quotaopt: '1',
        //
        //     // 필수 항목 : 결제 금액/화폐단위
        //   currency: 'WON',
        //   module_type: '01',
        //   res_cd: '',
        //   res_msg: '',
        //   enc_info: '',
        //   enc_data: '',
        //   ret_pay_method: '',
        //   tran_cd: '',
        //   use_pay_method: '',
        //   ordr_chk: '',
        //   cash_yn: '',
        //   cash_tr_code: '',
        //   cash_id_info: '',
        //   good_expr: '0',
        //
        //   tax_flag: 'TG03',
        //   comm_tax_mny: '',
        //   comm_vat_mny: '',
        //   comm_free_mny: '',
        //   skin_indx: '1',
        //   kcp_pay_title: 'NHN KCP TEST',
        //   disp_tax_yn: 'N',
        //
        //   }
        jsf__pay(pay_data);

      }else {
        const routeData = router.resolve({
          name: 'user_thirdPartyPaymentPage',
          query: { orderList:[...data.orders] , total: data.total }
        });
        window.open(routeData.href, '_blank');

        payedHandle(data);
      }

    }

  });



  //发送创建订单接口, 如果创建成功, 新开一个 付款 url, 本页面显示 dialog 提示, 有2个按钮(已完成付款, 未付款), 点击已完成付款, 跳转到付款成功页面, 点击未付款, 关闭 dialog
}

const payedHandle = (data) => {
  open.value = true;

  intervalId  = setInterval(() => {

    AuthRequest.get(process.env.VUE_APP_API_URL + '/api/user/order/is/payed', {
      params:{
        orderId:data.orders[0]
      }
    }).then((res) => {
      if (res.status !== '2000') {
        message.error(res.message)
        return false;
      }

      if (res.data){

        clearInterval(intervalId);
        router.push({
          name: 'user_my'
        })
      }

    }).catch((error) => {
      message.error(error.message);
      return false;
    });


  },checkPayTime)
}

const handleOk = () => {
  router.push({
    name: 'user_my'
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

/* 결제창 호출 调用结算界面 */
const jsf__pay = (args = {}) => {

  const form = {
    ...args
  }

  // create form element
  const formElement = document.createElement("form");
  formElement.setAttribute("name", "order_info");
  // create hidden input element
  for (const key in form) {
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "hidden");
    inputElement.setAttribute("name", key);
    inputElement.setAttribute("value", form[key]);

    formElement.appendChild(inputElement);
  }

  document.body.appendChild(formElement);

  try {
    KCP_Pay_Execute_Web(formElement);
  } catch (e) {
    /* IE 에서 결제 정상종료시 throw로 스크립트 종료 */
    console.log(e);
  }
}

const store = useStore();
const openPolicyModal = () => {
  store.commit('setIsModalOpen', true);
};

const openRefundRuleModal = () => {
  store.commit('setIsRefundModalOpen', true);
};

const onAgree1 = () => {
  state.selectedList.book1= true;
};

const onAgree2 = () => {
  state.selectedList.book2= true;
};

</script>

<style scoped>
.bottom-border-f0f0f0{
  border-bottom: 2px solid #f0f0f0;
}
.border-top-f0f0f0-2{
  border-top: 2px solid #f0f0f0;
}
.border-bottom-f0f0f0-2{
  border-bottom: 2px solid #f0f0f0;
}
.pay-wrap .title{
  height: 75px;
  border-top: 2px solid #f0f0f0;
  padding: 0 22px 0 30px;
}
.pay-wrap .check-wrap{
  width: 90%;
  margin: 0 auto;
  gap: 20px 80px;
}
.pay-wrap .check-list{
  min-width: 220px;
}
.pay-wrap .check{
  width: 19px;
  height: 14px;
}
.pay-wrap .btn{
  padding: 15px 20px;
}
.pay-wrap .rq-wrap{
  width: 100%;
  margin: 0 auto;
}
.pay-wrap .radio-wrap{
  gap: 20px;
}
.pay-wrap .radio-wrap label{
  width: calc(100% / 3);
  border: 1px solid #0505050f;
  height: 200px;
  border-radius: 15px;
  cursor: pointer;
  padding: 30px;
}
.pay-wrap .radio-wrap label > span:last-child > div{
  width: 100%;
  height: 100%;
  justify-content: space-between;
}
.pay-wrap .total-wrap .left{
  width: 60%;
}
.pay-wrap .total-wrap .left label{
  width: initial;
  height: initial;
  padding: 10px;
  margin: 0;
}
.pay-wrap .total-wrap .right{
  width: 40%;
  height: 100%;
  border-left: 2px solid #F0F0F0;
  border-right: 2px solid #F0F0F0;
}
.pay-wrap .right .text-list:last-child{
  border: 0;
}
.pay-wrap .right .pay-type{
  border: 2px solid #f0f0f0;
}

.pay-type .ant-btn{
  padding: 0;
}

.pay-type .ant-btn-default{
  border-color: transparent;
}

.pay-type .ant-btn-default:not(:disabled):hover{
  color:#2171E2;
  border-color: transparent;
}

</style>
<style>
.pay-wrap .radio-wrap label > span:first-child{
  display: block;
  padding: 0;
  width: 16px;
  height: 16px;
}
.pay-wrap .radio-wrap label > span:last-child{
  display: block;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>