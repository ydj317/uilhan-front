import {AuthRequest} from "@/util/request";

export function useUserApi() {
    return {
        // 사용자 리스트
        getUserList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/user/list",
                method: "get",
                params: data,
            });
        },
        // 사용자 로그인
        userLogin: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/user/login",
                method: "post",
                data: data,
            });
        },

        // 사용자 정보 저장
        saveUserData: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/user/save",
                method: "post",
                data: data,
            });
        },

        // 사용자 정보 조회
        getUserInfoData: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/user/getUserInfoData",
                method: "post",
                data: data,
            });
        },

        bindBridge: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/user/bindBridge",
                method: "post",
                data: data,
            });
        },


    }
}