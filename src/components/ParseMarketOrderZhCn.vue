<template>
  <a-card title="주문내역 등록" :bordered="false"


  >
    <p>* 복사된 상품정보 일부가 누락 또는 잘못 복사될 수 있으니 등록 후 , 상품 정보를 확인하시기 바랍니다.</p>
    <div v-html="state.parseText">
    </div>
    <a-form
      :model="state"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      :border="true"
    >
      <a-form-item label="사이트">
        <a-select v-model:value="state.site">
          <a-select-option value="">선택</a-select-option>
          <a-select-option value="taobao">타오바오</a-select-option>
          <a-select-option value="tmall">티엔모</a-select-option>
          <a-select-option value="alibaba">1688</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="주문내역">
        <a-input v-model:value="state.parseText" id="pasteArea" placeholder="주문을 복사하여 붙혀넣기 해주세요."/>
        <div v-html="pasteValue" style="display: flex; width: 100%;overflow: hidden">

        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="onSubmit">등록</a-button>
        <a-button type="primary" @click="parser">닫기</a-button>
      </a-form-item>
    </a-form>


  </a-card>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useMarketOrderParser } from '@/util/parseMarketOrder'

const { parser } = useMarketOrderParser()

const modal = defineModel();

const state = reactive({
  site: '',
  parseText: ''
})

const pasteValue = ref('')
const onSubmit = () => {
  const res = parser(state.site, pasteValue.value)
}

onMounted(() => {
  document.getElementById('pasteArea').addEventListener('paste', function(e) {
    e.preventDefault(); // 기본 붙여넣기 동작 방지

    let text = '';
    if (e.clipboardData || window.clipboardData) {
      text = (e.clipboardData || window.clipboardData).getData('text/html');
    }
    pasteValue.value = text;
  });
})
</script>

<style lang="scss" scoped>

</style>