<template>
  <div>
    <a-modal v-model:visible="product.text_trans_visible" title="Basic Modal" @ok="textTranslate">
      <a-radio-group v-model:value="product.toLang">
        <a-radio  value="ko">to Korea</a-radio>
        <a-radio  value="ja">to Japan</a-radio>
        <a-radio  value="en">to English</a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script>
import {lib} from 'util/lib';
import {AuthRequest} from 'util/request';
import {mapState} from 'vuex';

export default {
  computed: {
    ...mapState([
      'product',
    ])
  },

  methods: {
    textTranslate() {
      this.product.loading = true;

      let param = {
        item_name: this.product.item_name,
      };

      if (!lib.isEmpty(this.product.item_option, true)) {
        param.item_option = this.product.item_option;
      }

      if (!lib.isEmpty(this.product.sku, true)) {
        param.item_sku = this.product.sku;
      }

      if (!lib.isEmpty(this.product.item_info, true)) {
        param.item_info = this.product.item_info;
      }

      if (!lib.isEmpty(this.product.item_cross_border, true)) {
        param.item_cross_border = this.product.item_cross_border;
      }

      param.to = this.product.toLang;

      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/transtext', param).then((res) => {
        if (lib.isEmpty(res.status, true) || res.status !== 200) {
          alert('텍스트 번역 실패');
          this.product.loading = false;
          return false;
        }

        this.product.item_trans_name = res.data.item_trans_name;
        this.product.sku = res.data.item_sku;
        this.product.item_option = res.data.item_option;
        this.product.item_info = res.data.item_info;
        this.product.item_cross_border = res.data.item_cross_border;

        if (!lib.isEmpty(this.product.item_detail, true)) {
          this.product.item_detail = res.data.detailSpec + this.product.item_detail;
        }

        this.product.toLang = 'ko';
        this.product.item_is_trans = true;
        this.product.text_trans_visible = false;
        this.product.loading = false;
      });
    },
  }
};
</script>

<style scoped>

</style>