<template>
  <div>
    <h4 style="margin-top: 10px;"><strong>전시카테고리</strong></h4>
    <div style="display: flex;flex-direction: column;gap: 10px" class="mt15" v-if="displayCategorys.length > 0">
      <template v-for="(item, key) in displayCategorys" :key="key">
        <div>
          <a-typography-link @click="settingCategory(item)">
            {{ item.cate_names.join(' / ') }}
          </a-typography-link>
        </div>
      </template>
    </div>
    <a-cascader disabled style="margin-top: 10px; width: 100%; " v-model:value="displayCategoryValue" :options="displayCategorys" placeholder="마켓별 전시카테고리를 선택해 주세요." />
  </div>
</template>

<script setup>

import {computed, toRefs} from "vue";
import {useStore} from "vuex";
import { ref } from 'vue';

const store = useStore()
const product = computed(() => store.state.product.detail)
const displayCategoryValue = ref([])
const props = defineProps(
  {
    visible: Boolean,
    marketCode: String,
    sellerId: String,
    displayCategorys: {
      type: Array,
      default: () => []
    },
  }
)

const { visible, marketCode, sellerId, displayCategorys } = toRefs(props)

// 원클릭 카테고리 설정
const settingCategory = (item) => {
  displayCategoryValue.value = item.cate_names.join(' / ')
  if (!product.value.item_cate) {
    product.value.item_disp_cate = {}
  }
  let accountName = marketCode.value + '|' + sellerId.value
  product.value.item_disp_cate[accountName] = { marketCode: marketCode.value, cateId: item.cate_ids[item.cate_ids.length - 1], categoryNames: displayCategoryValue.value }
}

// const parseOptions = (categorys) => {
//   console.log(categorys);
//   const result = []
//   categorys.forEach((item) => {
//     const items = []
//     item.cate_ids.forEach((cate_id, index) => {
//       items.push({
//         value: cate_id,
//         label: item.cate_ids[index],
//         cate_names: item.cate_ids[index],
//         cate_ids: cate_id,
//         children: item.children ? parseOptions(item.children) : []
//       })
//     })
//     result.push(items)
//   })
//   return result
// }

</script>