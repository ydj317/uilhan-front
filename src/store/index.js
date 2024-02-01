import {createStore} from "vuex";
import product from "@/store/modules/product";

export default createStore({
    state: {
        common: {},
        relaket: {
            data: {},
            methods: {}
        },
        return: {
            isOptionApplied: false,
        },
    },

    modules: {
        product
    },
});
