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
  },
  actions: {},
  modules: {},
});
