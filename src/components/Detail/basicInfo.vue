<template>
  <div id="eModelTitle_0" class="p20 bg-white">
    <h1><strong>기본정보</strong></h1>

<!--    &lt;!&ndash;항목 리스트&ndash;&gt;-->
<!--    <div class="mb12" v-for="item in CONFIG">-->
<!--      <div v-if="!item.hide">-->
<!--        <p>{{ item.text }}</p>-->
<!--        <a-input class="mb12" v-if="item.editor" v-model:value="product[item.key]" :placeholder="`${item.text} 값을 입력하세요.`"/>-->
<!--        <a-alert class="mb12 bg-white" v-else :message="product[item.key]" type="info" />-->
<!--      </div>-->
<!--    </div>-->

    <div class="mb12" v-if="product.item_is_trans === false">
      <p>상품명칭</p>
      <a-input v-model:value="product.item_name" :placeholder="`상품명칭을 입력하세요.`"/>
    </div>

    <div class="mb12" v-else>
      <p>상품명칭</p>
      <a-input v-model:value="product.item_trans_name" :maxlength="max_name_length" :showCount="true" :placeholder="`상품명칭을 입력하세요.`"/>
    </div>

    <div>
      <p>수집마켓</p>
      <div class="row w15">
        <a-button type="primary" ghost><strong>코드: {{product.item_code}}</strong></a-button>
        <a-button class="ml5" type="primary" ghost @click="openWindow(product.item_url)"><strong>상세페이지</strong></a-button>
      </div>
    </div>

<!--    &lt;!&ndash;마켓 상품상세 바로가기 버튼&ndash;&gt;-->
<!--    <div class="mt20">-->
<!--      <a-button type="primary" ghost @click="openWindow(product.item_url)">-->
<!--        <strong>상품상세페이지</strong>-->
<!--      </a-button>-->
<!--    </div>-->
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
      max_name_length: 50,
      item_trans_name: '',
      "CONFIG": [
        {
          "key": "item_name",
          "text": "상품명칭",
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
    if (this.product.item_is_trans) {
      this.product.item_trans_name = this.product.item_trans_name.substr(0, this.max_name_length);
    }

    this.item_trans_name = this.product.item_trans_name;
  }
};


</script>

<style scoped></style>