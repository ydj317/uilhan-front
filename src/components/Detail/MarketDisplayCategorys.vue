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
    <div style="display: flex;align-items: flex-end;gap: 10px;">
      <a-cascader
        disabled
        style="margin-top: 10px; width: 100%; "
        :value="displayCategoryValue"
        :options="displayCategorys"
        placeholder="마켓별 전시카테고리를 선택해 주세요."
      />
      <CloseCircleTwoTone
        two-tone-color="#eb2f96"
        style="cursor: pointer;margin-bottom: 10px"
        @click="removeDispCategory()"
        v-if="! marketPrdCode"
        v-show="product.item_disp_cate && product.item_disp_cate[getAccountName()]"
      />
    </div>
  </div>
</template>

<script setup>

import {computed, toRefs} from "vue";
import {useStore} from "vuex";
import {CloseCircleTwoTone} from "@ant-design/icons-vue";

const store = useStore()
const product = computed(() => store.state.product.detail)
const displayCategoryValue = computed(() => {
  if (! product.value.item_disp_cate) return []
  if (! product.value.item_disp_cate[getAccountName()]) return []
  return [product.value.item_disp_cate[getAccountName()].categoryNames]

})
const props = defineProps(
  {
    visible: Boolean,
    marketCode: String,
    sellerId: String,
    marketPrdCode: String,
    displayCategorys: {
      type: Array,
      default: () => []
    },
  }
)

const { visible, marketCode, sellerId, displayCategorys } = toRefs(props)

// 원클릭 카테고리 설정
const settingCategory = (item) => {
  if (!product.value.item_disp_cate) {
    product.value.item_disp_cate = {}
  }
  let accountName = getAccountName()
  product.value.item_disp_cate[accountName] = {
    marketCode: marketCode.value,
    cateId: item.cate_ids[item.cate_ids.length - 1],
    categoryNames: item.cate_names.join(' / ')
  }
}

const removeDispCategory = () => {
  delete product.value.item_disp_cate[getAccountName()];
}

function getAccountName() {
  return marketCode.value + '|' + sellerId.value
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