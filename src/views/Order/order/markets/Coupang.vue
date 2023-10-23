<template>
  <a-descriptions title="주문정보" bordered :column="2" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문번호">{{ orderData.orderNo }}</a-descriptions-item>
    <a-descriptions-item label="주문일시">{{ orderData.orderDate }}</a-descriptions-item>
    <a-descriptions-item label="결제일시">{{ orderData.orgData.paidAt }}</a-descriptions-item>

    <a-descriptions-item label="주문자 이름">{{ orderData.orgData.orderer.name }}</a-descriptions-item>
    <a-descriptions-item label="주문자 email">{{ orderData.orgData.orderer.email }}</a-descriptions-item>
    <a-descriptions-item label="주문자 연락처(안심번호)">{{ orderData.orgData.orderer.ordererNumber }}</a-descriptions-item>
    <a-descriptions-item label="주문자 연락처(실전화번호)">{{ orderData.orgData.orderer.safeNumber }}</a-descriptions-item>

    <a-descriptions-item label="수취인 이름">{{ orderData.orgData.receiver.name }}</a-descriptions-item>
    <a-descriptions-item label="수취인 연락처(안심번호)">{{ orderData.orgData.receiver.safeNumber }}</a-descriptions-item>
    <a-descriptions-item label="수취인 연락처(실전화번호)">{{ orderData.orgData.receiver.receiverNumber }}</a-descriptions-item>
    <a-descriptions-item label="수취인 배송지1">{{ orderData.orgData.receiver.addr1 }}</a-descriptions-item>
    <a-descriptions-item label="수취인 배송지2">{{ orderData.orgData.receiver.addr2 }}</a-descriptions-item>
    <a-descriptions-item label="수취인 우편번호">{{ orderData.orgData.receiver.postCode }}</a-descriptions-item>

    <a-descriptions-item label="배송비">{{ orderData.orgData.shippingPrice }}</a-descriptions-item>
    <a-descriptions-item label="도서산간배송비">{{ orderData.orgData.remotePrice }}</a-descriptions-item>
    <a-descriptions-item label="도서산간여부">{{ orderData.orgData.remoteArea }}</a-descriptions-item>
    <a-descriptions-item label="배송메세지">{{ orderData.orgData.parcelPrintMessage }}</a-descriptions-item>
    <a-descriptions-item label="분리배송여부">{{ orderData.orgData.splitShipping }}</a-descriptions-item>
    <a-descriptions-item label="분리배송가능여부">{{ orderData.orgData.ableSplitShipping }}</a-descriptions-item>

    <a-descriptions-item label="개인통관 고유부호">{{ orderData.orgData.overseaShippingInfoDto.personalCustomsClearanceCode }}</a-descriptions-item>
    <a-descriptions-item label="미사용">{{ orderData.orgData.overseaShippingInfoDto.orderersSsn }}</a-descriptions-item>
    <a-descriptions-item label="통관용 구매자 전화번호">{{ orderData.orgData.overseaShippingInfoDto.ordererPhoneNumber }}</a-descriptions-item>

    <a-descriptions-item label="택배사">{{ orderData.orgData.deliveryCompanyName }}</a-descriptions-item>
    <a-descriptions-item label="운송장번호">{{ orderData.orgData.invoiceNumber }}</a-descriptions-item>
    <a-descriptions-item label="출고일(발송일)">{{ orderData.orgData.inTrasitDateTime }}</a-descriptions-item>
    <a-descriptions-item label="배송완료일">{{ orderData.orgData.deliveredDate }}</a-descriptions-item>
    <a-descriptions-item label="결제위치">{{ orderData.orgData.refer }}</a-descriptions-item>
    <a-descriptions-item label="배송유형">{{ orderData.orgData.shipmentType }}</a-descriptions-item>
  </a-descriptions>

  <div class="mt40" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }" style="">
    <h3>상품정보</h3>
    <a-collapse v-model:activeKey="state.collapseKey" style="background-color: white;" collapsible="header">
      <a-collapse-panel :key="index" v-for="(item, index) in orderData.items">
        <template #header style="display: flex;align-items: center;">
          <a-space>
            <a-image :src="`https://picsum.photos/id/${index + 20}/200/300`"
              style="width:50px;height:50px;border-radius: 5px;" />
            {{ item.prdName }} - {{ item.prdOption }} <a-divider type="vertical" /> {{ item.quantity }}개 <a-divider
              type="vertical" /> {{ item.unitPrice }}원 <a-divider type="vertical" /> {{ item.quantity * item.unitPrice }}원
          </a-space>
        </template>

        <a-descriptions bordered :column="2" :labelStyle="{ width: '220px' }"
          :contentStyle="{ width: '500px' }">
          <a-descriptions-item label="상품명">{{ item.prdName }}</a-descriptions-item>
          <a-descriptions-item label="옵션번호">{{ item.prdOptionNo }}</a-descriptions-item>
          <a-descriptions-item label="옵션명">{{ item.prdOptionName }}</a-descriptions-item>
          <a-descriptions-item label="수량">{{ item.quantity - item.claimQuantity }}</a-descriptions-item>
          <a-descriptions-item label="가격">{{ item.unitPrice }}</a-descriptions-item>
          <a-descriptions-item label="합계">{{ (item.quantity - item.claimQuantity) * item.unitPrice }}</a-descriptions-item>
          <a-descriptions-item label="주문상태">
            <a-badge color="blue" :text="state.orderStatusList[item.status]" v-if="item.status === 'paid'" />
            <a-badge color="yellow" :text="state.orderStatusList[item.status]"
              v-else-if="item.status === 'shippingAddress'" />
            <a-badge color="orange" :text="state.orderStatusList[item.status]" v-else-if="item.status === 'shipping'" />
            <a-badge color="green" :text="state.orderStatusList[item.status]"
              v-else-if="item.status === 'shippingComplete'" />
          </a-descriptions-item>
          <a-descriptions-item label="배송빡스번호">{{ item.shippingBoxNo }}</a-descriptions-item>
          <a-descriptions-item label="수취인">{{ item.receiverName }}</a-descriptions-item>
          <a-descriptions-item label="택배사">{{ item.courierName }}</a-descriptions-item>
          <a-descriptions-item label="운송장번호">{{ item.invoiceNumber }}</a-descriptions-item>
          <a-descriptions-item label="즉시할인 쿠폰">{{ item.itemOrgData.instantCouponDiscount }}</a-descriptions-item>
          <a-descriptions-item label="다운로드 쿠폰">{{ item.itemOrgData.downloadableCouponDiscount }}</a-descriptions-item>
          <a-descriptions-item label="쿠팡 지원 할인">{{ item.itemOrgData.coupangDiscount }}</a-descriptions-item>
          <a-descriptions-item label="external code">{{ item.itemOrgData.externalVendorSkuCode }}</a-descriptions-item>
          <a-descriptions-item label="상품별 개별 항목">{{ item.itemOrgData.etcInfoHeader }}</a-descriptions-item>
          <a-descriptions-item label="상품별 개별 항목값">{{ item.itemOrgData.etcInfoValue }}</a-descriptions-item>
          <a-descriptions-item label="주문시 출고예정일">{{ item.itemOrgData.estimatedShippingDate }}</a-descriptions-item>
          <a-descriptions-item label="실제 출고예정일 (분리배송 시)">{{ item.itemOrgData.plannedShippingDate }}</a-descriptions-item>
          <a-descriptions-item label="운송장번호 업로드 일시">{{ item.itemOrgData.invoiceNumberUploadDate }}</a-descriptions-item>
          <a-descriptions-item label="업체상품옵션 추가 정보">{{ item.itemOrgData.extraProperties }}</a-descriptions-item>
          <a-descriptions-item label="최저가 상품 여부">{{ item.itemOrgData.pricingBadge }}</a-descriptions-item>
          <a-descriptions-item label="중고 상품 여부">{{ item.itemOrgData.usedProduct }}</a-descriptions-item>
          <a-descriptions-item label="구매확정일자">{{ item.itemOrgData.confirmDate }}</a-descriptions-item>
          <a-descriptions-item label="배송비구분">{{ item.itemOrgData.deliveryChargeTypeName }}</a-descriptions-item>
          <a-descriptions-item label="주문 취소 여부">{{ item.itemOrgData.canceled }}</a-descriptions-item>

        </a-descriptions>

        <template #extra>
          <a-button @click="placeOneOrder(orderData, item)" size="small" v-if="item.status === 'paid'">
            발주
          </a-button>
          <div v-if="item.status === 'shippingAddress'">
            <a-input v-model:value="state.invoiceNumberValues[item.id]" style="width: 250px;" size="small">
              <template #addonBefore>
                <a-select v-model:value="state.courierNameValues[item.id]" style="width: 120px" placeholder="택배사 선택">
                  <a-select-option value="1">CJ대한통운</a-select-option>
                  <a-select-option value="2">우체국</a-select-option>
                </a-select>
              </template>
            </a-input>
            <a-button @click="deliveryOrder(orderData, item)" size="small" class="ml10">
              배송
            </a-button>
          </div>
          <div v-if="item.status === 'shipping' || item.status === 'shippingComplete'">
            {{ item.courierName }} <a-divider type="vertical" /> {{ item.invoiceNumber }}
            <a-button size="small" class="ml10">
              추적
            </a-button>
          </div>
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


const getMarketOrderStatusList = async () => {
  await useMarketApi().getMarketOrderStatusList().then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.orderStatusList = res.data;
  });
}
const { orderData } = toRefs(props)

// 발주처리
const placeOrderApi = (order) => {
  useMarketOrderApi().placeOrder({
    order
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    message.success('발주처리가 완료되었습니다.');
  });
}

const placeOneOrder = (orders, item) => {
  const order = {};
  order[orders.account_id] = {
    [orders.order_no]: {
      order_no: orders.order_no,
      account_id: orders.account_id,
      shipping_box_id: orders.shipping_box_id,
      items: [item.item_no],
    }
  }

  placeOrderApi(order);
}

// 배송처리
const deliveryOrder = (order, item) => {

  if (!state.courierNameValues[item.id]) {
    message.error('택배사를 선택해주세요.');
    return false;
  }

  if (!state.invoiceNumberValues[item.id]) {
    message.error('운송장번호를 입력해주세요.');
    return false;
  }

  useMarketOrderApi().deliveryOrder({
    accountId: order.account_id,
    orderId: order.id,
    itemId: item.id,
    courierName: state.courierNameValues[item.id],
    invoiceNumber: state.invoiceNumberValues[item.id]
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    message.success('배송처리가 완료되었습니다.');
  });
}

onMounted(async () => {
  await getMarketOrderStatusList();
  console.log('==0==')
  console.log(orderData.value)
})
</script>
