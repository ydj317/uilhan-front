<template>
  <div class="plrb20 bg-white" style="padding: 20px;">
    <h3><strong>카테고리</strong></h3>
    <table class="basic-info-table" style="width: 100%; border-collapse: collapse;">
      <colgroup>
        <col style="width: 15%">
        <col >
      </colgroup>
      <tr>
        <th></th>
        <td style="display: flex;flex-direction: column; gap: 5px">
          <div style="display: flex;gap: 5px;">
          <a-input placeholder="검색 카테고리를 입력하세요." style="width: 100%" />
          <a-button type="primary" style="background-color: #1e44ff;color: white">카테고리 검색</a-button>
          </div>
          <div class="search_category_list">
            <a href="javascript:void(0)">category1</a>
          </div>
        </td>
      </tr>
      <tr v-for="(market, key) in product.item_sync_market" :key="key">
        <th><img :src="getLogoSrc(market.market_code)" style="width: 18px;height: 18px;"/>
          {{ market.market_code }}:</th>
        <td>
          <a-cascader v-model:value="categoryValue" :options="options" placeholder="마켓별 카테고리를 선택해 주세요." style="width: 100%"
                      :field-names="{ label: 'cateName', value: 'cateId' }" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

import {ref, reactive, computed} from 'vue';
import {mapState, useStore} from 'vuex';
import CategorySettings from "@/components/Detail/categorySettings.vue";
import {CloseCircleTwoTone} from '@ant-design/icons-vue';

export default {
  components: {CategorySettings, CloseCircleTwoTone},

  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    })
  },

  setup() {
    const store = useStore()
    const aProduct = computed(() => store.state.product)
    const formState = reactive({
      pid: '',
      co_pid: '',
      options: [],
      surtax: 'N',
      keyword: '',
      custom_code: '',
    });

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
      openCategorySettingsDialog,
      settingCategoryVisible,
      isShow,
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
  },
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

<style scoped>
.basic-info-table {
  border-collapse: collapse;
  width: 100%;
}

.basic-info-table th {
  text-align: right;
  padding: 10px 20px;
  font-weight: bold;
  color: #666;
}

.basic-info-table td {
  padding: 10px 20px;
}
</style>
