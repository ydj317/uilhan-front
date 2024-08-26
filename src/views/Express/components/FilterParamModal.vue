<template>
	<a-modal v-model:visible="visible" :closable="false" cancelText="취소" okText="주문검색" width="560px" class="modal-wrap">
		<template #title>
			<a-flex align="center" justify="space-between">
				<div class="fw fs16">배송대행 검색 필터</div>
				<a-button class="reset plr30">초기화</a-button>
			</a-flex>
		</template>
		<a-flex vertical class="mt30">
			<div><strong>검색기간</strong></div>
			<a-form-item name="date" class="mt10 mb10">
				<a-range-picker class="w100"/>
			</a-form-item>
		</a-flex>
		<a-flex class="date-wrap bor br5" align="center" justify="center">
			<a-button ghost>전체기간</a-button>
			<a-divider type="vertical"/>
			<a-button ghost>오늘</a-button>
			<a-divider type="vertical"/>
			<a-button ghost>일주일</a-button>
			<a-divider type="vertical"/>
			<a-button ghost>1개월</a-button>
			<a-divider type="vertical"/>
			<a-button ghost>3개월</a-button>
		</a-flex>
		<a-flex vertical class="mt20">
			<div><strong>주문번호</strong></div>
			<a-form-item name="date" class="mt10 mb10">
				<a-input class="w100" placeholder="쇼핑몰 주문번호를 입력하세요."/>
			</a-form-item>
		</a-flex>
		<a-flex vertical class="mt10">
			<div><strong>수취인</strong></div>
			<a-form-item name="date" class="mt10 mb10">
				<a-input class="w100" placeholder="수취인 이름을 입력하세요."/>
			</a-form-item>
		</a-flex>
		<a-flex vertical class="mt10">
			<div><strong>트래킹번호</strong></div>
			<a-form-item name="date" class="mt10 mb10">
				<a-input class="w100" placeholder="중국 트래킹 번호를 입력하세요."/>
			</a-form-item>
		</a-flex>
		<a-flex vertical class="mt10">
			<div><strong>운송장번호</strong></div>
			<a-form-item name="date" class="mt10 mb10">
				<a-input class="w100" placeholder="운송장번호를 입력하세요."/>
			</a-form-item>
		</a-flex>
	</a-modal>
</template>
<script setup>
import {reactive, ref, watch} from "vue";

const visible = ref(false);

// 响应外部传入的 open prop 的变化
watch(() => props.open, (newValue) => {
	visible.value = newValue;
});

const updateVisible = (newValue) => {
	visible.value = newValue;
	emit('update:open', newValue);
};

const state = reactive({

})
</script>
<style>
.modal-wrap .ant-btn.reset{
	background: #2270E3;
	color: white;
}
.modal-wrap .ant-modal-content{
	padding: 30px 50px;
}
.modal-wrap .ant-picker-input{
	height: 34px;
}
.modal-wrap .date-wrap .ant-divider{
	background: #FEEA91;
}
.modal-wrap .date-wrap .ant-btn-background-ghost{
	color: black;
}
.modal-wrap .ant-modal-footer{
	margin-top: 40px;
}
</style>
<style scoped>
.modal-wrap input{
	height: 40px;
}
.modal-wrap .date-wrap{
	height: 40px;
}
</style>