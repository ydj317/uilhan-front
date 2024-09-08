import { useMarketApi } from "@/api/market";

const state = () => ({
    marketList : [],
    use_category_meta_market : [],
    use_recommended_market_list : []
});

const getters = {}

const mutations = {
    setUseRecommendedOptionMarketList(state, value) {
        state.use_recommended_market_list = value;
    },
    setUseCategoryMetaMarket(state, value) {
        state.use_category_meta_market = value;
    },
    setMarketList(state, value) {
        state.marketList = value;
    },
};

// 추천옵션 사용 마켓리스트
const actions = {
    async getUseRecommendedOptionMarketList({commit, state}, value) {
        try {
            // state.detail.loading = true;
            await useMarketApi().getUseRecommendedOptionMarketList(value).then(res => {
                commit("setUseRecommendedOptionMarketList", res.data);
            })
        } catch (e) {
            console.log(e);
        }
    },
    async getUseCategoryMetaMarket({commit, state}, value) {
        try {
            // state.detail.loading = true;
            await useMarketApi().getUseCategoryMetaMarket(value).then(res => {
                commit("setUseCategoryMetaMarket", res.data);
            })
        } catch (e) {
            console.log(e);
        }
    },
    async getOpenMarketList({commit, state}, value) {
        try {
            // state.detail.loading = true;
            await useMarketApi().getMarketList(value).then(res => {
                commit("setMarketList", res.data);
            })
        } catch (e) {
            console.log(e);
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}