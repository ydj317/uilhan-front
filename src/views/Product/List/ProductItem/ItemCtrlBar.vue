<template>
  <div class="item-ctrl-bar">
    <div class="item-ctrl-bar__row">
      <a-button size="small" @click="$emit('detailOption')">옵션편집</a-button>
      <a-button size="small" @click="$emit('detailDesc')">상세페이지 편집</a-button>
      <a-button
        size="small"
        :type="!! product.item_memo ? 'primary' : 'default'"
        style="width: 32px;padding: 0;"
        @click="$emit('editMemo')"
      ><FileTextOutlined/></a-button>
    </div>
    <div class="item-ctrl-bar__row">
      <a-button size="small" type="primary" @click="$emit('send')" style="flex: 1 1 auto;"><strong>상품등록</strong></a-button>
      <a-popover v-model:open="product.moreActionVisible" trigger="click">
        <template #content>
          <div style="display: flex;flex-direction: column;gap: 3px;width: 120px;">
            <div style="display: flex;gap: 3px;align-items: center">
              <a-button
                type="default" style="padding: 0;width: 100%" size="small"
                @click.prevent.stop="historyVisible = true;">히스토리</a-button>
            </div>
            <div style="display: flex;gap: 3px">
              <btn-clone :selection="[product.item_id]">
                <a-button type="default" style="padding: 0;width: 100%" size="small">복사</a-button>
              </btn-clone>
              <btn-delete :delete-items="[product]" @popup="product.moreActionVisible = false" :full-width="true">
                <a-button type="default" style="padding: 0;width: 100%" size="small">삭제</a-button>
              </btn-delete>
            </div>
            <div class="time-info">
              <span>수집일</span>
              <span>{{product.item_ins?.slice(0, 16)}}</span>
              <span>연동일</span>
              <span>{{product.item_sync_date ? product.item_sync_date.slice(0, 16) : '—'}}</span>
            </div>
            <div style="margin-top: 5px;">
              <a-button type="default" size="small" style="width: 100%" @click="product.moreActionVisible = false">닫기</a-button>
            </div>
          </div>
        </template>
        <a-button size="small" type="primary" class="btn-more">...</a-button>
      </a-popover>
    </div>
  </div>
  <HistoryView :visible="historyVisible" @close="historyVisible = false" :historyData="historyData"/>
</template>

<script setup>
import {computed, ref} from "vue";
import BtnDelete from "@/views/Product/List/Ctrls/BtnDelete.vue";
import BtnClone from "@/views/Product/List/Ctrls/BtnClone.vue";
import HistoryView from "@/components/HistoryView.vue";
import {FileTextOutlined} from "@ant-design/icons-vue";

const props = defineProps(['product'])
defineEmits(['detailOption', 'detailDesc', 'editMemo', 'send'])

const historyVisible = ref(false)
const historyData = computed(() => {
  return {
    type: 'product',
    title: props.product.item_trans_name || props.product.item_name,

    index_id: props.product.item_id
  }
})


</script>

<style scoped>
.item-ctrl-bar {

}
.item-ctrl-bar__row {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;gap: 3px;
}
.btn-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width:26px;
  height: 26px;
  border-radius: 50%;
  font-size: 25px;
}
.btn-more:deep(span) {
  margin-top: -18px;
}
.time-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  font-weight: bold;
  font-size: 9pt;
  margin-top: 5px;
}
</style>