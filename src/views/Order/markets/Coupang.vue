<template>
  <a-descriptions title="주문정보" bordered :column="2" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="배송번호">{{ orderData.order_id }}</a-descriptions-item>
    <a-descriptions-item label="주문번호">Prepaid</a-descriptions-item>
    <a-descriptions-item label="주문일시">YES</a-descriptions-item>
    <a-descriptions-item label="결제일시">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="주문상태" :span="2">2019-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="배송비">
      <a-badge status="processing" text="Running" />
    </a-descriptions-item>
    <a-descriptions-item label="도서산간배송비">$80.00</a-descriptions-item>
    <a-descriptions-item label="도서산간여부">$20.00</a-descriptions-item>
    <a-descriptions-item label="배송메세지">$60.00</a-descriptions-item>
    <a-descriptions-item label="분리배송여부">$60.00</a-descriptions-item>
    <a-descriptions-item label="분리배송가능여부">$60.00</a-descriptions-item>
  </a-descriptions>

  <div class="mt40" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }" style="">
    <h3>상품정보</h3>
    <a-table :dataSource="data" :pagination="false" bordered>
      <a-table-column title="이미지" dataIndex="image" key="image">
        <template #default="{ record }">
          <a-image :src="record.image" style="width:80px;height:80px;" />
        </template>
      </a-table-column>
      <a-table-column title="상품명" dataIndex="name" key="name" />
      <a-table-column title="옵션명" dataIndex="option" key="option" />
      <a-table-column title="수량" dataIndex="quantity" key="quantity" />
      <a-table-column title="개당" dataIndex="price" key="price" />
      <a-table-column title="총 할인 가격" dataIndex="discount_price" key="discount_price" />
    </a-table>

    <!-- <a-descriptions-item label="이미지">
      <a-image src="https://picsum.photos/id/237/200/300" style="width:80px;height:80px;" />
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </a-descriptions-item>
    <a-descriptions-item label="수량">Cloud Database</a-descriptions-item>
    <a-descriptions-item label="개당">Prepaid</a-descriptions-item>
    <a-descriptions-item label="결제금액">YES</a-descriptions-item>
    <a-descriptions-item label="총 할인 가격">2018-04-24 18:00:00</a-descriptions-item> -->
  </div>

  <a-descriptions title="주문자" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
    :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="주문자 이름">Cloud Database</a-descriptions-item>
    <a-descriptions-item label="주문자 email">Prepaid</a-descriptions-item>
    <a-descriptions-item label="주문자 연락처(안심번호)">YES</a-descriptions-item>
    <a-descriptions-item label="주문자 연락처(실전화번호)">2018-04-24 18:00:00</a-descriptions-item>
  </a-descriptions>

  <a-descriptions title="수취인" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
    :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="수취인 이름">Cloud Database</a-descriptions-item>
    <a-descriptions-item label="수취인 email">Prepaid</a-descriptions-item>
    <a-descriptions-item label="수취인 연락처(안심번호)">YES</a-descriptions-item>
    <a-descriptions-item label="수취인 연락처(실전화번호)">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="수취인 배송지1" :span="2">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="수취인 배송지2" :span="2">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="수취인 우편번호">2018-04-24 18:00:00</a-descriptions-item>
  </a-descriptions>

  <a-descriptions title="배송정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
    :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="택배사">Cloud Database</a-descriptions-item>
    <a-descriptions-item label="운송장번호">Prepaid</a-descriptions-item>
    <a-descriptions-item label="출고일(발송일)">YES</a-descriptions-item>
    <a-descriptions-item label="배송완료일">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="결제위치">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="배송유형">2018-04-24 18:00:00</a-descriptions-item>
  </a-descriptions>

  <a-descriptions title="해외배송정보" bordered :column="2" class="mt40" :labelStyle="{ width: '220px' }"
    :contentStyle="{ width: '500px' }">
    <a-descriptions-item label="개인통관 고유부호">Cloud Database</a-descriptions-item>
    <a-descriptions-item label="통관용 구매자 전화번호">Prepaid</a-descriptions-item>
  </a-descriptions>
</template>

<script setup>
import { onMounted, toRefs } from 'vue'
const props = defineProps({
  orderData: {
    type: Object,
    default: () => ({})
  }
})

const data = [
  {
    key: '1',
    image: 'https://picsum.photos/id/237/200/300',
    name: 'John Brown',
    option: 'John Brown',
    quantity: 32,
    price: 'New York No. 1 Lake Park',
    discount_price: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    image: 'https://picsum.photos/id/237/200/300',
    name: 'Jim Green',
    option: 'John Brown',
    quantity: 42,
    price: 'London No. 1 Lake Park',
    discount_price: 'New York No. 1 Lake Park',
  },
  {
    key: '3',
    image: 'https://picsum.photos/id/237/200/300',
    name: 'Joe Black',
    option: 'John Brown',
    quantity: 32,
    price: 'Sidney No. 1 Lake Park',
    discount_price: 'New York No. 1 Lake Park',
  },
];
const { orderData } = toRefs(props)
onMounted(() => {
  console.log(orderData.value)
})
</script>

<style lang="scss" scoped></style>