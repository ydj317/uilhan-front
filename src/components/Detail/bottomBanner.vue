<template>
  <div>
    <a-affix :offset-bottom="10">
      <div>
        <a-button type="primary" @click="textTranslateSwicth"
          >텍스트 번역</a-button
        >
        <a-button type="primary" @click="submit">저장</a-button>
        <a-button type="primary" @click="backList">목록</a-button>
      </div>
    </a-affix>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { AuthRequest } from "@/util/request";
import router from "@/router";
import { lib } from "@/util/lib";

export default {
  computed: {
    ...mapState(["product"]),
  },

  methods: {
    /**
     * 번역 팝업열기
     * @returns {boolean}
     */
    textTranslateSwicth() {
      if (this.product.item_is_trans === true) {
        alert("이미 번역한 상품입니다.");
        return false;
      }

      this.product.text_trans_visible = true;
    },

    /**
     * 리스트로 가기
     */
    backList() {
      router.push("/product");
    },

    /**
     * 뭐하는건지 모르겠음
     * @returns {boolean}
     */
    checkMarket() {
      if (this.product.isSync === false) {
        return false;
      }

      let cate = this.product.formState.last_cate;

      if (cate === undefined || cate === null || cate.length === 0) {
        alert("카테고리를 선택해주세요");
        return false;
      }

      let mandatoryVal = this.product.formState.mandatory_val;

      if (mandatoryVal === "선택") {
        alert("상품고시정보를 선택해주세요");
        return false;
      }

      let cont = this.product.formState.keyword;
      if (cont !== null && cont.length > 255) {
        alert(
          "키워드는 최대 (255)자내로 입력하시길 바랍니다.\n현재입력수(" +
            cont.length +
            ")"
        );
        return false;
      }

      let dlvTemp = this.product.formState.delivery_template_real_val;
      if (dlvTemp === null || dlvTemp === "선택") {
        alert("배송정책정보를 선택해주십시오");
        return false;
      }

      return true;
    },

    /**
     * 상품저장
     * @returns {boolean}
     */
    submit() {
      this.product.loading = true;

      let send = this.checkMarket();

      //연동필수데이터 없는 상황
      if (this.product.isSync === true && send === false) {
        this.product.loading = false;
        return false;
      }

      // 태그 제거 (사양)
      let sItemDetail = this.product.item_detail;
      sItemDetail = sItemDetail.replaceAll(
        '<p style="display: flex; flex-flow: column nowrap; align-items: center;">',
        ""
      );
      sItemDetail = sItemDetail.replaceAll("<p>", "");
      sItemDetail = sItemDetail.replaceAll("</p>", "");
      this.product.item_detail = sItemDetail;

      let oForm = new FormData();
      oForm = this.getForm(oForm, send);

      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/prdup", oForm).then(
        (res) => {
          if (res.status === undefined || res.status !== "2000") {
            alert(res.message);
            this.product.loading = false;
            return false;
          }

          this.product.sku = res.data.sku;
          let aTempItemThumbnails = res.data.item_thumb || [];
          this.product.item_detail = res.data.item_detail;

          for (let i = 0; i < this.product.sku.length; i++) {
            this.product.sku[i].checked = false;
          }

          let aItemThumbnails = [];
          for (let i = 0; i < aTempItemThumbnails.length; i++) {
            aItemThumbnails.push({
              url: aTempItemThumbnails[i],
              order: i + 1,
              checked: false,
              visible: false,
            });
          }
          this.product.item_thumbnails = aItemThumbnails;

          alert("저장 성공");
          this.product.loading = false;
        }
      );
    },

    getForm(oForm, send) {
      let oProduct = this.product;
      let oFormState = oProduct.formState;

      if (this.product.isSync === true && send === true) {
        oForm = this.setForm(oForm, {
          cate: oFormState.last_cate,
          surtax: oFormState.surtax,
          keyword: oFormState.keyword,
          mandatory_val: oFormState.mandatory_val,
          delivery_template: oFormState.delivery_template_real_val,
        });
      }

      oForm = this.setForm(oForm, {
        id: oProduct["item_id"],
        sku: JSON.stringify(oProduct.sku),
        // rate: oProduct.rate_default,
        info: oProduct.item_info,
        name: oProduct.item_name,
        spec: JSON.stringify(oProduct.item_option),
        stock: oProduct["item_stock"],
        image: JSON.stringify(oProduct.item_thumbnails),
        detail: oProduct.item_detail,
        use_sync: oProduct.isSync,
        trans_name: oProduct.item_trans_name,
        trans_status: oProduct.item_is_trans,
        cross_border: oProduct.item_cross_border,

        // 새로추가한 마진
        item_disp_margin_option: oProduct.item_disp_margin_option,
        item_selling_margin_option: oProduct.item_selling_margin_option,
        item_wholesale_margin_option: oProduct.item_wholesale_margin_option,
        item_rate_margin_option: oProduct.item_rate_margin_option,
      });

      return oForm;
    },

    setForm(oForm, oFormData) {
      Object.keys(oFormData).map((sField) => {
        oForm.append(sField, oFormData[sField]);
      });

      return oForm;
    },
  },
};
</script>

<style scoped>
div:last-child {
  display: flex;
  justify-content: center;
}
button {
  width: 150px;
  margin-left: 30px;
}
button:first-child {
  margin-left: 0;
}
</style>
