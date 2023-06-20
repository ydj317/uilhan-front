<script setup>
import {onMounted, reactive, ref} from "vue";

import {AuthRequest} from "@/util/request";
import {useRoute, useRouter} from "vue-router";
const route = useRoute();
console.log(route.params);
const router = useRouter();
let indicator = ref(false);
let buttonLoading = ref(false);

const onFinish = values => {
  values = Object.assign(values,route.params)
  buttonLoading.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + '/api/delivery/save', values).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      buttonLoading.value = false;
      return false;
    }

    let data = res.data;
    alert(data.message);

    buttonLoading.value = false;
    router.push('/setting/delivery')

  }).catch((error) => {
    alert(error.message);
    buttonLoading.value = false;
    return false;
  });
};

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

let formState = reactive({
  market_id: '',
  dt_ix: '',
  template_name: '',
  delivery_company: '1',
  delivery_basic_policy: '1',
  delivery_package: 'N',
  delivery_policy: '1',
  delivery_price: '',
  delivery_unit_price: '',
  return_shipping_price: '',
  exchange_shipping_price: '',
  return_shipping_cnt: '1',
  product_return_text: '',
  delivery_region_use: 'Y',
  jeju_delivery_price: '',
  island_delivery_price: '',
  out_addr_ix: '1',
  in_addr_ix: '1',
});

const getDeliveryDetail = (id) => {
  if(!id) return false;
  indicator.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/detail/' + id).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      indicator.value = false;
      router.push('/setting/delivery')
      return false;
    }

    let data = res.data;
    formState.template_name = data.template_name
    formState.delivery_company = data.delivery_company
    formState.delivery_basic_policy = data.delivery_basic_policy
    formState.delivery_package = data.delivery_package
    formState.delivery_policy = data.delivery_policy
    formState.delivery_price = data.delivery_price
    formState.delivery_unit_price = data.delivery_unit_price
    formState.return_shipping_price = data.return_shipping_price
    formState.exchange_shipping_price = data.exchange_shipping_price
    formState.return_shipping_cnt = data.return_shipping_cnt
    formState.product_return_text = data.product_return_text
    formState.delivery_region_use = data.delivery_region_use
    formState.jeju_delivery_price = data.jeju_delivery_price
    formState.island_delivery_price = data.island_delivery_price
    formState.out_addr_ix = data.out_addr_ix
    formState.in_addr_ix = data.in_addr_ix

    indicator.value = false;
  }).catch((error) => {
    alert(error.message);
    indicator.value = false;
    return false;
  });
}

onMounted(() => {
  getDeliveryDetail(route.params.id);
})
</script>

<template>
  <a-card :bordered="false" title="배송정책 등록/수정" :loading="indicator">
    <a-form :model="formState" name="delivery_form" @finish="onFinish"
            @finishFailed="onFinishFailed" autocomplete="off" layout="horizontal" class="delivery_form">
      <a-form-item label="배송정책명" name="template_name"
                   :rules="[{ required: true, message: '배송정책명을 입력해 주세요.' }]">
        <a-input v-model:value="formState.template_name"  allow-clear />
      </a-form-item>
      <a-form-item
          name="delivery_company"
          label="택배사코드"
          :rules="[{ required: true, message: '택배사코드를 선택해 주세요' }]"
      >
        <a-select v-model:value="formState.delivery_company" >
          <a-select-option value="1">로젠택배</a-select-option>
          <a-select-option value="06">우정택배</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="배송구분" name="delivery_basic_policy">
        <a-radio-group  v-model:value="formState.delivery_basic_policy">
          <a-radio value="1">선불</a-radio>
          <a-radio value="2">착불</a-radio>
        </a-radio-group >
      </a-form-item>

      <a-form-item label="패키지" name="delivery_package">
        <a-radio-group  v-model:value="formState.delivery_package">
          <a-radio value="N">묶음배송</a-radio>
          <a-radio value="Y">개별배송</a-radio>
        </a-radio-group >
      </a-form-item>

      <a-form-item label="배송정책타입" name="delivery_policy">
        <a-radio-group  v-model:value="formState.delivery_policy">
          <a-radio value="0">무료배송</a-radio>
          <a-radio value="1">고정배송</a-radio>
          <a-radio value="6">기타</a-radio>
        </a-radio-group >
      </a-form-item>
      <div style="display: flex;">
        <a-form-item label="배송비" name="delivery_price"
                     :rules="[{ required: true, message: '배송비를 입력해 주세요.' }]" :style="{flex:'1'}">
          <a-input v-model:value="formState.delivery_price" allow-clear/>
        </a-form-item>

        <a-form-item label="상품 1개단위 배송비" name="delivery_unit_price"
                     :rules="[{ required: true, message: '상품 1개단위 배송비를 입력해 주세요.'}]" :style="{flex:'1',marginLeft:'-1px'}">
          <a-input v-model:value="formState.delivery_unit_price" allow-clear/>
        </a-form-item>
      </div>

      <div style="display: flex;">
      <a-form-item label="반품 배송비" name="return_shipping_price"
                   :rules="[{ required: true, message: '반품 배송비를 입력해 주세요.'}]" :style="{flex:'1'}">
        <a-input v-model:value="formState.return_shipping_price" allow-clear/>
      </a-form-item>

      <a-form-item label="교환 배송비" name="exchange_shipping_price"
                   :rules="[{ required: true, message: '교환 배송비를 입력해 주세요.' }]" :style="{flex:'1',marginLeft:'-1px'}">
        <a-input v-model:value="formState.exchange_shipping_price" allow-clear/>
      </a-form-item>
      </div>
      <a-form-item label="편도/왕복 여부" name="return_shipping_cnt">
        <a-radio-group  v-model:value="formState.return_shipping_cnt">
          <a-radio value="1">편도</a-radio>
          <a-radio value="2">왕복</a-radio>
        </a-radio-group >
      </a-form-item>

      <a-form-item label="반품/교환 안내" name="product_return_text" :rules="[{ required: true, message: '반품/교환 안내를 입력해 주세요.' }]">
        <a-textarea v-model:value="formState.product_return_text" allow-clear :rows="4" placeholder="반품/교환 안내를 입력해 주세요."/>
      </a-form-item>

      <a-form-item label="추가지역 배송비" name="delivery_region_use">
        <a-radio-group v-model:value="formState.delivery_region_use">
          <a-radio value="Y">사용함</a-radio>
          <a-radio value="N">정지</a-radio>
        </a-radio-group>
      </a-form-item>

      <div style="display: flex;">
      <a-form-item label="제주 추가 배송비" name="jeju_delivery_price"
                   :rules="[{ required: true, message: '제주 추가 배송비를 입력해 주세요.' }]" class="-item-no-flex" :style="{flex:'1'}">
        <a-input v-model:value="formState.jeju_delivery_price" allow-clear/>
      </a-form-item>

      <a-form-item label="도서산간 추가 배송비" name="island_delivery_price"
                   :rules="[{ required: true, message: '도서산간 추가 배송비를 입력해 주세요.' }]" :style="{flex:'1',marginLeft:'-1px'}">
        <a-input v-model:value="formState.island_delivery_price" allow-clear/>
      </a-form-item>
      </div>

      <div style="display: flex;">
        <a-form-item label="출고지" name="out_addr_ix"
                     :rules="[{ required: true, message: '출고지를 선택해 주세요.' }]" :style="{flex:'1'}">
          <a-select v-model:value="formState.out_addr_ix">
            <a-select-option value="1">국내-서울 송파구 방이동 124-52</a-select-option>
            <a-select-option value="2">기본-서울 송파구 방이동 124-52</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="도서산간 추가 배송비" name="in_addr_ix"
                     :rules="[{ required: true, message: '반품지를 선택 주세요.' }]" :style="{flex:'1',marginLeft:'-1px'}">
          <a-select v-model:value="formState.in_addr_ix" >
            <a-select-option value="1">국내-서울 송파구 방이동 124-52</a-select-option>
            <a-select-option value="2">기본-서울 송파구 방이동 124-52</a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <div style="display: flex;justify-content: center;margin-top: 20px;">
        <a-button type="primary" html-type="submit" :loading="buttonLoading">저장</a-button>
        <a-button style="margin-left: 10px" @click="router.go(-1)">취소</a-button>
      </div>
    </a-form>
  </a-card>
</template>

<style>
.delivery_form .ant-form-item{
  margin-bottom: 0;
}
.delivery_form .ant-form-item-label{
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.delivery_form .ant-form-item-control{
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.delivery_form .ant-form-item-control:nth-last-child{
  border-bottom: 1px solid #eeeeee;
}


</style>