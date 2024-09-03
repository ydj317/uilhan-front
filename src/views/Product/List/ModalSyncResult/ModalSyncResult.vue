<template>
  <a-modal
    width="600px"
    :open="show"
    @update:open="$emit('update:show', false)"
    centered
    @cancel="closeAllModel"
  >
    <p v-if="syncResult.marketSyncResult">상품등록 요청에 성공하였습니다.</p>
    <p v-else>상품등록 요청에 실패하였습니다. <br />잠시 후 다시 진행해 주시기 바랍니다. </p>
    <template v-slot:footer>
      <a-button type="primary" @click="$emit('close')">닫기</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {message, Modal} from 'ant-design-vue';
const props = defineProps(['syncResult', 'show'])
const emit = defineEmits(['update:show', 'close'])

function closeAllModel() {
  Modal.destroyAll()
}
</script>
