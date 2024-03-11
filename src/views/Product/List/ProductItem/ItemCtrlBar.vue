<template>
  <div style="display: flex;justify-content: space-around;align-items: center;padding: 0 10px;margin-bottom: 10px;gap: 3px;">
    <a-button type="text" style="padding: 0">옵션편집</a-button>
    <a-divider type="vertical" style="margin: 0;padding: 0;background-color: #ffde3d "/>
    <a-button type="text" style="padding: 0">상세페이지 편집</a-button>
    <a-divider type="vertical" style="margin: 0;padding: 0;background-color: #ffde3d"/>
    <a-button type="text" style="padding: 0;"><strong>상품등록</strong></a-button>
    <a-popover v-model:open="product.moreActionVisible" trigger="click">
      <template #content>
        <div style="display: flex;flex-direction: column;gap: 3px;width: 120px;">
          <div style="display: flex;gap: 3px;align-items: center">
            <a-button type="primary" style="padding:1px 5px;margin: 0;height: auto">
              <FileTextOutlined/>
            </a-button>
            <a-button type="default" style="padding: 0;width: 100%" size="small" @click.prevent="showHistory({title: product.item_trans_name || product.item_name, type: 'product', index_id: product.item_id})">히스토리</a-button>
          </div>
          <div style="display: flex;gap: 3px">
            <btn-clone :selection="[product.item_id]">
              <a-button type="default" style="padding: 0;width: 100%" size="small">복사</a-button>
            </btn-clone>
            <btn-delete :delete-items="[product]" @popup="product.moreActionVisible = false" :full-width="true">
              <a-button type="default" style="padding: 0;width: 100%" size="small">삭제</a-button>
            </btn-delete>
          </div>
          <div style="display: flex;flex-direction: column;justify-content: center; align-items: center; gap: 3px;font-weight: bold;font-size: 9pt;margin-top: 5px;">
            <span>수집일</span>
            <span>2024-02-29 23:59</span>
            <span>연동일</span>
            <span>2024-02-29 23:59</span>
          </div>
          <div style="margin-top: 5px;">
            <a-button type="default" size="small" style="width: 100%" @click="product.moreActionVisible = false">닫기</a-button>
          </div>
        </div>
      </template>
      <a-button type="primary" style="border-radius: 50%;display: flex;align-items: center;justify-content: center;width: 20px;height: 20px;padding: 0 3px 6px 3px;">...</a-button>
    </a-popover>
  </div>
</template>

<script setup>
import {FileTextOutlined} from "@ant-design/icons-vue";
import BtnDelete from "@/views/Product/List/Ctrls/BtnDelete.vue";
import BtnClone from "@/views/Product/List/Ctrls/BtnClone.vue";
defineProps(['product'])


</script>

<style scoped>

</style>