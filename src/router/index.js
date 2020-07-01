import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            title: "首页"
        }
    },
    {
        path: "/unauth/Json",
        name: "Json",
        component: () =>
            import ("../views/unauth/Json.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;