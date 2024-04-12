<template>
  <a-modal v-model:open="data.show" title="주문내역 등록" width="1000px" @ok="onSubmit" @cancel="data.show = false">

    <a-card title="주문내역 등록" :bordered="false"
    >
      <p>* 복사된 상품정보 일부가 누락 또는 잘못 복사될 수 있으니 등록 후 , 상품 정보를 확인하시기 바랍니다.</p>
      <a-form
        :model="state"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :border="true"
      >
        <a-form-item label="사이트">
          <a-radio-group v-model:value="state.site">
            <a-radio value="">선택</a-radio>
            <a-radio value="taobao">타오바오</a-radio>
            <a-radio value="alibaba">1688</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="주문내역">
          <a-input v-model:value="state.parseText" id="pasteArea" placeholder="주문을 복사하여 붙혀넣기 해주세요." @focus="onParse" />
          <div v-html="pasteValue" style="display: flex; width: 100%;overflow: hidden">

          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import { useMarketOrderParser } from "@/util/parseMarketOrder";
import {message} from "ant-design-vue";
const { parser } = useMarketOrderParser();
const data = defineModel()

const state = reactive({
  site: "",
  parseText: ""
});

const pasteValue = ref("");
const onSubmit = () => {
  try {
    data.value.orderData = parser(state.site, pasteValue.value);
    data.value.show = false;
  } catch (e) {
    console.log(e)
    message.error('주문내역을 가져올 수 없습니다. 주문내역의 영역을 잘 선택하여 복사 한 후 붙여넣으시기 바랍니다.');
  }
};

const onParse = () => {
  document.getElementById("pasteArea").addEventListener("paste", function(e) {
    e.preventDefault(); // 기본 붙여넣기 동작 방지

    let text = "";
    if (e.clipboardData || window.clipboardData) {
      text = (e.clipboardData || window.clipboardData).getData("text/html");
    }
    pasteValue.value = text;
  });
}

</script>