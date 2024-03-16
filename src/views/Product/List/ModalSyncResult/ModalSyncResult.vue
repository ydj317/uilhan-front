<template>
  <a-modal
    width="600px"
    :open="show"
    @update:open="$emit('update:show', false)"
    centered title="제휴사연동결과"
    @cancel="closeAllModel"
  >
    <h3><b>총{{ syncResult.marketSyncTotal }}개 상품 / 성공 {{ syncResult.marketSyncSuccess }} / 실패 {{ syncResult.marketSyncFailed }}</b></h3>
    <a-list v-if="syncResult.marketSyncResult.length > 0" :data-source="syncResult.marketSyncResult">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card :title="item.market_code + '::' + item.seller_id" style="width: 100%">
            <p v-for="( prd ) in item.products">{{ prd.prd_code }} - {{ prd.result }}</p>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <template v-slot:footer>
      <a-button type="primary" @click="searchFailed">실패상품검색</a-button>
      <a-button type="primary" @click="$emit('close')">확인</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {message, Modal} from 'ant-design-vue';
const props = defineProps(['syncResult', 'show'])
const emit = defineEmits(['update:show', 'searchFail', 'close'])

function closeAllModel() {
  Modal.destroyAll()
}

function searchFailed() {
  if (! props.syncResult?.marketSyncFailedCode) {
    message.warning("연동실패한 상품이 없습니다.");
    return false;
  }
  emit('searchFail')
}
</script>
