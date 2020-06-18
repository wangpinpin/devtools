import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

//打印当前所处环境
console.log("当前所处环境", process.env.NODE_ENV)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
