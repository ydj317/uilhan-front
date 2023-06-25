<script setup>
import {defineAsyncComponent, onBeforeMount, reactive, ref} from "vue";

import {AuthRequest} from "@/util/request";
import {useRoute, useRouter} from "vue-router";

const DeliveryAddress = defineAsyncComponent(() => import('@/views/Setting/component/DeliveryAddress.vue'))
const DeliveryAddressForm = defineAsyncComponent(() => import('@/views/Setting/component/DeliveryAddressForm.vue'))

const route = useRoute();
const router = useRouter();
let indicator = ref(false);
let buttonLoading = ref(false);
const deliveryModalRef = ref();
const deliveryOutAddressList = ref([]);
const deliveryOutAddressDetail = ref(false);
const deliveryInAddress = ref([]);
const deliveryInAddressDetail = ref(false);

const deliveryCompany = [
  {'code': '01', 'delivery_com': '우체국택배'},
  {'code': '02', 'delivery_com': '아주택배'},
  {'code': '03', 'delivery_com': '옐로우캡'},
  {'code': '05', 'delivery_com': '로젠택배'},
  {'code': '06', 'delivery_com': 'CJ대한통운(CJ택배)'},
  {'code': '07', 'delivery_com': '고려택배'},
  {'code': '09', 'delivery_com': 'KT로지스'},
  {'code': '10', 'delivery_com': 'KGB택배'},
  {'code': '12', 'delivery_com': '현대택배'},
  {'code': '13', 'delivery_com': '한진택배'},
  {'code': '15', 'delivery_com': '동부익스프레스'},
  {'code': '17', 'delivery_com': '사가와익스프레스'},
  {'code': '18', 'delivery_com': 'CJ택배'},
  {'code': '19', 'delivery_com': '하나로택배'},
  {'code': '21', 'delivery_com': '경동택배'},
  {'code': '22', 'delivery_com': '대신택배'},
  {'code': '23', 'delivery_com': '일양로지스'},
  {'code': '24', 'delivery_com': '건영택배'},
  {'code': '25', 'delivery_com': '천일택배'},
  {'code': '26', 'delivery_com': '합동택배'},
  {'code': '27', 'delivery_com': '호남택배'},
  {'code': '28', 'delivery_com': '이노지스'},
  {'code': '40', 'delivery_com': '기타'},
  {'code': '42', 'delivery_com': 'CVSnet(편의점택배)'},
  {'code': '43', 'delivery_com': '페덱스(FedEx)'},
  {'code': '44', 'delivery_com': '롯데택배(현대택배)'},
  {'code': '50', 'delivery_com': '한의사랑택배'},
  {'code': '605', 'delivery_com': 'QEXPRESS'},
  {'code': '606', 'delivery_com': '일양로지스'},
]
const onFinish = values => {
  values = Object.assign(values, route.params)
  values = Object.assign(values, {dt_ix: formState.dt_ix})
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
  dt_ix: '',
  template_name: '',
  delivery_company: '',
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
  out_addr_ix: '',
  in_addr_ix: '',
});

/** 배송정책 상세 */
const getDeliveryDetail = (id) => {
  if (!id) return false;
  indicator.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/detail/' + id).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      indicator.value = false;
      router.push('/setting/delivery')
      return false;
    }

    let data = res.data;
    formState.dt_ix = data.dt_ix
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

    selectDeliveryInAddress(formState.in_addr_ix)
    selectDeliveryOutAddress(formState.out_addr_ix)
    indicator.value = false;
  }).catch((error) => {
    alert(error.message);
    indicator.value = false;
    return false;
  });
}

/**
 * 출고지 조회
 */
const getDeliveryOutAddressList = () => {
  indicator.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/deliveryOutAddress/list').then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      indicator.value = false;
      router.push('/setting/delivery')
      return false;
    }

    deliveryOutAddressList.value = res.data;
    indicator.value = false;
  }).catch((error) => {
    alert(error.message);
    indicator.value = false;
    return false;
  });
}

/**
 * 출고지 선택후 상세정보 노출
 * @param value
 */
const selectDeliveryOutAddress = (value) => {
  if (!value) {
    deliveryOutAddressDetail.value = false;
    return
  }
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/deliveryOutAddress/detail/' + value).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      router.push('/setting/delivery')
      return false;
    }
    deliveryOutAddressDetail.value = JSON.parse(res.data.jsonData);
  }).catch((error) => {
    alert(error.message);
    return false;
  });
}

/**
 * 교환/반품지 선택후 상세정보 노출
 * @param value
 */
const selectDeliveryInAddress = (value) => {
  if (!value) {
    deliveryInAddressDetail.value = false;
    return
  }
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/deliveryInAddress/detail/' + value).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      router.push('/setting/delivery')
      return false;
    }
    deliveryInAddressDetail.value = JSON.parse(res.data.jsonData);
  }).catch((error) => {
    alert(error.message);
    return false;
  });
}

/**
 * 교환/반품지 조회
 */
const getDeliveryInAddressList = () => {

  indicator.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/deliveryInAddress/list').then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      indicator.value = false;
      router.push('/setting/delivery')
      return false;
    }

    deliveryInAddress.value = res.data;

    indicator.value = false;
  }).catch((error) => {
    alert(error.message);
    indicator.value = false;
    return false;
  });
}

// 모델창 오픈
const onOpenAddModel = (type, action) => {
  deliveryModalRef.value.openDialog(type, action);
};

const onOpenEditModel = (type, action, id, data) => {
  deliveryModalRef.value.openDialog(type, action, id, data);
};

onBeforeMount(() => {
  getDeliveryDetail(route.params.id);
  getDeliveryOutAddressList();
  getDeliveryInAddressList();
})

/**
 * 출고지,교환/반품지 등록수정 완료후 실행
 */
const onDeliveryAddressData = () => {
  indicator.value = true;
  setTimeout(() => {
    getDeliveryOutAddressList();
    getDeliveryInAddressList();
    selectDeliveryOutAddress(formState.out_addr_ix);
    selectDeliveryInAddress(formState.in_addr_ix);
    indicator.value = false;
  }, 500)
}

</script>

<template>
  <a-card :bordered="false" title="배송정책 등록/수정" :loading="indicator">
    <a-form :model="formState" name="delivery_form" @finish="onFinish"
            @finishFailed="onFinishFailed" autocomplete="off" layout="horizontal" class="delivery_form">
      <a-form-item label="배송정책명" name="template_name"
                   :rules="[{ required: true, message: '배송정책명을 입력해 주세요.' }]">
        <a-input v-model:value="formState.template_name" allow-clear placeholder="배송정책명을 입력해 주세요."/>
      </a-form-item>
      <a-form-item
          name="delivery_company"
          label="택배사코드"
          :rules="[{ required: true, message: '택배사코드를 선택해 주세요.' }]"
      >
        <a-select v-model:value="formState.delivery_company" placeholder="택배사코드를 선택해 주세요.">
          <a-select-option value="">
            - 선택 -
          </a-select-option>
          <a-select-option :value="item.code" v-for="(item,index) in deliveryCompany" :key="index">
            {{ item.delivery_com }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="배송구분" name="delivery_basic_policy">
        <a-radio-group v-model:value="formState.delivery_basic_policy">
          <a-radio value="1">선불</a-radio>
          <a-radio value="2">착불</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="패키지" name="delivery_package">
        <a-radio-group v-model:value="formState.delivery_package">
          <a-radio value="N">묶음배송</a-radio>
          <a-radio value="Y">개별배송</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="배송정책타입" name="delivery_policy">
        <a-radio-group v-model:value="formState.delivery_policy">
          <a-radio value="1">무료배송</a-radio>
          <a-radio value="2">고정배송</a-radio>
          <a-radio value="6" v-if="formState.delivery_policy===6" disabled="disabled">1개당 배송비</a-radio>
          <a-radio value="6" v-else disabled="disabled">1개당 배송비</a-radio>
        </a-radio-group>
      </a-form-item>
      <div style="display: flex;">
        <a-form-item label="배송비" name="delivery_price"
                     :rules="[{ required: true, message: '배송비를 입력해 주세요.' }]" :style="{flex:'1'}">

          <a-input v-model:value="formState.delivery_price" allow-clear placeholder="배송비를 입력해 주세요."/>
        </a-form-item>

        <a-form-item label="상품 1개단위 배송비" name="delivery_unit_price"
                     :rules="[{ required: true, message: '상품 1개단위 배송비를 입력해 주세요.'}]"
                     :style="{flex:'1',marginLeft:'-1px'}">

          <a-input v-model:value="formState.delivery_unit_price" allow-clear placeholder="상품 1개단위 배송비를 입력해 주세요." v-if="formState.delivery_policy ==='6'"/>
          <a-input v-model:value="formState.delivery_unit_price" allow-clear placeholder="상품 1개단위 배송비를 입력해 주세요." v-else disabled/>
        </a-form-item>
      </div>

      <div style="display: flex;">
        <a-form-item label="반품 배송비" name="return_shipping_price"
                     :rules="[{ required: true, message: '반품 배송비를 입력해 주세요.'}]" :style="{flex:'1'}">
          <a-input v-model:value="formState.return_shipping_price" allow-clear placeholder="반품 배송비를 입력해 주세요."/>
        </a-form-item>

        <a-form-item label="교환 배송비" name="exchange_shipping_price"
                     :rules="[{ required: true, message: '교환 배송비를 입력해 주세요.' }]" :style="{flex:'1',marginLeft:'-1px'}">
          <a-input v-model:value="formState.exchange_shipping_price" allow-clear placeholder="교환 배송비를 입력해 주세요."/>
        </a-form-item>
      </div>
      <a-form-item label="편도/왕복 여부" name="return_shipping_cnt">
        <a-radio-group v-model:value="formState.return_shipping_cnt">
          <a-radio value="1">편도</a-radio>
          <a-radio value="2">왕복</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="반품/교환 안내" name="product_return_text"
                   :rules="[{ required: true, message: '반품/교환 안내를 입력해 주세요.' }]">
        <a-textarea v-model:value="formState.product_return_text" allow-clear :rows="4"
                    placeholder="반품/교환 안내를 입력해 주세요."/>
      </a-form-item>

      <a-form-item label="추가지역 배송비" name="delivery_region_use">
        <a-radio-group v-model:value="formState.delivery_region_use">
          <a-radio value="Y">사용함</a-radio>
          <a-radio value="N">정지</a-radio>
        </a-radio-group>
      </a-form-item>

      <div style="display: flex;">
        <a-form-item label="제주 추가 배송비" name="jeju_delivery_price"
                     :rules="[{ required: true, message: '제주 추가 배송비를 입력해 주세요.' }]" class="-item-no-flex"
                     :style="{flex:'1'}" v-if="formState.delivery_region_use === 'Y'">
          <a-input v-model:value="formState.jeju_delivery_price" allow-clear placeholder="제주 추가 배송비를 입력해 주세요."/>
        </a-form-item>

        <a-form-item label="도서산간 추가 배송비" name="island_delivery_price"
                     :rules="[{ required: true, message: '도서산간 추가 배송비를 입력해 주세요.' }]"
                     :style="{flex:'1',marginLeft:'-1px'}" v-if="formState.delivery_region_use === 'Y'">
          <a-input v-model:value="formState.island_delivery_price" allow-clear placeholder="도서산간 추가 배송비를 입력해 주세요."/>
        </a-form-item>
      </div>


      <a-form-item label="출고지" name="out_addr_ix"
                   :rules="[{ required: true, message: '출고지를 선택해 주세요.' }]" :style="{flex:'1'}"
                   extra="* 출고지 등록시 [- 선택 -] 을 선택하고 등록해 주세요.">
        <div style="display: flex;margin-bottom: 10px;">
          <a-select v-model:value="formState.out_addr_ix" @change="selectDeliveryOutAddress">
            <a-select-option value="">- 선택 -</a-select-option>
            <a-select-option :value="outItem.addrIx" v-for="outItem in deliveryOutAddressList" :key="outItem.addrIx">
              {{ outItem.addrName }} -
              {{ JSON.parse(outItem.jsonData).doro_address_1 || JSON.parse(outItem.jsonData).city }}
            </a-select-option>
          </a-select>
          <a-button v-if="!formState.out_addr_ix" type="primary" @click="onOpenAddModel('out_address','add')">등록
          </a-button>
          <a-button v-if="formState.out_addr_ix" type="primary"
                    @click="onOpenEditModel('out_address','edit', formState.out_addr_ix, deliveryOutAddressDetail)">수정
          </a-button>

        </div>
        <div v-if="deliveryOutAddressDetail">
          <DeliveryAddress :delivery="deliveryOutAddressDetail"/>
        </div>
      </a-form-item>

      <a-form-item label="교환/반품지" name="in_addr_ix"
                   :rules="[{ required: true, message: '교환/반품지를 선택 주세요.' }]"
                   extra="* 교환/반품지 등록시 [- 선택 -] 을 선택하고 등록해 주세요.">
        <div style="display: flex;margin-bottom: 10px;">
          <a-select v-model:value="formState.in_addr_ix" @change="selectDeliveryInAddress">
            <a-select-option value="">- 선택 -</a-select-option>
            <a-select-option :value="item.addrIx" v-for="(item,index) in deliveryInAddress" :key="index">
              {{ item.addrName }} -
              {{ JSON.parse(item.jsonData).doro_address_1 || JSON.parse(item.jsonData).city }}
            </a-select-option>
          </a-select>
          <a-button v-if="!formState.in_addr_ix" type="primary" @click="onOpenAddModel('in_address','add')">등록
          </a-button>
          <a-button v-if="formState.in_addr_ix" type="primary"
                    @click="onOpenEditModel('in_address','edit', formState.in_addr_ix, deliveryInAddressDetail)">수정
          </a-button>
        </div>
        <div v-if="deliveryInAddressDetail">
          <DeliveryAddress :delivery="deliveryInAddressDetail"/>
        </div>
      </a-form-item>

      <DeliveryAddressForm ref="deliveryModalRef" @refresh="onDeliveryAddressData()"/>

      <div style="display: flex;justify-content: center;margin-top: 20px;">
        <a-button type="primary" html-type="submit" :loading="buttonLoading">저장</a-button>
        <a-button style="margin-left: 10px" @click="router.back()">취소</a-button>
      </div>
    </a-form>
  </a-card>
</template>

<style>
.delivery_form .ant-form-item {
  margin-bottom: 0;
}

.delivery_form .ant-form-item-label {
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.delivery_form .ant-form-item-control {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.delivery_form .ant-form-item-control:nth-last-child {
  border-bottom: 1px solid #eeeeee;
}

</style>