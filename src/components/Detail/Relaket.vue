<template>
  <div class="plrb20 bg-white" style="margin-top: -1px;">
    <!--title-->
    <div>
      <div class="detail-basic">
        <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 1}" >

          <a-descriptions-item label="카테고리 검색">
            <div style="position: relative;">
              <div style="position: absolute;top: 0;right: 20px;">
                <a-button size="small" type="primary" @click="openCategorySettingsDialog">선택</a-button>
              </div>
              <div style="display: flex;flex-direction: column;gap: 15px">
                <div v-for="(item,key) in product.item_cate" :key="key">
                  {{key}} : {{item.categoryNames}}
                </div>
              </div>
            </div>
            <category-settings :isShow="settingCategoryVisible" @cancelDialog="isShow"/>
          </a-descriptions-item>

          <a-descriptions-item label="상품고시">
              <a-form-item>
                <a-select v-model:value="formState.mandatory_val" :options="formState.mandatory" placeholder="상품고시 선택해주세요.">
                </a-select>
              </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="통관유형">
              <a-form-item>
                <a-select v-model:value="formState.surtax" placeholder="통관유형 선택해주세요.">
                  <a-select-option value="Y">면세</a-select-option>
                  <a-select-option value="N">과세</a-select-option>
                </a-select>
              </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="배송비">
            <a-form-item>
              <p>
                <a-checkbox v-model:checked="formState.item_is_free_delivery">무료 배송</a-checkbox>
              </p>
              <a-input v-model:value="formState.item_shipping_fee" placeholder="배송비 입력"/>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="키워드">
            <a-form-item>
              <a-input v-model:value="formState.keyword" placeholder="최대 255자내로 입력해주세요"/>
            </a-form-item>
          </a-descriptions-item>
        </a-descriptions>
      </div>

    </div>
  </div>
</template>

<script>
import {mandatoryList} from 'config/Relaket/mandatory'
import {ref, reactive, computed, onBeforeUnmount} from 'vue';
import {mapState, useStore} from 'vuex';
import CategorySettings from "@/components/Detail/categorySettings.vue";

export default {
  components: {CategorySettings, mandatoryList},

  computed: {
    ...mapState([
      'product',
    ])
  },

  setup() {
    const store = useStore()
    const aProduct = computed(() => store.state.product)
    const formState = reactive({
      pid: '',
      co_pid: '',
      options: [],
      surtax: 'Y',
      mandatory: mandatoryList(),
      mandatory_val: '선택',
      keyword: null,
      item_is_free_delivery: false,
      item_shipping_fee: ''
    });

    const marketCategorys = [
      {
        accountID: 'coupang',
        categoryNames: '패션의류/런닝/트레이닝/요가복/여성런닝복',
      },
      {
        accountID: '11st',
        categoryNames: '패션의류/런닝/트레이닝/요가복/여성런닝복',
      },
    ]
    let settingCategoryVisible = ref(false);

    const isShow = (visible) => {
      settingCategoryVisible.value = visible;
    }

    const openCategorySettingsDialog = () => {
      settingCategoryVisible.value = true;
    }
    return {
      aProduct,
      formState,
      marketCategorys,
      openCategorySettingsDialog,
      settingCategoryVisible,
      isShow
    }
  },

  mounted() {

    // this.formState.mandatory_val = this.product;
    this.formState.item_shipping_fee = this.product.item_shipping_fee;
    this.formState.item_is_free_delivery = this.product.item_is_free_delivery;

    this.formState.mandatory_val = this.product.item_mandatory;

    if (this.product.item_sync_keyword === 'null') {
      this.product.item_sync_keyword = '';
    }
    this.formState.keyword = this.product.item_sync_keyword;
    this.formState.surtax = this.product.item_surtax;

    // 데이터 관리용
    this.product.formState = this.formState;
  }
}

</script>

<style>
.detail-basic .ant-descriptions-item-label {
  width: 200px;
}

.detail-basic .ant-form-item {
  margin-bottom: 0;
}
</style>
