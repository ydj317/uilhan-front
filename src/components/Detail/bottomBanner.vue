<template>
  <div>
    <a-affix :offset-bottom="10">
      <div>
        <a-button type="primary" @click="textTranslateSwicth">텍스트 번역</a-button>
        <a-button type="primary" @click="submit">저장</a-button>
        <a-button type="primary" @click="backList">목록</a-button>
      </div>
    </a-affix>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {AuthRequest} from '../../util/request';
import router from '../../router';

export default {
  computed: {
    ...mapState([
      'product'
    ])
  },

  methods: {
    textTranslateSwicth() {
      if (this.product.item_is_trans === true) {
        alert('이미 번역한 상품입니다.');
        return false;
      }

      this.product.text_trans_visible = true;
    },

    backList() {
      router.push('/product');
    },

    checkMarket() {
      if (this.product.isSync === false) {
        return false;
      }

      let cate = this.product.formState.last_cate;

      if (cate === undefined || cate === null || cate.length === 0) {
        alert('카테고리를 선택해주세요');
        return false;
      }

      let mandatoryVal = this.product.formState.mandatory_val;

      if (mandatoryVal === '선택') {
        alert('상품고시정보를 선택해주세요');
        return false;
      }

      let cont = this.product.formState.keyword;
      if (cont !== null && cont.length > 255) {
        alert("키워드는 최대 (255)자내로 입력하시길 바랍니다.\n현재입력수(" + cont.length + ')');
        return false;
      }

      let dlvTemp = this.product.formState.delivery_template_val;
      if (dlvTemp === null || dlvTemp === '선택') {
        alert('배송정책정보를 선택해주십시오');
        return false;
      }

      return true;
    },

    submit() {
      let formData = new FormData();
      if (this.product.roles.indexOf('ROLE_RELAKET') > -1) {
        let send = this.checkMarket();

        //연동필수데이터 없는 상황
        if (this.product.isSync === true && send === false) {
          return false;
        }

        if (this.product.isSync === true && send === true) {
          formData.append('cate', this.product.formState.last_cate);
          // formData.append('listprice', this.product.formState.listprice);
          // formData.append('sellprice', this.product.formState.sellprice);
          formData.append('surtax', this.product.formState.surtax);
          formData.append('mandatory_val', this.product.formState.mandatory_val);
          formData.append('keyword', this.product.formState.keyword);
          formData.append('delivery_template', this.product.formState.delivery_template_real_val);
        }
      }

      this.product.loading = true;
      formData.append('use_sync', this.product.isSync);
      formData.append('id', this.product.item_id);
      formData.append('name', this.product.item_name);
      formData.append('spec', JSON.stringify(this.product.item_option));
      formData.append('info', this.product.item_info);
      formData.append('sku', JSON.stringify(this.product.sku));
      formData.append('detail', this.product.item_detail);
      formData.append('image', JSON.stringify(this.product.item_thumbnails));
      formData.append('margin', this.product.item_margin);
      formData.append('rate', this.product.item_rate);
      formData.append('stock', this.product.item_stock);
      formData.append('translate_status', this.product.item_is_trans);
      formData.append('trans_name', this.product.item_trans_name);
      formData.append('shipping_fee', this.product.item_shipping_fee);
      if (!/^[0-9]+$/.test(this.product.item_weight) ||
          !/^[0-9]+$/.test(this.product.item_depth) ||
          !/^[0-9]+$/.test(this.product.item_width) ||
          !/^[0-9]+$/.test(this.product.item_height)
      ) {
        alert('무게, 세로, 가로, 높이 값은 숫자로 입력하시길 바랍니다.');
        return false;
      }

      formData.append('weight', this.product.item_weight);
      formData.append('depth', this.product.item_depth);
      formData.append('width', this.product.item_width);
      formData.append('height', this.product.item_height);

      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/prdup', formData).then((res) => {
        if (res.status === undefined || res.status !== 200) {
          alert('저장 실패');
          this.product.loading = false;
          return false;
        }

        alert('저장 성공');
        this.product.loading = false;
      });
    },
  }

};
</script>

<style scoped>
div:last-child {
  display: flex;
  justify-content: center;
}
button {
  width: 150px;
  margin-left: 30px
}
button:first-child {
  margin-left: 0;
}
</style>