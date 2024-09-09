<template>
  <a-spin :spinning="loading">
    <div class="bg-white" style="margin-top:20px;">
      <h3><strong>카테고리</strong></h3>
      <table class="basic-info-table" style="width: 100%; border-collapse: collapse;">
        <colgroup>
          <col style="width: 150px;">
          <col>
          <col style="width: 200px;">
        </colgroup>
        <tr>
          <th></th>
          <td colspan="2">
            <div style="display: flex;gap: 5px;">
              <a-input
                placeholder="검색 카테고리를 입력하세요."
                style="width: 100%"
                v-model:value.trim="search_keyword"
                @keyup.enter="searchMarketCategory(search_keyword)"
              />
              <a-button
                type="primary" style="background-color: #2171e2;color: white"
                @click="searchMarketCategory(search_keyword)"
              >카테고리 검색
              </a-button>
            </div>
            <div class="search_category_list" v-if="suggestCategory.length">
              <a href="javascript:void(0)" style="color: #999999"><strong>추천 카테고리:</strong>
                {{ suggestCategory.join(" / ") || "-" }}</a>
            </div>
          </td>
        </tr>
        <tr v-for="market in marketList" :key="market.seller_id">
          <th style="text-align: right">
            <a-tooltip :title="market.seller_id">
              <img :src="getLogoSrc(market.market_code)" style="width: 25px;height: 25px;" />
            </a-tooltip>

            <span style="position: absolute" v-if="['auction', 'gmarket'].includes(market.market_code)">
              <a-tooltip>
              <template #title>
                <div>그룹상품으로 표기된 카테고리는 옵션 추가가 불가하기에 매개 옵션이 각각 단일상품으로 등록됩니다.</div>
              </template>
                <ExclamationCircleOutlined />
              </a-tooltip>
            </span>
<!--            {{ market.market_code }}:-->
          </th>
          <td>
            <template v-if="initialize">


              <a-select
                v-model:value="categories[market.accountName].value"
                placeholder="마켓별 카테고리를 선택해 주세요."
                change-on-select style="width: 100%"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :disabled="market.market_prd_code !== ''"
                @change="(val, info) => handleCascaderChange(val, info, market)"
                @reset="removeCategory(market.accountName)"
              >
                <a-select-option v-for="(option, key) in categories[market.accountName].options" :value="option.cate_ids" :key="key">
                  <a-tag v-if="option.is_group" color="#108ee9">그룹상품</a-tag>
                  {{ option.cate_names }}
                </a-select-option>
              </a-select>

              <!-- disp 的情况 -->
              <template v-if="displayCategoryMarkets.includes(market.market_code)">
                <!-- loading 的时候，除了 loading 其他什么都不显示 -->
                <div
                  v-if="displayCategories[market.accountName].loading"
                  style="display: flex;align-items: center;margin-top: 10px"
                >
                  <LoadingOutlined />
                  <span style="color: #999999;margin-left: 5px;">전시카테고리 로딩중입니다.</span>
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
                  >전시 카테고리 미설정
                  </div>
                </template>
              </template>
            </template>
            <a-spin v-else spinning>
              <a-input />
            </a-spin>
          </td>
          <td style="display: flex;align-items: flex-start;">
            <div style="display: flex;justify-content: flex-end;align-items: flex-start; gap: 5px">
              <a-input
                v-model:value="search_keyword_by_market[market.accountName]" placeholder="검색 카테고리를 입력하세요."
                @keyup.enter="searchCategoryByMarket(market, search_keyword_by_market[market.accountName])"
                style="width: 200px"
                :disabled="market.market_prd_code !== ''"
                allow-clear
              />
              <a-button
                type="primary"
                style="background-color: #2171e2;color: white"
                @click="searchCategoryByMarket(market,search_keyword_by_market[market.accountName])"
              >검색
              </a-button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </a-spin>
</template>

<script>

import { ref, reactive, computed } from "vue";
import { mapState, useStore } from "vuex";
import CategorySettings from "@/components/Detail/categorySettings.vue";
import { CloseCircleTwoTone, LoadingOutlined, ExclamationCircleOutlined} from "@ant-design/icons-vue";
import { useCategoryApi } from "@/api/category";
import { message } from "ant-design-vue";
import MarketDisplayCategorys from "@/components/Detail/MarketDisplayCategorys.vue";
import { useProductApi } from "@/api/product";
import { forEach } from "lodash";

const displayCategoryMarkets = ["lotteon"];

export default {
  components: { MarketDisplayCategorys, CategorySettings, CloseCircleTwoTone, LoadingOutlined, ExclamationCircleOutlined },
  props: {
    suggestCategory: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    ...mapState({
      product: (state) => state.product.detail,
      useCategoryMetaMarket: (state) => state.market.use_category_meta_market
    }),
    marketList() {
      if (Array.isArray(this.product.item_sync_market) && this.product.item_sync_market.length > 0) {
        return this.product.item_sync_market.map(info => ({
          ...info,
          accountName: info.market_code + "|" + info.seller_id
        }));
      } else {
        return [];
      }
    }
  },
  watch: {
    // 应用 搜索 keywords 得到的推荐分类
    async suggestCategory() {
    }
  },
  setup() {
    const store = useStore();
    const aProduct = computed(() => store.state.product);
    const formState = reactive({
      pid: "",
      co_pid: "",
      options: [],
      surtax: "N",
      keyword: "",
      custom_code: ""
    });

    let settingCategoryVisible = ref(false);

    const isShow = (visible) => {
      settingCategoryVisible.value = visible;
    };

    const openCategorySettingsDialog = () => {
      settingCategoryVisible.value = true;
    };

    return {
      aProduct,
      formState,
      openCategorySettingsDialog,
      settingCategoryVisible,
      isShow
    };
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
      search_keyword: "",
      search_keyword_clone: "",
      search_keyword_by_market: {
        // market_code|seller_id: ''
      },
      searchCategories: {
        // market_code|seller_id: []
      },
      initMetaData : {
        recommendedOptList: [], //추천 옵션 리스트
        recommendedOpt: [] // 선택한 추천옵션 데이타
      }
    };
  },
  methods: {
    // 删除分类
    removeCategory(key) {
      delete this.product.item_cate[key];
    },

    // search input 搜索
    searchMarketCategory(search_keyword) {
      if (!search_keyword) return;
      this.loading = true
      const queue = [];
      this.marketList.forEach(marketInfo => {
        if (marketInfo.market_prd_code !== "") return;

        const params = { market_code: marketInfo.market_code, search_keyword: search_keyword };
        queue.push(
          useCategoryApi().getAutoRecommendCategoryNames(params).then(async res => {
            this.categories[marketInfo.accountName].options = res.data.map(item => {
              return {
                cate_ids: item.cate_ids[item.cate_ids.length - 1],
                cate_names: item.cate_names.join(" / ")
              };
            });
            if (res.data.length) {
              this.search_keyword_clone = search_keyword;
              // this.categories[marketInfo.accountName].value = res.data[0]["cate_names"].join("/");
              this.categories[marketInfo.accountName].value =this.categories[marketInfo.accountName].options[0]["cate_ids"];
              const leafCateId = res.data[0]["cate_ids"][res.data[0]["cate_ids"].length - 1];
              this.product.item_cate[marketInfo.accountName] = {
                accountName : marketInfo.accountName,
                marketCode: marketInfo.market_code,
                cateId: leafCateId,
                categoryNames: res.data[0]["cate_names"].join("/"),
                keyword: search_keyword,
                meta_data:{
                  //추천 옵션 리스트
                  recommendedOptList: [],
                  // 선택한 추천옵션 데이타
                  recommendedOpt: this.product.item_option.map(item => {
                    return {
                      option_name : item.name,
                      recommended_id : ''
                    }
                  })
                }
              };

              if (this.displayCategoryMarkets.includes(marketInfo.market_code)) {
                await this.getDisplayCategory(marketInfo.market_code, res.data[0]["cate_ids"], marketInfo.seller_id, marketInfo.accountName);
              }

              // 추천옵션 사용마켓일경우 추천옵션 리스트 조회하여 초기데이타 넣어줌
              if (this.useCategoryMetaMarket.includes(marketInfo.market_code)) {
                await this.getCategoryMeta(marketInfo, leafCateId)
              }

            } else {
              this.product.item_cate[marketInfo.accountName] = {};
              this.categories[marketInfo.accountName].value = [];

              this.displayCategories[marketInfo.accountName].list = [];
              this.displayCategories[marketInfo.accountName].visible = false;
              this.product.item_disp_cate[marketInfo.accountName] = {};
            }
            this.searchCategories[marketInfo.accountName] = res.data;
          })
        );
        this.search_keyword_by_market[marketInfo.accountName] = search_keyword;
      });
      return Promise.all(queue).then(() => {
        this.loading = false
      });
    },

    searchCategoryByMarket(market, searchInput) {
      if (!searchInput) return;
      this.loading = true;

      const params = { market_code: market.market_code, search_keyword: searchInput };
      useCategoryApi().getAutoRecommendCategoryNames(params).then(async res => {
        this.categories[market.accountName].options = res.data.map(item => {
          return {
            cate_ids: item.cate_ids[item.cate_ids.length - 1],
            cate_names: item.cate_names.join(" / ")
          };
        });

        if (res.data.length) {
          // this.categories[market.accountName].value = res.data[0]["cate_names"].join("/");
          this.categories[market.accountName].value =this.categories[market.accountName].options[0]["cate_ids"];
          this.product.item_cate[market.accountName] = {
            accountName: market.accountName,
            marketCode: market.market_code,
            cateId: res.data[0]["cate_ids"][res.data[0]["cate_ids"].length - 1],
            categoryNames: res.data[0]["cate_names"].join("/"),
            keyword: this.search_keyword_clone || searchInput,
            meta_data: {
              //추천 옵션 리스트
              recommendedOptList: [],
              // 선택한 추천옵션 데이타
              recommendedOpt: this.product.item_option.map(item => {
                return {
                  option_name : item.name,
                  recommended_id : ''
                }
              })
            }
          };
          if (this.displayCategoryMarkets.includes(market.market_code)) {
            await this.getDisplayCategory(market.market_code, res.data[0]["cate_ids"], market.seller_id, market.accountName);
          }
          // 추천옵션 불러오기
          if (this.useCategoryMetaMarket.includes(market.market_code)) {
            await this.getCategoryMeta(market, res.data[0]["cate_ids"][res.data[0]["cate_ids"].length - 1])
          }

        } else {
          this.product.item_cate[market.accountName] = {};
          this.categories[market.accountName].value = [];

          this.displayCategories[market.accountName].list = [];
          this.displayCategories[market.accountName].visible = false;
          this.product.item_disp_cate[market.accountName] = {};
        }
        this.searchCategories[market.accountName] = res.data;
      }).finally(() => {
        this.loading = false;
      });
    },

    // 搜索结果列表，点击应用到分类
    async settingCategory(item, marketInfo) {
      const marketCode = marketInfo.market_code;
      const sellerId = marketInfo.seller_id;
      const accountName = marketInfo.accountName;
      this.categories[accountName].value = item.cate_names.join(" / ");
      if (!this.product.item_cate) {
        this.product.item_cate = {};
      }

      this.product.item_cate[accountName] = {
        marketCode,
        cateId: item.cate_ids[item.cate_ids.length - 1],
        categoryNames: this.categories[accountName].value
      };
      this.searchCategories[accountName] = [];
      this.search_keyword_by_market[accountName] = "";

      if (this.displayCategoryMarkets.includes(marketCode)) {
        const cateId = item.cate_ids;
        this.displayCategories[accountName].loading = true;
        await this.getDisplayCategory(marketCode, cateId, sellerId, accountName);
      }
    },

    getLogoSrc(marketCode) {
      try {
        return require(`../../assets/img/list/market-logo/${marketCode}.png`);
      } catch (error) {
        return "../../assets/img/temp_image.png";
      }
    },

    async handleCascaderChange(value, selectedOptions, marketInfo) {
      if (!value) return;
      const marketCode = marketInfo.market_code;
      const sellerId = marketInfo.seller_id;
      const accountName = marketInfo.accountName;
      if (!this.product.item_cate) {
        this.product.item_cate = {};
      }
      let keyword = this.product.item_cate?.[accountName]?.keyword || this.search_keyword_clone;
      this.product.item_cate[accountName] = {
        accountName: accountName,
        marketCode: marketCode,
        cateId: value,
        categoryNames: selectedOptions.cate_names,
        keyword: keyword,
        meta_data:{
          //추천 옵션 리스트
          recommendedOptList: [],
          // 선택한 추천옵션 데이타
          recommendedOpt: this.product.item_option.map(item => {
            return {
              option_name : item.name,
              recommended_id : ''
            }
          })
        }
      };

      // 전시카테고리 마켓
      if (this.displayCategoryMarkets.includes(marketCode)) {
        await this.getDisplayCategory(marketCode, [selectedOptions.cate_ids], sellerId, accountName);
      }

      if (this.useCategoryMetaMarket.includes(marketCode)) {
        await this.getCategoryMeta(marketInfo, value)
      }

      return false;

    },

    // 获取显示分类
    async getDisplayCategory(marketCode, cateId, sellerId, accountName) {
      this.displayCategories[accountName].loading = true;
      return await useCategoryApi().getDisplayCategorys({
        market_code: marketCode,
        seller_id: sellerId,
        cate_id: cateId
      }).then(res => {
        if (res.status !== "2000") {
          this.displayCategories[accountName].list = [];
          this.displayCategories[accountName].visible = false;
          this.product.item_disp_cate[accountName] = {};
          message.error(res.message);
          return false;
        }

        this.displayCategories[accountName].list = res.data;
        this.displayCategories[accountName].visible = true;
        this.product.item_disp_cate[accountName] = {
          marketCode: marketCode,
          cateId: res.data[0].cate_ids[res.data[0].cate_ids.length - 1],
          categoryNames: res.data[0].cate_names.join(" / ")
        };

      }).catch(err => {
        message.error(err.message);
        this.displayCategories[accountName].list = [];
        this.displayCategories[accountName].visible = false;
        this.product.item_disp_cate[accountName] = {};
        return false;
      }).finally(() => {
        this.displayCategories[accountName].loading = false;
      });
    },

    // 카테고리 메타데이타에 추가옵션 조회해서 넣음 (옥션, g마켓)
    async getCategoryMeta(marketInfo, leafCateId) {
      let param = {
        market_code : marketInfo.market_code,
        account_id : marketInfo.id,
        cate_id : leafCateId
      }
      this.loading = true;
      await useCategoryApi().getCategoryMeta(param).then(res => {
        // g마켓, 옥션
        if (['auction', 'gmarket'].includes(marketInfo.market_code)) {
          const metaData = res.data;
          metaData['recommendedOpt'] = this.product.item_option.map(item => {
            return {
              option_name : item.name,
              recommended_id : ''
            }
          });

          this.product.item_cate[marketInfo.accountName]['meta_data'] = metaData;
          this.categories[marketInfo.accountName].options = this.categories[marketInfo.accountName].options.map(option => {
            if (option.cate_ids === leafCateId && res.data['optionUseYn'] === 'N') {
               option['is_group'] = true;
            }
            return option;
          })
          console.log(this.categories[marketInfo.accountName]);
          this.categories[marketInfo.accountName].value = leafCateId;
          this.loading = false;
        }
      })
    },
  },

  mounted() {
    //this.search_keyword = '망치'
    if (this.product.item_cate === null || this.product.item_cate === undefined || Object.keys(this.product.item_cate).length === 0) {
      this.product.item_cate = {};
      forEach(this.marketList, (market) => {
        let accountName = market.market_code + "|" + market.seller_id;
        this.product.item_cate[accountName] = {
          accountName : accountName,
          marketCode : market.market_code,
          meta_data : {
            //추천 옵션 리스트
            recommendedOptList: [],
            // 선택한 추천옵션 데이타
            recommendedOpt: this.product.item_option.map(item => {
              return {
                option_name : item.name,
                recommended_id : ''
              }
            })
          }
        }
      })
    }

    if (this.product.item_disp_cate === null || this.product.item_disp_cate === undefined || Object.keys(this.product.item_disp_cate).length === 0) {
      this.product.item_disp_cate = {};
    }

    if (Array.isArray(this.product?.item_sync_market)) {
      const queue = [];

      this.marketList.forEach(market => {
        // 处理 market_prd_code 为 null 的情况
        if (market.market_prd_code === "" || market.market_prd_code === null) {
          market.market_prd_code = "";
        }
        let accountName = market.accountName;
        // 创建 分类
        this.categories[accountName] = {
          loading: true,
          value: [],
          options: []
        };
        this.displayCategories[accountName] = { loading: false, visible: false, list: [] };
        this.searchCategories[accountName] = [];
        this.search_keyword_by_market[accountName] = "";

        if (this.product.item_cate && this.product.item_cate[accountName]) {
          this.categories[accountName].options[0] = {
            cate_ids: this.product.item_cate[accountName].cateId,
            cate_names: this.product.item_cate[accountName].categoryNames,
          }
          if (['gmarket', 'auction'].includes(market.market_code)) {
            this.categories[accountName].options[0]['is_group'] =  this.product.item_cate[accountName].meta_data?.optionUseYn === 'N'
          }
          this.categories[accountName].value = this.product.item_cate[accountName].cateId
        }

        // // 加载初始数据
        // queue.push(
        //   this.getMarketCategory(market.market_code,this.search_keyword).then(res => {
        //     this.categories[accountName].options = res.data
        //     // initMarketCategory
        //     if (this.product.item_cate && this.product.item_cate[accountName]) {
        //       this.categories[accountName].value = this.product.item_cate[accountName].categoryNames
        //     }
        //   }).finally(()=> {
        //     this.categories[accountName].loading = false
        //   })
        // )
      });

      Promise.all(queue).finally(() => {
        this.initialize = true;
      });
    }
  }
};

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
  padding: 10px 20px 10px 25px;
}

</style>
