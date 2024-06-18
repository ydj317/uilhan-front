<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>
  <span @click="deletePop" :style="fullWidth ? 'width: 100%' : ''">
    <slot>
      <a-button type="default" >삭제</a-button>
    </slot>
  </span>

  <a-modal width="800px" v-model:open="deletePrdPop" centered>
    <template #title>
      등록상품 삭제하기
      <a-tooltip>
        <template #title>
          <div>전체 삭제할 경우 리스트에서 상품이 삭제됩니다.</div>
        </template>
        <QuestionCircleOutlined/>
      </a-tooltip>
    </template>

    <div class="space-between">
      <div>선택한 상품의 삭제할 오픈마켓을 선택해 주세요.<br>11번가 / 롯데온 / 위메프는 상품 삭제를 지원하지 않아 "판매중지" 상태로 변경됩니다.</div>
      <div>
        <a-button style="margin-right: 10px;" @click="deleteCheckList = deleteOptions.map(option => option.value)">
          전체선택
        </a-button>
        <a-button @click="deleteCheckList = []">전체해제</a-button>
      </div>
    </div>

    <a-divider/>

    <div v-if="deleteOptions.length > 0">
      <a-checkbox-group v-model:value="deleteCheckList">
        <a-checkbox v-for="option in deleteOptions" :key="option.value" :value="option.value"
                    style="background: #e1ecfe; padding: 5px 8px 8px 12px; border-radius: 3px; margin: 5px 10px 5px 0;">
          <img :src="getLogoSrc('market-logo', option.market_code)" alt=""
               style="width: 16px; height: 16px; margin-right: 5px;">
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group>
    </div>

    <div style="color: red;" v-else>
      <a-empty>
        <template #description>
          <span>연동된 마켓이 없습니다. 리스트에서 상품을 삭제하시겠습니까?</span>
        </template>
      </a-empty>
    </div>

    <template v-slot:footer>
      <a-button type="primary" @click="deletePrd">삭제하기</a-button>
      <a-button @click="deletePrdPop = false">취소</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {ref, toRefs} from "vue";
import {message} from "ant-design-vue";
import {useProductApi} from "@/api/product";
import {getLogoSrc} from "@/util/functions";
import {QuestionCircleOutlined} from "@ant-design/icons-vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const props = defineProps(['deleteItems', 'fullWidth'])
const emit = defineEmits(['popup'])
const {deleteItems} = toRefs(props)

const indicator = ref(false)
const deleteOptions = ref([])
const deletePrdPop = ref(false)
const deleteCheckList = ref([])
function deletePop() {
  if (deleteItems.value.length === 0) {
    message.warning("선택된 상품이 없습니다.");
    return false;
  }

  deleteOptions.value = Object.values(
    deleteItems.value.flatMap(item => item['item_sync_market'])
    .reduce((acc, syncItem) => {
      const key = syncItem.id;
      if (!acc[key] && syncItem.status !== 'unsync' && syncItem.market_prd_code !== null) {
        acc[key] = {
          market_code: syncItem.market_code,
          label: syncItem.seller_id,
          value: syncItem.id
        };
      }
      return acc;
    }, {})
  );

  deletePrdPop.value = true;
  emit('popup')
}
async function deletePrd() {
  // 연동 마켓이 있을때 선택한 마켓이 없으면 선택하도록 얼럿
  if (deleteOptions.value.length > 0 && deleteCheckList.value.length === 0) {
    message.warning("삭제할 마켓을 선택해주세요.");
    return false;
  }

  // 1. 연동 마켓이 없을때
  // ㄴ리스트에서 상품삭제

  // 2. 연동 마켓이 있을때
  // ㄴ부분 마켓선택시 선택된 마켓만 삭제
  // ㄴ전체 선택시 선택된 마켓 삭제 및 리스트에서 상품삭제
  indicator.value = true;
  await useProductApi().deletePrd({
    'deleteItems': deleteItems.value,
    'deleteCheckList': deleteCheckList.value
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    window.location.reload()
  }).finally(() => {
    indicator.value = false;
  });
  return true;
}
</script>
