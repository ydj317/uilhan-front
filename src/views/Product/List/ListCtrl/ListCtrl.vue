<template>
  <div class="action-tool" :class="{disabled}">
    <div class="button-group">
      <a-checkbox
        :indeterminate="selectPart"
        :checked="selectAll"
        @change="$emit('toggleSelect')"
      />
      <a-button type="primary" @click="$emit('showFilter')">필터</a-button>
      <a-divider type="vertical"/>
      <div><strong>선택한 상품</strong></div>
      <a-button type="primary" >삭제</a-button>
      <a-button type="primary" >복사</a-button>
      <a-button type="primary" >상품등록</a-button>
      <a-button type="primary" v-if="userinfo?.use_ai === '1'" @click="replaceWithAI">AI 추천모드</a-button>
    </div>
    <div class="search">
      <a-input-search placeholder="검색어를 입력하세요" enter-button="검색" style="width: 300px" />
    </div>
  </div>
</template>

<script setup>
import {toRefs} from "vue";

const props = defineProps(['disabled', 'userinfo', 'selectPart', 'selectAll'])
defineEmits(['showFilter', 'toggleSelect'])
const {selectAll, selectPart} = toRefs(props)

const replaceWithAI = () => {
  console.log('---', 'replace white AI')
}

</script>

<style scoped>
.action-tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-tool.disabled {
  opacity: .5;
  pointer-events: none;
}

.button-group {
  flex: auto;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>