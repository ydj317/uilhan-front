<template>
	<a-descriptions title="클레임정보" bordered :column="2" :labelStyle="{ width: '220px' }"
					:contentStyle="{ width: '500px' }">
		<a-descriptions-item label="주문번호">{{ orderData.orderNo }}</a-descriptions-item>
		<a-descriptions-item label="클레임요청시간">{{ orderData.claimDate }}</a-descriptions-item>
	</a-descriptions>


	<div class="mt40" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }" style="">
		<h3>상품정보</h3>
		<a-collapse v-model:activeKey="state.collapseKey" style="background-color: white;" collapsible="header">
			<a-collapse-panel :key="index" v-for="(item, index) in orderData.items">
				<template #header style="display: flex;align-items: center;">
					<a-space>
						<a-image :src="item.prdImage"
								 fallback="data:image/png;base64,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"
								 style="width:50px;height:50px;border-radius: 5px;"/>
						{{ item.prdName }} - {{ item.prdOption }}
						<a-divider type="vertical"/>
						{{ item.quantity }}<span style="color: red;" v-if="item.isCancel === '1'">(반품철회)</span>개
					</a-space>
				</template>

				<a-descriptions title="상품정보" bordered :column="2" :labelStyle="{ width: '220px' }"
								:contentStyle="{ width: '500px' }">
					<a-descriptions-item label="상품명">{{ item.prdName }}</a-descriptions-item>
					<a-descriptions-item label="옵션명">{{ item.prdOptionName }}</a-descriptions-item>
					<a-descriptions-item label="옵션번호">{{ item.prdOptionNo }}</a-descriptions-item>
					<a-descriptions-item label="수량">
						{{ item.quantity }}
						<span style="color: red;" v-if="item.isCancel === '1'">(반품철회)</span>
					</a-descriptions-item>
					<a-descriptions-item label="클레임상태">
						<a-badge color="blue" :text="state.orderStatusList[item.status]" v-if="item.status === 'cancelComplete'"/>
						<a-badge color="yellow" :text="state.orderStatusList[item.status]"
								 v-else-if="item.status === 'returnRequest'"/>
						<a-badge color="green" :text="state.orderStatusList[item.status]"
								 v-else-if="item.status === 'returnComplete'"/>
					</a-descriptions-item>
					<a-descriptions-item label="클레임 요청일">{{ item.status }}</a-descriptions-item>

					<a-descriptions v-if="item.status === 'cancelComplete'" title="취소 정보" bordered :column="2"
									:labelStyle="{ width: '220px' }"
									:contentStyle="{ width: '500px' }">
						<a-descriptions-item label="취소 승인일">{{ item.itemOrgData.cancel.cancelApprovalDate }}</a-descriptions-item>
						<a-descriptions-item label="취소 완료일">{{ item.itemOrgData.cancel.cancelCompletedDate }}</a-descriptions-item>
						<a-descriptions-item label="취소 상세 사유">{{ item.itemOrgData.cancel.cancelDetailedReason }}</a-descriptions-item>
					</a-descriptions>




					<a-descriptions-item label="클레임번호">{{ item.claimNo }}</a-descriptions-item>
					<a-descriptions-item label="클레임사유">{{ item.claimCode }}</a-descriptions-item>
					<a-descriptions-item label="클레임상세">{{ item.claimDetail }}</a-descriptions-item>
					<a-descriptions-item label="최종상태변경시간">{{ item.lastDate }}</a-descriptions-item>
				</a-descriptions>

				<a-descriptions title="반품정보" bordered :column="2" :labelStyle="{ width: '220px' }"
								:contentStyle="{ width: '500px' }"
								v-if="item.status.indexOf(['returnRequest', 'returnComplete']) !== -1">
					<a-descriptions-item label="클레임 요청일">{{ item.itemOrgData.return.claimRequestDate }}</a-descriptions-item>
					<a-descriptions-item label="반품택배사">{{ item.courierName }}</a-descriptions-item>
					<a-descriptions-item label="반품송장번호">{{ item.invoiceNumber }}</a-descriptions-item>
					<a-descriptions-item label="반품 배송비 청구액" v-if="item.orgData.return">
						{{ item.orgData.return.claimDeliveryFeePayMeans }}
					</a-descriptions-item>
					<a-descriptions-item label="반품 배송비 결제 수단">{{ item.itemOrgData.return.claimDeliveryFeePayMeans }}
					</a-descriptions-item>
					<a-descriptions-item label="반품 배송비 결제 방법">{{ item.itemOrgData.return.claimDeliveryFeePayMethod }}
					</a-descriptions-item>
					<a-descriptions-item label="반품 배송비 할인액">{{ item.itemOrgData.return.claimDeliveryFeeDiscountAmount }}
					</a-descriptions-item>
					<a-descriptions-item label="반품 도서산간 배송비">{{ item.itemOrgData.return.remoteAreaCostChargeAmount }}
					</a-descriptions-item>
					<a-descriptions-item label="기타 비용 청구액">{{ item.itemOrgData.return.collectTrackingNumber }}</a-descriptions-item>
					<a-descriptions-item label="기타 비용 결제 수단">{{ item.itemOrgData.return.etcFeePayMeans }}</a-descriptions-item>
					<a-descriptions-item label="기타 비용 결제 방법">{{ item.itemOrgData.return.etcFeePayMethod }}</a-descriptions-item>
					<a-descriptions-item label="환불 예정일">{{ item.itemOrgData.return.refundExpectedDate }}</a-descriptions-item>
					<a-descriptions-item label="반품 상세 사유">{{ item.itemOrgData.return.returnDetailedReason }}</a-descriptions-item>

					<a-descriptions title="수거지 정보" bordered :column="2" :labelStyle="{ width: '220px' }"
									:contentStyle="{ width: '500px' }" class="mt20">
						<a-descriptions-item label="배송지 타입">
							{{ item.itemOrgData.return.collectAddress.addressType === 'DOMESTIC' ? '국내배송' : '해외배송' }}
						</a-descriptions-item>
						<a-descriptions-item label="이름">{{ item.itemOrgData.return.collectAddress.name }}</a-descriptions-item>
						<a-descriptions-item label="연락처 1">{{ item.itemOrgData.return.collectAddress.tel1 }}</a-descriptions-item>
						<a-descriptions-item label="연락처 2">{{ item.itemOrgData.return.collectAddress.tel2 }}</a-descriptions-item>
						<a-descriptions-item label="국가">{{ item.itemOrgData.return.collectAddress.state }}</a-descriptions-item>
						<a-descriptions-item label="주(state)">{{ item.itemOrgData.return.collectAddress.country }}
						</a-descriptions-item>
						<a-descriptions-item label="도시">{{ item.itemOrgData.return.collectAddress.city }}</a-descriptions-item>
						<a-descriptions-item label="기본 주소">{{ item.itemOrgData.return.collectAddress.baseAddress }}
						</a-descriptions-item>
						<a-descriptions-item label="상세 주소">{{ item.itemOrgData.return.collectAddress.detailedAddress }}
						</a-descriptions-item>
						<a-descriptions-item label="우편번호">{{ item.itemOrgData.return.collectAddress.zipCode }}</a-descriptions-item>
					</a-descriptions>

					<a-descriptions title="반환지 정보" bordered :column="2" :labelStyle="{ width: '220px' }"
									:contentStyle="{ width: '500px' }" class="mt20">
						<a-descriptions-item label="배송지 타입">
							{{ item.itemOrgData.return.returnReceiveAddress.addressType === 'DOMESTIC' ? '국내배송' : '해외배송' }}
						</a-descriptions-item>
						<a-descriptions-item label="이름">{{ item.itemOrgData.return.returnReceiveAddress.name }}</a-descriptions-item>
						<a-descriptions-item label="연락처 1">{{ item.itemOrgData.return.returnReceiveAddress.tel1 }}
						</a-descriptions-item>
						<a-descriptions-item label="연락처 2">{{ item.itemOrgData.return.returnReceiveAddress.tel2 }}
						</a-descriptions-item>
						<a-descriptions-item label="국가">{{ item.itemOrgData.return.returnReceiveAddress.state }}</a-descriptions-item>
						<a-descriptions-item label="주(state)">{{ item.itemOrgData.return.returnReceiveAddress.country }}
						</a-descriptions-item>
						<a-descriptions-item label="도시">{{ item.itemOrgData.return.returnReceiveAddress.city }}</a-descriptions-item>
						<a-descriptions-item label="기본 주소">{{ item.itemOrgData.return.returnReceiveAddress.baseAddress }}
						</a-descriptions-item>
						<a-descriptions-item label="상세 주소">{{ item.itemOrgData.return.returnReceiveAddress.detailedAddress }}
						</a-descriptions-item>
						<a-descriptions-item label="우편번호">{{ item.itemOrgData.return.returnReceiveAddress.zipCode }}
						</a-descriptions-item>
					</a-descriptions>
				</a-descriptions>

				<template #extra>
					<a-button @click="placeOneOrder(orderData, item)" size="small" v-if="item.status === 'paid'">
						발주
					</a-button>
				</template>
			</a-collapse-panel>
		</a-collapse>
	</div>
</template>

<script setup>
import {onMounted, toRefs, reactive} from 'vue'
import {message} from "ant-design-vue";
import {SettingOutlined} from '@ant-design/icons-vue';
import {useMarketApi} from '@/api/market'
import {useMarketOrderApi} from '@/api/order'

const props = defineProps({
	orderData: {
		type: Object,
		default: () => ({})
	}
})

const state = reactive({
	orderStatusList: {},
	collapseKey: [],
	courierNameValues: {},
	invoiceNumberValues: {},
});


const getMarketClaimStatusList = async () => {
	await useMarketApi().getMarketClaimStatusList().then(res => {
		if (res.status !== "2000") {
			message.error(res.message);
			return false;
		}
		state.orderStatusList = res.data;
	});
}
const {orderData} = toRefs(props)


onMounted(async () => {
	console.log('==0==')
	console.log(orderData.value)
	await getMarketClaimStatusList();
})
</script>
