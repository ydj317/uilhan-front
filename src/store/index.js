import { createStore } from "vuex";

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
    user: {},
  },
  mutations: {},
  actions: {},
  modules: {},
});
