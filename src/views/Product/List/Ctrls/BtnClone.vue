<template>
  <a-popconfirm
    class="button-blue"
    :open="copyPrdVisible"
    @confirm="clonePrd()"
    @openChange="handleCopyPrdVisibleChange"
    @cancel="clonePrdCancel"
    ok-text="확인"
    cancel-text="취소"
  >
    <template #title>
      <b>상품 복사 확인</b>
      <br>
      <span>선택한 상품을 복사하시겠습니까?</span>
      <br>
      <span style="font-size: 12px; color: #999;">*복사 된 상품은 최상단으로 이동합니다.</span>
    </template>
    <slot><a-button type="default" >복사</a-button></slot>
  </a-popconfirm>
</template>

<script setup>
import {ref, toRefs} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";

const props = defineProps(['selection'])
const {selection} = toRefs(props)
const copyPrdCondition = ref(true)
const copyPrdVisible = ref(false)

function clonePrd() {
  copyPrdVisible.value = true
  if(copyPrdCondition.value === false) return;
  AuthRequest.post(process.env.VUE_APP_API_URL + '/api/clone', selection.value.join(',')).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    window.location.reload()
  });
}

function clonePrdCancel(){
  copyPrdVisible.value = false;
}

function handleCopyPrdVisibleChange(bool){
  if (!bool) {
    copyPrdVisible.value = false
    return;
  }

  if (selection.value.length === 0) {
    message.warning("선택된 상품이 없습니다.");
    copyPrdCondition.value = false
    return false;
  } else {
    copyPrdVisible.value = true
  }

}


</script>
