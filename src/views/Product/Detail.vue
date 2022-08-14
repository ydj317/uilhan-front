<template>
  <div id="container" class="w100" v-if="this.product.onload">
    <!--loading-->
    <loading
      v-model:active="this.product.loading"
      :can-cancel="false"
      :is-full-page="true"
    />

    <!--번역팝업-->
    <TextTranslate></TextTranslate>

    <!--navigation-->
    <Navigation></Navigation>

    <!--기본 정보-->
    <BasicInfo></BasicInfo>

    <!--Relaket-->
    <Relaket></Relaket>

    <!--상품 이미지-->
    <ImageUpload></ImageUpload>

    <!--Spec-->
    <Spec></Spec>

    <!--Sku-->
    <Sku></Sku>

    <!--통관정보-->
    <div id="eModelTitle_4">
      <a-collapse class="mt20 bg-white" v-model:activeKey="activeKey">
        <a-collapse-panel key="1" header="통관정보 보기">
          <CustomsInfo></CustomsInfo>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <!--간략설명-->
    <div id="eModelTitle_5">
      <a-collapse class="mt20 bg-white" v-model:activeKey="activeKey">
        <a-collapse-panel key="2" header="간략설명 보기">
          <SimpleDescription></SimpleDescription>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <!--상세설명-->
    <Description></Description>

    <!--하단버튼-->
    <BottomBanner></BottomBanner>
  </div>
</template>
<script>
import "vue-loading-overlay/dist/vue-loading.css";
import "../../assets/css/global.css";

import { lib } from "@/util/lib";
import { mapState } from "vuex";
import { useRoute } from "vue-router";
import { AuthRequest } from "@/util/request";
import { defineComponent, ref } from "vue";
import router from "@/router";

import Sku from "@/components/Detail/Sku";
import Spec from "@/components/Detail/Spec.vue";
import Relaket from "@/components/Detail/Relaket";
import Loading from "vue-loading-overlay";
import BasicInfo from "@/components/Detail/basicInfo";
import Navigation from "@/components/Detail/nanigation";
import CustomsInfo from "@/components/Detail/customsInfo";
import ImageUpload from "@/components/Detail/ImageUpload";
import Description from "@/components/Detail/description";
import BottomBanner from "@/components/Detail/bottomBanner";
import TextTranslate from "@/components/Detail/textTranslate";
import SimpleDescription from "@/components/Detail/simpleDescription";

export default defineComponent({
  name: "productDetail",

  components: {
    Sku,
    Spec,
    Relaket,
    Loading,
    BasicInfo,
    Navigation,
    CustomsInfo,
    ImageUpload,
    Description,
    BottomBanner,
    TextTranslate,
    SimpleDescription,
  },

  computed: {
    ...mapState(["product"]),
  },

  setup() {
    const activeKey = ref([]);
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
        alert("상품번호가 잘못되었습니다.");
        router.push("/product");
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prd", {
        params: { prduct_idx: id },
      }).then((res) => {
        if (lib.isEmpty(res) || res.status !== 200 || lib.isEmpty(res.data)) {
          alert("상품정보 얻기 실패");
          router.push("/product");
          this.product.loading = false;
          return false;
        }

        this.$store.state.product = Object.assign(this.product, res.data);

        this.initSku();
        this.product.bak_sku = JSON.parse(JSON.stringify(this.product.sku));
        this.product.onload = true;
        this.product.loading = false;
      });
    },

    setLabel(items, type, isRate = false) {
      let labelAddInfo = "";
      for (let i = 0; i < items.length; i++) {
        let symble = "";
        if (type === "margin" && isRate === false) {
          symble = "%";
        }

        if (
          items[i].label.indexOf("(") === -1 &&
          items[i].label.indexOf("%") === -1
        ) {
          labelAddInfo = " ( " + items[i].value + symble + " )";
        }

        items[i].label += labelAddInfo;
      }

      return items;
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
      if (lib.isEmpty(this.product["prd_upd"])) {
        this.product.is_modify = "F";
      }

      // 마진율 초기화
      ["wholesale", "supply", "selling", "disp", "rate"].map((sKey) => {
        this.initMargin(sKey);
      });

      // // rate 옵션
      // this.product.rate = lib.isArray(this.product.user.rate)
      //     ? this.setLabel(this.product.user.rate, "rate")
      //     : [];
      //
      // this.product.rate_option = 0;
      //
      // // 최초수정
      // if (this.product.is_modify === "F" && !lib.isEmpty(this.product.user.rate_option)) {
      //   this.product.rate_option = this.product.user.rate_option;
      // }
    },

    initMargin(field) {
      let isRate = false;
      if (field === 'rate') {
        isRate = true;
      }

      // 마진 옵션
      this.product[field + "_margin"] = lib.isArray(this.product.user[field + "_margin"])
        ? this.setLabel(this.product.user[field + "_margin"], "margin", isRate)
        : [];

      this.product[field + "_margin_option"] = 0;

      // 최초수정
      if (this.product.is_modify === "F" && !lib.isEmpty(this.product.user[field + "_margin_option"])) {
        this.product[field + "_margin_option"] = this.product.user[field + "_margin_option"];
      }

      // 수정
      if (this.product.is_modify === "T" && !lib.isEmpty(this.product["item_" + field + "_margin_option"])) {
        this.product[field + "_margin_option"] = this.product["item_" + field + "_margin_option"];
      }
    },
  },

  mounted() {
    this.getProduct();
  },
});
</script>

<style scoped></style>
