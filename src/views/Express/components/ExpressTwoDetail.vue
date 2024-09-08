<template>
	<a-modal
		width="100%"
		wrap-class-name="full-modal"
		class="expressTwoModal"
		:footer="null"
    :closable="false"
		v-model:open="visible"
    @cancel="visible = false"
	>
    <a-flex justify="space-between" class="action">
      <a-flex gap="10">
        <a-button shape="round" ghost>수정</a-button>
        <a-button shape="round" ghost>출고</a-button>
        <a-button shape="round" ghost>삭제</a-button>
      </a-flex>
      <a-button shape="round" class="close bg-535660">목록</a-button>
    </a-flex>
    <a-flex>

    </a-flex>
	</a-modal>
</template>
<script setup>
import { computed, watch } from "vue";
const emit = defineEmits(["close"]);
const props = defineProps({
  visible: Boolean,
  bridgeDetail: {
    type: Object
  }
});
let visible = computed({
  get: () => props.visible,
  set: (value) => emit("close")
});


</script>
<style>
.expressTwoModal .ant-modal-content{
  background: #f1f3f8;
  padding: 40px 100px;
}
</style>
<style scoped>
.action button{
  border: 1px solid #cfd2da;
  color: #3F4249;
  font-size: 14px;
}
.action button:hover{
  border: 1px solid #2755F9;
  color: #2755F9;
}
.action .close{
  color:white;
}
</style>