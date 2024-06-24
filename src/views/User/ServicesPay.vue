<template>
  <div class="pay-wrap">
    <a-page-header title="유일 AI 플랜" class="font-SCDream6 fs16" />
    <a-flex align="center" justify="space-between" class="title bg-fafafa">
      <span class="fs18">AI 플랜 기능설명</span>
      <span class="font-SCDream4 fs14 rq bg-FEDB41 br20 fl-cc">사용중 : 2024.03.01 - 2024.03.31</span>
    </a-flex>
    <a-flex class="check-wrap">
      <div class="fl-tc">
        <img src="@/assets/img/pay-yes.png">
        <div class="font-SCDream5 fs12">무제한 상품등록</div>
      </div>
    </a-flex>
  </div>

</template>

<script setup>

</script>

<style scoped>
.pay-wrap .title{
  height: 75px;
  border-top: 2px solid #f0f0f0;
  padding: 0 22px 0 30px;
}
.pay-wrap .rq{
  width: 330px;
  height: 33px;
}
.pay-wrap .check-wrap img{
  width: 19px;
  height: 14px;
}

</style>