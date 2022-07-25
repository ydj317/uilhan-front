<template>
  <div id="eModelTitle_0" class="_container">
    <h1><strong>기본정보</strong></h1>

    <!--항목 리스트-->
    <div class="item" v-for="item in CONFIG">
      <div v-if="!item.hide">
        <p>{{ item.text }}</p>
        <a-input class="item" v-if="item.editor" v-model:value="product[item.key]" :placeholder="`${item.text} 값을 입력하세요.`"/>
        <a-alert class="item not_editor" v-else :message="product[item.key]" type="info" />
      </div>
    </div>

    <!--마켓 상품상세 바로가기 버튼-->
    <div class="button">
      <a-button type="primary" ghost @click="openWindow(product.item_url)">
        <strong>상품상세페이지</strong>
      </a-button>
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
      item_trans_name: '',
      "CONFIG": [
        {
          "key": "item_name",
          "text": "상품명",
          "editor": true
        },
        {
          "key": "item_trans_name",
          "text": "번역 상품명",
          "editor": true,
          "hide": !this.item_trans_name,
        },
        {
          "key": "item_stock",
          "text": "재고",
          "editor": true
        },
        {
          "key": "item_code",
          "text": "상품 코드",
          "editor": false
        },
        {
          "key": "item_lan",
          "text": "원산지",
          "editor": false
        },
        {
          "key": "item_market",
          "text": "마켓",
          "editor": false
        }
      ]
    }
  },

  methods: {
    openWindow: sUrl => open(sUrl),
  },

  mounted() {
    this.item_trans_name = this.product.item_trans_name;
  }
};


</script>

<style scoped>
/*!*DEBUG*!*/
/*div {*/
/*  outline: 1px solid red;*/
/*}*/

.not_editor {
  background-color: #f0f2f5;
  border: none;
}
._container {
  background-color: white;
  margin:  0 24px 0 24px;
  padding: 40px 20px 1px 20px;
}

.item {
  margin-bottom: 12px;
}
.button {
  margin-top: 20px
}
</style>