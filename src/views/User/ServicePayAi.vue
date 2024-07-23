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
            <div>
              <a-checkbox v-model:checked="checked">
                <a-button class="init" type="link" @click="openPolicyModal">이용약관</a-button> (결제 취소 및 환불 규정) 에 동의합니다.
              </a-checkbox>
              <policy @agree="onAgree" />
            </div>
            <div><a-button class="s-button" size="large" @click="serviceBuy(data)">결제하기</a-button></div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <div style="height: 100px;"></div>

  </a-card>

  <!-- 결제요청  -->
<!--  <a href="#none" onclick="jsf__pay(document.order_info);">결제요청</a>-->

  <form name="order_info" >
    <!-- 주문정보 세팅 -->
    <input type="hidden" name="ordr_idxx" value="TEST12345" maxlength="40" />  <!--상점관리 주문번호-->
    <input type="hidden" name="good_name" value="AI 서비스 결제" /><!--상품명-->
    <input type="hidden" name="good_mny" value="250000" maxlength="9" /><!--주문요청금액-->

    <!-- 구매자 세팅 -->

    <input type="hidden" name="shop_user_id" value="홍길동" /> <!-- 쇼핑몰에서 관리하는 회원 ID -->
    <input type="hidden" name="buyr_name" value="홍길동" /><!--주문자이름(선택)-->
    <input type="hidden" name="buyr_tel2" value="010-0000-0000" /><!--주문자 휴대폰번호(선택)-->
    <input type="hidden" name="buyr_mail" value="test@test.co.kr" /><!--주문자 이메일(선택)-->

    <!-- 가맹점 정보 설정-->
    <input type="hidden" name="site_cd" value="AK3QN" />
    <input type="hidden" name="site_name" value="해주국제무역상사" />

    <!-- 결제수단 -->
    <input type="hidden" name="pay_method" value="100000000000" />
  </form>

</template>

<script setup>
import {
  CheckOutlined
} from "@ant-design/icons-vue";
import {reactive, ref} from "vue";
import {message} from "ant-design-vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Policy from "@/components/Detail/policy.vue";

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
  if (!checked.value) {
    message.warning('결제 하시러면 이용약관 내용을 읽어보시고 약관 동의가 필요합니다.');
    return false;
  }
  console.log('==0==')
  console.log(data)

  message.success('결제');


  jsf__pay(document.order_info);


}

const checked = ref(false);
const onAgree = () => {
  checked.value = true;
};

import { useStore } from 'vuex';
const store = useStore();
const openPolicyModal= () => {
  store.commit('setIsModalOpen', true);
}

/* 결제창 호출 */
const jsf__pay = (form) => {
  // 결제수단 설정
  form.pay_method.value="100000000000"; //신용카드
  // form.pay_method.value="001000000000"; //가상계좌

  try {
    KCP_Pay_Execute_Web( form );
  } catch (e) {
    /* IE 에서 결제 정상종료시 throw로 스크립트 종료 */
    console.log(e);
  }
}

/* 인증완료시 재귀 함수  */
const m_Completepayment = ( FormOrJson, closeEvent ) => {

  if( FormOrJson.res_cd.value == "0000" ) {

    // FormOrJson 데이터를 Server 에 전달하여 승인요청하기
    // {
    //   "res_cd": '',
    //   "res_msg": '',
    //   "enc_info": '',
    //   "enc_data": '',
    //   "ret_pay_method": '',
    //   "tran_cd": '',
    //   "use_pay_method": '',
    // }

  } else {
    message.warning("[" + FormOrJson.res_cd.value + "] " + FormOrJson.res_msg.value);
    closeEvent();
  }
}
</script>

<style scoped>

.s-service-description {
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
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

.ant-checkbox-wrapper{
  color:#fe3a2f;
}

.ant-btn-link {
  padding:0;
  color:#1677ff;
}

</style>
