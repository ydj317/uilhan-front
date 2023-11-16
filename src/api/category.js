import {AuthRequest} from "@/util/request";

export function useCategoryApi() {
    return {
        getAutoRecommendCategory: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/getAutoRecommendCategory",
                method: "get",
                params: data,
            });
        },
        getMarketCategoryList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/category",
                //url: "https://mock.apifox.cn/m2/3318349-0-default/111776451",
                method: "get",
                params: data,
            });
        },

        getAutoRecommendCategoryNames: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/getAutoRecommendCategoryNames",
                method: "get",
                params: data,
            });
        },

        getSmartstoreCategory: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/getSmartstoreCategory",
                method: "get",
                params: data,
            });
        }




        
    }
}