import {AuthRequest} from "@/util/request";

export function useDeliveryApi() {
    return {
        // 택배사 수집
        sync: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/account",
                method: "get",
                params: data,
            });
        },

        getDeliveryList: (data) => {
            return new Promise((resolve, reject) => {
                resolve({
                    data: {
                        list: [
                            {
                                id: 1,
                                name: "택배사1",
                                code: "code1",
                                status: "Y",
                                regDate: "2021-01-01",
                                modDate: "2021-01-01",
                            },
                            {
                                id: 2,
                                name: "택배사2",
                                code: "code2",
                                status: "Y",
                                regDate: "2021-01-01",
                                modDate: "2021-01-01",
                            },
                            {
                                id: 3,
                                name: "택배사3",
                                code: "code3",
                                status: "Y",
                                regDate: "2021-01-01",
                                modDate: "2021-01-01",
                            },
                            {
                                id: 4,
                                name: "택배사4",
                                code: "code4",
                                status: "Y",
                                regDate: "2021-01-01",
                                modDate: "2021-01-01",
                            },
                            {
                                id: 5,
                                name: "택배사5",
                                code: "code5",
                                status: "Y",
                                regDate: "2021-01-01",
                                modDate: "2021-01-01",
                            },
                        ],
                        total: 5,
                    },
                    status: "2000",
                    message: "성공",
                });
            });
        },
    }
}