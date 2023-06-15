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
      <div class="spec-box" v-for="(option, optionIndex) in product.item_option" :key="optionIndex">
        <table>
          <!--옵션그룹,옵션일괄설정-->
          <thead>
          <tr>
            <!--그룹명 영역-->
            <th style="background-color: #ebeff0;">
              <div class="spec-option-group">
                <span class="spec-font">옵션그룹{{optionIndex + 1}}</span>
                <a-input class="spec-option-input-size"  v-model:value="option.name" size="default" placeholder="Basic usage" />
                <span class="spec-count"><span>{{ option.name.length }}</span> / 25</span>
                <a-button @click="deleteSpecGroup(optionIndex)" class="spec-grop-delete" type="primary" danger>삭제</a-button>
              </div>
            </th>
          </tr>
          <tr>
            <!--옵션값 일괄 설정 영역-->
            <th>
              <div class="spec-option-header">
                <div class="spec-option-left">
                  <a-checkbox class="spec-checkbox" v-model:checked="checked"></a-checkbox>
                  <span class="spec-font">옵션명</span>
                </div>
                <div class="spec-option-button">
                  <a-button class="spec-right-button" type="primary">삭제</a-button>
                  <a-button class="spec-right-button" type="primary">빈칸</a-button>
                  <a-button class="spec-right-button" type="primary">특문</a-button>
                  <a-button class="spec-right-button" type="primary">25자</a-button>
                  <a-button class="spec-right-button" type="primary">순번</a-button>
                  <a-button class="spec-right-button" type="primary">A-Z</a-button>
                  <a-button type="primary">Back</a-button>
                </div>
              </div>
            </th>
          </tr>
          </thead>
          <!--옵션명 영역-->
          <tbody>
          <tr v-for="(item, index) in option.data" :key="item.key">
            <td>
              <div class="spec-option-name">
                <a-checkbox class="spec-checkbox" v-model:checked="checked"></a-checkbox>
                <a-input class="input-size" v-model:value="item.name" size="default" placeholder="small size" />
                <span class="spec-count">{{ item.name.length }} / 25</span>
                <a-button @click="addSpecOptionName(optionIndex)" v-if="option.data.length === (index + 1)" class="spec-add-option-name-button" type="primary">추가</a-button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { lib } from "util/lib";
import { forEach } from "lodash";
import { mapState } from "vuex";

export default {
  name: "productDetailNewSpec",
  computed: {
    ...mapState(["product"]),
  },
  data() {
    return {
      temp_sku: [],
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

.spec-box {
  margin-top: 5px;
  margin-right: 5px;
  margin-left: 5px;
  width: 50%;
  min-width: 589px;
}

.spec-box table {
  border-radius: 5px;
  width: 100%;
}

.spec-box table tr {
  border: 1px solid #f0f0f0;
}

.spec-option-group {
  height: 50px;
  display: flex;
  align-items: center;
}

.spec-grop-delete {
  margin-left: auto;
  margin-right: 10px;
}

.spec-option-group .spec-font {
  margin-left: 10px;
  margin-right: 10px;
}
.spec-option-input-size {
  width: 50%;
}

.spec-option-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
}

.spec-option-name {
  display: flex;
  align-items: center;
  height: 45px;
}

.input-size {
  width: 70%;
}

.spec-checkbox {
  margin-left: 10px;
  margin-right: 10px;
}
.spec-font {
  font-weight: normal;
}
.spec-option-header .spec-font {
  margin-left: 10px;
}

.spec-count {
  margin-left: 5px;
  font-weight: bold;
  color: #808080;
}

.spec-option-button {
  margin-right: 10px;
}

.spec-option-left {
  margin-right: auto;
}

.spec-right-button {
  margin-right: 5px;
}

.spec-add-option-name-button {
  margin-left: 18px;
}
</style>
