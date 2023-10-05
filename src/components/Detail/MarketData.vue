<template>
  <div class="plrb20 bg-white" style="margin-top: -1px;">
    <!--title-->
    <div>
      <div class="detail-basic">
        <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 1 }">

          <a-descriptions-item label="카테고리 설정">
            <div style="position: relative;">
              <div style="position: absolute;top: 0px;right: 20px;">
                <a-button size="small" type="primary" @click="openCategorySettingsDialog">설정</a-button>
              </div>
              <div style="display: flex;flex-direction: column;gap: 15px">
                <div v-for="(item, key) in product.item_cate" :key="key">
                  {{ key }} : {{ item.categoryNames }}
                </div>
                <div v-if="!product.item_cate || product.item_cate.lenght < 1">
                  <span style="color: #999999;">카테고리를 설정해 주세요.</span>
                </div>
              </div>
            </div>
            <category-settings :isShow="settingCategoryVisible" @cancelDialog="isShow" />
          </a-descriptions-item>

          <a-descriptions-item label="상품고시">
            <a-form-item>
              <a-select v-model:value="formState.mandatory_val" placeholder="상품고시 선택해주세요.">
                <a-select-option v-for="(item, key) in formState.mandatory" :key="key" :value="item.value">{{ item.label
                }}</a-select-option>
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
              <a-input v-model:value="formState.item_shipping_fee" placeholder="배송비 입력" />
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="키워드">
            <a-form-item>
              <a-input v-model:value="formState.keyword" placeholder="최대 255자내로 입력해주세요" />
            </a-form-item>
          </a-descriptions-item>
        </a-descriptions>
      </div>

    </div>
  </div>
</template>

<script>

import { ref, reactive, computed, onBeforeUnmount } from 'vue';
import { mapState, useStore } from 'vuex';
import CategorySettings from "@/components/Detail/categorySettings.vue";
import { useMandatoryApi } from "@/api/mandatory";
export default {
  components: { CategorySettings },

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
      mandatory: [],
      mandatory_val: '선택',
      keyword: null,
      item_is_free_delivery: false,
      item_shipping_fee: ''
    });

    let settingCategoryVisible = ref(false);

    const isShow = (visible) => {
      settingCategoryVisible.value = visible;
    }

    const getMandatory = () => {
      useMandatoryApi().getList().then((res) => {
        formState.mandatory = res;
      })
    }
    const openCategorySettingsDialog = () => {
      settingCategoryVisible.value = true;
    }
    return {
      aProduct,
      formState,
      openCategorySettingsDialog,
      settingCategoryVisible,
      isShow,
      getMandatory
    }
  },

  mounted() {
    console.log('==0==')
    console.log(this.product)

    this.getMandatory();
    // this.formState.mandatory_val = this.product;
    this.formState.item_shipping_fee = this.product.item_shipping_fee;
    this.formState.item_is_free_delivery = this.product.item_is_free_delivery === 'T' ? true : false;

    this.formState.mandatory_val = this.product.item_mandatory ? this.product.item_mandatory : '선택';

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
