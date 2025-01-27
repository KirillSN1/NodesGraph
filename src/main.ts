import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import './main.scss';
// import store from "./store";

createApp(App).use(router).mount("#app");