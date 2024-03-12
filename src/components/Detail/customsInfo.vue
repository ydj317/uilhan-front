<template>
  <div id="eModelTitle_4" class="plrb20 bg-white">
    <h1><strong>통관정보</strong></h1>
    <a-textarea :rows="8" v-model:value="product.item_cross_border" placeholder="통관정보" />
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  computed: {
    ...mapState({
      product: state => state.product.detail
    })
  },
};
</script>