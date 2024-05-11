<template>
	<a-modal
		width="100%"
		wrap-class-name="full-modal"
		class="expressForm"
		:footer="null"
		v-model:open="visible"
	>
		<a-flex>
			<span class="fs18 fw">배대지 신청 현황 정보</span>
		</a-flex>

		<a-flex class="status-wrap fl-lb p30 mt25 top-border-000 bottom-border-f0f0f0">
			<a-flex class="fl-tc">
				<img v-if="state.bridgeOrderDetail['bridgeOrderStatus'] === '배송완료'"
					src="@/assets/img/express-success.png" class="mr15" alt="success">
				<img v-else-if="['주문오류','노데이터'].includes(state.bridgeOrderDetail['bridgeOrderStatus'])" src="@/assets/img/express-fail.png" class="mr15" alt="fail">
				<img v-else src="@/assets/img/express-ing.png" class="mr15" alt="ing">
				<a-flex vertical>
					<div class="fs20">{{state.bridgeOrderDetail['bridgeOrderStatus']}}</div>
				</a-flex>
			</a-flex>
<!--			<a-button class="fw fs14" @click="state.historyModal = true">배송 히스토리</a-button>-->
		</a-flex>

		<a-flex vertical>
			<a-descriptions title="주문정보" :column="2" bordered class="mt40">
				<a-descriptions-item label="주문번호">{{state.bridgeOrderDetail['bridgeOrderId']}}</a-descriptions-item>
				<a-descriptions-item label="진행상태">{{state.bridgeOrderDetail['bridgeOrderStatus']}}</a-descriptions-item>
				<a-descriptions-item label="물류센터">{{state.bridgeOrderDetail['ctrSeq']}}</a-descriptions-item>
				<a-descriptions-item label="운송방식">
					{{state.bridgeOrderDetail['ctrSeq'] === '위해 항공' ? '항공운송' : '해운운송'}}
				</a-descriptions-item>
			</a-descriptions>
			<a-flex class="fs12 mt10 color-bababa">
				*항공운송은 사이즈에 따른 추가금이 발생할 수 있으며 추후 예치금 자동 결제될 수 있습니다.<br>
				*항공운송 시 사이즈/무게(20kg이상)/품목에 따라 배송 불가능한 경우, 해운배송으로 자동 변경될 수 있습니다.<br>
				*항공운송을 선책했어도 배터리 포함 등 항공 불가 품목 발견 시 해운운송으로 변경되어 운송될 수 있습니다.
			</a-flex>
		</a-flex>

		<a-flex vertical>
			<a-descriptions title="국내 배송정보" :column="2" bordered class="area-wrap mt40">
				<a-descriptions-item label="택배사">
					<div class="row-content bottom-border-f0f0f0 m10">
						{{state.bridgeOrderDetail['items'][0]['ctrSeq'] === '인천1 해운' ? '한진택배' : 'CJ대한통운'}}
					</div>
				</a-descriptions-item>
				<a-descriptions-item label="송장번호" :contentStyle="{color:'#2071E1'}">
					<div class="row-content bottom-border-f0f0f0 m10" style="text-decoration: underline;">
						{{state.bridgeOrderDetail['items'][0]['invoice_no']}}
					</div>
				</a-descriptions-item>
			</a-descriptions>
			<a-flex class="fs12 mt10 color-bababa">
				*화물(건영택배) 배송 시 배송비는 셀러가 직접 결제해야 합니다.
			</a-flex>
		</a-flex>

		<a-flex vertical>
			<a-descriptions title="받는사람 정보" :column="2" bordered class="mt40">
				<a-descriptions-item label="이름">{{state.bridgeOrderDetail['receiverName']}}</a-descriptions-item>
				<a-descriptions-item label="개인통관부호">{{state.bridgeOrderDetail['personalCustomsClearanceCode']}}</a-descriptions-item>
				<a-descriptions-item label="휴대전화번호">{{state.bridgeOrderDetail['receiverTel1']}}</a-descriptions-item>
				<a-descriptions-item label="우편번호">{{state.bridgeOrderDetail['receiverPostCode']}}</a-descriptions-item>
				<a-descriptions-item label="주소">{{state.bridgeOrderDetail['receiverAddr1']}}</a-descriptions-item>
				<a-descriptions-item label="상세주소">{{state.bridgeOrderDetail['receiverAddr2']}}</a-descriptions-item>
				<a-descriptions-item label="배송 요청사항" :span="3">{{state.bridgeOrderDetail['message']}}</a-descriptions-item>
			</a-descriptions>
		</a-flex>

		<span v-for="(item, index) in state.bridgeOrderDetail['items']" :key="index">
		<a-flex class="mt40">
			<span class="fs14 fw">상품정보 0{{index + 1}}</span>
		</a-flex>
		<a-flex vertical class="info-wrap mt15 bor-0505050f br5">
			<a-flex>
				<a-flex vertical class="w50">
					<a-flex class="bottom-border-f0f0f0 h54">
						<div class="bg-fafafa fw w50 fl-tc pl20">트래킹번호</div>
						<div class="w50 fl-tc pl20">{{item['tracking_no']}}</div>
					</a-flex>
					<a-flex class="bottom-border-f0f0f0 h54">
						<div class="bg-fafafa fw w50 fl-tc pl20">오더번호</div>
						<div class="w50 fl-tc plr10">
							<a-input placeholder="주문번호 입력 (order No.)" class="h40" readonly :value="item['cn_order_id']"/>
						</div>
					</a-flex>
					<a-flex class="bottom-border-f0f0f0 h54">
						<div class="bg-fafafa fw w50 fl-tc pl20">오픈마켓 주문번호</div>
						<div class="w50 fl-tc plr10">
							<a-input placeholder="주문번호 입력 (order No.)" class="h40" readonly :value="item['orderNo']"/>
						</div>
					</a-flex>
				</a-flex>
				<a-flex class="w50 bottom-border-f0f0f0">
					<div class="bg-fafafa fw fl-cc w50">상품 이미지</div>
					<div class="w50 fl-cc">
						<img :src="item['prdImage']" class="br5" width="140" height="140" alt="">
					</div>
				</a-flex>
			</a-flex>
			<a-flex class="bottom-border-f0f0f0 h54">
				<div class="bg-fafafa fw w25 fl-tc pl20">가격 (위안)</div>
				<div class="w25 fl-tc pl20">¥ {{item['unitPrice']}}</div>
				<div class="bg-fafafa fw w25 fl-tc pl20">수량</div>
				<div class="w25 fl-tc pl20">{{item['quantity']}}</div>
			</a-flex>
			<a-flex class="bottom-border-f0f0f0 h54">
				<div class="bg-fafafa fw w25 fl-tc pl20">통관 품목</div>
				<div class="w75 fl-tc pl20">{{item['arc_seq']}}</div>
			</a-flex>
			<a-flex class="bottom-border-f0f0f0 h54">
				<div class="bg-fafafa fw w25 fl-tc pl20">영문 상품명</div>
				<div class="w75 fl-tc pl20">{{item['prd_name_en']}}</div>
			</a-flex>
			<a-flex class="bottom-border-f0f0f0 h54">
				<div class="bg-fafafa fw w25 fl-tc pl20">중국어 상품명</div>
				<div class="w75 fl-tc pl20">{{item['prd_name_cn'] ?? ''}}</div>
			</a-flex>
			<a-flex class="bottom-border-f0f0f0 h54">
				<div class="bg-fafafa fw w25 fl-tc pl20">한국어 상품명</div>
				<div class="w75 fl-tc pl20">{{item['prdName'] ?? ''}}</div>
			</a-flex>
			<a-flex class="bottom-border-f0f0f0 h54">
				<div class="bg-fafafa fw w25 fl-tc pl20">옵션명</div>
				<div class="w75 fl-tc pl20">{{item['prdOptionName'] ?? ''}}</div>
			</a-flex>
			<a-flex class="bottom-border-f0f0f0 h54">
				<div class="bg-fafafa fw w25 fl-tc pl20">상품 URL</div>
				<div class="w75 fl-tc pl20">{{item['prdUrl'] ?? ''}}</div>
			</a-flex>
		</a-flex>
		</span>
		<a-flex vertical>
			<a-descriptions title="세관신고 금액정보" :column="2" bordered class="mt40">
				<a-descriptions-item label="총 수량">{{state.totalCount}}</a-descriptions-item>
				<a-descriptions-item label="총 금액 (달러)">{{state.totalAmount}}</a-descriptions-item>
			</a-descriptions>
			<a-flex vertical class="fs12 mt10 color-bababa">
				<span style="color: #F9443E">*달러 금액은 환율 변동에 따라 변경이 있을 수 있으며 문제 발생 시 책임지지 않습니다.</span>
				<span>*세관에 신고되는 금액으로 쇼핑몰 결제 금액과 동일해야 합니다.</span>
				<span>*총 금액(금액)이 미화 150달러 이상인 경우 통관 수수료가 발생합니다.</span>
				<span>*상품의 총 금액을 꼭 확인해주세요. 실제와 다른 경우 과태료가 발생할 수 있습니다.</span>
				<span>*목록통관이 불가한 식품, 액체, 식품, 분말은 간이 통관으로 진행됩니다. 세관 적발 시 책임지지 않으니 주의해주세요.</span>
			</a-flex>
		</a-flex>

		<a-flex vertical>
			<a-descriptions title="부가서비스 정보" :column="2" bordered class="mt40">
				<a-descriptions-item label="검수 옵션" :span="3">{{setEtcOptions('EtcDlvr1')}}</a-descriptions-item>
				<a-descriptions-item label="제거 옵션" :span="3">{{setEtcOptions('EtcDlvr3')}}</a-descriptions-item>
				<a-descriptions-item label="포장 옵션" :span="3">{{setEtcOptions('EtcDlvr2')}}</a-descriptions-item>
				<a-descriptions-item label="통관 옵션" :span="3">{{setEtcOptions('EtcDlvr4')}}</a-descriptions-item>
				<a-descriptions-item label="기타 옵션" :span="3">{{setEtcOptions('EtcDlvr5')}}</a-descriptions-item>
				<a-descriptions-item label="물류 요청사항" :span="3">{{state.bridgeOrderDetail['req2']}}</a-descriptions-item>
			</a-descriptions>
		</a-flex>

		<a-flex class="mt40">
			<span class="fs18 fw">입고상품 검수 이미지</span>
		</a-flex>

		<a-flex class="mt25 top-border-000 bottom-border-f0f0f0 fl-tc">
			<div class="fs14 bg-fafafa mr40 h90 fl-cc fw" style="width: 180px;">검수 이미지</div>
			<img src="@/assets/img/express-success.png" class="br5 mr15" width="70" height="70">
			<img src="@/assets/img/express-fail.png" class="br5 mr15" width="70" height="70">
			<img src="@/assets/img/express-ing.png" class="br5" width="70" height="70">
		</a-flex>
		<a-flex class="fs12 mt10 color-bababa">
			상품 오염/파손 문제로 중국 내 반품이 필요하신가요?  네, 상품에 문제가 있어요
		</a-flex>

<!--		<a-flex class="mt40">-->
<!--			<span class="fs14 fw">결제정보</span>-->
<!--		</a-flex>-->
<!--		<a-divider class="top-border-000 mtb10" />-->
<!--		<a-flex class="mt10">-->
<!--			<span class="fs14">선결제 정보</span>-->
<!--		</a-flex>-->
<!--		<a-descriptions :column="1" bordered class="mt10">-->
<!--			<a-descriptions-item label="선결제 금액">5,830 원 (기본료 5,300원 + 부가세 530원)</a-descriptions-item>-->
<!--		</a-descriptions>-->
<!--		<a-flex class="fs12 mt10 color-bababa">-->
<!--			*선결제 금액은 추가결제 금액의 배송대행료에서 제외됩니다.-->
<!--		</a-flex>-->
<!--		<a-flex class="mt10">-->
<!--			<span class="fs14">추가결제 정보</span>-->
<!--		</a-flex>-->
<!--		<a-descriptions :column="2" bordered class="mt10">-->
<!--			<a-descriptions-item label="추가결제 금액" :span="3">6,160 원</a-descriptions-item>-->
<!--			<a-descriptions-item label="배송대행료">5,600 원</a-descriptions-item>-->
<!--			<a-descriptions-item label="실측 범위">고객 (구매자)</a-descriptions-item>-->
<!--			<a-descriptions-item label="도서산간 추가배송비" :span="3">0 원</a-descriptions-item>-->
<!--			<a-descriptions-item label="검수 옵션" :span="3">0 원 (기본검수 0원)</a-descriptions-item>-->
<!--			<a-descriptions-item label="제거 옵션" :span="3">0 원</a-descriptions-item>-->
<!--			<a-descriptions-item label="포장 옵션" :span="3">0 원</a-descriptions-item>-->
<!--			<a-descriptions-item label="통관 옵션" :span="3">0 원 (목록통관 0원)</a-descriptions-item>-->
<!--			<a-descriptions-item label="기타 옵션" :span="3">0 원</a-descriptions-item>-->
<!--			<a-descriptions-item label="부가세" :span="3">560 원</a-descriptions-item>-->
<!--		</a-descriptions>-->
<!--		<a-flex class="mt10">-->
<!--			<span class="fs14">총 결제 정보</span>-->
<!--		</a-flex>-->
<!--		<a-descriptions :column="1" bordered class="mt10">-->
<!--			<a-descriptions-item label="총 결제 금액">11,990 원 (10,900원 + 부가세 1,090원)</a-descriptions-item>-->
<!--		</a-descriptions>-->
<!--		<a-flex class="fs12 mt10 color-bababa">-->
<!--			*선결제 금액과 추가결제 금액이 합쳐진 금액입니다.-->
<!--		</a-flex>-->
<!--		<a-flex justify="center" class="mt60">-->
<!--			<a-flex style="display: none;">-->
<!--				<a-button>ID : 8a8b000008<CopyOutlined class="color-2071E1" /></a-button>-->
<!--			</a-flex>-->
<!--			<a-space>-->
<!--				<a-button class="fs14 fw" @click="emit('close')">닫기</a-button>-->
<!--				<a-button type="primary"  class="fs14 fw">결제하기</a-button>-->
<!--			</a-space>-->
<!--		</a-flex>-->
	</a-modal>

	<a-modal
		v-model:open="state.historyModal"
		:closable="true"
		cancelText="닫기"
		width="560px"
		class="modal-wrap"
		:footer="null"
	>
		<template #title>
			<a-flex align="center" justify="space-between">
				<div class="fw fs16">배송 히스토리</div>
			</a-flex>
			<a-flex vertical class="mt20">
				<div><strong>주문번호</strong></div>
				<div><strong>주문번호</strong></div>
			</a-flex>
		</template>
	</a-modal>
</template>
<script setup>
import {CopyOutlined} from "@ant-design/icons-vue";
import {computed, reactive, toRefs, watchEffect} from "vue";

const props = defineProps({
	visible: Boolean,
	bridgeDetail: {
		type: Object
	}
});

const {bridgeDetail} = toRefs(props);
const emit = defineEmits(["close"]);

const state = reactive({
	loading: false,
	bridgeOrderDetail: {},
	historyModal: false,
	totalAmount: 0,
	totalCount: 0,
})

let visible = computed({
	get: () => props.visible, // getter
	set: (value) => emit("close") // setter
});

const setEtcOptions = (type) => {
	if (Array.isArray(state.bridgeOrderDetail['options'][type])) {
		return state.bridgeOrderDetail['options'][type].join(',');
	}

	return '-';
}

const setTotal = (items, type) => {
	let total = 0;
	let typeByKey = {
		amount: 'unitPrice',
		count: 'quantity'
	}
	if (Array.isArray(items)) {
		items.forEach(item => total += item[typeByKey[type]] ?? 0);
	}

	return total;
}

watchEffect(() => {
    if (visible.value) {
        state.bridgeOrderDetail = bridgeDetail.value;

		state.totalAmount = setTotal(state.bridgeOrderDetail['items'] ?? [], 'amount');
		state.totalCount = setTotal(state.bridgeOrderDetail['items'] ?? [], 'count');
    }
})

</script>
<style>
.expressForm .ant-modal-content{
	padding: 65px 150px;
	height: auto;
	min-height: 100vh;
}
.expressForm .area-wrap .ant-descriptions-item-content{
	padding: 0;
}
</style>