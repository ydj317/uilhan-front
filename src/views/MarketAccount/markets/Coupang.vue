<template>
    <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        class="market_form">
        <a-form-item name="seller_id" label="셀러ID" :rules="[{ required: true, message: '셀러ID를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.seller_id" />
        </a-form-item>

        <a-form-item name="verdor_id" label="업체코드" :rules="[{ required: true, message: '업체코드를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.verdor_id" />
        </a-form-item>

        <a-form-item name="access_key" label="accessKey" :rules="[{ required: true, message: 'AccessKey를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.access_key" />
        </a-form-item>

        <a-form-item name="secret_key" label="secretKey" :rules="[{ required: true, message: 'AccessKey를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.secret_key" />
        </a-form-item>

        <a-button class="mt15" @click="handleSyncMarketCheck">연동확인</a-button>

        <a-divider></a-divider>
        <div style="display:flex;justify-content:space-between;align-items:center;" class="mb15">
            <h3>마켓정보 불러오기</h3>
            <a-button type="primary">
                <template #icon>
                    <RedoOutlined />
                </template>
                새로고침
            </a-button>
        </div>
        <a-form-item label="택배사">
            <a-select v-model:value="state.formData.delivery_code" placeholder="선택해 주세요" style="width:260px;">
                <a-select-option value="">- 설정 -</a-select-option>
                <a-select-option :value="item.delivery_code" v-for="(item,key) in state.deliveryList" :key="key">{{ item.delevery_name }}</a-select-option>
            </a-select>
            <a-button @click="syncDelivery()" class="ml15">업데이트</a-button>
            <a-tag class="ml15" style="width:38px;text-align:center">-</a-tag>
            <span>2023-09-23</span>
        </a-form-item>

        <a-form-item label="출고지">
            <a-select v-model:value="state.formData.outbound_address_code" placeholder="선택해 주세요" style="width:260px;">
                <a-select-option value="0" >- 설정 -</a-select-option>
                <a-select-option :value="item.outbound_code" v-for="(item,key) in state.outboundAddressList" :key="key">{{ item.outbound_name }}</a-select-option>
            </a-select>
            <a-button @click="syncOutboundAddress()" class="ml15">업데이트</a-button>
            <a-tag color="#87d068" class="ml15">성공</a-tag>
            <span>2023-09-23</span>
        </a-form-item>
        
        <a-form-item label="반품지">
            <a-select v-model:value="state.formData.return_address_code" placeholder="선택해 주세요" style="width:260px;">
                <a-select-option value="0">- 설정 -</a-select-option>
                <a-select-option :value="item.return_address_code" v-for="(item,key) in state.returnAddressList" :key="key">{{ item.return_address_name }}</a-select-option>
            </a-select>
            <a-button @click="syncReturnAddress()" class="ml15">업데이트</a-button>
            <a-tag color="#108ee9" class="ml15">성공</a-tag>
            <span>2023-09-23</span>
        </a-form-item>


        <h3 class="mt20">마켓정보설정</h3>

        <a-form-item label="제주 추가 배송비">
            <a-input v-model:value="state.formData.id" placeholder="제주 추가 배송비" style="width:160px" /> - <a-input
                placeholder="제주 외 도서간간 추가 배송비" style="width:200px" />
        </a-form-item>
        <a-form-item label="반품배송비(편도)">
            <a-input v-model:value="state.formData.id" placeholder="반품배송비(편도)" style="width:160px" />
        </a-form-item>
        <a-form-item label="반품배송비(왕복)">
            <a-input v-model:value="state.formData.id" placeholder="반품배송비(왕복)" style="width:160px" />
        </a-form-item>

        <a-form-item label="A/S전화번호">
            <a-input v-model:value="state.formData.id" placeholder="A/S전화번호" style="width:140px" />
        </a-form-item>

        <a-button class="mt15" @click="goBack">돌아가기</a-button>
        <a-button class="mt15 ml15" @click="handleSubmit" type="primary">저장</a-button>

    </a-form>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useMarketAccountApi } from '@/api/marketAccount';
import {
    RedoOutlined,
} from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    market_code: {
        type: String,
        default: ''
    },
    accountInfo: {
        type: Object,
        default: {}
    }
});

const router = useRouter();

const marketFormRef = ref(null);

const state = reactive({
    formData: {
        id: '',
        market_code: props.market_code,
        seller_id: '',
        verdor_id: '',
        access_key: '',
        secret_key: '',

        delivery_code: '',
        return_address_code: '',
        outbound_address_code: '',


    },

    deliveryList: [],
    returnAddressList: [],
    outboundAddressList: [],

})

// 수정시 계정 데이터 설정
const initFormData = () => {
    const accountInfo = props.accountInfo;

    if (accountInfo.length > 0) {
        state.formData.id = accountInfo.id;
        state.formData.market_code = accountInfo.market_code;
        state.formData.seller_id = accountInfo.marketData.seller_id;
        state.formData.verdor_id = accountInfo.marketData.verdor_id;
        state.formData.access_key = accountInfo.marketData.access_key;
        state.formData.secret_key = accountInfo.marketData.secret_key;
    }
}

// 마켓정보 불러오기
const handleAction = (record) => {
    // @TODO 카테고리, 택배사 수집후 마켓정보 동기화 성공여부 업데이트해야함
    if (record.value === 'category') {
        syncCategory();
    } else if (record.value === 'delivery') {
        syncDelivery();
    }
};

const syncOutboundAddress = () => {
    // @TODO: 카테고리 동기화
    console.log('syncCategory');
};
const syncReturnAddress = () => {
    // @TODO: 카테고리 동기화
    console.log('syncReturnAddress');
};
const syncDelivery = () => {
    // @TODO: 택배사 동기화
    console.log('syncDelivery');
};

// 연동확인
const handleSyncMarketCheck = () => {
    // @TODO: 연동확인
    console.log('handleSyncMarketCheck');
};

// 저장
const handleSubmit = (e) => {
    // validation form
    marketFormRef.value.validate().then(() => {
        useMarketAccountApi().registerOrModifyAccount(state.formData).then(res => {
            if (res.status !== "2000") {
                message.error(res.message);
                return false;
            }

            message.success(res.message);
            setTimeout(() => {
                router.push({ name: 'market_accounts_list' });
            }, 500);

        });


    }).catch((error) => {
        console.log('error', error);
    });
};

// 택배사 리스트
const getDeliveryList = () => {
    console.log('getDeliveryList');
}

// 반품지 리스트
const returnAddressList = () => {
    console.log('returnAddressList');
}

// 출고지 리스트
const outboundAddressList = () => {
    console.log('outboundAddressList');
}

onMounted(() => {
    initFormData()
});

const goBack = () => {
    router.go(-1);
};
</script>
<style>
.market_form .ant-form-item {
    margin-bottom: 0;
}

.market_form .ant-form-item-label {
    border: 1px solid #eeeeee;
    background-color: #fafafa;
    width: 170px;
    padding: 10px;
    margin-bottom: -1px;
}

.market_form .ant-form-item-control {
    border: 1px solid #eeeeee;
    padding: 10px;
    margin-left: -1px;
    margin-bottom: -1px;
}

.market_form .ant-form-item-control:nth-last-child {
    border-bottom: 1px solid #eeeeee;
}
</style>