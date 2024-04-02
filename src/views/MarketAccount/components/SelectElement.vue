<template>
	<a-select v-model:value="selectedValue" :style="style">
		<a-select-option value=""> - 선택해주세요 - </a-select-option>
		<a-select-option :value="key" v-for="(item, key) in options"
						 :key="key">{{ item }}</a-select-option>
	</a-select>
</template>

<script setup>
import { computed } from 'vue';

// 定义 props 和 emits
const props = defineProps({
	options: Object,
	value: String,
	style: String,
});

const emit = defineEmits(['update:value']);

// 计算属性来处理 v-model
const selectedValue = computed({
	get: () => props.value,
	set: (val) => emit('update:value', val)
});
</script>