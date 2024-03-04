<template>
  <div id="container" class="w100" v-if="this.product.onload">
    <!--loading-->
    <loading v-model:active="this.product.loading" :can-cancel="false" :is-full-page="true" />

    <!--번역팝업-->
    <TextTranslate></TextTranslate>

    <!--navigation-->
    <Navigation></Navigation>

    <!--기본 정보-->
    <BasicInfo @userinfo-updated="handleUserInfoUpdate"></BasicInfo>

    <MarketData> </MarketData>

    <!--이미지 편집기 세트-->
    <XiangJi></XiangJi>

    <!--상품 이미지-->
    <ImageUpload></ImageUpload>


    <!--Spec-->
<!--    <Spec></Spec>-->

    <!--Sku-->
    <Sku></Sku>

    <!--New Spec-->
    <NewSpec></NewSpec>

    <!--상세페이지-->
    <Description></Description>

    <!--하단버튼-->
    <BottomBanner></BottomBanner>

    <ImageEditorGroup></ImageEditorGroup>
  </div>
</template>
<script>
import "vue-loading-overlay/dist/vue-loading.css";
import "../../assets/css/global.css";

import { lib } from "@/util/lib";
import { mapState, createNamespacedHelpers } from "vuex";
import { useRoute } from "vue-router";
import { AuthRequest } from "@/util/request";
import { defineAsyncComponent, defineComponent, ref } from "vue";
import router from "@/router";

// import Spec from "@/components/Detail/Spec";
import Loading from "vue-loading-overlay";
import { message } from "ant-design-vue";

import Sku from "@/components/Detail/Sku";
import NewSpec from "@/components/Detail/Spec/NewSpec";

import MarketData from "@/components/Detail/MarketData";
import {throttle} from "lodash";
// const Sku = defineComponent(() => import('@/components/Detail/Sku'))
// const NewSpec = defineComponent(() => import('@/components/Detail/Spec/NewSpec'))

const BasicInfo = defineAsyncComponent(() => import('@/components/Detail/basicInfo'))
const Navigation = defineAsyncComponent(() => import('@/components/Detail/nanigation'))
const CustomsInfo = defineAsyncComponent(() => import('@/components/Detail/customsInfo'))
const ImageUpload = defineAsyncComponent(() => import('@/components/Detail/ImageUpload'))
const Description = defineAsyncComponent(() => import('@/components/Detail/description'))
const BottomBanner = defineAsyncComponent(() => import('@/components/Detail/bottomBanner'))
const TextTranslate = defineAsyncComponent(() => import('@/components/Detail/textTranslate'))
const SimpleDescription = defineAsyncComponent(() => import('@/components/Detail/simpleDescription'))
const XiangJi = defineAsyncComponent(() => import('@/components/Detail/xiangJi'))
const ImageEditorGroup = defineAsyncComponent(() => import('@/components/ImageEditor/imageEditorGroup.vue'))

export default defineComponent({
  name: "productDetail",

  components: {
    XiangJi,
    Sku,
    NewSpec,
    // Spec,
    MarketData,
    Loading,
    BasicInfo,
    Navigation,
    CustomsInfo,
    ImageUpload,
    Description,
    BottomBanner,
    TextTranslate,
    SimpleDescription,
    ImageEditorGroup,
  },

  data() {
    return {
      useAutoSave: false,
      productWatchCount: 0,
    };
  },

  computed: {
    ...mapState({
      product: state => state.product
    }),
  },

  setup() {
    const activeKey = ref(['']);
    return {
      activeKey,
    };
  },

  methods: {

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
        keyword: oProduct.item_sync_keyword,
        mandatory_val: oFormState.mandatory_val,
        is_free_delivery: oFormState.item_is_free_delivery === true ? "T" : "F",
        shipping_fee: oFormState.item_shipping_fee,

        item_cate: JSON.stringify(oProduct.item_cate),
        item_disp_cate: JSON.stringify(oProduct.item_disp_cate)
      });

      return oForm;
    },

    setForm(oForm, oFormData) {
      Object.keys(oFormData).map((sField) => {
        oForm.append(sField, oFormData[sField]);
      });

      return oForm;
    },

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

    getProduct() {
      const route = useRoute();
      let path = route.path.split("/", 4);
      let id = parseInt(path[3]);

      if (!lib.isNumeric(id)) {
        message.warning("상품번호가 잘못되었습니다.");
        router.push("/product");
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prd", {
        params: { prduct_idx: id },
      }).then((res) => {
        if (
          lib.isEmpty(res) ||
          res.status !== "2000" ||
          lib.isEmpty(res.data)
        ) {
          message.success(res.message);
          router.push("/product");
          this.product.loading = false;
          return false;
        }

        this.$store.state.product = Object.assign(this.product, res.data); //vueX
        if (Array.isArray(this.product.item_cate) && this.product.item_cate.length === 0){
          this.product.item_cate = {};
        }

        if ((Array.isArray(this.product.item_disp_cate) && this.product.item_disp_cate.length === 0) || lib.isEmpty(this.product.item_disp_cate)){
          this.product.item_disp_cate = {};
        }

        // 상품 전송여부 판단
        this.product.is_sync = "F";
        this.product.item_sync_market.forEach(item => {
          if (item.status !== "unsync") {
            this.product.is_sync = "T";
            return false;
          }
        })

        this.initSku();

        this.product.select_pvs = [1,2];

        this.product.onload = true;
        this.product.loading = false;
      });
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

    // 옵션명 순위별로 sku 명을 재구성함
    initSkuSpecName() {
      // 옵션 索引
      let aOptionIndex = [];
      let aItemOptions = this.product.item_option;
      aItemOptions.map((aItemOption, i) => {
        aOptionIndex[i] = [];
        aItemOption.data.map((data) => {
          aOptionIndex[i].push(data.name);
        });
      });

      // SKU 索引
      this.product.sku.map((sku, t) => {
        let oSkuName = {};
        let aSpec = sku.spec.split("::");
        aSpec.map((sSpec) => {
          aOptionIndex.map((aOptionNames, i) => {
            if (aOptionNames.includes(sSpec)) {
              oSkuName[i] = sSpec;
            }
          });
        });

        this.product.sku[t].spec = Object.values(oSkuName).join("::");
      });
    },

    initSku() {
      this.product.toLang = "ko";
      // this.initSkuSpecName();
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

    handleUserInfoUpdate(data) {
      this.useAutoSave = data.use_auto_save;
    },
  },

  watch: {
    'product': {
      handler() {
        this.productWatchCount++;
        if (this.productWatchCount > 10 && this.useAutoSave) {
          this.autoSave()
        }
      },
      deep: true, // 深度监听，如果 product 是对象或数组，需要设置为 true
      immediate: false, // 立即执行一次
    },
  },


  mounted() {
    this.getProduct();
  },
});
</script>

<style scoped></style>
