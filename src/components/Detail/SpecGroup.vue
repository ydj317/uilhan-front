<template>
  <div class="spec-box">
    <table>
      <!--옵션그룹,옵션일괄설정-->
      <thead>
      <tr>
        <!--그룹명 영역-->
        <th style="background-color: #ebeff0;">
          <div class="spec-option-group">
            <span class="spec-font">옵션그룹{{optionIndex + 1}}</span>
            <a-input class="spec-option-input-size"  v-model:value="option.name" size="default" placeholder="옵션그룹" />
            <span class="spec-count"><span :style="option.name.length > 25 ? 'color:red;' : ''">{{ option.name.length }}</span> / 25</span>
            <a-button @click="deleteSpecGroup(optionIndex)" class="spec-grop-delete" type="primary" danger>삭제</a-button>
          </div>
        </th>
      </tr>
      <tr>
        <!--옵션값 일괄 설정 영역-->
        <th>
          <div class="spec-option-header">
            <div class="spec-option-left">
              <a-checkbox class="spec-checkbox" v-model:checked="selectAll" @change="onCheckAllChange"></a-checkbox>
              <span class="spec-font">옵션명</span>
            </div>
            <div class="spec-option-button">
              <a-button @click="deleteOptionName" class="spec-right-button" type="primary">삭제</a-button>
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
            <label class="ant-checkbox-wrapper spec-checkbox" :class="{'ant-checkbox-wrapper-checked': selectedRows.indexOf(item.key) !== -1}">
              <span class="ant-checkbox" :class="{'ant-checkbox-checked': selectedRows.indexOf(item.key) !== -1}"><input type="checkbox" class="ant-checkbox-input" v-model="selectedRows" :value="item.key" @change="updateSelectAll"><span class="ant-checkbox-inner"></span></span>
            </label>
            <a-input class="input-size"  v-model:value="item.name" size="default" placeholder="옵션명" />
            <span class="spec-count"><span :style="item.name.length > 25 ? 'color:red;' : ''">{{ item.name.length }}</span> / 25</span>
            <a-button @click="addSpecOptionName(optionIndex)" v-if="option.data.length === (index + 1)" class="spec-add-option-name-button" type="primary">추가</a-button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { forEach } from "lodash";
import { mapState } from "vuex";

export default {
  name: "productDetailSpecGroup",
  computed: {
    ...mapState(["product"]),
  },
  props: ['option', 'optionIndex'],
  data() {
    return {
      selectAll: false,
      selectedRows: [],
    };
  },
  methods: {
    deleteSpecGroup(optionIndex) {
      this.product.item_option.splice(optionIndex, 1);
    },
    addSpecOptionName(optionIndex) {
      this.product.item_option[optionIndex].data.push({key:this._uniqueKey(), name: ''});
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
    },
    _uniqueKey() {
      return ((1 + Math.random()) * 0x10000) | 0;
    }
  }
}
</script>
<style lang="css" scoped>
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