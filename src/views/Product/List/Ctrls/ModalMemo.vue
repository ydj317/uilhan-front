<template>
  <a-modal
    width="600px"
    v-model:open="memoData.show"
    centered title="상품 메모"
    :afterClose="cancelEditMemo"
    :maskClosable="false"
  >
    <a-textarea
      show-count :maxlength="500"
      v-model:value="memoData.memo"
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
import {toRefs} from "vue";
import {useProductApi} from "@/api/product";
import {message} from "ant-design-vue";

const props = defineProps(['memoData'])
const emit = defineEmits(['update:memoData', 'beforeSave', 'afterSave'])
const {memoData} = toRefs(props)

function cancelEditMemo() {
  emit('update:memoData', {
    show: false,
    item_id: -1,
    memo: ''
  })
}

function savePrdMemo() {
  emit('beforeSave')
  useProductApi().savePrdMemo(memoData.value).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success('메모가 저장되었습니다.');
    cancelEditMemo()
    emit('afterSave')
  });
}

</script>

<style lang="scss" scoped>

</style>