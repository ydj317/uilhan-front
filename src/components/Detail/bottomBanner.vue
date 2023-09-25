<template>
  <div class="currentDiv">
    <a-affix :offset-bottom="0">
      <div class="currentDiv" style="background-color: white;padding: 10px;border-top: 1px solid #eeeeee;">
        <!--        <a-button type="primary" @click="textTranslateSwicth"-->
        <!--          >텍스트 번역</a-button-->
        <!--        >-->
        <a-button type="primary" @click="submit">저장</a-button>
        <a-button type="primary" @click="submitSync">연동</a-button>
        <a-button type="primary" @click="backList">목록</a-button>
      </div>
    </a-affix>

    <!--제휴사 상품연동-->
    <a-modal :maskClosable="false" v-model:visible="singleSyncPop" class="col w50">
      <h3><strong>제휴사 상품연동</strong></h3>
      <a-table
        class="tableSyncStatus"
        :dataSource="this.product.item_sync_market"
        :columns="SYNC_COLUMNS_CONFIG"
      >

        <!--table header-->
        <template v-slot:headerCell="{ text, record, index, column }">
          <!--전체선택-->
          <template v-if="column.key === 'checked'">
            <a-checkbox v-model:checked="checkAll" @click="checkAllMarket(checkAll)"></a-checkbox>
          </template>
        </template>

        <!--table body-->
        <template v-slot:bodyCell="{ text, record, index, column }">
          <!--단일선택-->
          <template v-if="column.key === 'checked'">
            <a-checkbox v-model:checked="record.checked"></a-checkbox>
          </template>

          <!--연동계정-->
          <template v-if="column.key === 'market_account'">
            연동계정 : {{ record.market_account }}
          </template>

          <!--상태-->
          <template v-if="column.key === 'status'">
            <div class="syncStatus" :data-status="record.status">
              {{ { "sending": "전송중", "success": "성공", "failed": "실패", "unsync": "미연동" }[record.status] }}<span
              v-if="record.status === 'failed'"> 실패원인: {{ record.result }}</span>
            </div>
          </template>

          <!--연동시간-->
          <template v-if="column.key === 'ins_time'">
            <div v-if="record.status !== 'unsync'">
              <div v-if="!record.upd_time">{{ record.ins_time }}</div>
              <div v-else>{{ record.upd_time }}</div>
            </div>
          </template>
        </template>

      </a-table>

      <template v-slot:footer>
        <a-button type="primary" @click="testsync()">선택제휴사연동</a-button>
        <a-button type="primary" @click="closeResultPop()" class="bg-697783">닫기</a-button>
      </template>
    </a-modal>

    <!--제휴사 연동결과-->
    <a-modal width="600px" :maskClosable="false" v-model:visible="marketSyncPop" title="제휴사연동결과" @ok="">
      <h3><b>총{{ marketSyncTotal }}개 상품 / 성공 {{ marketSyncSuccess }} / 실패 {{ marketSyncFailed }}</b></h3>
      <a-list v-if="marketSyncResult.length > 0" :data-source="marketSyncResult">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.market_account" style="width: 100%">
              <p v-for="( prd ) in item.products">{{ prd.prd_code }} - {{ prd.result }}</p>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
      <template v-slot:footer>
        <a-button type="primary" @click="closeMarketSyncPop()">확인</a-button>
      </template>
    </a-modal>

  </div>
</template>

<script>
import { mapState } from "vuex";
import { AuthRequest } from "@/util/request";
import router from "@/router";
import { lib } from "@/util/lib";
import moment from "moment/moment";
import { message } from "ant-design-vue";

export default {
  computed: {
    ...mapState(["product"])
  },

  data() {

    return {
      SYNC_COLUMNS_CONFIG: [
        {
          title: "선택",
          key: "checked"
        },
        {
          title: "쇼핑몰",
          key: "market_account"
        },
        {
          title: "연동상태",
          key: "status"
        },
        {
          title: "연동시간",
          key: "ins_time"
        }
      ],
      checkAll: false,
      singleSyncPop: false,
      marketSyncPop: false,
      marketSyncSuccess: 0,
      marketSyncFailedCode: [],
      marketSyncFailed: 0,
      marketSyncTotal: 0,
      marketSyncResult: []
    };
  },

  methods: {
    /**
     * 번역 팝업열기
     * @returns {boolean}
     */
    textTranslateSwicth() {
      if (this.product.item_is_trans === true) {
        message.warning("이미 번역한 상품입니다.");
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
      let mandatoryVal = this.product.formState.mandatory_val;
      if (mandatoryVal === "선택") {
        message.warning("상품고시정보를 선택해주세요");
        return false;
      }

      let cont = this.product.formState.keyword;
      if (cont !== null && cont.length > 255) {
        message.warning(
          "키워드는 최대 (255)자내로 입력하시길 바랍니다.\n현재입력수(" +
          cont.length +
          ")"
        );
        return false;
      }

      return true;
    },

    /**
     * 상품저장
     * @returns {boolean}
     */
    async submit() {
      if (this.validateFilterProductWords() === false) return false;

      this.product.loading = true;

      //연동필수데이터 없는 상황
      if (this.checkMarket() === false) {
        this.product.loading = false;
        return false;
      }

      // 주문옵션 추가금액은 본 상품 판매가의 -50% ~ 50%까지 입력 가능
      let checkSellingPrice = this.checkSellingPrice();
      if (checkSellingPrice === false) {
        this.product.loading = false;
        return false;
      }

      // 태그 제거 (사양)
      let sItemDetail = this.product.item_detail;
      sItemDetail = sItemDetail.replaceAll(
        "<p style=\"display: flex; flex-flow: column nowrap; align-items: center;\">",
        ""
      );
      sItemDetail = sItemDetail.replaceAll("<p>", "");
      sItemDetail = sItemDetail.replaceAll("</p>", "");
      this.product.item_detail = sItemDetail;

      let oForm = new FormData();
      oForm = this.getForm(oForm);

      try {
        const res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/prdup", oForm);
        if (res.status === undefined || res.status !== "2000") {
          message.error(res.message);
          this.product.loading = false;
          return false;
        }

        this.product.sku = res.data.sku;
        this.setExpectedReturn();
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
            visible: false
          });
        }
        this.product.item_thumbnails = aItemThumbnails;

        message.success("저장 성공");
        this.product.loading = false;

      } catch (e) {
        message.error("저장에 실패 하였습니다.");
        return false;
      }
    },
    checkSellingPrice() {
      let maxPrice = Number.NEGATIVE_INFINITY; // Initialize with the smallest possible value
      let minPrice = Number.POSITIVE_INFINITY; // Initialize with the largest possible value
      for (const skuItem of this.product.sku) {
        const { selling_price } = skuItem;
        if (selling_price > maxPrice) {
          maxPrice = selling_price;
        }
        if (selling_price < minPrice) {
          minPrice = selling_price;
        }
      }

      // this.product.sku에서 selling_price가 minPrice 보다 50%이상이거나 50%이하일때 경고창 띄우기
      for (const skuItem of this.product.sku) {
        const { selling_price } = skuItem;
        if (selling_price > minPrice * 1.5 || selling_price < minPrice * 0.5) {
          message.warning("주문옵션 추가금액은 본 상품 판매가의 -50% ~ 50%까지 입력 가능합니다.");
          return false;
        }
      }

      return true;
    },

    checkAllMarket(checkAll) {
      for (let i = 0; i < this.product.item_sync_market.length; i++) {
        if (checkAll === false) {
          this.product.item_sync_market[i].checked = true;
        } else {
          this.product.item_sync_market[i].checked = false;
        }
      }
    },

    closeResultPop(type) {
      this.singleSyncPop = false;
    },

    closeMarketSyncPop() {
      this.marketSyncPop = false;
    },

    getCheckedMarketList() {
      let list = [];

      for (let i = 0; i < this.product.item_sync_market.length; i++) {
        if (this.product.item_sync_market[i].checked === true) {
          list.push(this.product.item_sync_market[i].market_account);
        }
      }

      return list;
    },

    async testsync(type) {
      this.product.loading = true;
      let list = "";
      let marketList = [];

      marketList = this.getCheckedMarketList();
      list = this.product.item_id + "";

      if (marketList.length === 0) {
        message.warning("선택된 제휴사가 없습니다.");
        this.product.loading = false;
        return false;
      }

      try {

        let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/sendmarket", { list: list });
        if (res.status !== "2000") {
          message.error(res.message);
          this.indicator = false;
          return false;
        }

        if (res.data !== undefined && res.data.length === 0) {
          message.error("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.indicator = false;
          return false;
        }

      } catch (e) {
        message.error(e.message);
        this.product.loading = false;
        return false;
      }

      const res3 = await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/marketlist");

      if (res3.status !== "2000") {
        message.error(res3.message);
        return false;
      }

      const options = res3.data.data;

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/syncmarket",
        { params: { list: list, market: marketList, options: options } }).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
        }

        let returnData = res.data;

        this.singleSyncPop = false;
        this.singleDetail = [];
        this.checkedList = [];

        this.setResultPopData(true, [
          returnData.success,
          returnData.failedCode,
          returnData.failed,
          returnData.total,
          returnData.data
        ]);


        this.product.loading = false;
      });

    },

    setResultPopData(isOpen, data) {
      if (isOpen) {
        this.marketSyncSuccess = data[0];
        this.marketSyncFailedCode = data[1];
        this.marketSyncFailed = data[2];
        this.marketSyncTotal = data[3];
        this.marketSyncResult = data[4];
        this.marketSyncPop = true;
      } else {
        this.marketSyncSuccess = 0;
        this.marketSyncFailedcode = "";
        this.marketSyncFailed = 0;
        this.marketSyncTotal = 0;
        this.marketSyncResult = [];
        this.marketSyncPop = false;
      }
    },

    /**
     * 상품저장
     * @returns {boolean}
     */
    async submitSync() {
      if (this.validateFilterProductWords() === false) return false;

      this.product.loading = true;

      //연동필수데이터 없는 상황
      if (this.checkMarket() === false) {
        this.product.loading = false;
        return false;
      }

      // 주문옵션 추가금액은 본 상품 판매가의 -50% ~ 50%까지 입력 가능
      let checkSellingPrice = this.checkSellingPrice();
      if (checkSellingPrice === false) {
        this.product.loading = false;
        return false;
      }

      // 태그 제거 (사양)
      let sItemDetail = this.product.item_detail;
      sItemDetail = sItemDetail.replaceAll(
        "<p style=\"display: flex; flex-flow: column nowrap; align-items: center;\">",
        ""
      );
      sItemDetail = sItemDetail.replaceAll("<p>", "");
      sItemDetail = sItemDetail.replaceAll("</p>", "");
      this.product.item_detail = sItemDetail;

      let oForm = new FormData();
      oForm = this.getForm(oForm);

      try {
        const res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/prdup", oForm);
        if (res.status === undefined || res.status !== "2000") {
          message.error(res.message);
          this.product.loading = false;
          return false;
        }

        this.product.sku = res.data.sku;
        this.setExpectedReturn();
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
            visible: false
          });
        }
        this.product.item_thumbnails = aItemThumbnails;


        this.product.loading = false;

        this.singleSyncPop = true;

        setTimeout(() => {
          Object.values(document.querySelectorAll(".syncStatus")).map(el => {
            el.parentElement.parentElement.style.backgroundColor = "#f9f9f9";
            if (el.getAttribute("data-status") === "success") {
              el.parentElement.parentElement.style.backgroundColor = "#fff7f5";
            }
          });

          Object.values(document.querySelectorAll(".tableSyncStatus thead th")).map(el => {
            el.style.backgroundColor = "#f7fdff";
          });
        });

      } catch (e) {
        message.error("저장에 실패 하였습니다.");
        return false;
      }
    },

    setExpectedReturn() {
      this.product.sku.map((data, i) => {
        let expected_return = (Number(data.selling_price) - Number(data.original_price_ko) - Number(data.selling_price) * 0.12).toFixed(0);
        this.product.sku[i].expected_return = Number(expected_return);
      });
    },

    validateFilterProductWords() {
      /* 번역안한상품 금지어 체크안함 */
      if (this.product.item_is_trans === false) {
        return true;
      }

      if (this.product.filter_word_validate_in_process === true) {
        message.warning("상품명 금지어 체크중입니다.잠시후 다시 시도해 주세요.");
        return false;
      }

      if (this.product.filter_word_status === false) {
        message.warning("상품명에 금지어가 포함되었습니다.상품명 수정후 다시 시도해 주세요.");
        // return false;
      }

      return true;
    },

    getForm(oForm) {
      let oProduct = this.product;
      let oFormState = oProduct.formState;

      oForm = this.setForm(oForm, {
        id: oProduct["item_id"],
        sku: JSON.stringify(oProduct.sku),
        info: oProduct.item_info,
        name: oProduct.item_name,
        spec: JSON.stringify(oProduct.item_option),
        stock: oProduct["item_stock"],
        image: JSON.stringify(oProduct.item_thumbnails),
        detail: oProduct.item_detail,
        trans_name: oProduct.item_trans_name,
        trans_status: oProduct.item_is_trans,
        cross_border: oProduct.item_cross_border,

        surtax: oFormState.surtax,
        keyword: oFormState.keyword,
        mandatory_val: oFormState.mandatory_val,
        is_free_delivery: oFormState.item_is_free_delivery === true ? "T" : "F",
        shipping_fee: oFormState.item_shipping_fee,

        // 새로추가한 마진
        item_disp_margin_option: oProduct.item_disp_margin_option,
        item_selling_margin_option: oProduct.item_selling_margin_option,
        item_wholesale_margin_option: oProduct.item_wholesale_margin_option,
        item_rate_margin_option: oProduct.item_rate_margin_option
      });

      return oForm;
    },

    setForm(oForm, oFormData) {
      Object.keys(oFormData).map((sField) => {
        oForm.append(sField, oFormData[sField]);
      });

      return oForm;
    }
  }

};
</script>

<style scoped>
div.currentDiv:last-child {
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
