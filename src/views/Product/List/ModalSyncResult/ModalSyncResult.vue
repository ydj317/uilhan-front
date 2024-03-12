<template>
  <a-modal
    width="600px"
    v-model:open="syncResult.marketSyncPop"
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
      <a-button type="primary" @click="closeResultPop('multi')">확인</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {message, Modal} from 'ant-design-vue';
defineProps(['syncResult'])

function closeAllModel() {
  Modal.destroyAll()
}

function searchFailed() {
  if (this.marketSyncFailedCode.length === 0) {
    message.warning("연동실패한 상품이 없습니다.");
    return false;
  }

  // @todo
  // this.search_key = "item_code";
  // this.search_value = this.marketSyncFailedCode;
  // this.getList();

  // this.setResultPopData(false, []);
}

// @todo
function closeResultPop(type) {
  // if (type === "multi") {
  //   this.setResultPopData(false);
  // }
  // this.singleSyncPop = false;
  // this.singleDetail = [];
  // this.checkedList = [];
}

</script>
