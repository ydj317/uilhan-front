<template>
  <div id="eModelTitle_6" class="plrb20 bg-white">
    <h1><strong>간략설명</strong></h1>
    <a-textarea v-model:value="product.item_info" placeholder="간략설명" :rows="8" />
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  computed: {
    ...mapState({
      product: state => state.product.detail
    })
  }
};
</script>