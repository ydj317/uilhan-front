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
            <a-radio-group v-model:value="formState.selectValue.productRegister" @change="selectOption">
              <a-radio class="selectRadio" v-for="(info, value) in formState.productRegisterSelect" :key="value" :value="value">
                {{ info.label }}
              </a-radio>
            </a-radio-group>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="이미지 편집/번역" :bordered="false">
            <div style="text-align: center;">월드링크 편집툴로 빠르고<br>편하게 편집해보세요.</div>
            <a-divider />
            <a-radio-group v-model:value="formState.selectValue.imageEdit" @change="selectOption">
              <a-radio class="selectRadio" v-for="(info, value) in formState.imageEditSelect" :key="value" :value="value">
                {{ info.label }}
              </a-radio>
            </a-radio-group>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="배송대행 원클릭" :bordered="false">
            <div style="text-align: center;">별도의 배대지 사이트 방문없이 원클릭으로<br>배대지를 등록할 수 있어요.</div>
            <a-divider />
            <a-radio-group v-model:value="formState.selectValue.bindBridge" @change="selectOption">
              <a-radio class="selectRadio" v-for="(info, value) in formState.bindBridgeSelect" :key="value" :value="value">
                {{ info.label }}
              </a-radio>
            </a-radio-group>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <a-descriptions title="서비스 이용 기간" bordered  :labelStyle="{ width: '170px' }">
      <a-descriptions-item label="상품등록" :span="3">{{ nowDate }} ~ {{ formState.productRegisterDate }}</a-descriptions-item>
      <a-descriptions-item label="이미지편집" :span="3">{{ nowDate }} ~ {{ formState.imageEditDate }}</a-descriptions-item>
      <a-descriptions-item label="배송대행 원클릭" :span="3">{{ nowDate }} ~ {{ formState.bindBridgeDate }}</a-descriptions-item>
    </a-descriptions>

    <a-divider />

    <div class="service_content">
      <h4>결제 방법</h4>
      <div>
        <a-radio-group v-model:value="formState.selectValue.paymentMethod" name="radioGroup">
          <a-radio v-for="(label, value) in formState.paymentMethodSelect" :key="value" :value="value">{{ label }}</a-radio>
        </a-radio-group>
      </div>
    </div>

    <a-divider />

    <div class="service_content">
      <h4>총 결제 금액</h4>
      <div><span class="price">{{ formState.totalPrice.toLocaleString() }}</span>원 (vat 포함)</div>
    </div>

    <a-divider />

    <div class="service_content">
      <a-button type="primary" size="large" @click="payment">
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

const nowDate = ref(getFormattedDate());

const defaultDate = '0000년 00월 00일';

const formState = reactive({
  selectValue: {
    productRegister : '0',
    imageEdit : '0',
    bindBridge : '0',
    paymentMethod : 'cardPay',
  },
  productRegisterSelect: {
    '0': {
      'label': '선택안함',
      'price': 0,
    },
    '200': {
      'label': '200건/ 월 10,000원',
      'price': 10000,
    },
    '450': {
      'label': '450건/ 월 20,000원',
      'price': 20000,
    },
    '1000': {
      'label': '1000건/ 월 30,000원',
      'price': 30000,
    },
    '1500': {
      'label': '1500건/ 월 40,000원',
      'price': 40000,
    },
    '3000': {
      'label': '3000건/ 월 50,000원',
      'price': 50000,
    },
    '999999': {
      'label': '무제한/ 월 80,000원',
      'price': 80000,
    }
  },
  imageEditSelect: {
    '0': {
      'label': '선택안함',
      'price': 0,
    },
    '500': {
      'label': '500건/ 월 10,000원',
      'price': 10000,
    },
    '1000': {
      'label': '1000건/ 월 18,000원',
      'price': 18000,
    },
    '5000': {
      'label': '5000건/ 월 80,000원',
      'price': 80000,
    },
    '10000': {
      'label': '10000건/ 월 120,000원',
      'price': 120000,
    },
    '999999': {
      'label': '무제한/ 월 150,000원',
      'price': 1500000,
    },
  },
  bindBridgeSelect: {
    '0': {
      'label': '선택안함',
      'price': 0,
    },
    '1': {
      'label': '무제한 / 1개월 34,800원',
      'price': 34800,
    },
    '3': {
      'label': '무제한 / 3개월 98,800원',
      'price': 98800,
    },
    '6': {
      'label': '무제한 / 6개월 188,000원',
      'price': 188000,
    },
    '12': {
      'label': '무제한 / 1년 354,000원',
      'price': 354000,
    }
  },
  paymentMethodSelect: {
    'cardPay': '카드결제',
    'kakaoPay': '카카오페이',
    'tosPay': '토스페이',
    'coPay': 'PAYCO',
    'accountPay': '가상계좌',
  },
  productRegisterDate: defaultDate,
  imageEditDate: defaultDate,
  bindBridgeDate: defaultDate,
  totalPrice: 0
});

// 선택변경
const selectOption = () => {
  formState.totalPrice = 0;

  formState.productRegisterDate = defaultDate
  if (formState.selectValue.productRegister !== '0') {
    formState.productRegisterDate = getFormattedDate(1) + ' (' + formState.selectValue.productRegister + '건)';
    formState.totalPrice += formState.productRegisterSelect[formState.selectValue.productRegister].price
  }

  formState.imageEditDate = defaultDate
  if (formState.selectValue.imageEdit !== '0') {
    formState.imageEditDate = getFormattedDate(1) + ' (' + formState.selectValue.imageEdit + '건)';
    formState.totalPrice += formState.imageEditSelect[formState.selectValue.imageEdit].price
  }

  formState.bindBridgeDate = defaultDate
  if (formState.selectValue.bindBridge !== '0') {
    formState.bindBridgeDate = getFormattedDate(formState.selectValue.bindBridge) + ' (' + formState.selectValue.bindBridge + '개월)';
    formState.totalPrice += formState.bindBridgeSelect[formState.selectValue.bindBridge].price
  }

}

// 결제버튼
const payment = () => {
  console.log('==0==')
  console.log(formState)

  message.success('결제');
}

function getFormattedDate(monthOffset = 0) {
  monthOffset = Number(monthOffset)

  const date = new Date();
  let targetDay = date.getDate();

  if (monthOffset !== 0) {
    targetDay -= 1;
  }
  const targetDate = new Date(date.getFullYear(), date.getMonth() + monthOffset, targetDay);

  const year = String(targetDate.getFullYear());
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
}

</script>

<style scoped>
.service_title { text-align: center; }
.service_title h1 { font-size: 40px; font-weight: bold; letter-spacing: -3px; }
.service_title h4 { font-size: 18px; color: #666; margin-top: -15px;}

.service_content { text-align: center; }
.service_content h4 {font-size: 16px; font-weight: bold;}
.service_content div {font-size: 14px; color: #666;}
.service_content div .price {color: red;}

.selectRadio {
  display: flex;
  height: 30px;
  line-height: 30px;
}
</style>
