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
            <a-input 
              placeholder="검색 카테고리를 입력하세요." 
              style="width: 100%"
              v-model:value.trim="search_keyword"
            />
            <a-button 
              type="primary" style="background-color: #1e44ff;color: white"
              @click="searchMarketCategory"
            >카테고리 검색</a-button>
          </div>
          <div class="search_category_list">
            <a href="javascript:void(0)">category1</a>
          </div>
        </td>
      </tr>
      <tr v-for="market in product.item_sync_market" :key="market.seller_id">
        <th style="vertical-align: top">
          <img :src="getLogoSrc(market.market_code)" style="width: 18px;height: 18px;"/>
          {{ market.market_code }}:
        </th>
        <td>
          <template v-if="initialize">
            <a-cascader
              v-model:value="categories[getAccountName(market)].value"
              :options="categories[getAccountName(market)].options"
              placeholder="마켓별 카테고리를 선택해 주세요."
              change-on-select style="width: 100%"
              :field-names="{ label: 'cateName', value: 'cateId' }"
              :load-data="d => loadData(d,market)"
              @change="(val, info) => handleCascaderChange(val, info, market)"
              :disabled="market.market_prd_code !== ''"
              @reset="removeCategory(market)"
            />
            <div v-if="displayCategories[getAccountName(market)].loading" style="display: flex;align-items: center;">
              <LoadingOutlined /> <span style="color: #999999;margin-left: 5px;">전시카테고리 로딩중입니다.</span>
            </div>
            <MarketDisplayCategorys
              v-if="displayCategories[getAccountName(market)].visible"
              :marketCode="market.market_code"
              :sellerId="market.seller_id"
              :displayCategorys="displayCategories[getAccountName(market)].list"
            />
            <div
              style="display: flex;flex-direction: column;gap: 10px"
              class="mt15 scrollable-div"
              v-if="searchCategories[getAccountName(market)].length > 0"
            >
              <template v-for="(item, key) in searchCategories[getAccountName(market)]" :key="key">
                <div>
                  <a-typography-link @click="settingCategory(item, market)">
                    {{ item.cate_names.join(' / ') }}
                  </a-typography-link>
                </div>
              </template>
            </div>
          </template>
          <a-spin v-else spinning><a-input /></a-spin>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

import {ref, reactive, computed} from 'vue';
import {mapState, useStore} from 'vuex';
import CategorySettings from "@/components/Detail/categorySettings.vue";
import {CloseCircleTwoTone, LoadingOutlined} from '@ant-design/icons-vue';
import {useCategoryApi} from "@/api/category";
import {message} from "ant-design-vue";
import MarketDisplayCategorys from "@/components/Detail/MarketDisplayCategorys.vue";

const displayCategoryMarkets = ['lotteon']

export default {
  components: {MarketDisplayCategorys, CategorySettings, CloseCircleTwoTone, LoadingOutlined},
  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
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
        // market_code|seller_id: {loading: false, value: [], options: []}
      },
      displayCategories: {
        // market_code|seller_id: {loading: false, visible: false, list: [] }
      },
      search_keyword: '',
      searchCategories: {
        // market_code|seller_id: []
      }
    }
  },
  methods: {
    removeCategory(marketInfo) {
      // @todo 确认 item_disp_cate 的情况，是如何暂时数据
      const key = this.getAccountName(marketInfo)
      if (displayCategoryMarkets.includes(marketInfo.market_code)) {
        this.removeDispCategory(key)
      } else {
        delete this.product.item_cate[key];
      }
    },

    removeDispCategory(key) {
      delete this.product.item_disp_cate[key];
    },

    searchMarketCategory() {
      if (! this.search_keyword) return
      const queue = []
      this.product.item_sync_market.forEach(marketInfo => {
        if (marketInfo.market_prd_code !== '') return

        const accountName = this.getAccountName(marketInfo)
        const params = { market_code: marketInfo.market_code, search_keyword: this.search_keyword }
        queue.push(
          useCategoryApi().getAutoRecommendCategoryNames(params).then(res => {
            this.searchCategories[accountName] = res.data
          })
        )
      })
    },

    settingCategory(item, marketInfo) {
      const marketCode = marketInfo.market_code
      const sellerId = marketInfo.seller_id
      const accountName = this.getAccountName(marketInfo)
      this.categories[accountName].value = item.cate_names.join(' / ')
      if (!this.product.item_cate) {
        this.product.item_cate = {}
      }

      this.product.item_cate[accountName] = { marketCode, cateId: item.cate_ids[item.cate_ids.length - 1], categoryNames: this.categories[accountName].value }
      this.searchCategories[accountName] = []
      if(displayCategoryMarkets.includes(marketCode)) {
        const cateId = item.cate_ids;
        useCategoryApi().getDisplayCategorys({ market_code: marketCode, seller_id: sellerId, cate_id: cateId }).then(res => {
          if(res.status !== "2000") {
            message.error(res.message)
            return false;
          }
          this.displayCategories[accountName].list = res.data
          this.displayCategories[accountName].value = true
        }).catch(err => {
          message.error(err.message)
          return false;
        })
      }
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
        const accountName = this.getAccountName(marketInfo)
        this.categories[accountName].options = [...this.categories[accountName].options]
      }, 100);
    },
    handleCascaderChange(value, selectedOptions, marketInfo) {
      if (! value) return
      const marketCode = marketInfo.market_code
      const sellerId = marketInfo.seller_id
      if (!this.product.item_cate) {
        this.product.item_cate = {}
      }
      // check selectedOptions is isLeaf
      if (selectedOptions[selectedOptions.length - 1].isLeaf) {
        let accountName = this.getAccountName(marketInfo)
        this.product.item_cate[accountName] = {
          marketCode: marketCode,
          cateId: value[value.length - 1],
          categoryNames: selectedOptions.map(o => o.cateName).join(' / ')
        }

        // 전시카테고리 마켓
        if(displayCategoryMarkets.includes(marketCode)) {
          const cateId = selectedOptions.map(o => o.cateId)
          this.displayCategories[accountName].loading = true
          useCategoryApi().getDisplayCategorys({ market_code: marketCode, seller_id: sellerId, cate_id: cateId }).then(res => {
            if(res.status !== "2000") {
              message.error(res.message)
              return false;
            }
            this.displayCategories[accountName].loading = false
            this.displayCategories[accountName].list = res.data
            this.displayCategories[accountName].visible = true
          }).catch(err => {
            this.displayCategories[accountName].loading = false
            message.error(err.message)
            return false;
          })
        }
        return false;
      }
    },
    getAccountName(market) {
      return market.market_code + '|' + market.seller_id
    },
    getMarketCategory(marketCode) {
      return useCategoryApi().getMarketCategoryList({ market_code: marketCode })
    },
  },

  mounted() {
    if (Array.isArray(this.product?.item_sync_market)) {
      const queue = []

      this.product.item_sync_market.forEach(market => {
        let accountName = this.getAccountName(market)

        // 创建 分类
        this.categories[accountName] = {
          loading: true,
          value: [],
          options: []
        }
        this.displayCategories[accountName] = {loading: false, visible: false, list: [] }
        this.searchCategories[accountName] = []
        // 加载初始数据
        queue.push(
          this.getMarketCategory(market.market_code).then(res => {
            this.categories[accountName].options = res.data
            // initMarketCategory
            if (this.product.item_cate && this.product.item_cate[accountName]) {
              this.categories[accountName].value = this.product.item_cate[accountName].categoryNames
            }
          }).finally(()=> {
            this.categories[accountName].loading = false
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
