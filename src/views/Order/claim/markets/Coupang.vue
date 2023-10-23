<template>
  <a-descriptions title="클레임정보" bordered :column="2" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }">
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
              style="width:50px;height:50px;border-radius: 5px;" />
            {{ item.prdName }} - {{ item.prdOption }} <a-divider type="vertical" /> {{ item.quantity }}개
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
            <a-badge color="blue" :text="state.orderStatusList[item.status]" v-if="item.status === 'cancelComplete'" />
            <a-badge color="yellow" :text="state.orderStatusList[item.status]"
              v-else-if="item.status === 'returnRequest'" />
            <a-badge color="green" :text="state.orderStatusList[item.status]"
              v-else-if="item.status === 'returnComplete'" />
          </a-descriptions-item>
          <a-descriptions-item label="원 배송번호">{{ item.itemOrgData.shipmentBoxId }}</a-descriptions-item>
          <a-descriptions-item label="클레임번호">{{ item.claimNo }} </a-descriptions-item>
          <a-descriptions-item label="클레임사유">{{ item.claimCode }} </a-descriptions-item>
          <a-descriptions-item label="클레임상세">{{ item.claimDetail }}</a-descriptions-item>
          <a-descriptions-item label="최종상태변경시간">{{ item.lastDate }}</a-descriptions-item>

          <a-descriptions-item label="반품택배사">{{ item.courierName }}</a-descriptions-item>
          <a-descriptions-item label="반품송장번호">{{ item.invoiceNumber }}</a-descriptions-item>
          <a-descriptions-item label="반품 신청인 이름">{{ item.orgData.requesterName }}</a-descriptions-item>
          <a-descriptions-item label="반품 신청인 전화번호(안심번호)">{{ item.orgData.requesterPhoneNumber }}</a-descriptions-item>
          <a-descriptions-item label="반품 신청인 실전화번호">{{ item.orgData.requesterRealPhoneNumber }}</a-descriptions-item>
          <a-descriptions-item label="반품 회수지 주소">{{ item.orgData.requesterAddress }}</a-descriptions-item>
          <a-descriptions-item label="반품 회수지 상세주소">{{ item.orgData.requesterAddressDetail }}</a-descriptions-item>
          <a-descriptions-item label="반품 회수지 우편번호">{{ item.orgData.requesterZipCode }}</a-descriptions-item>
          <a-descriptions-item label="반품 사유 카테고리 1">{{ item.orgData.cancelReasonCategory1 }}</a-descriptions-item>
          <a-descriptions-item label="반품 사유 카테고리 2">{{ item.orgData.cancelReasonCategory2 }}</a-descriptions-item>
          <a-descriptions-item label="취소사유 상세내역">{{ item.orgData.cancelReason }}</a-descriptions-item>
          <a-descriptions-item label="총 취소수량">{{ item.orgData.cancelCountSum }}</a-descriptions-item>
          <a-descriptions-item label="반품배송번호">{{ item.orgData.returnDeliveryId }}</a-descriptions-item>
          <a-descriptions-item label="회수종류">{{ item.orgData.returnDeliveryType }}</a-descriptions-item>
          <a-descriptions-item label="출고중지처리상태">{{ item.orgData.releaseStopStatus }}</a-descriptions-item>
          <a-descriptions-item label="동봉배송비">{{ item.orgData.enclosePrice }}</a-descriptions-item>
          <a-descriptions-item label="귀책타입">{{ item.orgData.faultByType }}</a-descriptions-item>
          <a-descriptions-item label="선환불 여부">{{ item.orgData.preRefund }}</a-descriptions-item>
          <a-descriptions-item label="완료 확인 종류">{{ item.orgData.completeConfirmType }}</a-descriptions-item>
          <a-descriptions-item label="완료 확인 시간">{{ item.orgData.completeConfirmDate }}</a-descriptions-item>
          <a-descriptions-item label="반품사유코드">{{ item.orgData.reasonCode }}</a-descriptions-item>
          <a-descriptions-item label="반품사유설명">{{ item.orgData.reasonCodeText }}</a-descriptions-item>
          <a-descriptions-item label="예상 반품배송비">{{ item.orgData.returnShippingCharge }}</a-descriptions-item>

          <a-descriptions-item label="딜번호">{{ item.itemOrgData.vendorItemPackageId }}</a-descriptions-item>
          <a-descriptions-item label="딜명">{{ item.itemOrgData.vendorItemPackageName }}</a-descriptions-item>
          <a-descriptions-item label="상품출고여부">{{ item.itemOrgData.releaseStatus }}</a-descriptions-item>
          <a-descriptions-item label="주문취소처리 담당자">{{ item.itemOrgData.cancelCompleteUser }}</a-descriptions-item>
        </a-descriptions>

        <a-descriptions title="반품철회정보" bordered :column="2" :labelStyle="{ width: '220px' }"
                          :contentStyle="{ width: '500px' }" class="mt20">
          <a-descriptions-item label="철회여부">{{ item.isCancel }}</a-descriptions-item>
          <template v-if="item.cancelOrgData !== undefined">
            <a-descriptions-item label="반품 접수번호">{{ item.cancelOrgData.cancelId }}</a-descriptions-item>
            <a-descriptions-item label="반품 귀책">{{ item.cancelOrgData.refundDeliveryDuty }}</a-descriptions-item>
            <a-descriptions-item label="반품철회 시각">{{ item.cancelOrgData.createdAt }}</a-descriptions-item>
          </template>
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
import { onMounted, toRefs, reactive } from 'vue'
import { message } from "ant-design-vue";
import { SettingOutlined } from '@ant-design/icons-vue';
import { useMarketApi } from '@/api/market'
import { useMarketOrderApi } from '@/api/order'
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
const { orderData } = toRefs(props)


onMounted(async () => {
  console.log('==0==')
  console.log(orderData.value)
  await getMarketClaimStatusList();
})
</script>
