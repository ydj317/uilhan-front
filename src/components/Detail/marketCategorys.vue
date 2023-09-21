<template>
  <a-cascader v-model:value="categoryValue" :options="options" placeholder="Please select" style="width: 100%"
              class="mb15"/>
  <div style="display: flex;flex-direction: column;gap: 10px">
    <div>패션/아웃도어/패딩</div>
  </div>
</template>

<script setup>
import {onMounted, onUpdated, ref, toRefs, watch, watchEffect} from "vue";
import {useCategoryApi} from "@/api/category";

const props = defineProps(['marketAccount', 'modelValue'])
const { marketAccount, modelValue } = toRefs(props)

const categoryValue = ref([])
const options = ref([]);

const getMarketCategory = () => {
  useCategoryApi().getMarketCategoryList({marketAccount:marketAccount.value.split('::')[0]}).then(res => {
    options.value = res.data
  })

}

onMounted( async () => {
  await getMarketCategory()
})

// watchEffect searchCategoryValue
watchEffect(() => {

  if(modelValue.value !=='') {
    console.log('searchCategoryValue', modelValue.value)
  }
})


onUpdated(async () => {

})
</script>

<style scoped>

</style>