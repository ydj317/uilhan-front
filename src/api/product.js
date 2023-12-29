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
    }
}