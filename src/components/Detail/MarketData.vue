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
      <template v-if="initialize">
        <tr v-for="market in product.item_sync_market" :key="market.seller_id">
          <th>
            <img :src="getLogoSrc(market.market_code)" style="width: 18px;height: 18px;"/>
            {{ market.market_code }}:
          </th>
          <td>
            <a-cascader
              v-model:value="categories[market.seller_id].value"
              :options="categories[market.seller_id].options"
              placeholder="마켓별 카테고리를 선택해 주세요."
              change-on-select style="width: 100%"
              :field-names="{ label: 'cateName', value: 'cateId' }"
              :load-data="d => loadData(d,market)"
              @change="(val, info) => handleCascaderChange(val, info, market)"

            />
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>

import {ref, reactive, computed} from 'vue';
import {mapState, useStore} from 'vuex';
import CategorySettings from "@/components/Detail/categorySettings.vue";
import {CloseCircleTwoTone} from '@ant-design/icons-vue';
import {useCategoryApi} from "@/api/category";

const displayCategoryMarkets = ['lotteon']

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
  data() {
    return {
      initialize: false,
      categories: {
        // seller_id: { value: [], options: [] }
      },
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
    loadData(selectedOptions, marketInfo) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;

      // load options lazily
      setTimeout(() => {
        targetOption.loading = false;
        useCategoryApi().getMarketCategoryList({
          market_code: marketInfo.market_code,
          cate_id: targetOption.cateId
        }).then(res => {
          targetOption.children = res.data
        })
        this.categories[marketInfo.seller_id].options = [...this.categories[marketInfo.seller_id].options]
      }, 100);
    },
    handleCascaderChange(value, selectedOptions, marketInfo) {
      const marketCode = marketInfo.market_code
      const sellerId = marketInfo.seller_id
      if (!this.product.value.item_cate) {
        this.product.value.item_cate = {}
      }
      // check selectedOptions is isLeaf
      if (selectedOptions[selectedOptions.length - 1].isLeaf) {
        let accountName = marketCode.value + '|' + sellerId.value
        this.product.value.item_cate[accountName] = {
          marketCode: marketCode.value,
          cateId: value[value.length - 1],
          categoryNames: selectedOptions.map(o => o.cateName).join(' / ')
        }

        // 전시카테고리 마켓
        if(displayCategoryMarkets.includes(marketCode.value)) {
          const cateId = selectedOptions.map(o => o.cateId)
          displayCategoryLoading = true
          useCategoryApi().getDisplayCategorys({ market_code: marketCode.value, seller_id: sellerId.value, cate_id: cateId }).then(res => {
            if(res.status !== "2000") {
              message.error(res.message)
              return false;
            }
            displayCategorys.value = res.data
            displayCategorysVisible.value = true
            displayCategoryLoading = false
          }).catch(err => {
            displayCategoryLoading = false
            message.error(err.message)
            return false;
          })

        }
        return false;
      }
    },
    getMarketCategory(marketCode) {
      return useCategoryApi().getMarketCategoryList({ market_code: marketCode })
    }
  },

  mounted() {
    if (Array.isArray(this.product?.item_sync_market)) {
      const queue = []

      this.product.item_sync_market.forEach(market => {
        // 创建 分类
        this.categories[market.seller_id] = {
          value: [],
          options: []
        }
        // 加载初始数据
        queue.push(
          this.getMarketCategory(market.market_code).then(res => {
            this.categories[market.seller_id].options = res.data
          })
        )
      })

      Promise.all(queue).finally(() => {
        this.initialize = true
      })
    }
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
