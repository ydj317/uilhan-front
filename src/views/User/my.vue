<template>
  <div class="my mlr60">
    <a-flex class="font-SCDream6 fs18">마이페이지</a-flex>
    <a-flex class="info-wrap mt32 plr44 br10 primary-bg-color" justify="space-between" align="center">
      <a-flex class="name fl00" vertical justify="flex-end">
        <span class="font-SCDream5 fs30">{{ Cookie.get('member_name') }}님, 안녕하세요.</span>
        <span class="btn font-SCDream4 fs12 br15 mt35 bor-black">내 정보 관리</span>
      </a-flex>
      <a-flex class="money-wrap br15" justify="center" vertical>
        <a-flex class="bottom-border-f0f0f0 pb25 font-SCDream6 fs30" align="center" justify="space-between">
          <a-flex align="center">
            <img src="@/assets/img/logo.png">
            <span class="ml10 fw font-SCDream6 fs30">PAY</span>
          </a-flex>
          <span class="number color-FB6F3E">1,900 원</span>
        </a-flex>
        <a-flex class="font-SCDream4 fs12 color-bababa mt10" justify="flex-end">AI 프리미엄을 시작해보세요!&nbsp;&nbsp;></a-flex>
      </a-flex>
    </a-flex>
    <a-divider class="bg-hui h2"></a-divider>
    <a-flex class="card-wrap bg-fafafa br10" align="center" justify="space-around">
      <a-card :bordered="false" style="width: 300px" v-for="v in state.cardList">
        <a-flex align="center">
          <img :src="v.img">
          <a-flex vertical>
            <div class="font-SCDream6 fs18">{{v.title}}</div>
            <div class="font-SCDream6 fs16">{{v.money}}</div>
          </a-flex>
        </a-flex>
      </a-card>
    </a-flex>
    <a-flex class="mt30">
      <a-flex>

      </a-flex>
    </a-flex>
  </div>
</template>

<script setup>
import Cookie from "js-cookie";
import { reactive } from "vue";
const state = reactive({
  cardList:[
    {img:'@/assets/img/order.png',title:'주문내역',money:'1,890원'},
    {img:'@/assets/img/cart.png',title:'장바구니',money:'100원'},
    {img:'@/assets/img/send.png',title:'배송대행지 포인트',money:'18,000원'},
    {img:'@/assets/img/coupon.png',title:'보유쿠폰',money:'1,000원'},
  ]
});
</script>

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
}
</style>