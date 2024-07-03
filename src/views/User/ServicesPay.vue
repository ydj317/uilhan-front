<template>
  <div class="pay-wrap">
    <a-page-header title="유일 AI 플랜" class="font-SCDream6 fs16" />
    <a-flex align="center" justify="space-between" class="title bg-fafafa">
      <span class="fs18">AI 플랜 기능설명</span>
      <span class="font-SCDream4 fs14 color-2171E2">[사용중 : 2024.03.01 ~ 2024.03.31]</span>
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
          <a-radio :value="i" :class="{'bg-FEDB41':i == state.selectedList.basic}" :disabled="Object.keys(state.basicInfo).length">
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
                <a-radio :value="i3" :class="{'bg-FEDB41':i3 == state.selectedList['advanced'+(i+1)]}">
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
            <a-flex align="center" justify="space-between" class="text-list h50 border-bottom-f0f0f0-2" v-if="!Object.keys(state.basicInfo).length">
              <span>AI플랜 - 기본서비스</span>
              <span>{{ state.basicList[state.selectedList.basic]['title'] }}</span>
            </a-flex>
            <a-flex align="center" justify="space-between" class="text-list h50 border-bottom-f0f0f0-2">
              <span>프리미엄 AI기능 - 추가서비스</span>
              <span>1개월</span>
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
                <a-radio value="2"  class="font-SCDream4">무통장입금</a-radio>
              </a-radio-group>
            </a-flex>
          </a-flex>
          <a-flex vertical class="w100 pay-type br5 p10 mt20">
            <a-flex class="font-SCDream6 fs14">이용약관</a-flex>
            <a-flex vertical class="mt10">
              <a-checkbox v-model:checked="state.selectedList.book1">취소/환불 규정에 동의합니다.  <span class="color-2171E2">[약관보기]</span></a-checkbox>
              <a-checkbox v-model:checked="state.selectedList.book2">서비스 이용약관에 동의합니다.  <span class="color-2171E2">[약관보기]</span></a-checkbox>
            </a-flex>
          </a-flex>
          <a-flex vertical align="center" class="mt30">
            <a-button class="font-SCDream6 fs14 t-white bg-black fl-cc w60 h40">결제하기</a-button>
            <a-button class="font-SCDream6 fs14 fl-cc w60 mt20 h40">장바구니 담기</a-button>
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
  </div>

</template>

<script setup>
import { computed, reactive } from "vue";

const state = reactive({
  checkList:[
    '무제한 상품등록', '상품명 자동추천', '상품 데이터 AI 조회','상품수집',
    '브랜드 키워드 표시','원클릭 번역','주문수집 / 관리','자동 카테고리매칭',
    '고급 이미지 편집','배송대행지 연동','직원 계정 / 데이터','9대 마켓 입점'],
  basicList: [
    {value:1,title:'1개월',subTitle:'',money:'200000',monthMoney:''},
    {value:2,title:'6개월',subTitle:'20% 할인',money:'960000',monthMoney:'160000'},
    {value:3,title:'12개월',subTitle:'30% 할인',money:'1680000',monthMoney:'140000'}
  ],
  advancedList:[
    {
      title:'이미지 자동 번역',
      checkList:['상세페이지 전체 자동번역','옵션 이미지 10장 자동번역'],
      radioList:[
        {text:'100개/일',value:'100000'},
        {text:'200개/일',value:'200000'},
        {text:'300개/일',value:'300000'},
        {text:'선택안함',value:0},
      ]
    },
    {
      title:'GPT AI 자동 상품명',
      checkList:['제품사진으로 GPT 자동 AI 상품명 완성'],
      radioList:[
        {text:'100개/일',value:'100000'},
        {text:'150개/일',value:'150000'},
        {text:'200개/일',value:'200000'},
        {text:'250개/일',value:'250000'},
        {text:'300개/일',value:'300000'},
        {text:'선택안함',value:0},
      ]
    },
    {
      title:'ESM 판매데이터 자동수집',
      checkList:['옥션,G마켓 판매 데이터 버튼 클릭시 자동 수집 기능'],
      radioList:[
        {text:'100개/일',value:'100000'},
        {text:'150개/일',value:'150000'},
        {text:'200개/일',value:'200000'},
        {text:'250개/일',value:'250000'},
        {text:'300개/일',value:'300000'},
        {text:'선택안함',value:0},
      ]
    },
  ],
  selectedList: { basic:0,advanced1:3,advanced2:5,advanced3:5,payType:"1",book1:true,book2:true },
  basicInfo:{},//基础服务数据
});
const getBasicMoney = computed(() => {
  return parseFloat(state.basicList[state.selectedList.basic]['money']);
})
const getAdvancedMoney = computed(() => {
  return parseFloat(state.advancedList[0]['radioList'][state.selectedList.advanced1]['value']) + parseFloat(state.advancedList[1]['radioList'][state.selectedList.advanced2]['value']) + parseFloat(state.advancedList[2]['radioList'][state.selectedList.advanced3]['value']);
})
const getTotalMoney = computed(() => {
  return getBasicMoney.value + getAdvancedMoney.value;
})
const  numberFormat= (num) => {
  return parseFloat(num).toLocaleString();
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
  width: 80%;
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