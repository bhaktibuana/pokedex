import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import VueLazyload from "vue-lazyload";
import { FontAwesomeIcon } from "@/libs";

createApp(App)
  .use(store)
  .use(router)
  .use(VueLazyload)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
