<template>
  <div>
    <ul>
      <li v-for="(item,index) in displayCategorys" :key="index" @click="settingCategory(item)">{{ item.cateName }}</li>
    </ul>
  </div>
</template>

<script setup>

import {toRefs} from "vue";
import {useStore} from "vuex";

const store = useStore();
const { product } = toRefs(store.state);

const props = defineProps(
  {
    visible: Boolean,
    marketCode: String,
    sellerId: String,
    displayCategorys: {
      type: Array,
      default: () => []
    }
  }
)

const { visible, marketCode, sellerId, displayCategorys } = toRefs(props)

// 원클릭 카테고리 설정
const settingCategory = (item) => {
  console.log(item);
  //categoryValue.value = item.cate_ids
  // categoryValue.value = item.cate_names.join(' / ')
  // if (!product.value.item_cate) {
  //   product.value.item_cate = {}
  // }
  // product.value.item_cate[sellerId.value] = { marketCode: marketCode.value, cateId: item.cate_ids[item.cate_ids.length - 1], categoryNames: categoryValue.value }
}

</script>