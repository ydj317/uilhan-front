<template>
  <div class="detail" v-if="product.onload">
    <!--loading-->
<!--    <loading v-model:active="product.loading" :can-cancel="false" :is-full-page="true"/>-->
    <a-spin :indicator="product.loading" />
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
    <CustomsInfo></CustomsInfo>

    <!--배송설정-->
    <DeliverySettings></DeliverySettings>

    <!--간략설명-->
    <SimpleDescription></SimpleDescription>

    <!--상세설명-->
    <Description></Description>

    <!--하단버튼-->
    <BottomBanner></BottomBanner>
  </div>
</template>
<script>


import {lib} from 'util/lib';
import {forEach} from "lodash-es";
import {mapState} from 'vuex';
import {useRoute} from 'vue-router';
import {AuthRequest} from 'util/request';
import {defineComponent} from 'vue';

import Cookie from 'js-cookie';
import router from 'router';

import Sku from 'components/Detail/sku';
import Spec from 'components/Detail/Spec.vue';
import Relaket from 'components/Detail/Relaket';
// import Loading from 'vue-loading-overlay';
// import 'vue-loading-overlay/dist/vue-loading.css';
import BasicInfo from 'components/Detail/basicInfo';
import Navigation from 'components/Detail/nanigation';
import CustomsInfo from 'components/Detail/customsInfo';
import ImageUpload from 'components/Detail/ImageUpload';
import Description from 'components/Detail/description';
import BottomBanner from 'components/Detail/bottomBanner';
import TextTranslate from 'components/Detail/textTranslate';
import DeliverySettings from 'components/Detail/deliverySettings';
import SimpleDescription from 'components/Detail/simpleDescription';

export default defineComponent({
  components: {
    Sku,
    Spec,
    Relaket,
    BasicInfo,
    Navigation,
    CustomsInfo,
    ImageUpload,
    Description,
    BottomBanner,
    TextTranslate,
    DeliverySettings,
    SimpleDescription,
  },

  computed: {
    ...mapState([
      'product',
    ])
  },

  methods: {
    getProduct() {
      const route = useRoute();
      let path = route.path.split('/', 4);
      let id = parseInt(path[3]);

      if (!lib.isNumeric(id)) {
        alert('상품번호가 잘못되었습니다.');
        router.push('/product');
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/prd', {params: {prduct_idx: id}}).then((res) => {
        if (lib.isEmpty(res) || res.status !== 200 || lib.isEmpty(res.data)) {
          alert('상품정보 얻기 실패');
          router.push('/product');
          this.product.loading = false;
          return false;
        }

        this.$store.state.product = Object.assign(this.product, res.data);
        console.log('getProduct', res.data);

        this.initSku();
        // this.initRelaket();

        this.product.onload = true;
        this.product.loading = false;
      });
    },

    setLabel(items, type) {
      let labelAddInfo = '';
      for (let i=0; i < items.length; i++) {
        let symble = '';
        if (type === 'margin') {
          symble = '%';
        }

        if (items[i].label.indexOf('(') === -1 && items[i].label.indexOf('%') === -1) {
          labelAddInfo = ' ( ' + items[i].value + symble +' )';
        }

        items[i].label += labelAddInfo;
      }

      return items;
    },

    marginHandleChange(value) {
      let marginVal = !lib.isNumeric(value)? 0: parseFloat(value);
      if (marginVal > 0) {
        forEach(this.product.sku, (val, key) => {
          if (parseFloat(val.margin) === 0 || val.margin === null || val.custom_margin === false) {
            this.product.sku[key].margin = Math.ceil(parseFloat(marginVal / 100 * val.selling_price) + parseFloat(val.selling_price))
          }
        });
      }

      this.rateHandleChange(this.product.rate_default)
    },

    rateHandleChange(value) {
      let rateVal = !lib.isNumeric(value)? 0 : parseFloat(value);

      if (rateVal > 0) {
        forEach(this.product.sku, (val, key) => {
          if (parseFloat(val.rate) === 0 || val.rate === null || val.custom_rate === false) {
            this.product.sku[key].rate = Math.ceil(val.margin * rateVal);
          }
        });
      }
    },

    skuLongName() {
      let aLongerSkuName = this.product.sku.filter(data => data.spec.length > 20);
      this.product.sku_long_name = [];
      aLongerSkuName.map(sku => {
        let aLongerSpec = sku.spec.split('::');
        this.product.item_option.map(options => {
          options.data.map(data => {
            if (aLongerSpec.includes(data.name)) {
              this.product.sku_long_name.push(data.name);
            }
          })
        })
      })
    },

    initSku() {
      this.product.toLang = 'ko';
      this.skuLongName();

      for (let i = 0; i < this.product.sku.length; i++) {
        this.product.sku[i].checked = false;
      }

      if (!lib.isEmpty(this.product.user.margin, true)) {
        this.product.user.margin = this.setLabel(this.product.user.margin, 'margin');
        this.product.margin_default = this.product.user.margin[0].value;
      }

      if (!lib.isEmpty(this.product.user.rate, true)) {
        this.product.user.rate = this.setLabel(this.product.user.rate, 'rate');
        this.product.rate_default = this.product.user.rate[0].value;
      }

      if (!lib.isEmpty(this.product.item_margin, true)) {
        this.product.margin_default = this.product.item_margin + '';
      }

      if (!lib.isEmpty(this.product.item_rate, true)) {
        this.product.rate_default = this.product.item_rate + '';
      }

      this.marginHandleChange(this.product.margin_default);

      this.product.item_weight = !lib.isNumeric(this.product.item_weight, true)? 0 : this.product.item_weight;
      this.product.item_height = !lib.isNumeric(this.product.item_height, true)? 0 : this.product.item_height;
      this.product.item_depth = !lib.isNumeric(this.product.item_depth, true)? 0 : this.product.item_depth;
      this.product.item_width = !lib.isNumeric(this.product.item_width, true)? 0 : this.product.item_width;
    },

    initRelaket() {
      this.product.roles = Cookie.get('member_roles');
      this.product.relaket_visivle = this.product.roles.length > 0 && this.product.roles.indexOf('ROLE_RELAKET') > -1;
    }
  },

  mounted() {
    this.getProduct();
  },
});


</script>

<style scoped>
/*!*DEBUG*!*/
/*div {*/
/*  outline: 1px solid red;*/
/*}*/

/* 상품상세 全局 CSS (수정함 안됨~!) */
.container {
  background-color: white;
  margin: 22px;
  padding: 22px;
}

</style>
