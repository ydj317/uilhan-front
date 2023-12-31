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
    }
}