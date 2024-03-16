<template>
  <a-modal title="옵션명/옵션값 수정" v-model:open="this.$store.state.showOptionModifyModal" width="100%" wrap-class-name="full-modal" :maskClosable="false">
    <template #footer>
      <div style="display: flex; justify-content: center;">
        <a-button key="back" style="width: 100px;" @click="this.closeOptionModal" >취소</a-button>
        <a-button key="submit" style="width: 100px;" @click="this.saveOption" type="primary">적용</a-button>
      </div>
    </template>

<div class="container">
<!--  버튼 구역-->
  <div class="header-section">
    <!--세팅버튼-->
    <div class="setting header-button" style="display: flex;padding-right: 15px;">
      <!--      <a-button class="floatRight" type="primary" @click="setting" >옵션 적용</a-button>-->

      <a-button @click="setTrim" class="spec-right-button" type="primary"
                size="middle">빈칸
      </a-button>
      <a-button @click="replaceSpecialChars" class="spec-right-button" type="primary"
                 size="middle">특문
      </a-button>

      <a-button @click="setAtoZ" class="spec-right-button" type="primary"
                size="middle">A-Z
      </a-button>

      <a-button @click="handleMenuClick('N')" class="spec-right-button" type="primary"
                size="middle">01.___
      </a-button>

      <a-button @click="handleMenuClick('A')" class="spec-right-button" type="primary"
                size="middle">A.___
      </a-button>

      <a-button @click="setBeforeOldOptionData" class="spec-right-button" type="primary"
                 size="middle">초기화
      </a-button>

      <a-input size="middle" v-model:value="option_group_find_str" style="width: 100px;"
               placeholder="변경 전"></a-input>
      >
      <a-input size="middle" v-model:value="option_group_replace_str" style="width: 100px;"
               placeholder="변경 후"></a-input>
      <a-button type="primary" size="middle" @click="handleReplaceOptionGroup()" >
        글자변경
      </a-button>

    </div>
  </div>
  <div class="spec-box">
    <table v-for="(option, optionIndex) in this.options" :key="optionIndex" :data-index="optionIndex">
      <!--옵션그룹,옵션일괄설정-->
      <thead>
      <!--그룹명 영역-->
      <tr>
        <th style="background-color: #ebeff0;">
          <div class="spec-option-group">
            <span class="spec-font">옵션그룹{{ optionIndex + 1 }}</span>
            <a-input class="spec-option-input-size spec-checkbox" v-model:value="option.name" size="default" placeholder="옵션그룹"
            />
            <span class="spec-count"><span :style="option.name.length > 25 ? 'color:red;' : ''">{{
                option.name.length
              }}</span> / 25</span>
          </div>
        </th>
      </tr>
      <!--옵션값 일괄 설정 영역-->
      <tr>
        <th>
          <div class="spec-option-header">
            <div class="spec-option-left">
              <a-checkbox class="spec-checkbox" v-model:checked="option.checkAll" @change="onCheckAllChange(option, optionIndex)"
              ></a-checkbox>
              <span class="spec-font">옵션명</span>
            </div>
            <div class="spec-option-button">
              <!--重复词语-->
              <div class="repeat">
                <a-tag class="ant-tag" v-for="word in getDuplicateWords(option.data.map(item => item.name).join(' '))"
                       :key="word" color="error" @click="removeWordFromInputs(option, word)">
                  {{ word }}
                </a-tag>
              </div>
            </div>
          </div>
        </th>
      </tr>
      </thead>
      <!--옵션명 영역-->
      <tbody style="height: 400px;overflow-y: scroll">
      <tr v-for="(item, index) in option.data" :key="item.key">
        <td>
          <div class="spec-option-name" style="padding: 6px 0;">
            <label class="ant-checkbox-wrapper spec-checkbox"
                   >
              <span class="ant-checkbox" >
                <input type="checkbox" class="ant-checkbox-input" v-model="item.checked" :value="item.key"
                       @change="updateSelectAll(item, option, optionIndex)" >


                <span class="ant-checkbox-inner"></span>
              </span>
            </label>

            <span class="option-image" v-if="item.img" style="margin-right: 5px;">
                  <div class="option-image-large"><img :src="item.img" /></div>
                  <img class="option-image-small" :src="item.img" />
                </span>

            <div style="display: flex;flex-direction: column;justify-content: flex-start;width: 100%">
            <a-input class="input-size" v-model:value="item.name" size="default" placeholder="옵션명"
                     @input="handleInputChange" style="width: 100%" />

            <span style="color: #999999">{{ item.oldName }}</span>
            </div>

            <span class="spec-count" style="width: 80px"><span :style="item.name.length > 25 ? 'color:red;' : ''">
              {{ item.name.length }}
            </span> / 25</span>
<!--            <div class="spec-option-name-button">-->
<!--              <a-button @click="deleteSpecOptionName(optionIndex, index)" type="link" size="large"-->
<!--                        class="spec-set-option-name-button" >-->
<!--                <MinusOutlined/>-->
<!--              </a-button>-->
<!--            </div>-->
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
  </a-modal>
</template>
<script>
import {cloneDeep, forEach} from "lodash";
import {mapState, useStore} from "vuex";
import {PlusOutlined, MinusOutlined} from '@ant-design/icons-vue';
import {message} from "ant-design-vue";
import { nextTick, watch } from "vue";

export default {
  name: "productDetailSpecGroup",
  computed: {
    ...mapState({
      product: state => state.product.detail
    }),
  },
  watch: {
    'product.resetOption': {
      handler: function (val) {
        if (val === true) {
          // 옵션정보를 수집시 옵션정보로
          let tempOptions = cloneDeep(this.product.item_org_option);
          this.options = tempOptions.map(option => {
            option.checkAll = false;
            option.oldName = option.name;
            option.data = option.data.map(item => {
              item.oldName = item.name;
              item.checked = false;
              return item;
            });
            return option;
          });

          // 옵션정보 초기화 여부 초기화
          this.product.resetOption = false
        }
      },
      deep: true
    }
  },
  components: {PlusOutlined, MinusOutlined},
  data() {
    return {
      popoverVisible: false,
      option_group_find_str: '',
      option_group_replace_str: '',
      // 설정할 옵션안에 체크여부 판단필드를 넣어줌
      oldOptionData : [],
      options : [],
      selectedRows: [],
      // restOption : this.$store.state.resetOption,
    };
  },
  methods: {
    closeOptionModal() {
      this.$store.commit('setShowOptionModifyModal', false);
    },
    handleReplaceOptionGroup() {
      if (this.option_group_find_str.trim().length === 0) {
        message.warning('변경 전 글자를 입력해주세요.');
        return false;
      }

      let selectItems = this.selectedRows.flat();
      if (selectItems.length === 0) {
        message.warning('처리할 옵션명을 선택하세요.');
        return false;
      }

      let newOptionData = [];
      forEach(this.options.data, (item) => {
        if (this.selectedRows.indexOf(item.key) !== -1) {
          if (item.name.includes(this.option_group_find_str)) {
            item.name = item.name.replace(this.option_group_find_str, this.option_group_replace_str);
            newOptionData.push(item);
          } else {
            newOptionData.push(item);
          }
        } else {
          newOptionData.push(item);
        }
      });

      this.options.forEach(option => {
        option.data.forEach(item => {
          if (selectItems.includes(item.key)) {
            if (item.name.includes(this.option_group_find_str)) {
              item.name = item.name.replace(this.option_group_find_str, this.option_group_replace_str);
            }
          }
        });
      });

      this._setCheckBoxInit();
    },
    deleteSpecGroup(optionIndex) {
      if (this.product.item_option.length === 1) {
        message.warning('옵션그룹 전부 삭제 불가합니다.');
        return false;
      }
      this.product.item_option.splice(optionIndex, 1);
    },
    addSpecOptionName(optionIndex) {
      this.product.item_option[optionIndex].data.push({key: this._uniqueKey(), name: ''});
    },
    deleteSpecOptionName(optionIndex, index) {
      if (this.product.item_option[optionIndex].data.length === 1) {
        message.warning('옵션명 전부 삭제는 불가합니다.');
        return false;
      }
      this.product.item_option[optionIndex].data.splice(index, 1);
    },
    onCheckAllChange(option, optionIndex) {
      if (option.checkAll === true) {
        this.selectedRows[optionIndex] = [];
        forEach(option.data, (item, index) => {
          item.checked = true;
          this.selectedRows[optionIndex].push(item.key);
        });
      } else {
        this.selectedRows[optionIndex] = [];
        forEach(option.data, (item, index) => {
          item.checked = false;
        });
      }
    },

    updateSelectAll(item, option, optionIndex) {
      // item 에서 checked 가 true 일때 selectedRows 에 추가
      if (item.checked === true) {
        this.selectedRows[optionIndex].push(item.key);
      } else {
        // item 에서 checked 가 false 일때 selectedRows 에서 제거
        this.selectedRows[optionIndex] = this.selectedRows[optionIndex].filter(key => key !== item.key);
      }
      option.checkAll = this.selectedRows[optionIndex].length === option.data.length;
    },
    deleteOptionName() {
      if (this.selectedRows.length === 0) {
        message.warning('삭제할 옵션명을 선택하세요.');
        return false;
      }
      let newOptionData = [];
      if (this.option.data.length === this.selectedRows.length) {
        message.warning('옵션명 전부 삭제는 불가합니다.');
        this._setCheckBoxInit();
        return false;
      }
      forEach(this.option.data, (item, index) => {
        if (this.selectedRows.indexOf(item.key) === -1) {
          newOptionData.push(item);
        }
      });
      this.product.item_option[this.optionIndex].data = newOptionData;
      this._setCheckBoxInit();
    },
    setTrim() {
      let selectItems = this.selectedRows.flat();
      if (selectItems.length === 0) {
        message.warning('빈칸을 제거할 옵션명을 선택하세요.');
        return false;
      }
      const specialChars = /[ ]+/g;
      this.options.forEach(option => {
        option.data.forEach(item => {
          if (selectItems.includes(item.key)) {
            item.name = item.name.replace(specialChars, '');
          }
        });
      });
      this._setCheckBoxInit();
    },
    replaceSpecialChars() {
      let selectItems = this.selectedRows.flat();

      if (selectItems.length === 0) {
        message.warning('특문을 제거할 옵션명을 선택하세요.');
        return false;
      }
      const specialChars = /[@#$%^&* ㅥㅦㅧㅨㅩㅪㅫㅬㅭㅮㅯㅰㅱㅲㅳㅴㅵㅶㅷㅸㅹㅺㅻㅼㅽㅾㅿㆀㆁㆂㆃㆄㆅㆆㆇㆈㆉㆊㆋㆌㆍㆎ½⅓⅔¼¾⅛⅜⅝⅞¹²³⁴ⁿ₁₂₃₄ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫㉬㉭㉮㉯㉰㉱㉲㉳㉴㉵㉶㉷㉸㉹㉺㉻㈀㈁㈂㈃㈄㈅㈆㈇㈈㈉㈊㈋㈌㈍㈎㈏㈐㈑㈒㈓㈔㈕㈖㈗㈘㈙㈚㈛─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃╄╅╆╇╈╉╊＃＆＊＠§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡®ªº㉾＄％￦Ｆ′″℃Å￠￡￥¤℉‰€㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙㎚㎛㎜㎝㎞㎟㎠㎡㎢㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰㎱㎲㎳㎴㎵㎶㎷㎸㎹㎀㎁㎂㎃㎄㎺㎻㎼㎽㎾㎿㎐㎑㎒㎓㎔Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆＋－＜＝＞±×÷≠≤≥∞∴♂♀∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢⇒⇔∀∃∮∑∏＂（）［］｛｝‘’“”〔〕〈〉《》「」『』【】！＇，．／：；？＾＿｀｜￣、。·…¨〃­―∥＼∼～ˇ˘˝˚˙¸˛¿ː]+/g;
      this.options.forEach(option => {
        option.data.forEach(item => {
          if (selectItems.includes(item.key)) {
            item.name = item.name.replace(specialChars, '');
          }
        });
      });

      this._setCheckBoxInit();
    },

    setAtoZ() {
      // this.options 에서 checkAll 이 true 인것만 checkAllOption 에 넣는다
      let checkAllOption = this.options.filter(option => option.checkAll === true);
      if (checkAllOption.length === 0) {
        message.warning('A-Z로 처리할 옵션그룹을 선택하세요.');
        return false;
      }
      checkAllOption.forEach((option) => {
        let typeValue = 'A';
        forEach(option.data, (item) => {
          item.name = typeValue;
          typeValue = this._getNextLetter(typeValue);
        });
      });

      this._setCheckBoxInit();
    },

    handleMenuClick(type) {
      //type:N 01__, A A.__
      let prefix;
      let typeValue;

      // this.options 에서 checkAll 이 true 인것만 checkAllOption 에 넣는다
      let checkAllOption = this.options.filter(option => option.checkAll === true);
      if (checkAllOption.length === 0) {
        message.warning('처리할 옵션그룹을 선택하세요.');
        return false;
      }
      checkAllOption.forEach((option) => {
        if (type === 'N') {
          typeValue = 1;
        } else {
          typeValue = 'A';
        }

        forEach(option.data, (item, index) => {
          prefix = typeValue.toString();
          if (type === 'N') {
            if (prefix.length === 1) {
              prefix = '0' + prefix;
            }
            item.name = prefix + '.' + item.name;
            typeValue++;
          } else {
            item.name = prefix + '.' + item.name;
            typeValue = this._getNextLetter(typeValue);
          }
        });
      });

    },
    setBeforeOldOptionData() {
      this.options = cloneDeep(this.oldOptionData);
    },
    _getNextLetter(letter) {
      let nextLetter = '';
      let carry = true;

      for (let i = letter.length - 1; i >= 0; i--) {
        if (carry) {
          if (letter[i] === 'Z') {
            nextLetter = 'A' + nextLetter;
            carry = true;
          } else {
            const nextCharCode = letter.charCodeAt(i) + 1;
            nextLetter = String.fromCharCode(nextCharCode) + nextLetter;
            carry = false;
          }
        } else {
          nextLetter = letter[i] + nextLetter;
        }
      }

      if (carry) {
        nextLetter = 'A' + nextLetter;
      }

      return nextLetter;
    },
    _setCheckBoxInit() {
      this.selectedRows = [];
      this.options.forEach(option => {
        option.checkAll = false;
        option.data.forEach(item => {
          item.checked = false;
        });
      });
    },
    _uniqueKey() {
      return ((1 + Math.random()) * 0x10000) | 0;
    },

    getDuplicateWords(names) {
      // 分割字符串为单词，特别处理括号内的内容和特殊格式如 "1.5X2"
      let words = names.split(/[\s,]+/)
          .flatMap(word => {
            // 处理特殊格式
            if (/\d+\.\d+X\d+/.test(word)) {
              return [word];
            }
            // 分割括号内的单词，保留括号
            if (word.startsWith('[') && word.endsWith(']')) {
              return word.slice(1, -1).split(/\s+/).map(w => `[${w}]`);
            }
            return word;
          })
          .filter(word => this.isValidWord(word));

      // 获取重复的单词或数字
      let duplicates = this.findDuplicates(words);

      // 特殊处理
      return this.processSpecialDuplicates(duplicates);
    },
    isValidWord(word) {
      //有效单词检查：允许字母、数字、韩文、中文以及括号和特殊格式
      return /^[\[\]a-zA-Z0-9가-힣\u4e00-\u9fa5]+$/g.test(word) || /^\d+\.\d+X\d+$/g.test(word);
    },
    findDuplicates(words) {
      let wordCounts = {};
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
      return Object.keys(wordCounts).filter(word => wordCounts[word] > 1);
    },
    processSpecialDuplicates(duplicates) {
      return duplicates;
    },


    // 重新计算并更新所有repeat的高度
    adjustRepeatHeights() {
      nextTick(() => {
        let maxHeight = 0;

        // 获取所有 repeat 元素并找出最大高度
        const repeats = document.getElementsByClassName('repeat');
        for (const el of repeats) {
          maxHeight = Math.max(el.clientHeight, maxHeight);
        }

        // 设置所有 repeat 元素的高度为最大高度
        for (const el of repeats) {
          el.style.height = maxHeight + 'px';
        }
      });
    },

    handleInputChange() {
      const repeats = document.getElementsByClassName('repeat');
      for (const el of repeats) {
        el.style.height = 'auto';
      }
      this.adjustRepeatHeights();

    },



    //点击a-tag同时删除对应的input中的name
    removeWordFromInputs(option, wordToRemove) {
      option.data.forEach(item => {
        item.name = item.name.split(' ').filter(word => word !== wordToRemove).join(' ');
      });

      const repeats = document.getElementsByClassName('repeat');
      for (const el of repeats) {
        el.style.height = 'auto'; // 重置高度
      }
      this.adjustRepeatHeights();
    },

    saveOption() {
      if (!this.product || !this.product.item_option) {
        return;
      }

      if (!this._checkOptionGroup()) {
        return false;
      }

      // sku 수정
      if (this.product.sku.length < 0) {
        return false;
      }

      this.product.sku.forEach((sku, i) => {
        let aSkuName = sku.spec.split("::");
        let aSkuPvs = sku.pvs.split(";");
        forEach(this.options, (option, option_index) => {
          forEach(option.data, (item, item_index) => {
            if (aSkuPvs[option_index] === item.key) {
              aSkuName[option_index] = item.name;
              this.product.sku[i].spec = aSkuName.join("::");
            }
          });
        });
      });

      this.product.item_option = {...this.options};
      this.$store.commit('setShowOptionModifyModal', false);

    },

    _checkOptionGroup() {
      let check = true;
      let tmpOptionGroupName = [];
      try {
        forEach(this.options, (itemOption) => {
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
  },
  mounted() {

    this.oldOptionData = this.product.item_option.map(option => {
      option.checkAll = false;
      option.oldName = option.name;
      option.data = option.data.map(item => {
        item.oldName = item.name;
        item.checked = false;
        return item;
      });
      return option;
    });

    this.options = cloneDeep(this.oldOptionData);
    this.selectedRows = this.product.item_option.map(option => []);

    this.adjustRepeatHeights();
  },
}
</script>
<style lang="css" scoped>
.spec-box {
  margin-top: 5px;
  margin-right: 5px;
  margin-left: 5px;
  width: 100%;
  min-width: 580px;
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping to the next line */
  overflow-x: auto;
}

.spec-box table {
  border-radius: 5px;
  width: 100%;
  border-collapse: collapse;
  margin-right: 10px; /* Optional: Add some spacing between tables */
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
  min-height: 50px;
  margin-left:10px;
}

.spec-option-name {
  display: flex;
  align-items: center;
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
  margin:5px 10px 0 0;

  max-width:53%;
text-align:right;
}

.spec-option-left {
  margin-right: auto;
}

.spec-right-button {
  margin-right: 5px;
}

.spec-option-name-button {
  margin-left: auto;
  padding-right: 15px;
}

.spec-set-option-name-button {
  padding: 2px;
}

/* 根据类名 .ant-checkbox-input 选择元素 */
.ant-checkbox-input {
  position: relative;
  cursor: pointer;
  left: 1px;
}

/* 为 .ant-checkbox-input 添加伪元素 ::before */
.ant-checkbox-input::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px; /* 设置 checkbox 的宽度 */
  height: 16px; /* 设置 checkbox 的高度 */
  border: 1px solid #d9d9d9; /* 设置 checkbox 的边框颜色 */
  background-color: #fff; /* 设置未选中时的背景色 */
  border-radius: 4px; /* 设置 checkbox 圆角 */
  transition: background-color 0.3s ease; /* 添加过渡效果 */
}

/* 在伪元素中使用 ::before 画一个对号 */
.ant-checkbox-input::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg); /* 旋转45度形成对号 */
  margin-top: -1px;
  width: 6px; /* 对号的宽度 */
  height: 9px; /* 对号的高度 */
  border: 2px solid #fff; /* 对号的颜色 */
  border-top: none; /* 去掉对号的上边框 */
  border-left: none; /* 去掉对号的左边框 */
  z-index: 10;
}

/* 当 checkbox 选中时修改背景色 */
.ant-checkbox-input:checked::before {
  background-color: #ffd117; /* 设置选中时的背景色 */
  border-color: #ffd117; /* 设置选中时的边框颜色 */
}

/* 当 checkbox 被禁用时修改样式 */
.ant-checkbox-input:disabled::before {
  background-color: #ccc; /* 设置禁用时的背景色 */
  border-color: #ccc; /* 设置禁用时的边框颜色 */
  cursor: not-allowed;
}


.ant-btn.ant-btn-sm {
margin-bottom:5px;
}
.repeat{
  text-align: right;
  max-width:100%;
//min-height:0;
}
.ant-tag{
  margin: 0 0 5px 10px;
  cursor:pointer;
}

.ant-tag-error{
  max-width:100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ant-tag:empty {
  display: none;
}

.option-image {
  margin-left: 10px;
}

.option-image-large {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}

.option-image-large img {
  border-radius: 5px; width: 500px; height: 500px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background: #fff;
}

.option-image:hover .option-image-large {
  display: block;
}

.option-image-small {
  border-radius: 5px; width: 30px; height: 30px;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  margin-top: 10px;
  border-radius: 0.275rem;
  background-color: #f4f8f9;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column; /* 默认为 column，即垂直排列 */
}
.spec-right-button {

}

</style>