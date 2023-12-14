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

        // /api/openmarket/{marketCode}/getMarketReturnReasonList
        getMarketReturnReasonList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/" + data.marketCode + "/getMarketReturnReasonList",
                method: "get",
            });
        },
        
        // /api/openmarket/getMarketDeliveryCompany
        getMarketDeliveryCompany: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/getMarketDeliveryCompany",
                method: "get",
                params: data,
            });
        },

        // /api/openmarket/getMarketAdminUrls
        getMarketAdminUrls: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/getMarketAdminUrls",
                method: "get",
                params: data,
            });
        },

        getCustomOrderStatusList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/getCustomOrderStatusList",
                method: "get",
                params: data,
            });
        }
        

    }
}