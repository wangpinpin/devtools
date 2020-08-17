import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import http from "@/util/http";
import { formatDate } from '@/util/date'
//rem转换插件
import "amfe-flexible";
import VueWechatTitle from 'vue-wechat-title';
//滚动条
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
Vue.component('happy-scroll', HappyScroll)

//完整引入element组件库
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

//复制到粘贴板插件
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(VueWechatTitle)


//按需引入element组件库
import {
    Button, Select, Loading, Input, Tooltip, Scrollbar, Popover, Tabs, TabPane, ColorPicker, Dialog, Form, FormItem,
    Option, Slider, Table, TableColumn, Message, DatePicker, Upload, Notification, Collapse, CollapseItem
} from "element-ui";

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
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);

Vue.prototype.$loading = Loading;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
Vue.prototype.$http = http;
window.$notify = Notification;

//阻止启动生产消息
Vue.config.productionTip = false;

//打印当前所处环境
console.log("当前所处环境: ", process.env.NODE_ENV);
console.log("当前环境API: ", process.env.VUE_APP_BASE_URL);

//过滤器
Vue.filter('formatDate', function (value1, value2) {
    let date = new Date(value1);
    return formatDate(date, value2);
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

//路由之前动态修改title
//单独打开的页面此方法不可用
// router.beforeEach((to, from, next) => {
//     debugger
//     if (to.meta.title) {
//         document.title = to.meta.title;
//     }
//     next();
// });