<template>
  <div class="title">
    <h3><strong>상품관리</strong></h3>
    <a-button type="primary" @click="crawlProduct" >상품수집</a-button>
  </div>
  <a-divider style="margin: 10px 0;"/>
</template>

<script setup>

const crawlProduct = () => {
  // @todo
  console.log('---', '商品收集')
}

</script>

<style lang="css" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center
}
.title :deep(button) {
  background-color: #2171e2;color: white;
}
</style>