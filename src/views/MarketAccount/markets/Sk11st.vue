<template>
	<a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
			class="market_form">
		<a-form-item name="seller_id" label="판매자 ID" :rules="[{ required: true, message: '11번가 판매자 ID를 입력해 주세요.' }]">
			<a-input v-model:value="state.formData.seller_id" placeholder="11번가 판매자 ID를 입력해 주세요." :disabled="state.formData.sync_market_status"/>
		</a-form-item>

		<a-form-item name="access_token" @keyup="handleResetSyncStatus" label="OPEN API KEY"
					 :rules="[{ required: true, message: 'OPEN API KEY 를 입력해 주세요.' }]">
			<a-input v-model:value="state.formData.access_token" placeholder="OPEN API KEY 를 입력해주세요."/>
		</a-form-item>

		<a-button class="mt15" @click="handleSyncMarketCheck" :loading="state.syncCheckLoading">
			<template #icon v-if="state.formData.sync_market_status">
				<CheckCircleOutlined style="color:#67C23A;"/>
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
				<a-select v-model:value="state.formData.outboundShippingPlaceCode" placeholder="출고지를 선택해 주세요" style="width:260px;">
					<a-select-option :value="item.outbound_address_code" v-for="(item, key) in state.outboundAddressList"
									 :key="key">{{ item.outbound_address_name }}</a-select-option>
				</a-select>
				<a-button @click="syncOutboundAddress(state.formData.id)" class="ml15"
						  :loading="state.syncOutboundAddressLoading">업데이트</a-button>
				<a-tag class="ml15" v-if="state.sync_outbound_address_status === 0">-</a-tag>
				<a-tag color="#87d068" class="ml15" v-else-if="state.sync_outbound_address_status === 1">성공</a-tag>
				<a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
				<span>{{ state.sync_outbound_address_date ?? '-' }}</span>
			</a-form-item>

			<a-form-item name="returnCenterCode" label="반품지" :rules="[{ required: true, message: '반품지를 선택해 주세요.' }]">
				<a-select v-model:value="state.formData.returnCenterCode" placeholder="반품지를 선택해 주세요" style="width:260px;">
					<a-select-option :value="item.return_address_code" v-for="(item, key) in state.returnAddressList"
									 :key="key">{{ item.return_address_name }}</a-select-option>
				</a-select>
				<a-button @click="syncReturnAddress(state.formData.id)" class="ml15"
						  :loading="state.syncReturnAddressLoading">업데이트</a-button>
				<a-tag class="ml15" v-if="state.sync_return_address_status === 0">-</a-tag>
				<a-tag color="#87d068" class="ml15" v-else-if="state.sync_return_address_status === 1">성공</a-tag>
				<a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
				<span>{{ state.sync_return_address_date ?? '-' }}</span>
			</a-form-item>

			<h3 class="mt20">마켓정보설정</h3>

			<a-form-item label="제주 추가 배송비">
				<a-form-item name="jeju_add_delivery_price" label="제주 추가 배송비"
							 :rules="[{ required: true, message: '제주 추가 배송비를 입력해 주세요.' }]" :label-col="{ span: 5 }"
							 :wrapper-col="{ span: 19 }">
					<a-input v-model:value="state.formData.jeju_add_delivery_price" placeholder="제주 추가 배송비"
							 style="width:160px"/>
				</a-form-item>
				<a-form-item name="jeju_add_delivery_price_round_trip" label="제주 외 도서산간 추가 배송비"
							 :rules="[{ required: true, message: '제주 외 도서산간 추가 배송비를 입력해 주세요.' }]" :label-col="{ span: 5 }"
							 :wrapper-col="{ span: 19 }">
					<a-input v-model:value="state.formData.jeju_add_delivery_price_round_trip"
							 placeholder="제주 외 도서산간 추가 배송비" style="width:200px"/>
				</a-form-item>
			</a-form-item>

			<a-form-item name="return_delivery_price" label="반품배송비(편도)"
						 :rules="[{ required: true, message: '제주 추가 배송비를 입력해 주세요.' }]">
				<a-input v-model:value="state.formData.return_delivery_price" placeholder="반품배송비(편도)" style="width:160px"/>
			</a-form-item>
			<a-form-item name="return_delivery_price_round_trip" label="반품배송비(왕복)"
						 :rules="[{ required: true, message: '반품배송비(왕복)를 입력해 주세요.' }]">
				<a-input v-model:value="state.formData.return_delivery_price_round_trip" placeholder="반품배송비(왕복)"
						 style="width:160px"/>
			</a-form-item>

		</div>
		<a-button class="mt15" @click="goBack">돌아가기</a-button>
		<a-button class="mt15 ml15" @click="handleSubmit" type="primary">저장</a-button>

	</a-form>
</template>

<script setup>
import {reactive, onMounted, ref} from "vue";
import {message} from "ant-design-vue";
import {useMarketAccountApi} from '@/api/marketAccount';
import {useAccountJsonApi} from '@/api/accountJson';
import {CheckCircleOutlined} from '@ant-design/icons-vue';
import {useRouter} from 'vue-router';

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
		vendor_id:'',
		seller_id: '',
		access_token: '',

		sync_market_status: false,

		// 마켓정보 불러오기
		return_address_code: null,
		outbound_address_code: null,

		// 마켓정보 설정
		jeju_add_delivery_price: null, // 제주 추가 배송비
		jeju_add_delivery_price_round_trip: null, // 제주 외 도서산간 추가 배송비
		return_delivery_price: null, // 반품배송비(편도)
		return_delivery_price_round_trip: null, // 반품배송비(왕복)

	},

	syncCheckLoading: false,
	syncOutboundAddressLoading: false,
	getShippingCostPolicyLoading: false,

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
		state.formData.id = accountInfo?.id;
		state.formData.market_code = accountInfo?.marketCode;
		state.formData.vendor_id = accountInfo['marketData']?.vendor_id;
		state.formData.seller_id = accountInfo['marketData']?.seller_id;
		state.formData.access_token = accountInfo['marketData']?.access_token;
		state.formData.sync_market_status = accountInfo['marketData']?.sync_market_status;

		// 마켓정보 불러오기
		state.formData.return_address_code = accountInfo['marketData']?.return_address_code;
		state.formData.outbound_address_code = accountInfo['marketData']?.outbound_address_code;
		state.formData.outboundShippingPlaceCode = accountInfo['marketData']?.outboundShippingPlaceCode;
		state.formData.returnCenterCode = accountInfo['marketData']?.returnCenterCode;

		state.formData.jeju_add_delivery_price = accountInfo['marketData']?.jeju_add_delivery_price;
		state.formData.jeju_add_delivery_price_round_trip = accountInfo['marketData']?.jeju_add_delivery_price_round_trip;
		state.formData.return_delivery_price = accountInfo['marketData']?.return_delivery_price;
		state.formData.return_delivery_price_round_trip = accountInfo['marketData']?.return_delivery_price_round_trip;
	}
}


// 연동확인
const handleSyncMarketCheck = () => {

	marketFormRef.value.validate().then(() => {

		state.syncCheckLoading = true;

		useMarketAccountApi().syncMarketCheck(state.formData).then(res => {
			if (res?.status !== "2000") {
				message.error(res?.message);
				state.syncCheckLoading = false;
				return false;
			}

			state.syncCheckLoading = false;

			const { account_id } = res.data;
			message.success(res?.message);

			state.formData.id = account_id;
			// 출고지/반품지 수집실행
			syncOutboundAddress(account_id);
			syncReturnAddress(account_id);

			state.formData.sync_market_status = true
		});

	}).catch((error) => {
		console.log('error', error);
	});

};

// 저장
const handleSubmit = () => {

	if (state.formData.sync_market_status === false) {
		message.error('연동확인을 먼저 해주세요.');
		return false;
	}

	// validation form
	marketFormRef.value.validate().then(() => {
		useMarketAccountApi().registerOrModifyAccount(state.formData).then(res => {
			if (res?.status !== "2000") {
				message.error(res?.message);
				return false;
			}

			message.success(res?.message);
			setTimeout(() => {
				router.push({name: 'market_accounts_list'});
			}, 500);

		});


	}).catch((error) => {
		console.log('error', error);
	});
};

const handleResetSyncStatus = () => {
	state.formData.sync_market_status = false;
}


const syncOutboundAddress = (account_id) => {
	state.syncOutboundAddressLoading = true;
	useAccountJsonApi().syncOutboundAddress({account_id: account_id, market_code: props.market_code}).then(res => {
		if (res?.status !== "2000") {
			message.error(res?.message);
			state.syncOutboundAddressLoading = false;
			return false;
		}

		message.success('업데이트 완료 되었습니다. 출고지,반품지를 선택해 주세요.');

		const {marketJson, syncStatus, updDate} = res.data;

		// 업데이트상태/날짜
		state.sync_address_status = syncStatus || '0';
		state.sync_address_date = updDate || null;
		state.outboundAddressList = [];

		if ('inOutAddress' in marketJson) {
			if (Array.isArray(marketJson)) {
				marketJson['inOutAddress'].forEach(item => {
					state.outboundAddressList.push({
						outbound_address_code: item['memNo'],
						outbound_address_name: item['addr']
					});
				});
			} else {
				state.outboundAddressList.push({
					outbound_address_code: marketJson.inOutAddress['memNo'],
					outbound_address_name: marketJson.inOutAddress['addr']
				});
			}
		}

		state.syncOutboundAddressLoading = false;
	})
};

const syncReturnAddress = (account_id) => {
	state.syncReturnAddressLoading = true;
	useAccountJsonApi().syncReturnAddress({ account_id: account_id, market_code: props.market_code }).then(res => {
		if (res?.status !== "2000") {
			message.error(res?.message);
			state.syncReturnAddressLoading = false;
			return false;
		}

		message.success('업데이트 완료 되었습니다. 반품지를 선택해 주세요.');
		const { marketJson, syncStatus, updDate } = res.data;

		// 업데이트상태/날짜
		state.sync_return_address_status = syncStatus || 0;
		state.sync_return_address_date = updDate || null;
		state.returnAddressList = [];

		if ('inOutAddress' in marketJson) {
			if (Array.isArray(marketJson)) {
				marketJson['inOutAddress'].forEach(item => {
					state.returnAddressList.push({
						return_address_code: item['memNo'],
						return_address_name: item['addr']
					});
				});
			} else {
				state.returnAddressList.push({
					return_address_code: marketJson.inOutAddress['memNo'],
					return_address_name: marketJson.inOutAddress['addr']
				});
			}
		}

		state.syncReturnAddressLoading = false;
	});
};

// 반품지 리스트
const getReturnAddressList = () => {
	useAccountJsonApi().getAccountJson({ account_id: props.accountInfo?.id, group: 'return_address' }).then(res => {

		const { marketJson, syncStatus, updDate } = res.data;

		// 업데이트상태/날짜
		state.sync_return_address_status = syncStatus || 0;
		state.sync_return_address_date = updDate || null;

		if ('inOutAddress' in marketJson) {
			if (Array.isArray(marketJson)) {
				marketJson['inOutAddress'].forEach(item => {
					state.returnAddressList.push({
						return_address_code: item['memNo'],
						return_address_name: item['addr']
					});
				});
			} else {
				state.returnAddressList.push({
					return_address_code: marketJson.inOutAddress['memNo'],
					return_address_name: marketJson.inOutAddress['addr']
				});
			}
		}
	});

}

// 출고지 리스트
const getOutboundAddressList = () => {
	useAccountJsonApi().getAccountJson({ account_id: props.accountInfo?.id, group: 'outbound_address' }).then(res => {
		const { marketJson, syncStatus, updDate } = res.data;

		// 업데이트상태/날짜
		state.sync_outbound_address_status = syncStatus || 0;
		state.sync_outbound_address_date = updDate || null;

		if ('inOutAddress' in marketJson) {
			if (Array.isArray(marketJson)) {
				marketJson['inOutAddress'].forEach(item => {
					state.outboundAddressList.push({
						outbound_address_code: item['memNo'],
						outbound_address_name: item['addr']
					});
				});
			} else {
				state.outboundAddressList.push({
					outbound_address_code: marketJson.inOutAddress['memNo'],
					outbound_address_name: marketJson.inOutAddress['addr']
				});
			}
		}
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
	router.push({name: 'market_accounts_list'});
};

</script>
<style>
</style>