<template>
  <div id="container" class="w100" v-if="this.product.onload">
    <!--loading-->
    <loading v-model:active="this.product.loading" :can-cancel="false" :is-full-page="true" />

    <!--번역팝업-->
    <TextTranslate></TextTranslate>

    <!--navigation-->
    <Navigation></Navigation>

    <!--기본 정보-->
    <BasicInfo></BasicInfo>

    <MarketData> </MarketData>

    <!--이미지 편집기 세트-->
    <XiangJi></XiangJi>

    <!--상품 이미지-->
    <ImageUpload></ImageUpload>

    <!--New Spec-->
    <NewSpec></NewSpec>

    <!--Spec-->
    <!--<Spec></Spec>-->

    <!--Sku-->
    <Sku></Sku>

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
import { mapState } from "vuex";
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

  computed: {
    ...mapState(["product"]),
  },

  setup() {
    const activeKey = ref(['']);
    return {
      activeKey,
    };
  },

  methods: {
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

        this.$store.state.product = Object.assign(this.product, res.data);
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

  },

  mounted() {
    this.getProduct();
  },
});
</script>

<style scoped></style>
