<template>
  <a-modal title="스마트스토어 옵션 미리보기" class="modal-preview" v-model:open="this.$store.state.product.showOptionPreview"
           width="30%" centered :maskClosable="false" @open-change="handleOpenChange">
    <div v-for="(option, optionIndex) in this.$store.state.product.detail.item_option" :key="optionIndex" :data-index="optionIndex">
      <a-select
          style="width: 100%; margin-top:20px;"
          v-model:value="selectedValues[optionIndex]"
          size="default"
          :placeholder="option.name"
          :suffixIcon="customArrowIcon"
      >
        <a-select-option
            v-for="item in option.data"
            :key="item.key"
            :value="item.key">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>

    <template #footer>
      <div style="display: flex; justify-content: right;">
        <a-button key="submit" style="width: 100px; font-weight:700;" @click="closeOptionModal" type="primary">닫기</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script>
import {cloneDeep, forEach} from "lodash";
import {mapState, useStore} from "vuex";
import {UpOutlined,DownOutlined } from '@ant-design/icons-vue';

export default {
  name: "productDetailSpecGroup",
  computed: {
    ...mapState({
      product: state => state.product.detail
    }),

    oldOptionData() {
      if (this.$store.state.product && this.$store.state.product.detail && Array.isArray(this.$store.state.product.detail.item_option)) {
        return this.$store.state.product.detail.item_option.map(option => ({
          ...option,
          data: option.data ? option.data.map(item => ({ ...item })) : []
        }));
      }
      return [];
    },

    customArrowIcon() {
      return <DownOutlined />;
    },
  },
  components: {UpOutlined,DownOutlined},
  data() {
    return {
      selectedValues: {},
      isSelectOpen: false,
    };
  },
  methods: {
    initializeSelectedValues() {
      this.$store.state.product.detail.item_option.forEach((option, index) => {
        this.$set(this.selectedValues, index, null);
      });
    },
    closeOptionModal() {
      this.$store.commit('product/setShowOptionPreview', false);
      this.selectedValues = {};
    },

    handleOpenChange(status) {
      this.isSelectOpen = status;
    },
  },

  watch: {
    'product.detail.item_option'(newVal) {
      if (newVal && newVal.length > 0) {
        this.initializeSelectedValues();
      }
    }
  },

  mounted() {
    // this.options = cloneDeep(this.oldOptionData);
  },
}
</script>

<style>
.modal-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.modal-preview .ant-modal-header{
  margin-bottom:10px;
}

.modal-preview .ant-modal-content{
  padding:40px 50px;
}

.modal-preview .ant-modal-close{
  display: none;
}

.modal-preview .ant-modal-footer{
  margin-top:30px;
}
.modal-preview .ant-select-selection-placeholder{
  color:#000;
}
.ant-select-dropdown .ant-select-item-option-active:not(.ant-select-item-option-disabled){
  background-color:#FFEFA1;
}


</style>