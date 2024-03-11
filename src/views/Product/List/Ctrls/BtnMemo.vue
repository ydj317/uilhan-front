<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>
  <a-button
    :type="!! product.item_memo ? 'primary' : 'default'"
    style="width: 32px;padding: 0;"
    @click="editPrdMemo"
  ><FileTextOutlined/></a-button>
  <a-modal
    width="600px"
    v-model:open="prdMemoData.openPop"
    centered title="상품 메모"
    :afterClose="cancelEditMemo"
    :maskClosable="false"
  >
    <a-textarea
      show-count :maxlength="500"
      v-model:value="prdMemoData.memo"
      placeholder="메모를 입력해주세요."
      :auto-size="{ minRows: 15, maxRows: 15 }"
    />
    <br>

    <template v-slot:footer>
      <a-button @click="cancelEditMemo">취소</a-button>
      <a-button type="primary" @click="savePrdMemo">저장</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {FileTextOutlined} from "@ant-design/icons-vue";
import {computed, ref} from "vue";
import {useProductApi} from "@/api/product";
import {message} from "ant-design-vue";
import Loading from "vue-loading-overlay";
const props = defineProps(['product'])
const indicator = ref(false)
const showPopup = ref(false)
const prdMemoData = computed(() => ({
  item_id: props.product.item_id,
  memo: props.product.item_memo
}))

function editPrdMemo() {
  showPopup.value = true
}

function cancelEditMemo() {
  showPopup.value = false
}

async function savePrdMemo () {
  indicator.value = true;
  await useProductApi().savePrdMemo(prdMemoData.value).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      this.indicator = false;
      return false;
    }

    message.success('메모가 저장되었습니다.');
    indicator.value = false;
    cancelEditMemo()
    // this.getList(); // @todo
  });
}

</script>
