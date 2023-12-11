<script setup name="delivery_address_form">

import {reactive, ref, watchEffect} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps(['modal_outvisible'])
const emit = defineEmits(['refresh']);

const deliveryModalFormRef = ref();
const state = reactive({
  form: {
    addr_ix: '',
    addr_product_type: '1',
    addr_name: '',
    person_name: '',
    addr_phone: '',
    addr_mobile: '',
    nation_code: 'KR',
    zip_code: '',
    address_1: '',
    address_2: '',
    doro_zip_code: '',
    doro_address_1: '',
    doro_address_2: '',
    city: '',
    state: '',
  },
  modal: {
    isShow: false,
    type: '',
    action: '',
    id: '',
    title: '',
    addrName: '',
    buttonLoading: false,
  },
});

// 우편번호 받아오기
const addressRef = ref(null)
const execDaumPostcode = () => {
  new daum.Postcode({
    oncomplete: function(data) {
      state.form.zip_code = data.zonecode

      // 지번 data.jibunAddress
      state.form.address_1 = data.jibunAddress
      // 도로 data.roadAddress
      state.form.doro_address_1 = data.roadAddress

      state.form.address_2 = ''
      addressRef.value.focus();
    }
  }).open();
};

// 중국배대지 주소입력
const setChAddress = () => {
  state.form.zip_code = '264200'
  state.form.address_1 = '86-1 Taipei Road'
  state.form.address_2 = 'Huancui District'
  state.form.city = 'Weihai City'
  state.form.state = 'Shandong Province'
};

const formatPhone = (phone) => {
  phone = phone.replace(/-/g, '')

  return phone.slice(0, -8) + '-' + phone.slice(-8, -4) + '-' + phone.slice(-4)
}

const handleOk = () => {
  deliveryModalFormRef.value.validateFields().then(values => {

    state.modal.buttonLoading = true;

    let url = '';
    if (state.modal.type === "out_address") {
      url = process.env.VUE_APP_API_URL + '/api/delivery/outAddressSave';
    } else {
      url = process.env.VUE_APP_API_URL + '/api/delivery/inAddressSave';
    }

    state.form.addr_phone = formatPhone(state.form.addr_phone)
    state.form.addr_mobile = formatPhone(state.form.addr_mobile)

    // 신 우편번호, 상세는 같은값으로 넣음
    state.form.doro_zip_code = state.form.zip_code
    state.form.doro_address_2 = state.form.address_2

    AuthRequest.post(url, state.form).then((res) => {
      if (res.status !== '2000') {
        state.modal.buttonLoading = false;
        message.error(res.message)
        return false;
      }
      message.success(res.data.message);
      closeModal(); // 关闭弹窗
      emit('refresh', state.modal.type);
      setTimeout(() => {
        state.modal.buttonLoading = false;
      }, 1200)
    }).catch((error) => {
      state.modal.buttonLoading = false;
      message.error(error.message);
      return false;
    });

    // deliveryModalFormRef.value.resetFields();

  }).catch(info => {
    console.log('Validate Failed:', info);
  });

};

// 打开弹窗
const openDialog = (type, action, id = null, data = {}) => {
  if (type === 'out_address') {
    state.modal.title = ' 출고지 등록/수정';
    state.modal.addrName = '출고지 명';

  } else {
    state.modal.title = '교환/반품지 등록/수정';
    state.modal.addrName = '교환/반품지 명';
  }
  state.modal.type = type;
  state.modal.action = action;
  state.modal.isShow = true;
  if (action === 'edit') {
    state.form = data
    state.form.nation_code = data.nation_code || 'KR'
  } else {
    state.form.addr_ix = ''
    state.form.addr_product_type = '1'
    state.form.addr_name = ''
    state.form.person_name = ''
    state.form.addr_phone = ''
    state.form.addr_mobile = ''
    state.form.nation_code = 'KR'
    state.form.zip_code = ''
    state.form.address_1 = ''
    state.form.address_2 = ''
    state.form.doro_zip_code = ''
    state.form.doro_address_1 = ''
    state.form.doro_address_2 = ''
    state.form.city = ''
    state.form.state = ''
  }
};

watchEffect(() => {
  if (state.form.nation_code !== "KR") {
    state.form.doro_zip_code = ''
    state.form.doro_address_1 = ''
    state.form.doro_address_2 = ''
  } else {
    state.form.city = ''
    state.form.state = ''
  }
})

// 关闭弹窗
const closeModal = () => {
  state.modal.isShow = false;
};

// 取消
const onCancel = () => {
  closeModal();
};

// 暴露变量
defineExpose({
  openDialog,
});

</script>

<template>
  <a-modal
      v-model:open="state.modal.isShow"
      :title="state.modal.title"
      ok-text="저장"
      cancel-text="닫기"
      @close="onCancel"
      @ok="handleOk"
  >
    <a-form ref="deliveryModalFormRef" :model="state.form" name="delivery_form" autocomplete="off" :scrollToFirstError="true" layout="horizontal"
            :label-col="{style:{width:'130px'}}" class="deliveryModalForm">
      <a-form-item label="배송구분" name="addr_product_type">
        <a-radio-group v-model:value="state.form.addr_product_type">
          <a-radio value="1">일반상품</a-radio>
          <a-radio value="2">구매대행</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="state.modal.addrName" name="addr_name"
                   :rules="[{ required: true, message: '출고지 명을 입력해 주세요.' }]">
        <a-input v-model:value="state.form.addr_name" allow-clear/>
      </a-form-item>

      <a-form-item label="담당자 명" name="person_name"
                   :rules="[{ required: true, message: '담당자 명을 입력해 주세요.' }]">
        <a-input v-model:value="state.form.person_name" allow-clear/>
      </a-form-item>

      <a-form-item label="일반 전화번호" name="addr_phone"
                   :rules="[{ required: true, message: '일반 전화번호를 입력해 주세요.' }]">
        <a-input v-model:value="state.form.addr_phone" allow-clear/>
      </a-form-item>

      <a-form-item label="핸드폰 번호" name="addr_mobile">
        <a-input v-model:value="state.form.addr_mobile" allow-clear/>
      </a-form-item>

      <a-form-item label="국가코드" name="nation_code">
        <a-radio-group v-model:value="state.form.nation_code">
          <a-radio value="KR">한국</a-radio>
          <a-radio value="CN">중국</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="우편번호" name="zip_code"
                   :rules="[{ required: true, message: '우편번호를 입력해 주세요.' }]">
        <a-input v-model:value="state.form.zip_code"
                 style="width: 150px; margin-right: 10px;"
                 :disabled="state.form.nation_code === 'KR'" allow-clear />
        <a-button @click="execDaumPostcode" v-if="state.form.nation_code === 'KR'">우편번호 찾기</a-button>
        <a-button @click="setChAddress" v-else>중국배대지 주소입력</a-button>
      </a-form-item>

      <a-form-item label="주소" name="address_1"
                   :rules="[{ required: true, message: '주소를 입력해 주세요.' }]">
        <a-input v-model:value="state.form.address_1"
                 :disabled="state.form.nation_code === 'KR'" allow-clear />
      </a-form-item>

      <a-form-item label="도로명 주소" name="doro_address_1"
                   :rules="[{ required: true, message: '도로명주소를 입력해 주세요.' }]" v-if="state.form.nation_code === 'KR'">
        <a-input v-model:value="state.form.doro_address_1"
                 :disabled="state.form.nation_code === 'KR'" allow-clear />
      </a-form-item>

      <a-form-item label="주소 상세" name="address_2"
                   :rules="[{ required: true, message: '주소 상세를 입력해 주세요.' }]">
        <a-input v-model:value="state.form.address_2" allow-clear ref="addressRef"/>
      </a-form-item>

      <a-form-item label="도시" name="city"
                   :rules="[{ required: true, message: '도시를 입력해 주세요.' }]" v-if="state.form.nation_code !== 'KR'">
        <a-input v-model:value="state.form.city" allow-clear/>
      </a-form-item>

      <a-form-item label="주" name="state"
                   :rules="[{ required: true, message: '주를 입력해 주세요.' }]" v-if="state.form.nation_code !== 'KR'">
        <a-input v-model:value="state.form.state" allow-clear/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
