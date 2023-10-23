import {AuthRequest} from "@/util/request";

export function useMarketApi() {
    return {
        // 마켓목록
        getMarketList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/list",
                method: "get",
                params: data,
            });
        },

        // 마켓상태
        getMarketOrderStatusList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/getMarketOrderStatus",
                method: "get",
                params: data,
            });
        },

        // 마켓클레임상태
        getMarketClaimStatusList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/getMarketOrderClaimStatus",
                method: "get",
                params: data,
            });
        },

        // 마켓별상품상세 URL
        getMarketDetailUrls: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/getMarketDetailUrls",
                method: "get",
                params: data,
            });
        },

        

    }
}