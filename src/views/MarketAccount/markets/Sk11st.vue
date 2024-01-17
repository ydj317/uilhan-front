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

			<a-form-item name="outbound_address_code" label="출고지"
						 :rules="[{ required: true, message: '출고지를 선택해 주세요.' }]">
				<a-select v-model:value="state.formData.outbound_address_code" placeholder="출고지를 선택해 주세요" style="width:260px;">
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

			<a-form-item name="return_address_code" label="반품지" :rules="[{ required: true, message: '반품지를 선택해 주세요.' }]">
				<a-select v-model:value="state.formData.return_address_code" placeholder="반품지를 선택해 주세요" style="width:260px;">
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

<!--			<a-form-item label="출고지">-->
<!--				<a-form-item name="outbound_name" label="이름"-->
<!--							 :rules="[{ required: true, message: '이름을 입력해 주세요.' }]" :label-col="{ span: 5 }"-->
<!--							 :wrapper-col="{ span: 19 }">-->
<!--					<a-input v-model:value="state.formData.outbound_name" placeholder="예시) 홍길동"-->
<!--							 style="width:300px"/>-->
<!--				</a-form-item>-->
<!--				<a-form-item name="outbound_number" label="관련 지번 순번"-->
<!--							 :rules="[{ required: true, message: '관련 지번 순번을 입력해 주세요.' }]" :label-col="{ span: 5 }"-->
<!--							 :wrapper-col="{ span: 19 }">-->
<!--					<a-input v-model:value="state.formData.outbound_number" placeholder="예시) 1776801"-->
<!--							 style="width:300px"/>-->
<!--				</a-form-item>-->
<!--				<a-form-item name="outbound_address" label="상세주소"-->
<!--							 :rules="[{ required: true, message: '상세주소를 입력해 주세요.' }]" :label-col="{ span: 5 }"-->
<!--							 :wrapper-col="{ span: 19 }">-->
<!--					<a-input v-model:value="state.formData.outbound_address" placeholder="예시) 신개봉대리점"-->
<!--							 style="width:300px"/>-->
<!--				</a-form-item>-->
<!--				<a-form-item name="outbound_phone" label="휴대전화번호"-->
<!--							 :rules="[{ required: true, message: '휴대전화번호를 입력해 주세요.' }]" :label-col="{ span: 5 }"-->
<!--							 :wrapper-col="{ span: 19 }">-->
<!--					<a-input v-model:value="state.formData.outbound_phone" placeholder="예시) 010-1111-2222"-->
<!--							 style="width:300px"/>-->
<!--				</a-form-item>-->
<!--			</a-form-item>-->

<!--			<a-form-item label="반품지">-->
<!--				<a-form-item name="return_name" label="이름"-->
<!--							 :rules="[{ required: true, message: '이름을 입력해 주세요.' }]" :label-col="{ span: 5 }"-->
<!--							 :wrapper-col="{ span: 19 }">-->
<!--					<a-input v-model:value="state.formData.return_name" placeholder="예시) 홍길동"-->
<!--							 style="width:300px"/>-->
<!--				</a-form-item>-->
<!--				<a-form-item name="return_number" label="관련 지번 순번"-->
<!--							 :rules="[{ required: true, message: '관련 지번 순번을 입력해 주세요.' }]" :label-col="{ span: 5 }"-->
<!--							 :wrapper-col="{ span: 19 }">-->
<!--					<a-input v-model:value="state.formData.return_number" placeholder="예시) 1776801"-->
<!--							 style="width:300px"/>-->
<!--				</a-form-item>-->
<!--				<a-form-item name="return_address" label="상세주소"-->
<!--							 :rules="[{ required: true, message: '상세주소를 입력해 주세요.' }]" :label-col="{ span: 5 }"-->
<!--							 :wrapper-col="{ span: 19 }">-->
<!--					<a-input v-model:value="state.formData.return_address" placeholder="예시) 신개봉대리점"-->
<!--							 style="width:300px"/>-->
<!--				</a-form-item>-->
<!--				<a-form-item name="return_phone" label="휴대전화번호"-->
<!--							 :rules="[{ required: true, message: '휴대전화번호를 입력해 주세요.' }]" :label-col="{ span: 5 }"-->
<!--							 :wrapper-col="{ span: 19 }">-->
<!--					<a-input v-model:value="state.formData.return_phone" placeholder="예시) 010-1111-2222"-->
<!--							 style="width:300px"/>-->
<!--				</a-form-item>-->
<!--			</a-form-item>-->

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

			<a-form-item name="place_purchase" label="구매처"
						 :rules="[{ required: true, message: '구매처를 선택해 주세요.' }]">
				<SelectElement :options="placePurchaseList"
							   v-model:value="state.formData.place_purchase"
							   :style="'width:350px;'"
				/>
			</a-form-item>

			<a-form-item label="발송예정일">
				<a-form-item name="send_method" label="발송유형"
							 :rules="[{ required: true, message: '발송유형을 선택해 주세요.' }]" :label-col="{ span: 5 }"
							 :wrapper-col="{ span: 19 }">
					<SelectElement :options="sendMethodList"
								   v-model:value="state.formData.send_method"
								   :style="'width:250px;'"
					/>
				</a-form-item>

				<a-form-item name="send_normal" label="평일"
							 :rules="[{ required: true, message: '평일을 선택해 주세요.' }]" :label-col="{ span: 5 }"
							 :wrapper-col="{ span: 19 }">
					오늘 주문완료 건&nbsp;
					<SelectElement :options="sendDayList"
								   v-model:value="state.formData.send_normal"
								   :style="'width:150px;'"
					/>
					&nbsp;일 내 발송처리
				</a-form-item>
				<a-form-item name="send_saturday" label="토요일" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-checkbox v-model:checked="state.formData.send_saturday" value="Y">발송함</a-checkbox>
				</a-form-item>
				<a-form-item name="send_default_time">
					<a-checkbox v-model:checked="state.formData.send_default_time" value="Y" name="send_default_time">대표 마감시간으로 설정</a-checkbox>
				</a-form-item>
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
import SelectElement from '@/views/MarketAccount/components/SelectElement.vue'

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

const placePurchaseList = {
	A : 'A : 해당 브랜드 정식 도매',
	B : 'B : 해당 브랜드 직영 온,오프라인 매장(백화점포함)',
	C : 'C : 오프라인 아울렛',
	D : 'D : 현지 온라인 쇼핑몰',
	E : 'E : A~D에 해당되지 않는 구입처(경매 등)',
}

// TODO 해외직구일 경우 03만 선택 가능함
const sendMethodList = {
	// '01' : '일반발송',
	// '02' : '오늘발송',
	'03' : '재고확인 후 순차발송(소량재고/주문제작)',
}

// TODO 해외직구일 경우 필요 없어보임
const sendTimeList = {
	"0900": "오전 9시",
	"1000": "오전 10시",
	"1100": "오전 11시",
	"1200": "정오 12시",
	"1300": "오후 1시",
	"1400": "오후 2시",
	"1500": "오후 3시",
	"1600": "오후 4시",
	"1700": "오후 5시",
	"1800": "오후 6시",
	"1900": "오후 7시",
	"2000": "오후 8시"
}

const sendDayList = {
	// '1' : '1일',
	// '2' : '2일',
	'3' : '3일',
	'4' : '4일',
	'5' : '5일',
	'6' : '6일',
	'7' : '7일',
	'8' : '8일',
	'9' : '9일',
	'10' : '10일',
	'11' : '11일',
	'12' : '12일',
	'13' : '13일',
	'14' : '14일',
}

const router = useRouter();

const marketFormRef = ref(null);

const state = reactive({
	formData: {
		id: '',
		market_code: props.market_code,
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
		place_purchase: '',	// 구입처

		// 발송예정일 파람들
		send_method: '', // 발송방법
		send_normal: '', // 몇일
		send_today_end_time: '', // 오늘발송인경우 당일 주문마감시간 TODO 해외직구일 경우 필요 없어보임
		send_saturday: false, // 토요일 발송여부
		send_saturday_end_time: '', // 토요일 주문마감시간 TODO 해외직구일 경우 필요 없어보임
		send_default_time: false, // 대표 마감시간으로 설정

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
		state.formData.seller_id = accountInfo['marketData']?.seller_id;
		state.formData.access_token = accountInfo['marketData']?.access_token;
		state.formData.sync_market_status = accountInfo['marketData']?.sync_market_status;

		// 마켓정보 불러오기
		state.formData.return_address_code = accountInfo['marketData']?.return_address_code;
		state.formData.outbound_address_code = accountInfo['marketData']?.outbound_address_code;

		state.formData.jeju_add_delivery_price = accountInfo['marketData']?.jeju_add_delivery_price;
		state.formData.jeju_add_delivery_price_round_trip = accountInfo['marketData']?.jeju_add_delivery_price_round_trip;
		state.formData.return_delivery_price = accountInfo['marketData']?.return_delivery_price;
		state.formData.return_delivery_price_round_trip = accountInfo['marketData']?.return_delivery_price_round_trip;

		state.formData.place_purchase = accountInfo['marketData']?.place_purchase;
		state.formData.send_method = accountInfo['marketData']?.send_method;
		state.formData.send_normal = accountInfo['marketData']?.send_normal;
		state.formData.send_saturday = accountInfo['marketData']?.send_saturday;
		state.formData.send_default_time = accountInfo['marketData']?.send_default_time;
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
			if (Array.isArray(marketJson['inOutAddress'])) {
				marketJson['inOutAddress'].forEach(item => {
					state.outboundAddressList.push({
						outbound_address_code: item['addrSeq'],
						outbound_address_name: item['addr']
					});
				});
			} else {
				state.outboundAddressList.push({
					outbound_address_code: marketJson.inOutAddress['addrSeq'],
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
		state.sync_return_address_status = syncStatus || '0';
		state.sync_return_address_date = updDate || null;
		state.returnAddressList = [];

		if ('inOutAddress' in marketJson) {
			if (Array.isArray(marketJson['inOutAddress'])) {
				marketJson['inOutAddress'].forEach(item => {
					state.returnAddressList.push({
						return_address_code: item['addrSeq'],
						return_address_name: item['addr']
					});
				});
			} else {
				state.returnAddressList.push({
					return_address_code: marketJson.inOutAddress['addrSeq'],
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
		state.sync_return_address_status = syncStatus || '0';
		state.sync_return_address_date = updDate || null;

		if ('inOutAddress' in marketJson) {
			if (Array.isArray(marketJson['inOutAddress'])) {
				marketJson['inOutAddress'].forEach(item => {
					state.returnAddressList.push({
						return_address_code: item['addrSeq'],
						return_address_name: item['addr']
					});
				});
			} else {
				state.returnAddressList.push({
					return_address_code: marketJson.inOutAddress['addrSeq'],
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
		state.sync_outbound_address_status = syncStatus || '0';
		state.sync_outbound_address_date = updDate || null;

		if ('inOutAddress' in marketJson) {
			if (Array.isArray(marketJson['inOutAddress'])) {
				marketJson['inOutAddress'].forEach(item => {
					state.outboundAddressList.push({
						outbound_address_code: item['addrSeq'],
						outbound_address_name: item['addr']
					});
				});
			} else {
				state.outboundAddressList.push({
					outbound_address_code: marketJson.inOutAddress['addrSeq'],
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