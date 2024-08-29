<template>
  <a-modal v-model:open="isShow" :closable="false" centered width="220" okText="상품검색" cancelText="취소" @cancel="onCancel">
    <template #title>
      <div style="display: flex;justify-content: space-between;">
        <div style="font-size: 18px;">상품검색 필터</div>
        <a-button type="primary">초기화</a-button>
      </div>
    </template>
    <div style="display: flex;flex-direction: column;gap: 20px;margin-top: 15px">
      <div>
        <h3 style="font-weight: bold;letter-spacing: -0.1em;">상품수집마켓</h3>
        <a-radio-group>
          <a-radio value="a">전체</a-radio>
          <a-radio value="a">Taobao</a-radio>
          <a-radio value="a">Tmall</a-radio>
          <a-radio value="a">Alibaba</a-radio>
          <a-radio value="a">Aliexpress</a-radio>
          <a-radio value="a">Rakuten</a-radio>
          <a-radio value="a">Iherb</a-radio>
        </a-radio-group>
      </div>

      <div>
        <h3 style="font-weight: bold;letter-spacing: -0.1em;">처리상태</h3>
        <a-radio-group>
          <a-radio value="a">전체</a-radio>
          <a-radio value="a">연동성공</a-radio>
          <a-radio value="a">연동실패</a-radio>
          <a-radio value="a">연동전</a-radio>
        </a-radio-group>
      </div>

      <div>
        <h3 style="font-weight: bold;letter-spacing: -0.1em;">수집조회</h3>
        <a-range-picker style="width: 100%" />
        <div style="display: flex;justify-content: space-evenly;align-items: center;margin-top: 15px;border: 1px solid #dddddd; border-radius: 5px;">
          <a-button type="ghost">전체기간</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">오늘</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">일주일</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">1개월</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">3개월</a-button>
        </div>
      </div>

      <div>
        <h3 style="font-weight: bold;letter-spacing: -0.1em;">연동조회</h3>
        <a-range-picker style="width: 100%" />
        <div style="display: flex;justify-content: space-evenly;align-items: center;margin-top: 15px;border: 1px solid #dddddd; border-radius: 5px;">
          <a-button type="ghost">전체기간</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">오늘</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">일주일</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">1개월</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">3개월</a-button>
        </div>
      </div>

      <div>
        <h3 style="font-weight: bold;letter-spacing: -0.1em;">수정조회</h3>
        <a-range-picker style="width: 100%" />
        <div style="display: flex;justify-content: space-evenly;align-items: center;margin-top: 15px;border: 1px solid #dddddd; border-radius: 5px;">
          <a-button type="ghost">전체기간</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">오늘</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">일주일</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">1개월</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button type="ghost">3개월</a-button>
        </div>
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

import { toRefs } from "vue";

const props = defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])
const { isShow } = toRefs(props)

const onCancel = () => {
  emit('update:isShow', false)
}

</script>