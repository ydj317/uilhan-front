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

    return: {
      isOptionApplied: false,
    },
  },
  mutations: {
    setOptionApplied(state, value) {
      state.isOptionApplied = value;
    },
    setOptionModified(state, value) {
      state.isOptionModified = value;
    },
  },
  actions: {},
  modules: {},
});
