<template>
  <a-modal
    v-model:open="isShow"
    :closable="false"
    centered width="220"
    okText="상품검색"
    cancelText="취소"
    @cancel="onCancel"
    @ok="onSubmit"
  >
    <template #title>
      <div style="display: flex;justify-content: space-between;">
        <div style="font-size: 18px;">상품검색 필터</div>
        <a-button type="primary" @click="resetParams">초기화</a-button>
      </div>
    </template>
    <div class="product-filter">
      <div>
        <h3 class="field-label">상품수집마켓</h3>
        <a-radio-group v-model:value="searchParams.market_code" :options="marketOptions" />
      </div>

      <div>
        <h3 class="field-label">처리상태</h3>
        <a-radio-group v-model:value="searchParams.sync_status" :options="statusOptions" />
      </div>

      <div>
        <h3 class="field-label">수집조회</h3>
        <date-range v-model:start="searchParams.start_time" v-model:end="searchParams.end_time" />
      </div>
      <div>
        <h3 class="field-label">연동조회</h3>
        <date-range v-model:start="searchParams.start_time" v-model:end="searchParams.end_time" />
      </div>
      <div>
        <h3 class="field-label">수정조회</h3>
        <date-range v-model:start="searchParams.start_time" v-model:end="searchParams.end_time" />
      </div>
      <div>
        <h3 style="font-weight: bold;">상품코드</h3>
        <a-input style="width: 100%" placeholder="다중검색은 콤마,로 구분하세요." />
      </div>

      <div>
        <h3 style="font-weight: bold;">품목코드</h3>
        <a-input style="width: 100%" placeholder="다중검색은 콤마,로 구분하세요." />
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {inject, toRefs} from "vue";
import DateRange from "@/views/Product/List/ProductFilter/DateRange.vue";
import {ServiceProduct} from "@/services/product/ServiceProduct";

const props = defineProps(['isShow'])
const emit = defineEmits(['update:isShow', 'search'])
const {isShow} = toRefs(props)
const {searchParams} = inject('search')

function resetParams() {
  const defaultParams = ServiceProduct.defaultParams()
  // 保留分页信息，避免filter没有提交的情况下影响当前的 page 信息
  defaultParams.page = searchParams.value.page
  defaultParams.limit = searchParams.value.limit
  // 保留商品名搜索的内容，提交时才清空。
  defaultParams.keyword = searchParams.value.keyword || ''

  searchParams.value = defaultParams
}

function onCancel() {
  emit('update:isShow', false)
}

function onSubmit() {
  onCancel()
  emit('search')
}
// 상품수집마켓
const marketOptions = [
    {
      label: "전체",
      value: "all"
    },
    {
      label: "Taobao",
      value: "Taobao"
    },
    {
      label: "Tmall",
      value: "Tmall"
    },
    {
      label: "Alibaba",
      value: "Alibaba"
    },
    {
      label: "Aliexpress",
      value: "Aliexpress"
    },
  ]
// 처리상태
const statusOptions = [
  {
    label: "전체",
    value: "all"
  },
  {
    label: "연동성공",
    value: "1"
  },
  {
    label: "연동실패",
    value: "0"
  },
  {
    label: "연동전",
    value: "2"
  }
]
</script>

<style scoped>
.product-filter {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 15px
}

.field-label {
  font-weight: bold;
  letter-spacing: -0.1em;
}
</style>
