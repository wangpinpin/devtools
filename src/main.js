import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//rem转换插件
import "amfe-flexible";
//完整引入element组件库
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

//按需引入element组件库
import { Button, Select, Loading, Input } from "element-ui";

Vue.use(Button);
Vue.use(Select);
Vue.use(Input);

Vue.prototype.$loading = Loading;

//阻止启动生产消息
Vue.config.productionTip = false;

//打印当前所处环境
console.log("当前所处环境", process.env.NODE_ENV);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

//路由之前的操作
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});