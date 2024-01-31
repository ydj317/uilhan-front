import {createStore} from "vuex";
import {AuthRequest} from "@/util/request";
import {lib} from "@/util/lib";
import {message} from "ant-design-vue";
import router from "@/router";

export default createStore({
    state: {
        common: {},
        product: {
            onload: false,
            loading: true,
        },
        relaket: {
            data: {},
            methods: {}
        },
        prdlist: [],

        return: {
            isOptionApplied: false,
        },
    },
    mutations: {
        //bottonBanner옵션적용
        setOptionApplied(state, value) {
            state.isOptionApplied = value;
        },
        setOptionModified(state, value) {
            state.isOptionModified = value;
        },

        setUseAutoSave(state, value) {
            state.useAutoSave = value;
        },

        setProduct(state, value) {
            state.product = value;
        }
    },
    actions: {
        async getProduct({commit,state}, value) {
            try {
                state.product.loading = true;
                await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prd", {
                    params: {prduct_idx: value},
                }).then((res) => {
                    if (
                        lib.isEmpty(res) ||
                        res.status !== "2000" ||
                        lib.isEmpty(res.data)
                    ) {
                        message.success(res.message);
                        router.push("/product");
                        return false;
                    }

                    commit("setProduct", res.data);
                }).finally(() => {
                    state.product.onload = true;
                    state.product.loading = false;
                });
            } catch (e) {
                console.log(e);
            }
        }
    },
    modules: {},
});
