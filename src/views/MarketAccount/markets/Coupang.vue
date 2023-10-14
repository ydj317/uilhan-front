<template>
    <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        class="market_form">
        <a-form-item name="seller_id" label="셀러ID" :rules="[{ required: true, message: '셀러ID를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.seller_id" :disabled="state.formData.sync_market_status" />
        </a-form-item>

        <a-form-item name="vendor_id" label="업체코드" @keyup="handleResetSyncStatus" :rules="[{ required: true, message: '업체코드를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.vendor_id" />
        </a-form-item>

        <a-form-item name="access_key" label="accessKey" @keyup="handleResetSyncStatus" :rules="[{ required: true, message: 'AccessKey를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.access_key" />
        </a-form-item>

        <a-form-item name="secret_key" label="secretKey" @keyup="handleResetSyncStatus" :rules="[{ required: true, message: 'AccessKey를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.secret_key" />
        </a-form-item>

        <a-button class="mt15" @click="handleSyncMarketCheck" :loading="state.syncCheckLoading">
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

            <a-form-item name="outboundShippingPlaceCode" label="출고지"
                :rules="[{ required: true, message: '출고지를 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.outboundShippingPlaceCode" placeholder="출고지를 선택해 주세요"
                    style="width:260px;">
                    <a-select-option :value="item.outbound_address_code" v-for="(item, key) in state.outboundAddressList"
                        :key="key">{{ item.outbound_address_name }}</a-select-option>
                </a-select>
                <a-button @click="syncOutboundAddress(state.formData.id)" class="ml15"
                    :loading="state.syncOutboundAddressLoading">업데이트</a-button>
                <a-tag class="ml15" v-if="state.sync_outbound_address_status == 0">-</a-tag>
                <a-tag color="#87d068" class="ml15" v-else-if="state.sync_outbound_address_status == 1">성공</a-tag>
                <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
                <span>{{ state.sync_outbound_address_date ?? '-' }}</span>
            </a-form-item>

            <a-form-item name="returnCenterCode" label="반품지" :rules="[{ required: true, message: '반품지를 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.returnCenterCode" placeholder="반품지를 선택해 주세요" style="width:260px;"
                    @change="setReturnCenterData">
                    <a-select-option :value="item.return_address_code" v-for="(item, key) in state.returnAddressList"
                        :key="key">{{ item.return_address_name }}</a-select-option>
                </a-select>
                <a-button @click="syncReturnAddress(state.formData.id)" class="ml15"
                    :loading="state.syncReturnAddressLoading">업데이트</a-button>
                <a-tag class="ml15" v-if="state.sync_return_address_status == 0">-</a-tag>
                <a-tag color="#87d068" class="ml15" v-else-if="state.sync_return_address_status == 1">성공</a-tag>
                <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
                <span>{{ state.sync_return_address_date ?? '-' }}</span>
            </a-form-item>


            <h3 class="mt20">마켓정보설정</h3>


            <a-form-item name="returnCharge" label="반품배송비(편도)"
                :rules="[{ required: true, message: '반품배송비(왕복)를 입력해 주세요.' }]">
                <a-input v-model:value="state.formData.returnCharge" placeholder="반품배송비(편도)" style="width:160px" />
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
        vendor_id: '',
        access_key: '',
        secret_key: '',
        sync_market_status: false,

        // 마켓정보 불러오기
        returnCenterCode: null,// 반품지
        outboundShippingPlaceCode: null,// 출고지

        // 마켓정보 설정
        returnCharge: null,// 반품배송비(편도)

    },

    syncCheckLoading: false,
    syncOutboundAddressLoading: false,
    syncReturnAddressLoading: false,

    returnAddressList: [],
    outboundAddressList: [],

    // 불러오기 상태
    sync_outbound_address_status: 0,
    sync_outbound_address_date: null,

    sync_return_address_status: 0,
    sync_return_address_date: null,

})

// 수정시 계정 데이터 설정
const initFormData = () => {
    const accountInfo = props.accountInfo;

    if (Object.keys(accountInfo).length > 0) {
        state.formData.id = accountInfo.id;
        state.formData.market_code = accountInfo.marketCode;
        state.formData.seller_id = accountInfo.marketData.seller_id;
        state.formData.vendor_id = accountInfo.marketData.vendor_id;
        state.formData.access_key = accountInfo.marketData.access_key;
        state.formData.secret_key = accountInfo.marketData.secret_key;
        state.formData.sync_market_status = accountInfo.marketData.sync_market_status;

        state.formData.outboundShippingPlaceCode = accountInfo.marketData.outboundShippingPlaceCode;
        state.formData.returnCenterCode = accountInfo.marketData.returnCenterCode;
        state.formData.returnZipCode = accountInfo.marketData.returnZipCode;
        state.formData.returnAddress = accountInfo.marketData.returnAddress;
        state.formData.returnAddressDetail = accountInfo.marketData.returnAddressDetail;
        state.formData.companyContactNumber = accountInfo.marketData.companyContactNumber;
        state.formData.shippingPlaceName = accountInfo.marketData.shippingPlaceName;

        state.formData.returnCharge = accountInfo.marketData.returnCharge;

    }
}

const syncOutboundAddress = (account_id) => {
    state.syncOutboundAddressLoading = true;
    useAccountJsonApi().syncOutboundAddress({ account_id: account_id, market_code: props.market_code }).then(res => {
        if (res.status !== "2000") {
            message.error(res.message);
            state.syncOutboundAddressLoading = false;
            return false;
        }

        message.success('업데이트 완료 되었습니다. 출고지를 선택해 주세요.');

        const { marketJson, syncStatus, updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_outbound_address_status = syncStatus || '0';
        state.sync_outbound_address_date = updDate || null;
        state.outboundAddressList = [];
        marketJson?.forEach(item => {
            if (item.usable === true && item.placeAddresses[0].countryCode === 'CN') {
                state.outboundAddressList.push({
                    outbound_address_code: item.outboundShippingPlaceCode,
                    outbound_address_name: item.shippingPlaceName
                });
            }
        });

        state.syncOutboundAddressLoading = false;
    });
};
const syncReturnAddress = (account_id) => {
    state.syncReturnAddressLoading = true;
    useAccountJsonApi().syncReturnAddress({ account_id: account_id, market_code: props.market_code }).then(res => {
        if (res.status !== "2000") {
            message.error(res.message);
            state.syncReturnAddressLoading = false;
            return false;
        }

        message.success('업데이트 완료 되었습니다. 반품지를 선택해 주세요.');
        const { marketJson, syncStatus, updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_return_address_status = syncStatus || '0';
        state.sync_return_address_date = updDate || null;
        state.returnAddressList = [];
        marketJson?.forEach(item => {
            state.returnAddressList.push({
                return_address_code: item.returnCenterCode,
                return_address_name: item.shippingPlaceName + '-' + item.placeAddresses[0].returnAddress,
                shippingPlaceName: item.shippingPlaceName,
                companyContactNumber: item.placeAddresses[0].companyContactNumber,
                returnZipCode: item.placeAddresses[0].returnZipCode,
                returnAddress: item.placeAddresses[0].returnAddress,
                returnAddressDetail: item.placeAddresses[0].returnAddressDetail,

            });
        });

        state.syncReturnAddressLoading = false;
    });

};

const setReturnCenterData = (value) => {
    const returnCenterCode = value;
    const returnAddress = state.returnAddressList.find(item => item.return_address_code === returnCenterCode);

    state.formData.returnCenterCode = returnCenterCode;
    state.formData.returnZipCode = returnAddress.returnZipCode;
    state.formData.returnAddress = returnAddress.returnAddress;
    state.formData.returnAddressDetail = returnAddress.returnAddressDetail;
    state.formData.companyContactNumber = returnAddress.companyContactNumber;
    state.formData.shippingPlaceName = returnAddress.shippingPlaceName;
}
// 연동확인
const handleSyncMarketCheck = () => {

    marketFormRef.value.validate().then(() => {
        state.syncCheckLoading = true;
        state.formData.vendor_user_id = state.formData.seller_id

        useMarketAccountApi().syncMarketCheck(state.formData).then(res => {
            if (res.status !== "2000") {
                message.error(res.message);
                state.syncCheckLoading = false;
                return false;
            }

            const { account_id } = res.data;
            message.success(res.message);

            state.formData.id = account_id;
            // 출고지/반품지 수집실행
            syncOutboundAddress(account_id);
            syncReturnAddress(account_id);

            state.syncCheckLoading = false;
            state.formData.sync_market_status = true
        });
    }).catch((error) => {
        console.log('error', error);
    });
};

// 저장
const handleSubmit = (e) => {

  if (state.formData.sync_market_status === false) {
    message.error('연동확인을 먼저 해주세요.');
    return false;
  }

    // validation form
    state.formData.vendor_user_id = state.formData.seller_id
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

const handleResetSyncStatus = () => {
  state.formData.sync_market_status = false;
}


// 반품지 리스트
const getReturnAddressList = () => {
    useAccountJsonApi().getAccountJson({ account_id: props.accountInfo.id, group: 'return_address' }).then(res => {

        const { marketJson, syncStatus, updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_return_address_status = syncStatus || '0';
        state.sync_return_address_date = updDate || null;

        marketJson?.forEach(item => {
            state.returnAddressList.push({
                return_address_code: item.returnCenterCode,
                return_address_name: item.shippingPlaceName + '-' + item.placeAddresses[0].returnAddress,
                shippingPlaceName: item.shippingPlaceName,
                companyContactNumber: item.placeAddresses[0].companyContactNumber,
                returnZipCode: item.placeAddresses[0].returnZipCode,
                returnAddress: item.placeAddresses[0].returnAddress,
                returnAddressDetail: item.placeAddresses[0].returnAddressDetail,
            });
        });
    });

}

// 출고지 리스트
const getOutboundAddressList = () => {
    useAccountJsonApi().getAccountJson({ account_id: props.accountInfo.id, group: 'outbound_address' }).then(res => {
        const { marketJson, syncStatus, updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_outbound_address_status = syncStatus || '0';
        state.sync_outbound_address_date = updDate || null;

        marketJson?.forEach(item => {
            if (item.usable === true && item.placeAddresses[0].countryCode === 'CN') {
                state.outboundAddressList.push({
                    outbound_address_code: item.outboundShippingPlaceCode,
                    outbound_address_name: item.shippingPlaceName
                });
            }
        });
    });
}

onMounted(() => {
    initFormData()

    // 연동확인후
    if (state.formData.sync_market_status) {
        getOutboundAddressList()
        getReturnAddressList()
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