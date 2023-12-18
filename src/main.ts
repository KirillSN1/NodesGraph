import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createPinia } from "pinia";
// import store from "./store";

createApp(App).use(createPinia()).use(router).mount("#app");