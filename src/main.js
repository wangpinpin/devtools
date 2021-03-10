import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import http from "@/util/http";
import { formatDate } from '@/util/date'
import "@/assets/js/rem"
import VueWechatTitle from 'vue-wechat-title';
//滚动条
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
Vue.component('happy-scroll', HappyScroll)

//时间格式化
import moment from 'moment'

//无限滚动
import infiniteScroll from "vue-infinite-scroll";
Vue.use(infiniteScroll);
//完整引入element组件库
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

//element 内置过渡动画
import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition)

//复制到粘贴板插件
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(VueWechatTitle)

//谷歌联盟
import Ads from 'vue-google-adsense'
Vue.use(require('vue-script2'))
Vue.use(Ads.Adsense)
Vue.use(Ads.InArticleAdsense)
Vue.use(Ads.InFeedAdsense)


//tinymce富文本编辑器
import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'
Vue.prototype.$tinymce = tinymce // 将全局tinymce对象指向给Vue作用域下
Vue.use(VueTinymce)              // 安装vue的tinymce组件

//按需引入element组件库
import {
    Button,
    Select,
    Loading,
    Input,
    Tooltip,
    Scrollbar,
    Popover,
    Tabs,
    TabPane,
    ColorPicker,
    Dialog,
    Form,
    FormItem,
    Option,
    Slider,
    Table,
    TableColumn,
    Message,
    DatePicker,
    Upload,
    Notification,
    Collapse,
    CollapseItem,
    MessageBox,
    Switch,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Checkbox,
    CheckboxGroup,
    TimeSelect,
    Aside,
    Main,
    Autocomplete,
    Col
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
Vue.use(Switch);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(TimeSelect);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Autocomplete);
Vue.use(Col);

Vue.prototype.$loading = Loading;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$http = http;
window.$notify = Notification;
//阻止启动生产消息
window.Vue = Vue;

//打印当前所处环境
console.log("当前所处环境: ", process.env.NODE_ENV);
// console.log("当前环境API: ", process.env.VUE_APP_BASE_URL);

//过滤器

Vue.filter('formatDate', function (value1, value2) {
    value1 = value1.replace(/-/g, '/');
    return moment(value1).format(value2)
})

//百度统计
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?2032706202016ae71e8b76fb2b5f86b5";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

// 路由之前动态修改title
// 单独打开的页面此方法不可用
router.beforeEach((to, from, next) => {
    if (_hmt) {
        if (to.path) {
            _hmt.push(['_trackPageview', to.fullPath]);
        }
    }
    if (to.meta.requireAuth) {
        if (store.state.user) {
            next() // 已登录
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        if (to.meta.title) {
            document.title = to.meta.title;
        }
        next();
    }

});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
