<template>
  <div id="eModelTitle_2_1" class="mt20 p20 bg-white" v-if="product.item_option">
    <h1><strong>New 옵션설정</strong></h1>
    <!--옵션그룹해더, 옵션 셋팅, 옵션그룹 추가-->
    <div class="header-section">
      <!--세팅버튼-->
      <div class="setting header-button">
        <a-popconfirm
            title="현재 스팩설정대로 세팅하시겠습니까?"
            @confirm="setting"
        >
          <a-button class="floatRight" type="primary" danger>세팅</a-button>
        </a-popconfirm>
      </div>
      <a-button @click="addSpecGroup" class="header-button" type="primary">추가</a-button>
    </div>
    <!--옵션그룹 영역-->
    <div class="body-section">
      <SpecGroup v-for="(option, optionIndex) in product.item_option" :key="optionIndex" :option="option" :optionIndex="optionIndex"></SpecGroup>
    </div>
  </div>
</template>
<script>
import { lib } from "util/lib";
import { forEach } from "lodash";
import { mapState } from "vuex";
import SpecGroup from "./SpecGroup";

export default {
  name: "productDetailNewSpec",
  components:{
    SpecGroup
  },
  computed: {
    ...mapState(["product"]),
  },
  data() {
    return {
      temp_sku: []
    };
  },
  methods: {
    setting() {
      this._getSku([], 0, this.product.item_option);
      this._setSku();
    },
    addSpecGroup() {
      this.product.item_option.push({
        name: "",
        data: [
          {key:this._uniqueKey(), name: ''}
        ]
      });
    },
    deleteSpecGroup(optionIndex) {
      this.product.item_option.splice(optionIndex, 1);
    },
    addSpecOptionName(optionIndex) {
      this.product.item_option[optionIndex].data.push({key:this._uniqueKey(), name: ''});
    },
    _uniqueKey() {
      return ((1 + Math.random()) * 0x10000) | 0;
    },
    _getSku(aTempSku, i, aOptions) {
      forEach(aOptions[i].data, (val, key) => {
        if (i < aOptions.length - 1) {
          aTempSku[i] = aOptions[i].data[key];
          this._getSku(aTempSku, i + 1, aOptions);
        } else {
          this.temp_sku.push([...aTempSku, aOptions[i].data[key]]);
        }
      });
    },
    _setSku() {
      let format_sku = [];
      let aOptionImage = this._getOptionImage();

      forEach(this.temp_sku, (sku) => {
        let sName = sku[0].name;
        if (sku.length > 1) {
          // sName = `${sku[0].name}::${sku[1].name}`;
          let aTempName = [];
          forEach(sku, (_sku) => {
            aTempName.push(_sku.name);
          });
          sName = aTempName.join("::");
        }

        let bPush = true;
        forEach(this.product.sku, (original_sku) => {
          // let aName = original_sku.spec.split('::');
          if (original_sku.spec === sName) {
            bPush = false;
            // 기존 sku 는 그대로 유지
            format_sku.push(original_sku);
          }
        });

        // 새로 추가된 sku
        if (bPush) {
          // 셋팅시 새로은 품목 기존 옵션이미지 사용
          let sImageUrl = "";
          sName.split("::").map((tempSkuName) => {
            if (!lib.isEmpty(aOptionImage[tempSkuName])) {
              sImageUrl = aOptionImage[tempSkuName];
            }
          });

          // 축소된 이미지 원복 (원복할 이미지가 아니면 기존이미지)
          sImageUrl = lib.getOraginalImageUrlToString(sImageUrl, ['.jpg', '.jpeg', '.bmp', '.png', '.gif']);

          format_sku.push({
            img: sImageUrl,
            code: "",
            spec: sName,
            stock: 0,
            original_price_cn: 0,
            original_price_ko: 0,
            shipping_fee_cn: 0,
            shipping_fee_ko: 0,
            wholesale_price: 0,
            disp_price: 0,
            selling_price: 0,
            key: ((1 + Math.random()) * 0x10000) | 0,
          });
        }
      });

      this.product.sku = JSON.parse(JSON.stringify(format_sku));
    },
    _getOptionImage() {
      let aOptionImages = {};
      this.product.item_option.map((item_option) => {
        let aTemp = item_option.data.filter(
            (option) => !lib.isEmpty(option.img)
        );

        if (lib.isArray(aTemp, true)) {
          aTemp.map((item) => {
            aOptionImages[item.name] = item.img;
          });
        }
      });

      return aOptionImages;
    },
  }
};
</script>
<style lang="css" scoped>
.header-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  margin-top: 10px;
  border-radius: 0.275rem;
  background-color: #f4f8f9;
}

.header-button {
  margin-right: 10px;
}

.body-section {
  display: flex;
  flex-direction:row;
  width: 100%;
  height: 90%;
  overflow: auto;
}

.spec-box table {
  border-radius: 5px;
  width: 100%;
}

.spec-box table tr {
  border: 1px solid #f0f0f0;
}
</style>
