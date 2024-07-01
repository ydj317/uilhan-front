import {AuthRequest} from "@/util/request";

export function useProductApi() {
    return {
        // /api/market/product/download
        // 전체상품 EXCEL 다운로드 제한된 계정에서만
        downloadProductExcel: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/product/ExcelDownload",
                method: "post",
                data: data,
            });
        },
        deletePrd: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/delete",
                method: "post",
                data: data,
            });
        },
        replaceWithAI: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/replaceWithAI",
                method: "post",
                data: data,
            });
        },
        urlPrdUpload: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/urlPrdUpload",
                method: "post",
                data: data,
            });
        },
        async translateImage(data, callback) {
            return await AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/transimage",
                method: "post",
                data: data,
            }).then((res) => {
                callback(res);
            });
        },

        async translateImageBatch(data, callback) {
            return await AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/transimage/batch",
                method: "post",
                data: data,
            }).then((res) => {
                callback(res);
            });
        },

        async imageMatting(data, callback) {
            return await AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/image_matting",
                method: "post",
                data: data,
            }).then((res) => {
                callback(res);
            });
        },


        savePrdMemo: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/savePrdMemo",
                method: "post",
                data: data,
            });
        },

        getViewCountZeroProduct : (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/getViewCountZeroProduct",
                method: "post",
                data: data,
            });
        },

        getPrdImageTransStatus : (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/getPrdImageTransStatus",
                method: "post",
                data: data,
            });
        },
        async uploadImage(data, callback) {
            return await AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/xjUploadImage",
                method: "post",
                data: data,
            }).then((res) => {
                callback(res);
            });
        },

    }
}