<template>
  <div id="eModelTitle_2" class="container basic" v-if="product.item_option">
    <!--세팅,추가-->
    <h1><strong>옵션</strong></h1>

    <!--세팅버튼-->
    <div class="setting">
      <a-popconfirm title="현재 스팩설정대로 세팅하시겠습니까?" @confirm="setting">
        <a-button class="floatRight" type="primary" danger>세팅</a-button>
      </a-popconfirm>
    </div>

    <!--옵션-->
    <div v-for="(option, optionIndex) in product.item_option" style="display: flex; border-bottom: 3px solid #fafafa; padding: 5px;">
      <div style="width: 90%; display: flex;">
        <!--옵션명-->
        <div style="display: flex; margin-top: 35px; margin-right: 15px;">
          <a-input style="width: 165px; height: 40px; outline: 5px solid #f4f8f9"  v-model:value="option.name" placeholder="Basic usage"/>
        </div>

        <!--옵션값-->
        <div style="display: flex; margin-top: 25px; flex-direction: row; flex-wrap: wrap;">
          <template v-for="item in option.data" :key="item.name">
            <!--옵션값 편집창-->
            <div>
              <a-modal
                  :mask="false"
                  :title="old_option_value"
                  v-model:visible="modify_option_value_visible"
                  @ok="modifyOptionValueOk"
                  @cancel="modifyOptionValueCancel"
              >
                <a-input class="dispBlock" v-model:value="new_option_value"/>
              </a-modal>
            </div>

            <!--옵션값 삭제/수정-->
            <div style="margin-top: 10px;">
              <a-tag
                  style="height: 40px; display: flex; font-size: 15px; align-items: center;"
                  :color="skuLongNameStyle(item.name)"
                  :closable="true"
                  @close="deleteOptionValue(optionIndex, item.name)"
                  @click="modifyOptionValue(optionIndex, item.name)">
                <a-tooltip>
                  {{ item.name }}
                </a-tooltip>
              </a-tag>
            </div>
          </template>

          <!--옵션값 추가-->
          <div style="margin-top: 10px;">
            <!--옵션값 추가하기 클릭후-->
            <a-input style="width: 78px; height: 40px; font-size: 15px;"
                v-if="option.inputVisible"
                id="addSpecNameInput"
                class="in30"
                ref="inputRef"
                type="text"
                size="15px"
                v-model:value="option.inputValue"
                @blur="addOptionValue(optionIndex)"
                @pressEnter="addOptionValue(optionIndex)"
            />

            <!--옵션값 추가하기 클릭전-->
            <a-tag
                v-else
                @click="showAddOptionValueInput(optionIndex)"
                class="in30 bgWhite borderDashed"
                style="width: 100px; height: 40px; font-size: 15px; display: flex; justify-content: center; align-items: center; border: 1px solid #3ddc97; color: #3ddc97"
            >
              옵션값 추가
            </a-tag>
          </div>
        </div>
      </div>

      <!--버튼-->
      <div style="display: flex; width: 10%; justify-content: space-around; align-items: flex-end;">
        <a-button @click="deleteOptionValues(optionIndex)" style="height: 40px; background-color: #3ddc97; border: 1px solid #3ddc97; border-radius: 5px;" type="primary">삭제</a-button>
        <a-button @click="deleteOption(option.name)" style="height: 40px; background-color: #f06543; border: 1px solid #f06543; border-radius: 5px;" type="primary">제거</a-button>
      </div>
    </div>

    <!--추가버튼-->
    <div class="addOption">
      <a-button @click="addSpec" class="floatRight mar-R20" type="primary">추가</a-button>
    </div>
  </div>
</template>

<script>
import {lib} from 'util/lib';
import {forEach} from 'lodash-es';
import {mapState} from 'vuex';

export default {
  computed: {
    ...mapState([
      'product',
      'product'
    ])
  },

  data() {
    return {
      temp_sku: [],
      old_option_value: '',
      new_option_value: '',
      modify_option_index: '',
      modify_option_value_visible: false,
    };
  },

  methods: {
    css() {
      setTimeout(() => {
        Object.values(document.querySelectorAll('.ant-table-row-cell-break-word')).map((el, i) => {
          if (el.tagName === 'TH') {
            el.style.backgroundColor = '#f7fdff';
            el.style.height = '33px';
            el.style.fontSize = '15px';
          }
          el.style.padding = 0;
          el.style.textAlign = 'center';
        })
      })
    },

    setting() {
      this.temp_sku = [];
      this._getSku([], 0, this.product.item_option);
      this._setSku();
      this.css();
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
      forEach(this.temp_sku, sku => {
        let sName = sku[0].name;
        if (sku.length > 1) {
          sName = `${sku[0].name}::${sku[1].name}`;
        }

        let bPush = true;
        forEach(this.product.sku, original_sku => {
          let aName = original_sku.spec.split('::');
          if (aName.includes(sku[0].name) && aName.includes(sku[1].name)) {
            bPush = false;
            // 기존 sku 는 그대로 유지
            format_sku.push(original_sku);
          }
        });

        // 새로 추가된 sku
        if (bPush) {
          format_sku.push({
            code: '',
            height: 0,
            img: '',
            key: (((1 + Math.random()) * 0x10000) | 0),
            length: 0,
            margin: 0,
            rate: 0,
            selling_price: 0,
            shipping_fee: 0,
            spec: sName,
            stock: 0,
            weight: 0,
            width: 0,
          });
        }
      });

      this.product.sku = JSON.parse(JSON.stringify(format_sku));
    },

    // sku 명이 20 초과시 빨강
    skuLongNameStyle(name) {
      return this.product.sku_long_name.includes(name)? 'red': '';
    },

    // 옵션 추가
    addSpec() {
      this.product.item_option.push({
        name: '',
        data: [],
        inputValue: '',
        inputVisible: false,
      })
    },

    // 옵션값 편집창 확인
    modifyOptionValueOk() {
      this.product.item_option[this.modify_option_index].data.map((data, i) => {
        if (data.name === this.old_option_value) {
          this.product.item_option[this.modify_option_index].data[i].name = this.new_option_value;
        }
      })
      this.modify_option_value_visible = false;
    },

    // 옵션값 편집창 취소
    modifyOptionValueCancel() {
      this.modify_option_value_visible = false;
    },

    // 옵션값 편집창 노출
    modifyOptionValue(optionIndex, sItemName) {
      this.old_option_value = sItemName;
      this.new_option_value = sItemName;
      this.modify_option_index = optionIndex;
      this.modify_option_value_visible = true;
    },

    // 옵션값 단일 삭제
    deleteOptionValue(optionIndex, sItemName) {
      this.product.item_option[optionIndex].data = this.product.item_option[optionIndex].data.filter(data => data.name !== sItemName);
    },

    // 옵션값 추가
    addOptionValue(optionIndex) {
      // 유효한 옵션값 판단
      if (!lib.isString(this.product.item_option[optionIndex].inputValue, true)) {
        this.product.item_option[optionIndex].inputVisible = false;
        return false;
      }

      // 동일한 옵션값 판단
      let bRepeat = false;
      this.product.item_option.map(aOriginalOption => {
        aOriginalOption.data.map(oOriginalOptionData => {
          if (this.product.item_option[optionIndex].inputValue.trim() === oOriginalOptionData.name.trim()) {
            bRepeat = true;
          }
        });
      });
      if (bRepeat === true) {
        alert('동일한 옵션값이 존재합니다.');
        return false;
      }

      // 새로운 옵션 값 추가
      // 13 uniqid ("1234567890123" + (Math.random()*Math.pow(36,13) << 0).toString(36)).slice(-13)
      this.product.item_option[optionIndex].data.push({
        key: this.product.item_option[optionIndex].data.length,
        name: this.product.item_option[optionIndex].inputValue,
        type: this.product.item_option[optionIndex].name,
        img: ''
      });

      // 초기화
      this.product.item_option[optionIndex].inputVisible = false;
      this.product.item_option[optionIndex].inputValue = '';
    },

    // New Option 클릭 (옵션값 추가 input 노출)
    showAddOptionValueInput(optionIndex) {
      this.product.item_option[optionIndex].inputVisible = true;
    },

    // 제거 (해당 옵션 삭제)
    deleteOption(type) {
      this.product.item_option = this.product.item_option.filter(option => option.name !== type);
    },

    // 삭제 (해당 옵션값 전부 삭제)
    deleteOptionValues(optionIndex) {
      this.product.item_option[optionIndex].data = [];
    },
  },
};
</script>

<style scoped>
.setting,
.addOption {
  display: flex;
}

.addOption {
  margin-top: 35px;
}
</style>
