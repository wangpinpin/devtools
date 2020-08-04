import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import http from "@/util/http";
import { formatDate } from '@/util/date'


//rem转换插件
import "amfe-flexible";
//完整引入element组件库
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

//复制到粘贴板插件
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

//按需引入element组件库
import { Button, Select, Loading, Input, Tooltip, Scrollbar, Popover, Tabs, TabPane, ColorPicker, Option, Slider, Table, TableColumn, Message, DatePicker, Upload } from "element-ui";

Vue.use(Button);
Vue.use(Select);
Vue.use(Input);
Vue.use(Tooltip);
Vue.use(Scrollbar);
Vue.use(Popover);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(ColorPicker);
Vue.use(Option);
Vue.use(Slider);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Upload);

Vue.prototype.$loading = Loading;
Vue.prototype.$message = Message;
Vue.prototype.$http = http;

//阻止启动生产消息
Vue.config.productionTip = false;

//打印当前所处环境
console.log("当前所处环境", process.env.NODE_ENV);

//过滤器
Vue.filter('formatDate', function(value1, value2) {
    let date = new Date(value1);
    return formatDate(date, value2);
})
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