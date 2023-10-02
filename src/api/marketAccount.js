import {AuthRequest} from "@/util/request";

export function useMarketAccountApi() {
    return {
        // 계정목록
        getAccountList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/account",
                method: "get",
                params: data,
            });
        },

        getAccountFind: (id) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/account/" + id,
                method: "get"
            });
        },

        // 계정등록/수정
        registerOrModifyAccount: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/account",
                method: "POST",
                data,
            });
        },
        
        // 계정삭제
        deleteAccount: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/account/" + data.id,
                method: "DELETE",
                data,
            });
        },

        // 연동확인
        syncMarketCheck: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/syncMarketCheck",
                method: "POST",
                data,
            });
        },

        updateAccountStatus: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/account/updateAccountStatus",
                method: "POST",
                data,
            });
        },
    }
}