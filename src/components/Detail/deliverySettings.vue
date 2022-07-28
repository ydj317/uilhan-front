<template>
  <div id="eModelTitle_5" class="mt20 p20 bg-white">
    <h1><strong>배송설정</strong></h1>
    <div v-for="item in CONFIG">
      <p>{{ item.label }}</p>
      <label>
        <a-input v-model:value="product[item.value]" :placeholder="`${item.label} 값를 입력하여 주십시오`" />
      </label>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  computed: {
    ...mapState([
      'product'
    ])
  },

  data() {
    return {
      CONFIG: [
        {
          label: '무게',
          value: 'item_weight'
        },
        {
          label: '세로',
          value: 'item_depth'
        },
        {
          label: '가로',
          value: 'item_width'
        },
        {
          label: '높이',
          value: 'item_height'
        },
      ],
    }
  }
};
</script>

<style scoped>
.container div {
  margin-bottom: 12px;
}
</style>