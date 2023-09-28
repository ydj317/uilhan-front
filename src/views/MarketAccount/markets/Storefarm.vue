<template>
    <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        class="market_form">
        <a-form-item name="seller_id" label="셀러ID" :rules="[{ required: true, message: '셀러ID를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.seller_id" :disabled="state.formData.sync_market_status"/>
        </a-form-item>

        <a-form-item name="client_id" label="Client Id" :rules="[{ required: true, message: 'client Id를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.client_id" />
        </a-form-item>

        <a-form-item name="client_secret" label="Client Secret"
            :rules="[{ required: true, message: 'Client Secret를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.client_secret" />
        </a-form-item>

        <a-button class="mt15" @click="handleSyncMarketCheck">
            <template #icon v-if="state.formData.sync_market_status">
                <CheckCircleOutlined style="color:#67C23A;" />
            </template>
            연동확인
        </a-button>

        <a-divider></a-divider>
        <div v-if="state.formData.sync_market_status">
            <div style="display:flex;justify-content:space-between;align-items:center;" class="mb15">
                <h3>마켓정보 불러오기</h3>
            </div>

            <a-form-item label="출고지/반품지">
                <div style="display: flex; align-items: center;">
                <div>
                    <div>
                        <a-form-item name="outbound_address_code" label="출고지" :rules="[{ required: true, message: '출고지를 선택해 주세요.' }]">
                        <a-select v-model:value="state.formData.outbound_address_code" placeholder="출고지를 선택해 주세요"
                            style="width:260px;">
                            <a-select-option :value="item.outbound_code" v-for="(item, key) in state.outboundAddressList"
                                :key="key">{{ item.outbound_name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    </div>

                    <div>
                        <a-form-item name="return_address_code" label="반품지" :rules="[{ required: true, message: '반품지를 선택해 주세요.' }]">
                        <a-select v-model:value="state.formData.return_address_code" placeholder="반품지를 선택해 주세요"
                            style="width:260px;">
                            <a-select-option :value="item.return_address_code"
                                v-for="(item, key) in state.returnAddressList" :key="key">{{ item.return_address_name
                                }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    </div>
                </div>

                <div>
                    <a-button @click="syncOutboundAddress(state.formData.id)" class="ml15">업데이트</a-button>
                    <a-tag class="ml15" v-if="state.sync_address_status == 0">-</a-tag>
                    <a-tag color="#87d068" class="ml15" v-else-if="state.sync_address_status == 1">성공</a-tag>
                    <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
                    <span>{{ state.sync_address_date ?? '-' }}</span>
                </div>
            </div>
            </a-form-item>

            <h3 class="mt20">마켓정보설정</h3>

            <a-form-item label="제주 추가 배송비">
                <a-form-item name="jeju_add_delivery_price" label="제주 추가 배송비" :rules="[{ required: true, message: '제주 추가 배송비를 입력해 주세요.' }]" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input v-model:value="state.formData.jeju_add_delivery_price" placeholder="제주 추가 배송비"
                    style="width:160px" />
                </a-form-item>
                <a-form-item name="jeju_add_delivery_price_round_trip" label="제주 외 도서산간 추가 배송비" :rules="[{ required: true, message: '제주 외 도서산간 추가 배송비를 입력해 주세요.' }]" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input v-model:value="state.formData.jeju_add_delivery_price_round_trip" placeholder="제주 외 도서산간 추가 배송비"
                    style="width:200px" />
                </a-form-item>
            </a-form-item>
            <a-form-item name="return_delivery_price" label="반품배송비(편도)" :rules="[{ required: true, message: '제주 추가 배송비를 입력해 주세요.' }]">
                <a-input v-model:value="state.formData.return_delivery_price" placeholder="반품배송비(편도)" style="width:160px" />
            </a-form-item>
            <a-form-item name="return_delivery_price_round_trip" label="반품배송비(왕복)" :rules="[{ required: true, message: '반품배송비(왕복)를 입력해 주세요.' }]">
                <a-input v-model:value="state.formData.return_delivery_price_round_trip" placeholder="반품배송비(왕복)"
                    style="width:160px" />
            </a-form-item>

            <a-form-item name="as_phone_number" label="A/S전화번호" :rules="[{ required: true, message: 'A/S전화번호를 입력해 주세요.' }]">
                <a-input v-model:value="state.formData.as_phone_number" placeholder="A/S전화번호" style="width:140px" />
            </a-form-item>
        </div>
        <a-button class="mt15" @click="goBack">돌아가기</a-button>
        <a-button class="mt15 ml15" @click="handleSubmit" type="primary">저장</a-button>

    </a-form>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useMarketAccountApi } from '@/api/marketAccount';
import { useAccountJsonApi } from '@/api/accountJson';
import {
    RedoOutlined,
    CheckCircleOutlined
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
        client_id: '',
        client_secret: '',

        sync_market_status: false,

        // 마켓정보 불러오기
        return_address_code: null,
        outbound_address_code: null,

        // 마켓정보 설정
        jeju_add_delivery_price: null, // 제주 추가 배송비
        jeju_add_delivery_price_round_trip: null, // 제주 외 도서산간 추가 배송비
        return_delivery_price: null, // 반품배송비(편도)
        return_delivery_price_round_trip: null, // 반품배송비(왕복)
        as_phone_number: null, // A/S전화번호

    },

    deliveryList: [],
    returnAddressList: [],
    outboundAddressList: [],

    // 불러오기 상태
    sync_address_status: 0,
    sync_address_date: null,



})

// 수정시 계정 데이터 설정
const initFormData = () => {
    const accountInfo = props.accountInfo;

    if (Object.keys(accountInfo).length > 0) {
        state.formData.id = accountInfo.id;
        state.formData.market_code = accountInfo.marketCode;
        state.formData.seller_id = accountInfo.marketData.seller_id;
        state.formData.client_id = accountInfo.marketData.client_id;
        state.formData.client_secret = accountInfo.marketData.client_secret;
        state.formData.sync_market_status = accountInfo.marketData.sync_market_status;

        // 마켓정보 불러오기
        state.formData.return_address_code = accountInfo.marketData.return_address_code;
        state.formData.outbound_address_code = accountInfo.marketData.outbound_address_code;

        state.formData.jeju_add_delivery_price = accountInfo.marketData.jeju_add_delivery_price;
        state.formData.jeju_add_delivery_price_round_trip = accountInfo.marketData.jeju_add_delivery_price_round_trip;
        state.formData.return_delivery_price = accountInfo.marketData.return_delivery_price;
        state.formData.return_delivery_price_round_trip = accountInfo.marketData.return_delivery_price_round_trip;
        state.formData.as_phone_number = accountInfo.marketData.as_phone_number;

    }
}


// 연동확인
const handleSyncMarketCheck = () => {

    marketFormRef.value.validate().then(() => {
        useMarketAccountApi().syncMarketCheck(state.formData).then(res => {
            if (res.status !== "2000") {
                message.error(res.message);
                return false;
            }
            const {account_id} = res.data;
            message.success(res.message);
            
            // 출고지/반품지 수집실행
            syncOutboundAddress({account_id});
            state.formData.sync_market_status = true
        });
    }).catch((error) => {
        console.log('error', error);
    });

};

// 저장
const handleSubmit = (e) => {
    if(state.formData.sync_market_status === false) {
        message.error('연동확인을 먼저 해주세요.');
        return false;
    }
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


const syncOutboundAddress = ({account_id}) => {

    useAccountJsonApi().syncOuboundAddress({ account_id: account_id, market_code: props.market_code }).then(res => {
        if (res.status !== "2000") {
            message.error(res.message);
            return false;
        }

        message.success(res.message);

        // @TODO 출고지/반품지 리스트 설정
        state.sync_address_status = '1';
        state.sync_address_date = '2023-09-23 12:11:12'
    })
};

// 출고지/반품지 리스트 설정
const getAddressList = () => {
    useAccountJsonApi().getAccountJson({ account_id: props.accountInfo.id, group: 'outbound_address' }).then(res => {
        
        const { marketJson,syncStatus,updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_address_status = syncStatus || '0';
        state.sync_address_date = updDate || null;
        
        marketJson?.addressBooks.forEach(item => {

            // item.name 에 반품지 글자가 들어가면 반품지로 설정
            if (item.name.indexOf('반품') > -1) {
                state.returnAddressList.push({
                    return_address_code: item.addressBookNo,
                    return_address_name: item.name + '-' + item.address
                });
                return;
            } else if (item.name.indexOf('출고') > -1) {
                state.outboundAddressList.push({
                    outbound_code: item.addressBookNo,
                    outbound_name: item.name + '-' + item.address
                });
                return;
            }

        });
    });
}

onMounted(() => {
    initFormData()

    // 연동확인후
    if (state.formData.sync_market_status) {
        getAddressList()    
    }
    
});

const goBack = () => {
    router.push({ name: 'market_accounts_list' });
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