<template>
  <div class="pay-wrap">
    <a-page-header title="유일 AI 플랜" class="font-SCDream6 fs16" />
    <a-flex align="center" justify="space-between" class="title bg-fafafa">
      <span class="fs18">AI 플랜 기능설명</span>
      <span class="font-SCDream4 fs14 color-2071E1">[사용중 : 2024.03.01 ~ 2024.03.31]</span>
    </a-flex>
    <a-flex class="check-wrap mt30" wrap="wrap">
      <a-flex align="center" class="check-list" v-for="i in 12">
        <img src="@/assets/img/pay-yes.png" class="check">
        <div class="btn font-SCDream5 fs12 color-2071E1 ml15 bg-F0F8FE fl-cc br5 fl1">무제한 상품등록</div>
      </a-flex>
    </a-flex>
    <a-flex class="rq-wrap mt30">
      <a-radio-group v-model:value="state.rqSelected" name="radioGroup" class="radio-wrap w100 fl">
        <a-flex class="rq-list bor-0505050f font-SCDream5 p30 fl-c fl-la cp" v-for="(v,k) in state.rqList">
          <a-flex align="center" class="fs30">
            <a-radio :value="v.type"></a-radio>
            <div class="rq-text ml10 font-SCDream5 fs22">{{v.title}}</div>
            <div class="rq-text2 ml10 color-FB6F3E font-SCDream4 fs14 bg-f0f0f0 br15 p5" v-if="v.subTitle">{{v.subTitle}}</div>
          </a-flex>
          <a-flex vertical align="flex-end" class="money fs30">
            <div class="font-SCDream5 fs20">{{v.money}}</div>
            <div class="font-SCDream4 fs16" v-if="v.monthMoney">{{v.monthMoney}}</div>
          </a-flex>
        </a-flex>
      </a-radio-group>
    </a-flex>
    <a-divider class="mtb30" />
    <a-flex class="total-wrap">

    </a-flex>
  </div>

</template>

<script setup>
import { reactive } from "vue";

const state = reactive({
  rqList: [
    {type:1,title:'1개월',subTitle:'',money:'200,000원',monthMoney:''},
    {type:6,title:'6개월',subTitle:'20% 할인',money:'960,000원',monthMoney:'월 160,000원'},
    {type:12,title:'12개월',subTitle:'30% 할인',money:'1,680,000원',monthMoney:'월 140,000원'}
  ],
  rqSelected:1,
  listLoading: false,
});
</script>

<style scoped>
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
  width: 180px;
  height: 30px;
}
.pay-wrap .check{
  width: 19px;
  height: 14px;
}
.pay-wrap .btn{
  height: 30px;
  max-width: 80%;
}
.pay-wrap .rq-wrap{
  width: 80%;
  margin: 0 auto;
}
.pay-wrap .radio-wrap{
  gap: 20px;
}
.pay-wrap .rq-list{
  width: calc(100% / 3);
  height: 200px;
}
</style>