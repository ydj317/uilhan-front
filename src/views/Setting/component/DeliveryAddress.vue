<script setup>
const props = defineProps({
  delivery: Object
})
</script>

<template>
  <a-descriptions title="" bordered >
    <a-descriptions-item label="출고지 명" span="2">{{ props.delivery.addr_name }}</a-descriptions-item>
    <a-descriptions-item label="담당자 명" >{{ props.delivery.person_name }}</a-descriptions-item>
    <a-descriptions-item label="일반 전화번호" span="2" v-if="props.delivery.addr_phone">{{ props.delivery.addr_phone }}</a-descriptions-item>
    <a-descriptions-item label="핸드폰 번호" v-if="props.delivery.addr_mobile">{{ props.delivery.addr_mobile }}</a-descriptions-item>
    <a-descriptions-item label="구 우편번호" v-if="props.delivery.zip_code" span="3">{{ props.delivery.zip_code }}</a-descriptions-item>
    <a-descriptions-item label="구 주소" v-if="props.delivery.address_1" span="3">{{ props.delivery.address_1.split('|').filter(Boolean).join('-') }}</a-descriptions-item>
    <a-descriptions-item label="구 상세주소" v-if="props.delivery.address_2" span="3">{{ props.delivery.address_2 }}</a-descriptions-item>
    <a-descriptions-item label="신 우편번호" v-if="props.delivery.doro_zip_code" span="3">{{ props.delivery.doro_zip_code }}</a-descriptions-item>
    <a-descriptions-item label="도로명 주소" v-if="props.delivery.doro_address_1" span="3">{{ props.delivery.doro_address_1 }}</a-descriptions-item>
    <a-descriptions-item label="도로명 주소상세" v-if="props.delivery.doro_address_2" span="3">{{ props.delivery.doro_address_2 }}</a-descriptions-item>
    <a-descriptions-item label="도시" v-if="props.delivery.city" span="3">{{ props.delivery.city }}</a-descriptions-item>
    <a-descriptions-item label="주" v-if="props.delivery.state" span="3">{{ props.delivery.state }}</a-descriptions-item>
  </a-descriptions>
</template>
