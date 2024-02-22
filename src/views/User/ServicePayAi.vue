<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true" />

  <a-card :bordered="false" title="AI 서비스 결제">

    <a-card :bordered="false" class="s-service-description">
      <div class="s-title">유일 AI 특화 기능</div>
      <a-row class="s-sub" :gutter="80">
        <a-col :span="8"><span class="s-icon"><CheckOutlined /></span>무제한 상품 수집 / 등록 / 관리</a-col>
        <a-col :span="8"><span class="s-icon"><CheckOutlined /></span>직원 전용 계정 생성 및 관리</a-col>
        <a-col :span="8"><span class="s-icon"><CheckOutlined /></span>배송대행지</a-col>
        <a-col :span="8"><span class="s-icon"><CheckOutlined /></span>하루 100개 자동 상세페이지 / 옵션이미지 번역</a-col>
        <a-col :span="8"><span class="s-icon"><CheckOutlined /></span>하루 100개 GPT 상품명 추천</a-col>
        <a-col :span="8"><span class="s-icon"><CheckOutlined /></span>주문관리</a-col>
      </a-row>
    </a-card>

    <a-row :gutter="30">
      <a-col :span="8" v-for="(data, index) in payList">
        <a-card :bordered="false" class="s-service-pay" :key="index" v-if="data.serviceDay !== 0">
          <div class="s-best" v-if="data.isBest">BEST</div>
          <div class="s-content">
            <div class="s-day">{{ data.serviceDay }}개월</div>
            <div class="s-sail"><div v-show="data.sailValue"><span>{{ data.sailValue }}% 할인</span> 할부 결제 가능</div></div>
            <div class="s-price" :style="data.isBest ? 'color: #fe3a2f;' : ''">₩ {{ data.servicePrice }} / 월</div>
            <div><a-button class="s-button" size="large" @click="serviceBuy(data)">결제하기</a-button></div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <div style="height: 100px;"></div>

  </a-card>
</template>

<script setup>
import {
  CheckOutlined
} from "@ant-design/icons-vue";
import {reactive, ref} from "vue";
import {message} from "ant-design-vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const indicator = ref(false);

const payList = ref([
  {
    serviceDay: 1,
    sailValue: 0,
    servicePrice: '25만원',
    isBest: false,
  },
  // {
  //   serviceDay: 3,
  //   sailValue: 20,
  //   servicePrice: 200000,
  //   isBest: false
  // },
  // {
  //   serviceDay: 6,
  //   sailValue: 33,
  //   servicePrice: 167000,
  //   isBest: true
  // },
  // {
  //   serviceDay: 0,
  //   sailValue: 0,
  //   servicePrice: 0,
  //   isBest: false
  // },
  // {
  //   serviceDay: 0,
  //   sailValue: 0,
  //   servicePrice: 0,
  //   isBest: false
  // },
  // {
  //   serviceDay: 12,
  //   sailValue: 44,
  //   servicePrice: 140000,
  //   isBest: true
  // },
]);

// 결제버튼
const serviceBuy = (data) => {
  console.log('==0==')
  console.log(data)

  message.success('결제');
}


</script>

<style scoped>

.s-service-description {
  box-shadow: 3px 3px  10px rgba(0,0,0,0.1);
}

.s-service-description .s-title {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 10px;
}

.s-service-description .s-sub .ant-col {
  margin-bottom: 5px;
}

.s-service-description .s-sub .s-icon {
  position: relative;
  top: -2px;
  color: red;
  font-size: 10px;
  margin-right: 10px;
}

.s-service-pay {
  position: relative;
  box-shadow: 3px 3px  10px rgba(0,0,0,0.1);
  text-align: center;
  height: 230px;
  margin-top: 30px;
}

.s-service-pay .s-best {
  position: absolute;
  top: 15px;
  left: 20px;
  width: 50px;
  height: 25px;
  background: #f7d600;
  text-align: center;
  line-height: 24px;
  border-radius: 5px;
}

.s-service-pay .s-content {
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  //position: absolute;
  //top: 50%;
  //left: 50%;
  //transform: translate(-50%, -50%);
}

.s-service-pay .s-day {
  font-size: 18px;
  font-weight: 600;
}

.s-service-pay .s-sail {
  font-size: 14px;
}
.s-service-pay .s-sail span {
  color: #fe3a2f;
}

.s-service-pay .s-price {
  font-size: 18px;
  font-weight: 600;
}

.s-service-pay .s-button {
  background: #000;
  color: #fff;
  font-size: 13px;
  padding: 0 25px;
  margin-top: 30px;
  border: none;
}

.s-service-pay .introduction {
  color: #939393;
}

</style>
