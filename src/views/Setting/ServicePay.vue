<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true" />

  <a-card :bordered="false" title="서비스 결제">

    <div class="service_title">
      <h1>월드링크 가격안내</h1>
      <h4>나에게 필요한 기능만 선택하고 저렴하게 사용하세요.</h4>
    </div>

    <div style="padding: 50px 100px; margin: 30px 0; background: #eee">
      <a-row :gutter="100">
        <a-col :span="8">
          <a-card title="상품등록" :bordered="false">
            <div style="text-align: center;">원하는 마켓을 선택하여<br>상품을 등록할 수 있어요.</div>
            <a-divider />
            <a-radio-group v-model:value="value">
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">선택안함</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">200건/ 월 10,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">450건/ 월 20,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">1000건/ 월 30,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">1500건/ 월 40,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">3000건/ 월 50,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">무제한/ 월 80,000원</a-radio>
            </a-radio-group>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="이미지 편집/번역" :bordered="false">
            <div style="text-align: center;">월드링크 편집툴로 빠르고<br>편하게 편집해보세요.</div>
            <a-divider />
            <a-radio-group v-model:value="value">
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">선택안함</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">500건/ 월 10,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">1000건/ 월 18,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">5000건/ 월 80,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">10000건/ 월 120,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">무제한/ 월 150,000원</a-radio>
            </a-radio-group>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="배송대행 원클릭" :bordered="false">
            <div style="text-align: center;">별도의 배대지 사이트 방문없이 원클릭으로<br>배대지를 등록할 수 있어요.</div>
            <a-divider />
            <a-radio-group v-model:value="value">
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">선택안함</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">무제한 / 월 34,800원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">무제한 / 3개월 98,800원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">무제한/ 6개월 188,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">무제한/ 1년 354,000원</a-radio>
              <a-radio style="display: flex; height: 30px; line-height: 30px;" :value="1">주문수집 / 건당 200원</a-radio>
            </a-radio-group>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <a-descriptions title="서비스 이용 기간" bordered  :labelStyle="{ width: '170px' }">
      <a-descriptions-item label="상품등록" :span="3">2023년 00월 00일 ~ 2023년 00월 00일</a-descriptions-item>
      <a-descriptions-item label="이미지편집" :span="3">2023년 00월 00일 ~ 2023년 00월 00일</a-descriptions-item>
      <a-descriptions-item label="배송대행 원클릭" :span="3">2023년 00월 00일 ~ 2023년 00월 00일</a-descriptions-item>
    </a-descriptions>

    <a-divider />

    <div class="service_content">
      <h4>결제 방법</h4>
      <div>
        <a-radio-group v-model:value="value" name="radioGroup">
          <a-radio value="1">카드결제</a-radio>
          <a-radio value="2">카카오페이</a-radio>
          <a-radio value="3">토스페이</a-radio>
          <a-radio value="4">PAYCO</a-radio>
          <a-radio value="4">가상계좌</a-radio>
        </a-radio-group>
      </div>
    </div>

    <a-divider />

    <div class="service_content">
      <h4>총 결제 금액</h4>
      <div><span class="price">00,00</span>원 (vat 포함)</div>
    </div>

    <a-divider />

    <div class="service_content">
      <a-button type="primary" size="large">
        <DollarOutlined />
        결제하기
      </a-button>
    </div>

  </a-card>
</template>

<script setup>
import {
  DollarOutlined
} from "@ant-design/icons-vue";
import {reactive, ref} from "vue";
import {message} from "ant-design-vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const indicator = ref(false);

</script>

<style scoped>
.service_title { text-align: center; }
.service_title h1 { font-size: 40px; font-weight: bold; letter-spacing: -3px; }
.service_title h4 { font-size: 18px; color: #666; margin-top: -15px;}

.service_content { text-align: center; }
.service_content h4 {font-size: 16px; font-weight: bold;}
.service_content div {font-size: 14px; color: #666;}
.service_content div .price {color: red;}
</style>
