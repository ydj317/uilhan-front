<template>
	<a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
			class="market_form">
		<a-form-item name="seller_id" label="판매자 ID" :rules="[{ required: true, message: '큐텐 판매자 ID를 입력해 주세요.' }]">
			<a-input v-model:value="state.formData.seller_id" placeholder="큐텐 판매자 ID를 입력해 주세요." :disabled="state.formData.sync_market_status"/>
		</a-form-item>

		<a-form-item name="seller_pwd" label="비밀번호" :rules="[{ required: true, message: '큐텐 비밀번호를 입력해 주세요.' }]">
			<a-input-password v-model:value="state.formData.seller_pwd" placeholder="큐텐 비밀번호를 입력해 주세요."/>
		</a-form-item>

		<a-form-item name="api_token" @keyup="handleResetSyncStatus" label="API 인증키"
					 :rules="[{ required: true, message: 'API 인증키를 입력해 주세요.' }]">
			<a-input v-model:value="state.formData.api_token" placeholder="API 인증키를 입력해주세요."/>
		</a-form-item>

		<a-input type="hidden" name="access_token" v-model:value="state.formData.access_token" />

		<a-button class="mt15" @click="handleSyncMarketCheck" :loading="state.syncCheckLoading">
			<template #icon v-if="state.formData.sync_market_status">
				<CheckCircleOutlined style="color:#67C23A;"/>
			</template>
			인증키 가져오기
		</a-button>

		<a-divider></a-divider>

		<div v-if="state.formData.sync_market_status">
			<div style="display:flex;justify-content:space-between;align-items:center;" class="mb15">
				<h3>마켓정보 불러오기</h3>
			</div>

			<a-form-item name="shipping_fee_code" label="배송비 정보">
				<a-select v-model:value="state.formData.shipping_fee_code" placeholder="배송비 정보를 선택해 주세요" style="width:260px;">
					<a-select-option :value="item.shipping_fee_code" v-for="(item, key) in state.shippingFeeInfoList"
									 :key="key">{{ item.shipping_fee_name }}</a-select-option>
				</a-select>
				<a-button @click="syncShippingFeeInfo(state.formData.id)" class="ml15"
						  :loading="state.syncShippingFeeInfoLoading">업데이트</a-button>
				<a-tag class="ml15" v-if="state.sync_shipping_fee_info_status == 0">-</a-tag>
				<a-tag color="#87d068" class="ml15" v-else-if="state.sync_shipping_fee_info_status == 1">성공</a-tag>
				<a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
				<span>{{ state.sync_shipping_fee_info_date ?? '-' }}</span>
			</a-form-item>

			<h3 class="mt20">마켓정보설정</h3>

			<a-form-item label="A/S 정보">
				<a-form-item name="seller_phone" label="전화번호"
							 :wrapper-col="{ span: 19 }">
					<a-input v-model:value="state.formData.seller_phone" placeholder="전화번호"
							 style="width:200px"/>
				</a-form-item>
				<a-form-item name="seller_email" label="이메일"
							 :wrapper-col="{ span: 19 }">
					<a-input v-model:value="state.formData.seller_email"
							 placeholder="이메일" style="width:200px"/>
				</a-form-item>
			</a-form-item>

			<a-form-item name="is_real_rate">
				<template #label>
					<span>환율 설정</span>
					<a-tooltip class="ml10">
						<template #title>
							<p>설정된 환율 값으로 판매금액이 설정됩니다.</p>
						</template>
						<QuestionCircleOutlined/>
					</a-tooltip>
				</template>
				<a-radio-group v-model:value="state.formData.rate.is_real_rate">
					<a-radio :value="true">실시간 환율</a-radio>
					<a-radio :value="false">직접 입력 환율</a-radio>
				</a-radio-group>
				<a-input-number v-model:value.number="state.formData.rate.rate_value"
								:disabled="state.formData.rate.is_real_rate"
								:min="0" :max="999" size="small" name="rate_value"/>
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
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons-vue';
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
		seller_id: '',
		seller_pwd: '',
		api_token: '',
		access_token: '',

		sync_market_status: false,

		// 마켓정보 불러오기
		shipping_fee_code: null,

		// 마켓설정
		seller_phone: '',
		seller_email: '',
		rate: {
			is_real_rate: true,
			rate_value: ''
		}
	},

	syncCheckLoading: false,

	shippingFeeInfoList: [],

	// 불러오기 상태
	sync_shipping_fee_info_status: 0,
	sync_shipping_fee_info_date: null,
})

// 수정시 계정 데이터 설정
const initFormData = () => {
	const accountInfo = props.accountInfo;

	if (Object.keys(accountInfo).length > 0) {
		state.formData.id = accountInfo?.id;
		state.formData.market_code = accountInfo?.marketCode;
		state.formData.seller_id = accountInfo['marketData']?.seller_id;
		state.formData.seller_pwd = accountInfo['marketData']?.seller_pwd;
		state.formData.api_token = accountInfo['marketData']?.api_token;
		state.formData.access_token = accountInfo['marketData']?.access_token;
		state.formData.sync_market_status = accountInfo['marketData']?.sync_market_status;

		// 마켓정보 불러오기
		state.formData.shipping_fee_code = accountInfo['marketData']?.shipping_fee_code;

		// 마켓설정
		state.formData.seller_phone = accountInfo['marketData']?.seller_phone;
		state.formData.seller_email = accountInfo['marketData']?.seller_email;
		state.formData.rate.is_real_rate = accountInfo['marketData']?.rate?.is_real_rate;
		state.formData.rate.rate_value = state.formData.rate.is_real_rate === true ? '' : accountInfo['marketData']?.rate?.rate_value;
	}
}

// 연동확인
const handleSyncMarketCheck = () => {

	marketFormRef.value.validate().then(() => {

		state.syncCheckLoading = true;

		useMarketAccountApi().syncMarketGetToken(state.formData).then(res => {
			if (res?.status !== "2000") {
				message.error(res?.message);
				state.syncCheckLoading = false;
				return false;
			}

			state.syncCheckLoading = false;

			const { account_id, access_token } = res.data;
			message.success(res?.message);

			state.formData.id = account_id;
			state.formData.access_token = access_token;

			syncShippingFeeInfo(account_id);

			state.formData.sync_market_status = true
		});

	}).catch((error) => {
		console.log('error', error);
	});

};

// 저장
const handleSubmit = () => {

	if (state.formData.sync_market_status === false) {
		message.error('인증키 가져오기를 먼저 해주세요.');
		return false;
	}

	if (!state.formData.rate.is_real_rate && state.formData.rate.rate_value === '') {
		message.error('환율을 입력해 주세요.');
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

const syncShippingFeeInfo = (account_id) => {
	state.syncShippingFeeInfoLoading = true;
	useAccountJsonApi().getShippingCostPolicy({ account_id: account_id, market_code: props.market_code }).then(res => {
		if (res?.status !== "2000") {
			message.error(res?.message);
			state.syncShippingFeeInfoLoading = false;
			return false;
		}

		message.success('업데이트 완료 되었습니다. 반품지를 선택해 주세요.');
		const { marketJson, syncStatus, updDate } = res.data;

		// 업데이트상태/날짜
		state.sync_shipping_fee_info_status = syncStatus || '0';
		state.sync_shipping_fee_info_date = updDate || null;
		state.shippingFeeInfoList = [];

		if ('ResultObject' in marketJson) {
			marketJson['ResultObject'].forEach(item => {
				if (item['Oversea'] === 'N') {
					state.shippingFeeInfoList.push({
						shipping_fee_code: item['ShippingNo'],
						shipping_fee_name: item['ShippingName']
					});
				}
			});
		}

		state.syncShippingFeeInfoLoading = false;
	});
};

const getShippingFeeInfoList = () => {
	useAccountJsonApi().getAccountJson({ account_id: props.accountInfo?.id, group: 'shipping_cost_policy' }).then(res => {

		const { marketJson, syncStatus, updDate } = res.data;

		// 업데이트상태/날짜
		state.sync_shipping_fee_info_status = syncStatus || '0';
		state.sync_shipping_fee_info_date = updDate || null;

		if ('ResultObject' in marketJson) {
			marketJson['ResultObject'].forEach(item => {
				if (item['Oversea'] === 'N') {
					state.shippingFeeInfoList.push({
						shipping_fee_code: item['ShippingNo'],
						shipping_fee_name: item['ShippingName']
					});
				}
			});
		}
	});

}

onMounted(() => {
	initFormData()

	// 연동확인후
	if (state.formData.sync_market_status) {
		getShippingFeeInfoList()
	}

});

const goBack = () => {
	router.push({name: 'market_accounts_list'});
};

</script>
<style>
</style>