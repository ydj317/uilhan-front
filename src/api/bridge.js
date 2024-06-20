import {AuthRequest} from "@/util/request";

export function useBridgeApi() {
    return {
        // 바인딩 확인
        syncCheckIsMember: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/bridge/syncCheckIsMember",
                method: "POST",
                data,
            });
        },

        // 개인통관부호 체크
        checkPersonalCustomsClearanceCode: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/bridge/checkPersonalCustomsClearanceCode",
                method: "POST",
                data,
            });
        },

        // 통관유형
        getArcSeq: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/bridge/getArcSeq",
                method: "POST",
                data,
            });
        },

        // 리스트 조회
        getBridgeOrderList: (param) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/bridgeOrderList",
                method:'get',
                params: {...param},
            });
        },

        // 리스트 개수 조회
        getBridgeOrderListCount: () => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/bridgeOrderListCount",
                method:'get',
            });
        },

        updateBridgeOrderItems: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/updateBridgeOrderItems",
                method: "POST",
                data,
            });
        },

        updateBridgeOrder: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/bridge/update",
                method: "POST",
                data,
            });
        },

        getBridgeOrderStatusHistory: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/bridgeOrderStatusHistory",
                method: "POST",
                data,
            });
        }
    }
}