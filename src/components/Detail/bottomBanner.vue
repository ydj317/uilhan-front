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
    <a-modal width="1000px" title="제휴사 상품연동" v-model:visible="singleSyncPop" centered>
      <a-table
        class="tableSyncStatus"
        :dataSource="this.product.item_sync_market"
        :columns="SYNC_COLUMNS_CONFIG"
        :row-selection="{ selectedRowKeys: syncSelectedRowKeys, onChange: onSyncSelectChange }"
      >
        <!--table body-->
        <template v-slot:bodyCell="{ text, record, index, column }">

          <!--연동계정-->
          <template v-if="column.key === 'market_account'">
            <div style="text-align: left">
              <img :src="getLogoSrc('market-logo', record.market_code)"
                   style="width: 16px; height: 16px; margin-right: 5px;">
              {{ record.seller_id }}
            </div>
          </template>

          <!--상태-->
          <template v-if="column.key === 'status'">
            <div style="text-align: left">
              <a-tag color="processing" v-if="record.status === 'sending'">전송중</a-tag>
              <a-tag color="processing" v-else-if="record.status === 'approval'">승인대기</a-tag>
              <a-tag color="success" v-else-if="record.status === 'success'">연동성공</a-tag>
              <a-tag color="error" v-else-if="record.status === 'failed'">연동실패</a-tag>
              <a-tag color="default" v-else>연동대기</a-tag>
              <span v-if="record.status === 'failed'">실패원인: {{ record.result }}</span>
              <a-tag color="#108ee9" v-if="record.status === 'approval'"
                     style="cursor: pointer" @click="approvalCheck(record.market_id)">
                승인상태확인
              </a-tag>
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
        <a-button type="primary" @click="sendMarket()">선택마켓연동</a-button>
        <a-button @click="closeResultPop()">닫기</a-button>
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
import { useRoute } from "vue-router";

export default {
  computed: {
    ...mapState(["product"])
  },

  data() {

    return {
      SYNC_COLUMNS_CONFIG: [
        {
          title: "쇼핑몰",
          key: "market_account",
          width: "200px",
          align: "center"
        },
        {
          title: "연동상태",
          key: "status",
          align: "center"
        },
        {
          title: "연동시간",
          key: "ins_time",
          width: "170px",
          align: "center"
        }
      ],
      checkAll: false,
      singleSyncPop: false,
      marketSyncPop: false,
      marketSyncSuccess: 0,
      marketSyncFailedCode: [],
      marketSyncFailed: 0,
      marketSyncTotal: 0,
      syncSelectedRowKeys: [],
      marketSyncResult: []
    };
  },

  methods: {
    getLogoSrc(fileName, marketCode) {
      try {
        return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
      } catch (error) {
        return require('../../assets/img/temp_image.png');
      }
    },

    onSyncSelectChange(syncSelectedRowKeys) {
      this.syncSelectedRowKeys = syncSelectedRowKeys;

      for (let i = 0; i < this.product.item_sync_market.length; i++) {
        this.product.item_sync_market[i].checked = this.syncSelectedRowKeys.includes(this.product.item_sync_market[i].key);
      }
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
      let category = this.product.item_cate;
      if (!category) {
        message.warning("카테고리를 설정해 주세요");
        return false;
      }

      let isFree = this.product.formState.item_is_free_delivery;
      let shippingFee = this.product.formState.item_shipping_fee;
      if (isFree === false && shippingFee < 100) {
        message.warning("무료배송이 아닌경우 배송비를 입력해 주세요");
        return false;
      }

      if (shippingFee > 0 && shippingFee % 100 !== 0) {
        message.warning("배송비는 100 단위료 입력해 주세요");
        return false;
      }

      let mandatoryVal = this.product.formState.mandatory_val;
      if (mandatoryVal === "선택") {
        message.warning("상품고시정보를 선택해 주세요");
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

    closeResultPop() {
      this.singleSyncPop = false;
    },

    closeMarketSyncPop() {
      this.marketSyncPop = false;
    },

    async approvalCheck(market_id) {
      this.indicator = true;

      try {
        let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/approval_check", {
          market_id: market_id,
        });

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

        if (res.data.error !== false) {
          message.error("승인상태 조회 실패");
          this.indicator = false;
          return false;
        }

        for (let i = 0; i < this.product.item_sync_market.length; i++) {
          if (this.singleDetail.item_sync_market[i].market_id === market_id) {
            this.product.item_sync_market[i].status = res.data.status;
            this.product.item_sync_market[i].result = res.data.result;
            this.product.item_sync_date = new Date().toLocaleString();
            this.product.item_sync_status = res.data.status === 'success' ? true : false;
            this.product.item_sync_result = res.data.result;
          }
        }

        this.indicator = false;

        return true;
      } catch (e) {
        message.error(e.message);
        this.indicator = false;
        return false;
      }
    },

    async sendMarket() {
      this.product.loading = true;

      let accountList = this.product.item_sync_market.filter(item => item.checked === true);
      if (accountList.length === 0 || accountList.length === undefined) {
        message.warning("선택된 계정이 없습니다.");
        this.product.loading = false;
        return false;
      }

      try {
        let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/send_market", {
          productList: this.product.item_id + "",
          accountList: accountList
        });

        if (res.status !== "2000") {
          message.error(res.message);
          this.product.loading = false;
          return false;
        }

        if (res.data !== undefined && res.data.length === 0) {
          message.error("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.product.loading = false;
          return false;
        }

        let returnData = res.data;

        this.product.item_sync_market.forEach(item => {
          if (returnData.successSeller.includes(item.seller_id)) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            item.status = 'sending';
            item.ins_time = formattedDateTime;
          }
        });

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

        return true;
      } catch (e) {
        message.error(e.message);
        this.product.loading = false;
        return false;
      }
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
        this.marketSyncFailedCode = "";
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

      let sycnMarkets = []
      try {
        const res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/get_sync_market", {
          'prd_id': this.product.item_id
        });

        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        sycnMarkets = res.data;
      } catch (e) {
        message.error("연동상태 조회실패 하였습니다.");
        return false;
      }

      this.syncSelectedRowKeys = []
      for (let i = 0; i < this.product.item_sync_market.length; i++) {
        const foundItem = sycnMarkets.find(item => item.market_code === this.product.item_sync_market[i].market_code &&
          item.market_account === this.product.item_sync_market[i].seller_id);
        if (foundItem) {
          this.product.item_sync_market[i].status = foundItem.status;
        }

        this.product.item_sync_market[i].key = i;
        let isChecked = false;
        if (this.product.item_sync_market[i].status !== "unsync") {
          isChecked = true;
          this.syncSelectedRowKeys.push(i)
        }
        this.product.item_sync_market[i].checked = isChecked;
      }

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
        item_rate_margin_option: oProduct.item_rate_margin_option,

        item_cate: JSON.stringify(oProduct.item_cate)
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
