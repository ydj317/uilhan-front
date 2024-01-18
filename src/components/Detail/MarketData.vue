<template>
  <div class="plrb20 bg-white" style="padding: 20px;">
    <h1><strong>카테고리</strong></h1>

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
                <div v-for="(market, key) in product.item_sync_market" :key="key"
                     style="display: flex; align-items: center; gap: 6px;">
                  <img :src="getLogoSrc(market.market_code)" style="width: 18px;height: 18px;"/>
                  {{ market.seller_id }}:

                  <div style="display: flex; flex-direction: column;">
                    <div v-if="(product.item_cate !== null && !product.item_cate[market.market_code + '|' + market.seller_id]) || !product.item_cate"
                         style="color: #999999;">
                      카테고리 미설정
                    </div>



                    <div v-for="(item, cateKey) in product.item_cate" :key="cateKey">
                      <div v-if="cateKey == market.market_code + '|' + market.seller_id">

                        <a-tag color="#ffd117">표준</a-tag>: {{ item.categoryNames }}
                        <CloseCircleTwoTone two-tone-color="#eb2f96" style="cursor: pointer;"
                                            @click="removeCategory(cateKey)" v-if="market.market_prd_code === ''"/>
                      </div>
                    </div>

                    <div v-if="['lotteon'].includes(market.market_code) && ((product.item_disp_cate !== null && !product.item_disp_cate[market.market_code + '|' + market.seller_id]) || !product.item_disp_cate)"
                         style="color: #999999;">
                      전시 카테고리 미설정
                    </div>
                    <div v-for="(item, cateKey) in product.item_disp_cate" :key="cateKey">
                      <div v-if="cateKey == market.market_code + '|' + market.seller_id">
                        <a-tag color="#87d068">전시</a-tag>: {{ item.categoryNames }}
                        <CloseCircleTwoTone two-tone-color="#eb2f96" style="cursor: pointer;"
                                            @click="removeDispCategory(cateKey)" v-if="market.market_prd_code === ''"/>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <category-settings :isShow="settingCategoryVisible" @cancelDialog="isShow"/>
          </a-descriptions-item>

          <a-descriptions-item label="상품고시">
            <a-form-item>
              <a-select v-model:value="formState.mandatory_val" placeholder="상품고시 선택해주세요.">
                <a-select-option value="선택">선택</a-select-option>
                <a-select-option v-for="(item, key) in formState.mandatory" :key="key" :value="item.value">{{
                    item.label
                  }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-descriptions-item>

        </a-descriptions>
      </div>

    </div>
  </div>
</template>

<script>

import {ref, reactive, computed, defineAsyncComponent} from 'vue';
import {mapState, useStore} from 'vuex';
import CategorySettings from "@/components/Detail/categorySettings.vue";
import {useMandatoryApi} from "@/api/mandatory";
import {CloseCircleTwoTone} from '@ant-design/icons-vue';

export default {
  components: {CategorySettings, CloseCircleTwoTone},

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
      surtax: 'N',
      mandatory: [],
      mandatory_val: '선택',
      keyword: '',
      custom_code: '',
    });

    let settingCategoryVisible = ref(false);

    const isShow = (visible) => {
      settingCategoryVisible.value = visible;
    }

    const getMandatory = () => {
      useMandatoryApi().getList().then((res) => {
        formState.mandatory = res.data;
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
      getMandatory,
    }
  },
  methods: {
    removeCategory(key) {
      delete this.product.item_cate[key];
    },

    removeDispCategory(key) {
      delete this.product.item_disp_cate[key];
    },

    getLogoSrc(marketCode) {
      try {
        return require(`../../assets/img/list/market-logo/${marketCode}.png`);
      } catch (error) {
        return "../../assets/img/temp_image.png"
      }
    },
  },

  mounted() {
    this.getMandatory();

    // this.formState.mandatory_val = this.product;

    this.formState.mandatory_val = this.product.item_mandatory ? this.product.item_mandatory : '선택';

    this.formState.surtax = this.product.item_surtax;
    this.formState.custom_code = this.product.item_custom_code;

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
