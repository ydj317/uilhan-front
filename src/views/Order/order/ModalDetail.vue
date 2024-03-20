<template>
  <a-modal
      width="600px"
      v-model:open="memoData.show"
      centered title="주문상세정보"
      :afterClose="cancelEditMemo"
      :maskClosable="false"
  >

    <p>상세</p>


    <template v-slot:footer>
      <a-button type="primary" >닫기</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {toRefs} from "vue";
import {message} from "ant-design-vue";

const props = defineProps(['memoData'])
const {memoData} = toRefs(props)

function cancelEditMemo() {
  emit('update:memoData', {
    show: false,
    item_id: -1,
    memo: ''
  })
}

</script>

<style lang="scss" scoped>

</style>