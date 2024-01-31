<template>
  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 300px">
    <a-spin v-if="product.loading" size="large"/>
  </div>
  <div v-else id="eModelTitle_2" class="mt20 p20 bg-white" v-if="product.item_option">
    <h3><strong>옵션설정</strong></h3>
    <!--옵션그룹해더, 옵션 셋팅, 옵션그룹 추가-->
    <div class="header-section">
      <!--세팅버튼-->
      <div class="setting header-button" style="display: flex;justify-content: space-between;width: 100%;padding-right: 15px;">
        <a-button class="floatRight" type="primary" @click="setting" :disabled="product.is_sync === 'T'">옵션 적용</a-button>
      </div>
    </div>
    <!--옵션그룹 영역-->
    <div class="body-section">
      <SpecGroup v-for="(option, optionIndex) in product.item_option" :key="optionIndex" :option="option" :optionIndex="optionIndex"></SpecGroup>
    </div>
  </div>
</template>
<script>
import { lib } from "util/lib";
import { forEach, cloneDeep} from "lodash";
import {mapState, useStore} from "vuex";
import SpecGroup from "./SpecGroup";
import { message } from "ant-design-vue";
import {computed,ref} from "vue";

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
      temp_sku: [],
      temp_item_option: cloneDeep(this.$store.state.product.item_option),
    };
  },

  methods: {
    setting() {
      if (!this.product || !this.product.item_option) {
        return;
      }

      if (!this._checkOptionGroup()) {
        return false;
      }

      //sku 값 씽크 맞춤
      this._syncSku();
      this._getSku(this.product.item_option);
      this._setSku();

      forEach(this.product.sku, (item, index) => {
        this.product.sku[index].is_option_reference_price = "F";
        if (index === 0) {
          this.product.sku[index].is_option_reference_price = "T";
        }
      });

      //세팅후 초기화
      this.temp_item_option = cloneDeep(this.product.item_option);

      this.$store.commit('setOptionApplied', true);
    },
    addSpecGroup() {
      this.product.item_option.push({
        name: "",
        data: [
          {key:this._uniqueKey(), name: ''}
        ]
      });
      this.$nextTick(() => {
        const container = document.querySelector("#eModelTitle_2 > div.body-section");
        container.scrollLeft = container.scrollWidth - container.clientWidth;
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
    _syncSku() {
      const that = this;
      if (that.product.item_option.length !== that.temp_item_option.length) {
        return;
      }

      let modifyOption = {};
      forEach(that.product.item_option, (option, option_index) => {
        let modifyOptionNames = [];
        forEach(option.data, (item) => {
          let optionName = {};
          forEach(that.temp_item_option[option_index].data, (temp_item) => {
            if (item.key === temp_item.key && item.name !== temp_item.name) {
              optionName['new_option_value'] = item.name;
              optionName['old_option_value'] = temp_item.name;
              optionName['key'] = item.key;
              modifyOptionNames.push(optionName);
            }
          });
        });
        modifyOption[option_index] = modifyOptionNames;
      });

      that.product.sku.map((sku, i) => {
        let aSkuName = sku.spec.split("::");
        if ('pvs' in sku) {
          let aSkuPvs = sku.pvs.split(";");
          forEach(modifyOption, (modifyOptionNames, modify_option_index) => {
            if (modifyOptionNames.length > 0) {
              forEach(modifyOptionNames, (modifyOptionName) => {
                if (aSkuPvs[modify_option_index] === modifyOptionName.key) {
                  aSkuName[modify_option_index] = modifyOptionName.new_option_value;
                  that.product.sku[i].spec = aSkuName.join("::");
                }
              });
            }
          });
        }
      });
    },
    _getSku(aOptions) {
      this.temp_sku = [];
      if (aOptions.length < 1) {
        return false;
      }

      if (aOptions.length === 1) {
        forEach(aOptions[0].data, (val, key) => {
          this.temp_sku.push([aOptions[0].data[key]]);
        });
      }

      if (aOptions.length === 2) {
        forEach(aOptions[1].data, (val, key2) => {
          forEach(aOptions[0].data, (val, key1) => {
            this.temp_sku.push([aOptions[0].data[key1], aOptions[1].data[key2]]);
          });
        });
      }

      this._generateCombinations(aOptions);

    },
    _generateCombinations(aOptions, currentCombination = [], currentIndex = 0) {
      if (currentIndex === aOptions.length) {
        // 如果当前索引已经达到数组长度，将当前组合加入结果数组
        this.temp_sku.push([...currentCombination]);
        return;
      }

      // 遍历当前层的数据
      forEach(aOptions[currentIndex].data, (value, key) => {
        // 递归调用生成下一层的组合
        this._generateCombinations(aOptions, [...currentCombination, value], currentIndex + 1);
      });
    },
    _setSku() {
      let format_sku = [];
      let aOptionImage = this._getOptionImage();
      forEach(this.temp_sku, (sku) => {
        let sName = sku[0].name;
        let sPvs = sku[0].key;
        let sPvsReverse = sku[0].key;
        if (sku.length > 1) {
          let aTempName = [];
          let aTempPvs = [];

          forEach(sku, (_sku) => {
            aTempName.push(_sku.name);
            aTempPvs.push(_sku.key);
          });
          sName = aTempName.join("::");
          sPvs = aTempPvs.join(";");

          // 倒序
          aTempPvs.reverse();
          sPvsReverse = aTempPvs.join(";");
        }

        let bPush = true;
        forEach(this.product.sku, (original_sku) => {
          if (original_sku.pvs === undefined) {
            return;
          }

          let skuPvs = original_sku.pvs.replace(/(\s*)/g, "");
          let optionPvs = sPvs.replace(/(\s*)/g, "");
          let optionPvsReverse = sPvsReverse.replace(/(\s*)/g, "");

          if ([optionPvs, optionPvsReverse].includes(skuPvs)) {
            bPush = false;
            original_sku.spec = sName;
            format_sku.push(original_sku);
          } else if (original_sku.spec.replace(/(\s*)/g, "") === sName.replace(/(\s*)/g, "")) {
            // 기존로직 유지 2023-12-27
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
            shipping_fee_ko: this.product.item_shipping_fee,
            selling_price: 0,
            expected_return: 0,
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
    _checkOptionGroup() {
      let check = true;
      let tmpOptionGroupName = [];
      try {
        forEach(this.product.item_option, (itemOption) => {
          //입력하지 않은 옵션그룹 존재
          if (itemOption.name.trim().length === 0) {
            message.warning('입력하지 않은 옵션그룹이 존재합니다.');
            check = false;
            throw new Error();
          }

          if (tmpOptionGroupName.indexOf(itemOption.name) !== -1) {
            message.warning(`동일한 옵션그룹이 존재합니다. 옵션그룹:${itemOption.name}`);
            check = false;
            throw new Error();
          } else {
            tmpOptionGroupName.push(itemOption.name);
          }
          let tmpOptionName = [];
          forEach(itemOption.data, (item) => {
            if (item.name.trim().length === 0) {
              message.warning(`입력하지 않은 옵션명이 존재합니다. 옵션그룹:${itemOption.name}`);
              check = false;
              throw new Error();
            }

            if (tmpOptionName.indexOf(item.name) !== -1) {
              message.warning(`동일한 옵션명이 존재합니다. 옵션그룹:${itemOption.name}, 옵션명:${item.name}`);
              check = false;
              throw new Error();
            } else {
              tmpOptionName.push(item.name);
            }
          });
        });
      } catch(e) {
      }

      return check;
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
  margin-right: auto;
  margin-left: 15px;
}

.body-section {
  display: flex;
  flex-direction:row;
  gap: 5px;
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
