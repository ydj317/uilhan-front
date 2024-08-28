<template>
  <a-modal
      width="70%" wrap-class-name="full-modal"
      v-model:open="detail.show"
      centered
      :afterClose="cancelOrderDetail"
      :maskClosable="false"
  >
    <div class="container">
      <div style="position: relative; left: 20px;">
        <h3 class="title"> 주문상세정보</h3>
      </div>
      <div style="width:100%; background-color: #fafafa;">
        <div style="width:65%; position: relative; left: 30px; top:6px;">
          <a-descriptions size="middle"
                          :column="2">
            <a-descriptions-item label="주문번호">{{ detail.orderData.orderNo }}</a-descriptions-item>
            <a-descriptions-item label="주문일자">{{ detail.orderData.orderDate }}</a-descriptions-item>
            <a-descriptions-item label="결제위치 구분">{{ detail.orderData.payLocation }}</a-descriptions-item>
            <a-descriptions-item label="결제시간">
              {{ moment(detail.orderData.payDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <a-divider :plain="true" style="border-color: #1a1a1a; "/>
      <a-row>
        <a-col :flex="3" style=" width:50%;border-right: 2px solid #d9d9d9;">
          <a-list item-layout="horizontal" :data-source="detail.orderData.items">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a-space direction="vertical" :size="0" style="color: #1a1a1a">
                      <div>
                        <span v-if="item.prdUrl.length > 0">
                          <a target="_blank" :href="item.prdUrl">
                            <img
                                :src="getLogoSrc('get-logo', item.prdMarket.toLowerCase())"
                                style="width: 20px;height: 20px;border-radius: 10px"
                                alt=""/>
                          </a>

                        </span>

                        <span :style="item.prdUrl.length > 0? 'margin-left: 5px' : 'margin-left: 25px'" v-bind:class="state.claimStatusList[item.status] ? 'claimText' : 'orderText'">{{
                            item.prdName
                          }}</span>
                        <span style="position: absolute; right: 50px;">
                          <a-badge color="blue" :text="state.orderStatusList[item.status]"
                                   v-if="item.status === 'paid'"/>
                          <a-badge color="yellow" :text="state.orderStatusList[item.status]"
                                   v-else-if="item.status === 'shippingAddress'"/>
                          <a-badge color="orange" :text="state.orderStatusList[item.status]"
                                   v-else-if="item.status === 'shipping'"/>
                          <a-badge color="green" :text="state.orderStatusList[item.status]"
                                   v-else-if="item.status === 'shippingComplete'"/>
                          <a-badge color="red" :text="allStatus[item.status]" v-else/>
                        </span>
                      </div>
                    </a-space>
                  </template>
                  <template #avatar>
                    <div>
                      <a-image :src="item.prdImage"
                               fallback="data:image/png;base64,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"
                               style="width:100px;height:100px;border-radius: 5px;"/>
                    </div>
                  </template>
                  <template #description>
                    <div
                        style="margin-left: 25px;"
                        v-bind:class="{
                                      'claimText': state.claimStatusList[item.status],
                                      'orderText': !state.claimStatusList[item.status],
                                      'smallText': true,
                                    }">

                      <a-space direction="vertical" :size="0.1">
                        <a-space :size="60" class="smallText">
                          <div> {{ item.prdOptionName }}</div>
                          <div> 수량 : {{ item.quantity }} 개</div>
                        </a-space>

                        <a-space :size="30" class="smallText">
                          <div v-if="state.orderStatusList.hasOwnProperty(item.status) && item.unitPrice">
                            판매가 : {{ item.unitPrice.toLocaleString() }} 원
                          </div>
                          <div v-else>
                            판매가 : -
                          </div>

                          <div
                              v-if="state.orderStatusList.hasOwnProperty(item.status) && item.hasOwnProperty('unitDiscountFee')">
                            할인가 : {{ item.unitDiscountFee.toLocaleString() }} 원
                          </div>
                          <div v-else>
                            할인가 : -
                          </div>

                          <div v-if="state.orderStatusList.hasOwnProperty(item.status)">
                            배송비 : {{ item.deliveryFee.toLocaleString() }} 원
                          </div>
                          <div v-else>
                            배송비 : -
                          </div>

                          <div v-if="state.orderStatusList.hasOwnProperty(item.status)">
                            결제금액 : {{ item.totalPaymentAmount.toLocaleString() }} 원
                          </div>
                          <div v-else>
                            결제금액 : -
                          </div>
                        </a-space>

                      </a-space>
                    </div>
                  </template>

                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-divider/>

          <div>
            <a-space style="width: 77%;" direction="vertical">
              <div style="position: relative; left: 20px;">
                <div>
                  <h3 class="title">주문자 정보</h3>
                </div>
                <div style="position: relative; left: 120px;">
                  <a-descriptions
                      size="middle"
                      bordered :column="1"
                      :label-style="state.descriptionLabelStyle"
                      :content-style="state.descriptionContentStyle"
                  >
                    <a-descriptions-item label="주문자">{{ detail.orderData.ordererName }}</a-descriptions-item>
                    <a-descriptions-item label="전화번호">{{ detail.orderData.ordererTel }}</a-descriptions-item>
                  </a-descriptions>
                </div>

              </div>

              <div style="position: relative; left: 20px;">
                <div>
                  <h3 style="font-weight: bold">수령자 정보</h3>
                </div>
                <div style="position: relative; left: 120px;">
                  <a-descriptions
                      size="middle"
                      bordered
                      :column="1"
                      :label-style="state.descriptionLabelStyle"
                      :content-style="state.descriptionContentStyle"
                  >
                    <a-descriptions-item label="수령자">{{ detail.orderData.receiverName }}</a-descriptions-item>
                    <a-descriptions-item label="전화번호01">{{ detail.orderData.receiverTel1 }}</a-descriptions-item>
                    <a-descriptions-item label="전화번호02">{{ detail.orderData.receiverTel2 }}</a-descriptions-item>
                    <a-descriptions-item label="개인통관번호">{{
                        detail.orderData.personalCustomsClearanceCode
                      }}
                    </a-descriptions-item>
                    <a-descriptions-item label="기본주소">{{ detail.orderData.receiverAddr1 }}</a-descriptions-item>
                    <a-descriptions-item label="상세주소">{{ detail.orderData.receiverAddr2 }}</a-descriptions-item>
                    <a-descriptions-item label="우편번호">{{ detail.orderData.receiverPostCode }}</a-descriptions-item>
                  </a-descriptions>
                </div>
              </div>

              <div style="position: relative; left: 20px;">
                <div>
                  <h3 style="font-weight: bold">택배정보</h3>
                </div>
                <div style="position: relative; left: 120px;">
                  <a-descriptions
                      size="middle"
                      bordered :column="1"
                      :label-style="state.descriptionLabelStyle"
                      :content-style="state.descriptionContentStyle"
                  >
                    <a-descriptions-item label="택배사">{{ detail.orderData.courierName }}</a-descriptions-item>
                    <a-descriptions-item label="운송장번호">{{ detail.orderData.invoiceNumber }}</a-descriptions-item>
                    <a-descriptions-item label="배송메모">{{ detail.orderData.message }}</a-descriptions-item>
                  </a-descriptions>
                </div>
              </div>

            </a-space>
          </div>
        </a-col>

        <a-col :flex="2">
          <div>
            <div>
              <h3 class="title" style="margin-left: 20px;">주문내역</h3>
            </div>
            <div class="summary">
              <div class="summary-item">
                <span class="label">합계금액</span>
                <span class="discounted-value">{{ total.price.toLocaleString() }} 원</span>
              </div>
              <div class="summary-item">
                <span class="label">총 배송비</span>
                <span class="value">{{ total.deliveryFee.toLocaleString() }} 원</span>
              </div>
              <div class="summary-item">
                <span class="label">총 할인금액</span>
                <span class="value">{{ total.totalDiscountAmount.toLocaleString() }} 원</span>
              </div>
            </div>
            <div class="summary-total">
              <div class="title" style="margin-left: 20px;">최종 결제금액</div>
              <div class="total-value"> {{ total.totalPaymentAmount.toLocaleString() }} 원</div>
            </div>
          </div>
        </a-col>
      </a-row>

    </div>
    <template v-slot:footer>
      <div style="display: flex; justify-content: center">
        <a-button type="primary" @click="cancelOrderDetail">닫기</a-button>
      </div>
    </template>


  </a-modal>
</template>

<script setup>
import {computed, onMounted, reactive, toRefs,} from "vue";
import {message} from "ant-design-vue";
import moment from "moment";
import {useMarketApi} from "@/api/market";
import {getLogoSrc} from "@/util/functions";

const props = defineProps(['detail', 'marketCode'])
const emit = defineEmits(['update:detail'])
const {detail} = toRefs(props)

const state = reactive({
  descriptionLabelStyle: {width: '140px'},
  descriptionContentStyle: {width: '500px'},

  orderStatusList: {},
  claimStatusList: {},
  marketDeliveryCompany: {}
});

const allStatus = computed(() => {
  return {...state.orderStatusList, ...state.claimStatusList};
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
const getMarketClaimStatusList = async () => {
  await useMarketApi().getMarketClaimStatusList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.claimStatusList = res.data;
  });
}

const total = computed(() => {

  if (detail.value.show === false) {
    document.body.classList.remove('body-no-scroll');
    return {
      totalPaymentAmount: 0,
      deliveryFee: 0,
      price: 0,
      totalDiscountAmount: 0
    }
  }else{
    document.body.classList.add('body-no-scroll');
  }

  /** 합계 금액 */
  const price = detail.value.orderData.items.reduce((acc, cur) => {
    if (Object.keys(state.orderStatusList).includes(cur.status)) {
      return acc + cur.unitPrice * cur.quantity;
    } else {
      return acc
    }
  }, 0);


  /** 실 결제금액 */
  const totalPaymentAmount = detail.value.orderData.items.reduce((acc, cur) => {
    if (Object.keys(state.orderStatusList).includes(cur.status)) {
      return acc + cur.totalPaymentAmount;
    } else {
      return acc
    }
  }, 0);

  /** 배송비 */
  const deliveryFee = detail.value.orderData.items.reduce((acc, cur) => {
    if (Object.keys(state.orderStatusList).includes(cur.status)) {
      return acc + cur.deliveryFee;
    } else {
      return acc
    }
  }, 0);

  /** 총 할인금액 */
  const totalDiscountAmount = detail.value.orderData.items.reduce((acc, cur) => {
    if (Object.keys(state.orderStatusList).includes(cur.status)) {
      return acc + cur.totalDiscountAmount || 0;
    } else {
      return acc
    }
  }, 0);

  return {
    totalPaymentAmount,
    deliveryFee,
    price,
    totalDiscountAmount
  }
});

function cancelOrderDetail() {
  emit('update:detail', {
    show: false,
    orderData: {}
  })
}

onMounted(async () => {
  await getMarketOrderStatusList();
  await getMarketClaimStatusList();
})


</script>
<style>
.body-no-scroll {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
<style scoped>
.container {
  overflow: auto;
  height: calc(100vh - 100px);
  padding: 20px;
  margin-right: 20px;
}

title {
  font-size: 24px;
  font-weight: bold;
}

.claimText {
  color: #c5c5c5;
}

.orderText {
  color: black;
}

.smallText {
  font-size: 12px;
}

.summary {
  font-size: 0.9em;
  background-color: #fafafa; /* 배경색 추가 */
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 중앙 정렬 */
  padding: 10px; /* 패딩 추가 */
  border-bottom: 1px solid #eee; /* 항목 사이에 줄 추가 */
}

.summary-item:last-child {
  border-bottom: none; /* 마지막 항목에는 줄을 없앰 */
}

.summary-item .label {
  color: #666;
  margin-left: 20px;
}

.value,
.discounted-value {
  font-weight: bold;
  color: #333;
}

/* 원래 가격에 건너줄을 그음 */
.original-value {
  text-decoration: line-through; /* 건너줄 스타일 */
  color: #999;
  margin-right: 8px; /* 할인된 가격과의 공간 추가 */
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
  padding-top: 1em;
}

.summary-total .label {
  font-size: 1em;
  color: #000;
}

.summary-total .total-value {
  color: #1890ff;
  font-size: 1.2em;
  font-weight: bold;
}

</style>