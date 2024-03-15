<template>
  <a-spin :spinning="loading">
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
                @click="searchMarketCategory(search_keyword)"
              >카테고리 검색</a-button>
            </div>
            <div class="search_category_list">
              <a href="javascript:void(0)">추천 카테고리: {{suggestCategory.join(' / ') || '-'}}</a>
            </div>
          </td>
        </tr>
        <tr v-for="market in marketList" :key="market.seller_id">
          <th style="vertical-align: top">
            <img :src="getLogoSrc(market.market_code)" style="width: 18px;height: 18px;"/>
            {{ market.market_code }}:
          </th>
          <td>
            <template v-if="initialize">
              <a-cascader
                v-model:value="categories[market.accountName].value"
                :options="categories[market.accountName].options"
                placeholder="마켓별 카테고리를 선택해 주세요."
                change-on-select style="width: 100%"
                :field-names="{ label: 'cateName', value: 'cateId' }"
                :load-data="d => loadData(d, market)"
                @change="(val, info) => handleCascaderChange(val, info, market)"
                :disabled="market.market_prd_code !== ''"
                @reset="removeCategory(market.accountName)"
              />

              <!-- disp 的情况 -->
              <template v-if="displayCategoryMarkets.includes(market.market_code)">
                <!-- loading 的时候，除了 loading 其他什么都不显示 -->
                <div
                  v-if="displayCategories[market.accountName].loading"
                  style="display: flex;align-items: center;margin-top: 10px"
                >
                  <LoadingOutlined /> <span style="color: #999999;margin-left: 5px;">전시카테고리 로딩중입니다.</span>
                </div>
                <template v-else> <!-- 非 loading 的情况 -->
                  <!-- 显示选择分类时, cascader(readonly) 起到了 전시 카테고리 미설정 文字的作用 -->
                  <div
                    v-if="displayCategories[market.accountName].visible || (product.item_disp_cate && product.item_disp_cate[market.accountName])"
                    style="display: flex;align-items: flex-end;gap: 10px;"
                  >
                    <MarketDisplayCategorys
                      style="flex: 1 1 auto;"
                      :market-prd-code="market.market_prd_code"
                      :marketCode="market.market_code"
                      :sellerId="market.seller_id"
                      :displayCategorys="displayCategories[market.accountName].list"
                    />
                  </div>
                  <div
                    v-else
                    v-show="! product.item_disp_cate || ! product.item_disp_cate[market.accountName]"
                    style="color: #999999;margin-top: 10px;"
                  >전시 카테고리 미설정</div>
                </template>
              </template>
              <div
                style="display: flex;flex-direction: column;gap: 10px"
                class="mt15 scrollable-div"
                v-if="searchCategories[market.accountName].length > 0"
              >
                <template v-for="(item, key) in searchCategories[market.accountName]" :key="key">
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
  </a-spin>
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
  props: {
    suggestCategory: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
    marketList() {
      if (Array.isArray(this.product.item_sync_market) && this.product.item_sync_market.length > 0) {
        return this.product.item_sync_market.map(info => ({
          ...info,
          accountName: info.market_code + '|' + info.seller_id
        }))
      } else {
        return []
      }
    }
  },
  watch: {
    // 应用 搜索 keywords 得到的推荐分类
    async suggestCategory(val) {
      if (val.length === 0) return
      this.loading = true
      try {
        // 根据叶子分类搜索匹配的类目 (搜索结果保存到了 this.searchCategories)
        await this.searchMarketCategory(val[val.length - 1])
        await this.$nextTick()

        // 遍历每个 market, 确认 this.searchCategories 中对应的搜索结果
        const queue = []
        this.marketList.forEach(marketInfo => {
          // 如果没有搜索到，返回
          const cateList = this.searchCategories[marketInfo.accountName]
          if (! Array.isArray(cateList) || cateList.length === 0) return

          // 应用搜索结果的第一条, 应用后，如果是 lotteon ，直接应用匹配的第一个 disp 分类
          queue.push(this.settingCategory(cateList[0], marketInfo).then(() => {
            if (! this.displayCategories[marketInfo.accountName]) return
            if (this.displayCategories[marketInfo.accountName].list.length === 0) return

            const item = this.displayCategories[marketInfo.accountName].list[0]
            if (!this.product.item_disp_cate) {
              this.product.item_disp_cate = {}
            }

            this.product.item_disp_cate[marketInfo.accountName] = {
              marketCode: marketInfo.market_code,
              cateId: item.cate_ids[item.cate_ids.length - 1],
              categoryNames: item.cate_names.join(' / ')
            }
          }))
        })
        await Promise.all(queue)
      } catch(e) {
        console.log('MarketData:suggestCategory', e)
      }
      this.loading = false
    }
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
      loading: false,
      initialize: false,
      displayCategoryMarkets,
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
    // 删除分类
    removeCategory(key) {
      delete this.product.item_cate[key];
    },

    // search input 搜索
    searchMarketCategory(search_keyword) {
      if (! search_keyword) return
      this.loading = true
      const queue = []
      this.marketList.forEach(marketInfo => {
        if (marketInfo.market_prd_code !== '') return

        const params = { market_code: marketInfo.market_code, search_keyword: search_keyword }
        queue.push(
          useCategoryApi().getAutoRecommendCategoryNames(params).then(res => {
            this.searchCategories[marketInfo.accountName] = res.data
          })
        )
      })
      return Promise.all(queue).then(() => {
        this.loading = false
      })
    },

    // 搜索结果列表，点击应用到分类
    async settingCategory(item, marketInfo) {
      const marketCode = marketInfo.market_code
      const sellerId = marketInfo.seller_id
      const accountName = marketInfo.accountName
      this.categories[accountName].value = item.cate_names.join(' / ')
      if (!this.product.item_cate) {
        this.product.item_cate = {}
      }

      this.product.item_cate[accountName] = { marketCode, cateId: item.cate_ids[item.cate_ids.length - 1], categoryNames: this.categories[accountName].value }
      this.searchCategories[accountName] = []

      if(this.displayCategoryMarkets.includes(marketCode)) {
        const cateId = item.cate_ids;
        this.displayCategories[accountName].loading = true
        return useCategoryApi().getDisplayCategorys({ market_code: marketCode, seller_id: sellerId, cate_id: cateId }).then(res => {
          if(res.status !== "2000") {
            message.error(res.message)
            return false;
          }
          this.displayCategories[accountName].list = res.data
          this.displayCategories[accountName].visible = true
        }).catch(err => {
          message.error(err.message)
          return false;
        }).finally(() => {
          this.displayCategories[accountName].loading = false
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

    // 分类级联加载子分类
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
        const accountName = marketInfo.accountName
        this.categories[accountName].options = [...this.categories[accountName].options]
      }, 100);
    },

    async handleCascaderChange(value, selectedOptions, marketInfo) {
      if (! value) return
      const marketCode = marketInfo.market_code
      const sellerId = marketInfo.seller_id
      const accountName = marketInfo.accountName
      if (!this.product.item_cate) {
        this.product.item_cate = {}
      }
      // check selectedOptions is isLeaf
      if (selectedOptions[selectedOptions.length - 1].isLeaf) {
        this.product.item_cate[accountName] = {
          marketCode: marketCode,
          cateId: value[value.length - 1],
          categoryNames: selectedOptions.map(o => o.cateName).join(' / ')
        }

        // 전시카테고리 마켓
        if(this.displayCategoryMarkets.includes(marketCode)) {
          const cateId = selectedOptions.map(o => o.cateId)
          this.displayCategories[accountName].loading = true
          return useCategoryApi().getDisplayCategorys({ market_code: marketCode, seller_id: sellerId, cate_id: cateId }).then(res => {
            if(res.status !== "2000") {
              message.error(res.message)
              return false;
            }

            this.displayCategories[accountName].list = res.data
            this.displayCategories[accountName].visible = true
          }).catch(err => {
            message.error(err.message)
            return false;
          }).finally(()=> {
            this.displayCategories[accountName].loading = false
          })
        }

        return false;
      }
    },

    getMarketCategory(marketCode) {
      return useCategoryApi().getMarketCategoryList({ market_code: marketCode })
    },
  },

  mounted() {
    if (Array.isArray(this.product?.item_sync_market)) {
      const queue = []

      this.marketList.forEach(market => {
        let accountName = market.accountName
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
