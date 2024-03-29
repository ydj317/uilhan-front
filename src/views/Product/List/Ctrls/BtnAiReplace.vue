<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>
  <a-button type="default" @click="replaceWithAI">AI 추천모드</a-button>
</template>

<script setup>
import {ref} from "vue";
import {message} from "ant-design-vue";
import {useProductApi} from "@/api/product";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const props = defineProps(['selection'])

const indicator = ref(false)
async function replaceWithAI() {
  indicator.value = true;

  if (Array.isArray(props.selection) === false || props.selection.length === 0) {
    message.warning("선택된 상품이 없습니다.");
    indicator.value = false;
    return false;
  }

  await useProductApi().replaceWithAI({list: props.selection.join(',')}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
      return false;
    }

    indicator.value = false;
    message.success('상품명이 성공적으로 업데이트 되었습니다. ');

    window.location.reload()
  });
}
</script>
