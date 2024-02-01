import {createStore} from "vuex";
import product from "@/store/modules/product";
import marketAccount from "@/store/modules/marketAccount";

export default createStore({
    state: {
        common: {},
        return: {
            isOptionApplied: false,
        },
    },

    modules: {
        product,
        marketAccount
    },
});
