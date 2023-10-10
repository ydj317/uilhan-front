<template>
  <div>
    <a-modal v-model:visible="product.text_trans_visible" title="텍스트 번역" @ok="textTranslate">
      <a-radio-group v-model:value="product.toLang">
        <a-radio  value="ko">to Korea</a-radio>
        <a-radio  value="ja">to Japan</a-radio>
        <a-radio  value="en">to English</a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script>
import {lib} from '@/util/lib';
import {AuthRequest} from '@/util/request';
import {mapState} from 'vuex';
import { message } from "ant-design-vue";

export default {
  computed: {
    ...mapState([
      'product',
    ])
  },

  methods: {
    // 옵션명 순위별로 sku 명을 재구성함
    initSkuSpecName() {
      // 옵션 索引
      let aOptionIndex = [];
      let aItemOptions = this.product.item_option;
      aItemOptions.map((aItemOption, i) => {
        aOptionIndex[i] = [];
        aItemOption.data.map(data => {
          aOptionIndex[i].push(data.name)
        })
      })

      // SKU 索引
      this.product.sku.map((sku, t) => {
        let oSkuName = {};
        let aSpec = sku.spec.split('::');
        aSpec.map(sSpec => {
          aOptionIndex.map((aOptionNames, i) => {
            if (aOptionNames.includes(sSpec)) {
              oSkuName[i] = sSpec;
            }
          })
        })

        this.product.sku[t].spec = Object.values(oSkuName).join('::');
      })
    },

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
        if (res.status !== '2000') {
          message.error(res.message);
          this.product.loading = false;
          return false;
        }

        // if (lib.isEmpty(res.status, true) || res.status !== 200) {
        //   message.warning('텍스트 번역 실패');
        //   this.product.loading = false;
        //   return false;
        // }

        this.product.item_trans_name = res.data.item_trans_name;
        this.product.sku = res.data.item_sku;
        this.product.item_option = res.data.item_option;
        this.product.item_info = res.data.item_info;
        this.product.item_cross_border = res.data.item_cross_border;

        /**
         * todo 로고 이미지가 더 추가됨
         */
        if (!lib.isEmpty(this.product.item_detail, true)) {
          let sItemDetaiContents = this.product.item_detail;
          // 로고가 존재하지 않을경우에만 추가
          if (sItemDetaiContents.indexOf(res.data.detailSpec) === -1) {
            this.product.item_detail = res.data.detailSpec + this.product.item_detail;
          }
        }

        this.product.item_trans_name = this.product.item_trans_name.substr(0, 50);

        this.initSkuSpecName();

        this.validateFilterWord(res.data.item_trans_name);

        this.product.toLang = 'ko';
        this.product.item_is_trans = true;
        this.product.text_trans_visible = false;
        this.product.loading = false;
      });
    },

    /**
     * 상품명  체크
     * @returns {boolean}
     */
    validateFilterWord(sTransProductName = "") {
      if (sTransProductName === "") return false;

      this.product.filter_word_validate_in_process = true;
      this.product.filter_word_status = false;
      this.product.filter_word_list = [];

      /* 등록 호출 */
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/filterword", {
        method: "check",
        product_name: sTransProductName,
      }).then((res) => {
        /* 등록실패여부 및 로딩제거 */
        if (res.status !== "2000") {
          message.warning(res.message);
          return false;
        }

        this.product.filter_word_status = true;
        this.product.filter_word_list = [];

        if (Array.isArray(res.data) && res.data.length > 0) {
          let aFilterWords = [];
          res.data.map((r) => {
            aFilterWords.push(r.filter_word);
          });

          this.product.filter_word_status = false;
          this.product.filter_word_list = aFilterWords;
        }

        this.product.filter_word_validate_in_process = false;
        message.success(" 체크완료");
      });
    },
  }
};
</script>

<style scoped></style>
