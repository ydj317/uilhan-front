import {AuthRequest} from "@/util/request";

export function useCategoryApi() {
    return {
        getAutoCompCategory: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/category/searchList",
                method: "post",
                data,
            });
        },
        getMarketCategoryList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/getcategorylist",
                //url: "https://mock.apifox.cn/m2/3318349-0-default/111776451",
                method: "get",
                params: data,
            });
        }
    }
}