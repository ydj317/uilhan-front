<template>
  <a-modal v-model:open="localvisible" title="상품상세" width="1200px" centered :maskClosable="false">
    <a-tabs v-model:activeKey="activeKey"
            :tabBarGutter="0.5"
            type="card"
    >
      <a-tab-pane v-for="pane in tabList" :key="pane.key" @tabClick="handleTabChange">
        <template #tab>
          <div :style="{color: activeKey === pane.key ? '#ffffff' : '#000000'}">
            {{pane.tab}}
          </div>

        </template>
        <keep-alive>
          <component :is="pane.component" v-show="activeKey === pane.key" style="height: 700px;overflow-y: scroll" />
        </keep-alive>
      </a-tab-pane>
    </a-tabs>
    <template #footer>
      <div style="display: flex; justify-content: center">
        <a-button @click="onCancel">취소</a-button>
        <a-button type="primary" @click="submitSync">상품등록</a-button>
        <a-button type="primary" @click="onSubmit" >저장</a-button>
      </div>
    </template>
  </a-modal>
  <!--제휴사 상품연동-->
  <a-modal width="1000px" title="상품등록" v-model:open="singleSyncPop" centered>
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
      <a-button @click="closeResultPop()">닫기</a-button>
      <a-button type="primary" @click="sendMarket()">선택마켓등록</a-button>
    </template>
  </a-modal>

  <!--제휴사 연동결과-->
  <a-modal width="600px" :maskClosable="false" v-model:open="marketSyncPop" centered title="제휴사연동결과" @ok="">
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
</template>

<script>

import { defineComponent, ref } from "vue";
import { AndroidOutlined,ProfileOutlined } from '@ant-design/icons-vue';
import DefaultTab from "@/views/Product/Tab/DefaultTab.vue";
import OptionTab from "@/views/Product/Tab/OptionTab.vue";
import DetailInfoTab from "@/views/Product/Tab/DetailInfoTab.vue";
import {lib} from "@/util/lib";
import {message} from "ant-design-vue";
import {AuthRequest} from "@/util/request";
import { mapState} from "vuex";
import {throttle} from "lodash";
import {useCategoryApi} from "@/api/category";
import {useUserApi} from "@/api/user";


export default defineComponent({
  name: "productDetailPopup",

  data() {
    return {
      tabList: [
        {
          key: '1',
          tab: '기본정보',
          icon: ProfileOutlined,
          component: DefaultTab,
        },
        {
          key: '2',
          tab: '옵션/가격정보',
          icon: AndroidOutlined,
          component: OptionTab,
        },
        {
          key: '3',
          tab: '상세페이지',
          icon: AndroidOutlined,
          component: DetailInfoTab,
        },
      ],
      useAutoSave: false,
      productWatchCount: 0,

      SYNC_COLUMNS_CONFIG: [
        {
          title: "마켓",
          key: "market_account",
          width: "230px",
          align: "center"
        },
        {
          title: "등록상태",
          key: "status",
          align: "center"
        },
        {
          title: "등록시간",
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
      marketSyncResult: [],
      smartStoreCategory: [],
    };
  },

  computed: {
    ...mapState({
      product: state => state.product.detail
    }),
    localvisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    prdId: {
      type: Number,
      required: true
    }
  },
  emits: ['update:visible'],
  setup() {
    const activeKey = ref('1');
    return {
      activeKey,
    };
  },

  methods: {

    autoSave: throttle(async function() {
      message.success('자동 저장중...')

      let oForm = new FormData();
      oForm = this.getForm(oForm);

      const res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/prdup", oForm);
      if (res.status === undefined || res.status !== "2000") {
        message.error(res.message);
        return false;
      }

      message.success('자동 저장 성공')
    }, 5000, {
      leading: false
    }),

    closeResultPop() {
      this.singleSyncPop = false;
    },

    closeMarketSyncPop() {
      this.marketSyncPop = false;
    },

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

    skuLongName() {
      let aLongerSkuName = this.product.sku.filter(
          (data) => data.spec.length > 20
      );
      this.product.sku_long_name = [];
      aLongerSkuName.map((sku) => {
        let aLongerSpec = sku.spec.split("::");
        this.product.item_option.map((options) => {
          options.data.map((data) => {
            if (aLongerSpec.includes(data.name)) {
              this.product.sku_long_name.push(data.name);
            }
          });
        });
      });
    },

    initSku() {
      this.product.toLang = "ko";
      this.skuLongName();

      for (let i = 0; i < this.product.sku.length; i++) {
        this.product.sku[i].checked = false;
      }

      // 상품 수정여부 판단
      this.product.is_modify = "T";
      if (lib.isEmpty(this.product["item_upd"])) {
        this.product.is_modify = "F";
      }
    },

    handleTabChange(key) {
      this.product.loading = true;
      this.activeKey = key;
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

        surtax: 'N',
        keyword: oProduct.item_sync_keyword,
        mandatory_val: oProduct.item_mandatory,
        is_free_delivery: oProduct.item_is_free_delivery === true ? "T" : "F",
        shipping_fee: oProduct.item_shipping_fee,
        custom_code: oProduct.custom_code,

        item_cate: JSON.stringify(oProduct.item_cate),
        item_disp_cate: JSON.stringify(oProduct.item_disp_cate),
        discount_rate: oProduct.item_discount_rate,
      });

      return oForm;
    },

    setForm(oForm, oFormData) {
      Object.keys(oFormData).map((sField) => {
        oForm.append(sField, oFormData[sField]);
      });

      return oForm;
    },

    async getSmartstoreCategory() {
      await useCategoryApi().getSmartstoreCategory({}).then((res) => {
        if(res.status !== '2000'){
          message.error(res.message);
          return false;
        }

        this.smartStoreCategory = res.data
      }).catch((e) => {
        message.error(e.message);
        return false;
      })

    },
    checkSmartStoreCategory(accountList) {
      const smartstoreAccounts = accountList.filter((item) => item.market_code === 'smartstore')

      let faildItem = [];
      if(smartstoreAccounts.length === 0) {
        return true;
      }

      if (this.product.formState.keyword !== undefined && this.product.formState.keyword !== null) {
        faildItem = this.smartStoreCategory.filter((item) => {
          return this.product.formState.keyword.includes(item.cate_name);
        })
      }

      if(faildItem.length > 0) {
        message.warning(`스마트스토어 금지어: [${faildItem.map((item) => item.cate_name).join(', ')}] 상품명 수정후 마켓연동해 주세요.`)
        return false;
      }
      return true;
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

        if (res.data.message !== undefined && res.data.message !== '') {
          message.warning(res.data.message);
          this.indicator = false;
          return false;
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        let now_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        for (let i = 0; i < this.product.item_sync_market.length; i++) {
          if (this.product.item_sync_market[i].market_id === market_id) {
            this.product.item_sync_market[i].upd_time = now_time;
            this.product.item_sync_market[i].status = res.data.status;
            this.product.item_sync_market[i].result = res.data.result;
            this.product.item_sync_date = now_time;
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

      let accountList = this.product.item_sync_market.filter(item => item.checked === true);
      if (accountList.length === 0 || accountList.length === undefined) {
        message.warning("선택된 계정이 없습니다.");
        return false;
      }

      const checkSmartStore = this.checkSmartStoreCategory(accountList);
      if(checkSmartStore === false) {
        return false
      }
      this.product.loading = true;
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
          let accountName = item.market_code + '|' + item.seller_id;

          if (returnData.successSeller.includes(accountName)) {
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

    checkSellingPrice() {
      if (!Array.isArray(this.product.sku) || this.product.sku.length === 0) {
        return false;
      }

      // 获取相应的 selling_price 值
      const objWithT = this.product.sku.find(obj => obj.is_option_reference_price === 'T');
      const targetPrice = objWithT ? objWithT.selling_price : this.product.sku[0].selling_price;

      // this.product.sku에서 selling_price가 targetPrice 보다 50%이상이거나 50%이하일때 경고창 띄우기
      for (const skuItem of this.product.sku) {
        const { selling_price } = skuItem;
        // 경고창 띄운 후에도 selling_price가 targetPrice 보다 50%이상이거나 50%이하일때 this.product.sku 에서 삭제
        if (selling_price > targetPrice * 1.5 || selling_price < targetPrice * 0.5) {
          console.log(`주문옵션(${skuItem.spec}) 추가금액은 본 상품 판매가의 -50% ~ 50%까지 입력 가능합니다.`);

          // this.product.sku에서 삭제
          this.product.sku = this.product.sku.filter(item => item.key !== skuItem.key);
        }
      }

      // this.product.sku에서 is_option_reference_price가 모두 F일시 최소값을 T로 변경
      const hasTrueOption = this.product.sku.some(skuItem => skuItem.is_option_reference_price === 'T');

      if (!hasTrueOption) {
        for (const skuItem of this.product.sku) {
          // 제일 처음의 skuItem만 T로 변경
          skuItem.is_option_reference_price = 'F';
          if (skuItem.selling_price === targetPrice) {
            skuItem.is_option_reference_price = 'T';
          }
        }
      }

      const use_pvs = [];
      for (const skuItem of this.product.sku) {
        if (skuItem.pvs.includes(';')) {
          // 如果包含分号，按分号分割字符串并循环插入数组
          const valuesArray = skuItem.pvs.split(';');
          for (const value of valuesArray) {
            use_pvs.push(value);
          }
        } else {
          // 如果不包含分号，直接插入数组
          use_pvs.push(skuItem.pvs);
        }
      }

      if (!Array.isArray(use_pvs) || use_pvs.length === 0) {
        return false;
      }

      // 使用 filter 过滤 item_option
      this.product.item_option = this.product.item_option.map(item => {
        // 过滤掉 data 中 key 包含在 use_pvs 中的项
        item.data = item.data.filter(dataItem => use_pvs.includes(dataItem.key));

        // 过滤掉 data 数组为空的项
        return item.data.length > 0 ? item : null;
      }).filter(Boolean);

      return true;
    },

    /**
     * 뭐하는건지 모르겠음
     * @returns {boolean}
     */
    checkMarket() {

      let isFree = this.product.item_is_free_delivery;
      let shippingFee = this.product.item_shipping_fee;
      if (isFree === false && shippingFee < 100) {
        message.warning("무료배송이 아닌경우 배송비를 입력해 주세요");
        return false;
      }

      if (shippingFee > 0 && shippingFee % 100 !== 0) {
        message.warning("배송비는 100 단위료 입력해 주세요");
        return false;
      }

      let mandatoryVal = this.product.item_mandatory;
      if (mandatoryVal === "선택") {
        message.warning("상품고시정보를 선택해 주세요");
        return false;
      }

      let cont = this.product.item_sync_keyword;
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
    async onSubmit() {
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

        this.product.sku.every((item, index) => {
          item.checked = false;
        });

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
        this.$emit('update:visible');

      } catch (e) {
        console.error(e);
        message.error("저장에 실패 하였습니다.");
        return false;
      }
    },

    /**
     * 상품연동
     * @returns {boolean}
     */
    async submitSync() {
      if (this.validateFilterProductWords() === false) return false;

      this.product.loading = true;

      let category = this.product.item_cate;
      if (!category) {
        message.warning("마켓연동 하려면 카테고리를 설정해 주세요.");
        this.product.loading = false;
        return false;
      }

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
          this.product.item_sync_market[i].market_id = foundItem.id;
          this.product.item_sync_market[i].status = foundItem.status;
          this.product.item_sync_market[i].result = foundItem.result;
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
    async getUserInfoData() {
      useUserApi().getUserInfoData().then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        this.useAutoSave = res.data.use_auto_save === '1';
      });
    },
    onCancel() {
      console.log('cancel!');
      this.$emit('update:visible');
    },

    handleTabsEvent(e) {
      const event = e || window.event;
      if (event.key === 'Tab' || event.keyCode === 9) {
        event.preventDefault();
        if (this.tabList.length === parseInt(this.activeKey)) {
          this.activeKey = "1";
        } else {
          this.activeKey = String((parseInt(this.activeKey) + 1));
        }
      }
    },
  },

  watch: {
    'product': {
      handler() {
        this.productWatchCount++;
        if (this.productWatchCount > 6 && this.useAutoSave) {
          this.autoSave()
        }
      },
      deep: true, // 深度监听，如果 product 是对象或数组，需要设置为 true
      immediate: false, // 立即执行一次
    },
    prdId: {
      async handler() {
        this.$store.dispatch('product/getDetail', this.prdId);
      },
      flush: 'post',
    },
    localvisible: {
      handler() {
        if (this.localvisible) {
          // add keyboard event listener
          document.addEventListener('keydown', this.handleTabsEvent);
        } else {
          document.removeEventListener('keydown', this.handleTabsEvent);
        }
      },
      immediate: true,
    },
  },

  beforeMount() {
    this.getSmartstoreCategory();
    this.getUserInfoData();
  },
});

</script>
<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.ant-tabs-tab.ant-tabs-tab-active{
  background-color: #ffd117 !important;
}
</style>