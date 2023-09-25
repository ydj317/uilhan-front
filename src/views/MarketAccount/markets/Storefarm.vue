<template>
    <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        class="market_form">
        <a-form-item name="seller_id" label="셀러ID" :rules="[{required: true, message: '셀러ID를 입력해 주세요.'}]">
            <a-input v-model:value="state.formData.seller_id" />
        </a-form-item>

        <a-form-item name="verdor_id" label="업체코드" :rules="[{required: true, message: '업체코드를 입력해 주세요.'}]">
            <a-input v-model:value="state.formData.verdor_id" />
        </a-form-item>

        <a-form-item name="access_key" label="accessKey" :rules="[{required: true, message: 'AccessKey를 입력해 주세요.'}]">
            <a-input v-model:value="state.formData.access_key" />
        </a-form-item>

        <a-form-item name="secret_key" label="secretKey" :rules="[{required: true, message: 'AccessKey를 입력해 주세요.'}]">
            <a-input v-model:value="state.formData.secret_key" />
        </a-form-item>

        <a-button class="mt15" @click="handleSyncMarketCheck">연동확인</a-button>

        <a-divider></a-divider>

        <a-form-item name="category" label="마켓정보 불러오기">
            <a-table :data-source="state.syncItem" size="small" bordered :pagination="false">
                <a-table-column title="항목" dataIndex="label" key="label" align="center" />
                <a-table-column title="결과" dataIndex="updateAt" key="updateAt" align="center">
                    <template #customRender="scope">
                        <span v-if="scope.record.value === 'category'">
                            <a-tag>{{ scope.record.syncCategoryStatus ? '성공' : '실패' }}</a-tag>
                        </span>
                        <span v-else-if="scope.record.value === 'delivery'">
                            <a-tag>{{ scope.record.syncDeliveryStatus ? '성공' : '실패' }}</a-tag>
                        </span>
                        <p>{{ scope.record.updateAt }}</p>
                    </template>
                </a-table-column>
                <a-table-column title="요청" align="center">
                    <template #customRender="scope">
                        <a-button size="small" @click="handleAction(scope.record)">업데이트</a-button>
                    </template>
                </a-table-column>
            </a-table>
        </a-form-item>
        <a-button class="mt15" @click="goBack">돌아가기</a-button>
        <a-button class="mt15 ml15" @click="handleSubmit" type="primary">저장</a-button>
    </a-form>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useMarketAccountApi } from '@/api/marketAccount';

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
    },
    syncItem: [
        { label: '카테고리', value: 'category', syncCategoryStatus: false, updateAt: '2023-09-22 12:12:03' },
        { label: '택배사', value: 'delivery', syncDeliveryStatus: true, updateAt: '2023-09-23 10:12:03' },
    ],
})

// 수정시 계정 데이터 설정
const initFormData = () => {
    const accountInfo = props.accountInfo;

    if (accountInfo) {
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

const syncCategory = () => {
    // @TODO: 카테고리 동기화
    console.log('syncCategory');
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
                router.push({ name: 'market_seller_list' });
            }, 500);

        });


    }).catch((error) => {
        console.log('error', error);
    });
};

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