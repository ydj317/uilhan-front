<template>
  <div class="my mlr60">
    <a-flex class="font-SCDream6 fs18">마이페이지</a-flex>
    <a-flex class="info-wrap mt32 plr44 br10 primary-bg-color" justify="space-between" align="center">
      <a-flex class="name fl00" vertical justify="flex-end">
        <span class="font-SCDream5 fs30">{{ Cookie.get('member_name') }}님, 안녕하세요.</span>
        <span class="btn font-SCDream4 fs12 br15 mt35 bor-black cp">내 정보 관리</span>
      </a-flex>
      <a-flex class="money-wrap br15 box-sha" justify="center" vertical>
        <a-flex class="bottom-border-f0f0f0 pb25 font-SCDream6 fs30" align="center" justify="space-between">
          <a-flex align="center">
            <img src="@/assets/img/logo.png">
            <span class="ml10 fw font-SCDream6 fs30">PAY</span>
          </a-flex>
          <span class="number color-FB6F3E">1,900 원</span>
        </a-flex>
        <a-flex class="font-SCDream4 fs12 color-bababa mt10 cp" justify="flex-end">AI 프리미엄을 시작해보세요!&nbsp;&nbsp;></a-flex>
      </a-flex>
    </a-flex>
    <a-divider class="bg-hui h2"></a-divider>
    <a-flex class="card-wrap bg-fafafa br10" align="center" gap="40">
      <a-card :bordered="false">
        <a-flex align="center">
          <a-flex class="bg-round br50 bg-f0f0f0 center"><img src="@/assets/img/order.png"></a-flex>
          <a-flex vertical class="ml15">
            <div class="font-SCDream6 fs18">주문내역</div>
            <div class="font-SCDream6 fs16 primary-color">1,890원</div>
          </a-flex>
        </a-flex>
      </a-card>
      <a-card :bordered="false" >
        <a-flex align="center">
          <a-flex class="bg-round br50 bg-f0f0f0 center"><img src="@/assets/img/cart.png"></a-flex>
          <a-flex vertical class="ml15">
            <div class="font-SCDream6 fs18">주문내역</div>
            <div class="font-SCDream6 fs16 primary-color">1,890원</div>
          </a-flex>
        </a-flex>
      </a-card>
      <a-card :bordered="false">
        <a-flex align="center">
          <a-flex class="bg-round br50 bg-f0f0f0 center"><img src="@/assets/img/send.png"></a-flex>
          <a-flex vertical class="ml15">
            <div class="font-SCDream6 fs18">주문내역</div>
            <div class="font-SCDream6 fs16 primary-color">1,890원</div>
          </a-flex>
        </a-flex>
      </a-card>
      <a-card :bordered="false">
        <a-flex align="center">
          <a-flex class="bg-round br50 bg-f0f0f0 center"><img src="@/assets/img/coupon.png"></a-flex>
          <a-flex vertical class="ml15">
            <div class="font-SCDream6 fs18">주문내역</div>
            <div class="font-SCDream6 fs16 primary-color">1,890원</div>
          </a-flex>
        </a-flex>
      </a-card>
    </a-flex>
    <a-flex class="intro-wrap mt30 fs18 font-SCDream6" gap="30">
      <a-card :bordered="false" class="bg-fafafa">
        <template #title>
          <img src="@/assets/img/order-small.png">
          <span class="ml20">주문내역</span>
        </template>
        <div class="text fs16 font-SCDream4">메인서비스 : 2024.03.24 - 2024.03.23<br>
          GPT 자동화 : 2024.03.24 - 2024.03.23<br>
          이미지 자동번역 : 2024.03.24 - 2024.03.23</div>
      </a-card>
      <a-card :bordered="false" class="bg-fafafa">
        <template #title>
          <img src="@/assets/img/cart-small.png">
          <span class="ml20">장바구니</span>
        </template>
        <div class="text fs16 font-SCDream4">메인서비스 : 6개월<br>
          GPT 자동화 : 1개월<br>
          이미지 자동번역 : 1개월</div>
      </a-card>
      <a-card :bordered="false" class="bg-fafafa">
        <template #title>
          <img src="@/assets/img/clock-small.png">
          <span class="ml20">환불내역</span>
        </template>
        <div class="text fs16 font-SCDream4">메인서비스 : 2024.03.24 - 2024.03.23<br>
          GPT 자동화 : 2024.03.24 - 2024.03.23<br>
          이미지 자동번역 : 2024.03.24 - 2024.03.23<br>
          G마켓 자동수집 : 2024.03.24 - 2024.03.23</div>
      </a-card>
    </a-flex>
    <a-flex class="question-wrap mt30" gap="28">
      <a-card :bordered="false">
        <template #title>
          <img src="@/assets/img/free.png">
          <span class="ml20 font-SCDream6 fs18">무료플랜</span>
        </template>
        <div class="font-SCDream4 fs16">무료플랜 남은기간 : 2024.03.24 - 2024.03.23</div>
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
import { reactive } from "vue";
import {ClockCircleOutlined} from '@ant-design/icons-vue';
const state = reactive({
  cardList:[
    {img:'@/assets/img/order.png',title:'주문내역',money:'1,890원'},
    {img:'@/assets/img/cart.png',title:'장바구니',money:'100원'},
    {img:'@/assets/img/send.png',title:'배송대행지 포인트',money:'18,000원'},
    {img:'@/assets/img/coupon.png',title:'보유쿠폰',money:'1,000원'},
  ]
});
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
.my .info-wrap{
  height: 244px;
}
.my .name{
  height: inherit;
  padding-bottom: 50px;
}
.my .btn{
  width: fit-content;
  padding: 2px 6px;
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
</style>