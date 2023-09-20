<template>
  <a-cascader v-model:value="categoryValue" :options="options" placeholder="Please select" style="width: 100%"
              class="mb15"/>
  <div style="display: flex;flex-direction: column;gap: 10px">
    <div>패션/아웃도어/패딩</div>
  </div>
</template>

<script setup>
import { onMounted, ref} from "vue";
import {AuthRequest} from "@/util/request";

const { marketAccount, searchCategoryValue } = defineProps(['marketAccount', 'searchCategoryValue'])

const categoryValue = ref([])
const options = ref([]);

const getMarketCategory = () => {
  // useCategoryApi.getMarketCategoryList(marketAccount).then(res => {
  //   console.log('res', res)
  // })
  AuthRequest.get('https://mock.apifox.cn/m2/3318349-0-default/111776451', {
    params: {
      marketAccount: marketAccount.split('::')[0]
    }
  }).then(res => {
    options.value = res.data
    console.log('res', res)
  })
}
onMounted( async () => {
  await getMarketCategory()
  console.log('marketAccount', marketAccount)
  console.log('searchCategoryValue', searchCategoryValue)
})

/*onUpdated(async () => {
  await getMarketCategory()
  console.log('marketAccount', marketAccount)
  console.log('searchCategoryValue', searchCategoryValue)
})*/
</script>

<style scoped>

</style>