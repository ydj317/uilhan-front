<template>
  <a-modal title="일괄변경" class="modal-batch" v-model:open="showOptionBatchChange"
           width="30%" centered ::maskClosable="false">

<!--    <table>-->
<!--      <thead>-->
<!--      <tr>-->
<!--        <th><input type="checkbox"></th>-->
<!--        <th>품목명</th>-->
<!--        <th></th>-->
<!--      </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--      <tr>-->
<!--        <td><input type="checkbox"></td>-->
<!--        <td>11</td>-->
<!--        <td><input type="text"></td>-->
<!--      </tr>-->
<!--      </tbody>-->
<!--    </table>-->



    <template #footer>
      <div style="display: flex; justify-content: right;">
        <a-button key="submit" style="width: 100px; font-weight:700; margin-right: 160px" @click="closeOptionModal" type="primary">적용</a-button>
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
      showOptionBatchChange: state => state.product.showOptionBatchChange,
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
      this.$store.commit('product/setShowOptionBatchChange', false);
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
.modal-batch {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.modal-batch .ant-modal-header{
  margin-bottom:10px;
}

.modal-batch .ant-modal-content{
  padding:40px 50px;
}

.modal-batch .ant-modal-close{
  display: none;
}

.modal-batch .ant-modal-footer{
  margin-top:30px;
}
.modal-batch .ant-select-selection-placeholder{
  color:#000;
}
.ant-select-dropdown .ant-select-item-option-active:not(.ant-select-item-option-disabled){
  background-color:#FFEFA1;
}


</style>