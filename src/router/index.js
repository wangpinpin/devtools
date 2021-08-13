import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "Home",
    component: Home,
    meta: {
        title: "小破站 - 舔狗日记|每日一文|www.wangpinpin.com"
    }
},
{
    path: "/JsonFormat",
    name: "JsonFormat",
    meta: {
        title: "JSON格式化"
    },
    component: () =>
        import("../views/unauth/JsonFormat.vue")
},
{
    path: "/QRcodeCreate",
    name: "QRcodeCreate",
    meta: {
        title: "二维码生成"
    },
    component: () =>
        import("../views/unauth/QRcodeCreate.vue")
},
{
    path: "/ColorTransfer",
    name: "ColorTransfer",
    meta: {
        title: "颜色代码转换"
    },
    component: () =>
        import("../views/unauth/ColorTransfer.vue")
},
{
    path: "/DoglickingDiary",
    name: "DoglickingDiary",
    meta: {
        title: "舔狗日记"
    },
    component: () =>
        import("../views/unauth/DoglickingDiary.vue")
},
{
    path: "/ImageToTxt",
    name: "ImageToTxt",
    meta: {
        title: "图片转文字, 图片文字提取 "
    },
    component: () =>
        import("../views/unauth/ImageToTxt.vue")
},
{
    path: "/MessageBoard",
    name: "MessageBoard",
    meta: {
        title: "留言板"
    },
    component: () =>
        import("../views/unauth/MessageBoard.vue")
},
{
    path: "/GoddessLetter",
    name: "GoddessLetter",
    meta: {
        title: "给女神的信"
    },
    component: () =>
        import("../views/unauth/GoddessLetter.vue")
},
{
    path: "/EveryDayText",
    name: "EveryDayText",
    meta: {
        title: "每日一文"
    },
    component: () =>
        import("../views/unauth/EveryDayText.vue")
},
{
    path: "/v",
    name: "v",
    meta: {
        title: "看一看"
    },
    component: () =>
        import("../views/unauth/V.vue")
},
{
    path: "/Music",
    name: "Music",
    meta: {
        title: "听一听"
    },
    component: () =>
        import("../views/unauth/Music.vue")
},
{
    path: "/Statement",
    name: "Statement",
    meta: {
        title: "免责声明"
    },
    component: () =>
        import("../views/unauth/Statement.vue")
},
{
    path: "/Wyy",
    name: "Wyy",
    meta: {
        title: "网易云API"
    },
    component: () =>
        import("../views/unauth/Wyy.vue")
},
{
    path: "/wallpaper",
    name: "wallpaper",
    meta: {
        title: "必应壁纸"
    },
    component: () =>
        import("../views/unauth/Wallpaper.vue")
},
{
    path: "/Base64",
    name: "Base64",
    meta: {
        title: "图片转Base64"
    },
    component: () =>
        import("../views/unauth/Base64.vue")
},
{
    path: "/adarkroom",
    name: "adarkroom",
    meta: {
        title: "小黑屋"
    },
    component: () =>
        import("../views/unauth/Adarkroom.vue")
},
{
    path: "/sponsor",
    name: "sponsor",
    meta: {
        title: "赞助"
    },
    component: () =>
        import("../views/unauth/Sponsor.vue")
},
{
    path: "/login",
    name: "login",
    meta: {
        title: "登录页"
    },
    component: () =>
        import("../views/unauth/Login.vue")
},
{
    path: "/cancel",
    name: "cancel",
    meta: {
        title: "取消订阅"
    },
    component: () =>
        import("../views/unauth/Cancel.vue")
},
{
    path: "/subscribe",
    name: "subscribe",
    meta: {
        title: "订阅日记",
        requireAuth: true
    },
    component: () =>
        import("../views/auth/Subscribe.vue")
},
{
    path: "/info",
    name: "info",
    meta: {
        title: "个人资料",
        requireAuth: true
    },
    component: () =>
        import("../views/auth/Info.vue")
},
{
    path: "/note",
    name: "note",
    meta: {
        title: "笔记本",
        requireAuth: true
    },
    component: () =>
        import("../views/auth/Note.vue")
},
{
    path: "/timeformat",
    name: "timeformat",
    meta: {
        title: "时间戳转换",
    },
    component: () =>
        import("../views/unauth/TimeFormat.vue")
},
{
    path: "/previewfont",
    name: "previewfont",
    meta: {
        title: "字体预览",
    },
    component: () =>
        import("../views/unauth/PreviewFont.vue")
}
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
