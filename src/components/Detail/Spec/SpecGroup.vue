<template>
  <div class="spec-box">
    <table>
      <!--옵션그룹,옵션일괄설정-->
      <thead>
      <tr>
        <!--그룹명 영역-->
        <th style="background-color: #ebeff0;">
          <div class="spec-option-group">
            <span class="spec-font">옵션그룹{{ optionIndex + 1 }}</span>
            <a-input class="spec-option-input-size" v-model:value="option.name" size="default" placeholder="옵션그룹"
                     :disabled="product.is_sync === 'T'" />
            <span class="spec-count"><span :style="option.name.length > 25 ? 'color:red;' : ''">{{
                option.name.length
              }}</span> / 25</span>
          </div>
        </th>
      </tr>
      <tr>
        <!--옵션값 일괄 설정 영역-->
        <th>
          <div class="spec-option-header">
            <div class="spec-option-left">
              <a-checkbox class="spec-checkbox" v-model:checked="selectAll" @change="onCheckAllChange"
                          :disabled="product.is_sync === 'T'"></a-checkbox>
              <span class="spec-font">옵션명</span>
            </div>
            <div class="spec-option-button">
              <a-button @click="deleteOptionName" class="spec-right-button" type="primary"
                        :disabled="product.is_sync === 'T'" size="small">삭제
              </a-button>
              <a-button @click="setTrim" class="spec-right-button" type="primary" :disabled="product.is_sync === 'T'"
                        size="small">빈칸
              </a-button>
              <a-button @click="replaceSpecialChars" class="spec-right-button" type="primary"
                        :disabled="product.is_sync === 'T'" size="small">특문
              </a-button>
              <a-button @click="strLengthTo25" class="spec-right-button" type="primary"
                        :disabled="product.is_sync === 'T'" size="small">25자
              </a-button>
              <a-button @click="setAtoZ" class="spec-right-button" type="primary" :disabled="product.is_sync === 'T'"
                        size="small">A-Z
              </a-button>
              <a-dropdown size="small">
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleMenuClick('N')">01.___</a-menu-item>
                    <a-menu-item @click="handleMenuClick('A')">A.___</a-menu-item>
                  </a-menu>
                </template>
                <a-button class="spec-right-button" :disabled="product.is_sync === 'T'" size="small">
                  순번
                </a-button>
              </a-dropdown>
              <a-button @click="setBeforeOldOptionData" class="spec-right-button" type="primary"
                        :disabled="product.is_sync === 'T'" size="small">Back
              </a-button>
              <a-popover v-model:open="popoverVisible" trigger="click">
                <template #content>
                  <div style="display: flex;justify-content: end;padding: 15px 10px;">
                    <a-space>
                      <a-input v-model:value="option_group_find_str" style="width: 100px;"
                               :disabled="product.is_sync === 'T'" placeholder="변경 전"></a-input>
                      >
                      <a-input v-model:value="option_group_replace_str" style="width: 100px;"
                               :disabled="product.is_sync === 'T'" placeholder="변경 후"></a-input>
                      <a-button type="primary" @click="handleReplaceOptionGroup()" :disabled="product.is_sync === 'T'">
                        글자변경
                      </a-button>
                    </a-space>
                  </div>
                </template>
                <a-button type="primary" size="small">글자변경</a-button>
              </a-popover>

              <!--重复词语-->
              <div class="repeat">
                <a-tag class="ant-tag" v-for="word in getDuplicateWords(option.data.map(item => item.name).join(' '))"
                       :key="word" color="error" @click="removeWordFromInputs(word)">
                  {{ word }}
                </a-tag>
              </div>
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
            <label class="ant-checkbox-wrapper spec-checkbox"
                   :class="{'ant-checkbox-wrapper-checked': selectedRows.indexOf(item.key) !== -1}">
              <span class="ant-checkbox" :class="{'ant-checkbox-checked': selectedRows.indexOf(item.key) !== -1}">
                <input type="checkbox" class="ant-checkbox-input" v-model="selectedRows" :value="item.key"
                       @change="updateSelectAll" :disabled="product.is_sync === 'T'">

                <span style="margin-left: 10px;" v-if="item.img">
                  <a-image :src="item.img" style="border-radius: 5px; width: 30px; height: 30px;" :previewMask="false" />
                </span>
                <span class="ant-checkbox-inner"></span>
              </span>
            </label>
            <a-input class="input-size" v-model:value="item.name" size="default" placeholder="옵션명"
                     :disabled="product.is_sync === 'T'" @input="handleInputChange" />
            <span class="spec-count"><span :style="item.name.length > 25 ? 'color:red;' : ''">
              {{ item.name.length }}
            </span> / 25</span>
            <div class="spec-option-name-button">
              <a-button @click="deleteSpecOptionName(optionIndex, index)" type="link" size="large"
                        class="spec-set-option-name-button" :disabled="product.is_sync === 'T'">
                <MinusOutlined/>
              </a-button>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import {cloneDeep, forEach, debounce } from "lodash";
import {mapState, useStore} from "vuex";
import {PlusOutlined, MinusOutlined} from '@ant-design/icons-vue';
import {message} from "ant-design-vue";
import { nextTick, watch } from "vue";
import {AuthRequest} from "@/util/request";

export default {
  name: "productDetailSpecGroup",
  computed: {
    ...mapState(["product"]),
  },
  props: ['option', 'optionIndex'],
  components: {PlusOutlined, MinusOutlined},
  data() {
    return {
      popoverVisible: false,
      option_group_find_str: '',
      option_group_replace_str: '',
      oldOptionData: cloneDeep(this.option.data),
      selectAll: false,
      selectedRows: [],
    };
  },

  methods: {
    handleReplaceOptionGroup() {
      if (this.option_group_find_str.trim().length === 0) {
        message.warning('변경 전 글자를 입력해주세요.');
        return false;
      }

      if (this.selectedRows.length === 0) {
        message.warning('처리할 옵션명을 선택하세요.');
        return false;
      }

      let newOptionData = [];
      forEach(this.option.data, (item) => {
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

      this.product.item_option[this.optionIndex].data = newOptionData;
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
    onCheckAllChange() {
      if (this.selectAll === true) {
        this.selectedRows = [];
        forEach(this.option.data, (item, index) => {
          this.selectedRows.push(item.key);
        });
      } else {
        this.selectedRows = [];
      }
    },
    updateSelectAll() {
      this.selectAll = this.selectedRows.length === this.option.data.length;
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
      if (this.selectedRows.length === 0) {
        message.warning('빈칸을 제거할 옵션명을 선택하세요.');
        return false;
      }
      let newOptionData = [];
      const specialChars = /[ ]+/g;
      forEach(this.option.data, (item, index) => {
        if (this.selectedRows.indexOf(item.key) !== -1) {
          item.name = item.name.replace(specialChars, '');
          newOptionData.push(item);
        } else {
          newOptionData.push(item);
        }
      });
      this.product.item_option[this.optionIndex].data = newOptionData;
      this._setCheckBoxInit();
    },
    replaceSpecialChars() {
      if (this.selectedRows.length === 0) {
        message.warning('특문을 제거할 옵션명을 선택하세요.');
        return false;
      }
      let newOptionData = [];
      const specialChars = /[@#$%^&* ㅥㅦㅧㅨㅩㅪㅫㅬㅭㅮㅯㅰㅱㅲㅳㅴㅵㅶㅷㅸㅹㅺㅻㅼㅽㅾㅿㆀㆁㆂㆃㆄㆅㆆㆇㆈㆉㆊㆋㆌㆍㆎ½⅓⅔¼¾⅛⅜⅝⅞¹²³⁴ⁿ₁₂₃₄ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫㉬㉭㉮㉯㉰㉱㉲㉳㉴㉵㉶㉷㉸㉹㉺㉻㈀㈁㈂㈃㈄㈅㈆㈇㈈㈉㈊㈋㈌㈍㈎㈏㈐㈑㈒㈓㈔㈕㈖㈗㈘㈙㈚㈛─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃╄╅╆╇╈╉╊＃＆＊＠§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡®ªº㉾＄％￦Ｆ′″℃Å￠￡￥¤℉‰€㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙㎚㎛㎜㎝㎞㎟㎠㎡㎢㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰㎱㎲㎳㎴㎵㎶㎷㎸㎹㎀㎁㎂㎃㎄㎺㎻㎼㎽㎾㎿㎐㎑㎒㎓㎔Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆＋－＜＝＞±×÷≠≤≥∞∴♂♀∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢⇒⇔∀∃∮∑∏＂（）［］｛｝‘’“”〔〕〈〉《》「」『』【】！＇，．／：；？＾＿｀｜￣、。·…¨〃­―∥＼∼～ˇ˘˝˚˙¸˛¿ː]+/g;
      forEach(this.option.data, (item, index) => {
        if (this.selectedRows.indexOf(item.key) !== -1) {
          item.name = item.name.replace(specialChars, '');
          newOptionData.push(item);
        } else {
          newOptionData.push(item);
        }
      });
      this.product.item_option[this.optionIndex].data = newOptionData;
      this._setCheckBoxInit();
    },
    strLengthTo25() {
      if (this.selectedRows.length === 0) {
        message.warning('25자로 처리할 옵션명을 선택하세요.');
        return false;
      }
      let newOptionData = [];
      forEach(this.option.data, (item, index) => {
        if (this.selectedRows.indexOf(item.key) !== -1) {
          item.name = item.name.substring(0, 25);
          newOptionData.push(item);
        } else {
          newOptionData.push(item);
        }
      });
      this.product.item_option[this.optionIndex].data = newOptionData;
      this._setCheckBoxInit();
    },
    setAtoZ() {
      let typeValue = 'A';
      forEach(this.option.data, (item) => {
        item.name = typeValue;
        typeValue = this._getNextLetter(typeValue);
      });
    },
    handleMenuClick(type) {
      //type:N 01__, A A.__
      let prefix;
      let typeValue;
      if (type === 'N') {
        typeValue = 1;
      } else {
        typeValue = 'A';
      }
      forEach(this.option.data, (item, index) => {
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
    },
    setBeforeOldOptionData() {
      this.product.item_option[this.optionIndex].data = cloneDeep(this.oldOptionData);
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
      this.selectAll = false;
      this.selectedRows = [];
    },
    _uniqueKey() {
      return ((1 + Math.random()) * 0x10000) | 0;
    },

    getDuplicateWords(names) {
      // 分割为单词数组
      let words = names.split(/\s+/);

      // 找出重复的单词
      let duplicateWords = this.findDuplicates(words);

      // 找出重复的数字部分，即使它们后面跟着非数字字符
      let duplicateNumbers = this.findDuplicateNumbers(words);

      // 返回重复的单词和数字部分
      return [...new Set([...duplicateWords, ...duplicateNumbers])];
    },
    findDuplicates(words) {
      let wordCounts = {};
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
      return Object.keys(wordCounts).filter(word => wordCounts[word] > 1);
    },
    findDuplicateNumbers(words) {
      let numberCounts = {};
      words.forEach(word => {
        const match = word.match(/\d+/);
        if (match) {
          const number = match[0];
          numberCounts[number] = (numberCounts[number] || 0) + 1;
        }
      });
      return Object.keys(numberCounts).filter(number => numberCounts[number] > 1);
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
    removeWordFromInputs(wordToRemove) {
      this.option.data.forEach(item => {
        item.name = item.name.split(' ').filter(word => word !== wordToRemove).join(' ');
      });

      const repeats = document.getElementsByClassName('repeat');
      for (const el of repeats) {
        el.style.height = 'auto'; // 重置高度
      }
      this.adjustRepeatHeights();
    }
  },
  mounted() {
    this.adjustRepeatHeights();
  },
}

</script>
<style lang="css" scoped>
.spec-box {
  margin-top: 5px;
  margin-right: 5px;
  margin-left: 5px;
  width: 50%;
  min-width: 580px;
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
  min-height: 50px;
  margin-left:10px;
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

:where(.css-dev-only-do-not-override-1qb1s0s).ant-btn.ant-btn-sm {
margin-bottom:5px;
}
.repeat{
  text-align: right;
  max-width:100%;
//min-height:0;
}
:where(.css-dev-only-do-not-override-1qb1s0s).ant-tag{
  margin: 0 0 5px 10px;
  cursor:pointer;
}

:where(.css-dev-only-do-not-override-1qb1s0s).ant-tag-error{
  max-width:100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ant-tag:empty {
  display: none;
}

</style>