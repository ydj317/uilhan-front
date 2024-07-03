<template>


  <a-modal
    v-model:open="props.visible"
    title="상품 구매링크"
    width="50%"
    :footer="null"
    @cancel=" emit('update:updateData', {visible: false})"
  >

    <loading v-model:active="linkLoading" :can-cancel="false" :is-full-page="true" />
    <div>
      <a-textarea
          :rows="5"
        v-model:value="link"
        placeholder="링크 URL"
        style="margin-bottom: 10px;"
      />
      <div style="display: flex; justify-content: center;">
        <a-button type="primary" @click="updateLink">저장</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {defineProps, defineEmits, ref, watch} from 'vue'
import {useProductApi} from "@/api/product";
import { message } from 'ant-design-vue';
import Loading from "vue-loading-overlay";

const props = defineProps(['product', 'visible'])
const emit = defineEmits(['update:updateData'])
const link = ref('');
let linkLoading = ref(false);

watch(() => props.visible, () => {
  link.value = props.product.item_url;
})

const updateLink = async () => {

  if(!isValidUrl(link.value)){
    message.error('정확한 URL을 입력해주세요.');
    return false;
  }

  const params = {
    item_id: props.product.item_id,
    item_url: link.value
  }

  if (link.value) {
    linkLoading.value = true;
    await useProductApi().updatePrdUrl(params).then(res => {
      console.log(res)
      if (res.status !== "2000") {
        message.error(res.message);
        linkLoading.value = false;
        return false;
      }

      message.success(res.message);
      linkLoading.value = false;
      let updateData = {
        visible: false,
        ...res.data
      }
      emit('update:updateData', updateData);
    }).finally(() => {
      link.value = ''
    });
  }
}

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

</script>

<style scoped>

</style>