<template>
  <a-modal title="스마트스토어 옵션 미리보기" class="modal-preview" v-model:open="showOptionPreview"
           width="30%" centered :maskClosable="false">
    <div v-for="(option, optionIndex) in product.item_option" :key="optionIndex" :data-index="optionIndex">
      <a-select
          style="width: 100%; margin-top:20px;"
          v-model:value="selectedValues[optionIndex]"
          size="default"
          :placeholder="option.name"
      >
        <template #suffixIcon>
          <DownOutlined />
        </template>
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
import {mapState} from "vuex";
import {UpOutlined,DownOutlined } from '@ant-design/icons-vue';

export default {
  name: "productDetailSpecGroup",
  computed: {
    ...mapState({
      product: state => state.product.detail,
      showOptionPreview: state => state.product.showOptionPreview,
    }),

    oldOptionData() {
      if (this.product && this.product.detail && Array.isArray(this.product.detail.item_option)) {
        return this.product.item_option.map(option => ({
          ...option,
          data: option.data ? option.data.map(item => ({ ...item })) : []
        }));
      }
      return [];
    },
  },
  components: {UpOutlined,DownOutlined},
  data() {
    return {
      selectedValues: {},
    };
  },
  methods: {
    // initializeSelectedValues() {
    //   this.product.item_option.forEach((option, index) => {
    //     this.$set(this.selectedValues, index, null);
    //   });
    // },
    closeOptionModal() {
      this.$store.commit('product/setShowOptionPreview', false);
      this.selectedValues = {};
    },
  },

  // watch: {
  //   'product.item_option'(newVal) {
  //     if (newVal && newVal.length > 0) {
  //       this.initializeSelectedValues();
  //     }
  //   }
  // },

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