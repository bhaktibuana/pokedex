import { createStore } from "vuex";
import { string } from "@/constants";

export default createStore({
  state: {
    appTitle: string.appTitle,
  },
  getters: {},
  mutations: {
    setAppTitle(state, appTitle) {
      state.appTitle =
        appTitle === "" ? string.appTitle : `${appTitle} | ${string.appTitle}`;
    },
  },
  actions: {},
  modules: {},
});
