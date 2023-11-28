import {AuthRequest} from "@/util/request";

// 출고지
export function useAccountJsonApi() {
    return {
        // 출고지 수집
        syncOutboundAddress: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/sync/outBoundAddress",
                method: "POST",
                data,
            });
        },

        // 반품지 수집
        syncReturnAddress: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/sync/returnAddress",
                method: "POST",
                data,
            });
        },

        getAccountJson: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/accountJson/List",
                method: "GET",
                params: data,
            });
        },

        getShippingCostPolicy: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/sync/shippingCostPolicy",
                method: "POST",
                data,
            });
        }
    }
}