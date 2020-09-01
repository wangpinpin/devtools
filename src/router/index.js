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
            import ("../views/unauth/JsonFormat.vue")
    },
    {
        path: "/QRcodeCreate",
        name: "QRcodeCreate",
        meta: {
            title: "二维码生成"
        },
        component: () =>
            import ("../views/unauth/QRcodeCreate.vue")
    },
    {
        path: "/ColorTransfer",
        name: "ColorTransfer",
        meta: {
            title: "颜色代码转换"
        },
        component: () =>
            import ("../views/unauth/ColorTransfer.vue")
    },
    {
        path: "/DoglickingDiary",
        name: "DoglickingDiary",
        meta: {
            title: "舔狗日记"
        },
        component: () =>
            import ("../views/unauth/DoglickingDiary.vue")
    },
    {
        path: "/ImageToTxt",
        name: "ImageToTxt",
        meta: {
            title: "图片转文字, 图片文字提取 "
        },
        component: () =>
            import ("../views/unauth/ImageToTxt.vue")
    },
    {
        path: "/MessageBoard",
        name: "MessageBoard",
        meta: {
            title: "留言板"
        },
        component: () =>
            import ("../views/unauth/MessageBoard.vue")
    },
    {
        path: "/GoddessLetter",
        name: "GoddessLetter",
        meta: {
            title: "给女神的信"
        },
        component: () =>
            import ("../views/unauth/GoddessLetter.vue")
    },
    {
        path: "/EveryDayText",
        name: "EveryDayText",
        meta: {
            title: "每日一文"
        },
        component: () =>
            import ("../views/unauth/EveryDayText.vue")
    },
    {
        path: "/v",
        name: "v",
        meta: {
            title: "看一看"
        },
        component: () =>
            import ("../views/unauth/V.vue")
    },
    {
        path: "/Music",
        name: "Music",
        meta: {
            title: "听一听"
        },
        component: () =>
            import ("../views/unauth/Music.vue")
    },
    {
        path: "/Statement",
        name: "Statement",
        meta: {
            title: "免责声明"
        },
        component: () =>
            import ("../views/unauth/Statement.vue")
    },
    {
        path: "/Wyy",
        name: "Wyy",
        meta: {
            title: "网易云API"
        },
        component: () =>
            import ("../views/unauth/Wyy.vue")
    },
    {
        path: "/wallpaper",
        name: "wallpaper",
        meta: {
            title: "必应壁纸"
        },
        component: () =>
            import ("../views/unauth/Wallpaper.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;