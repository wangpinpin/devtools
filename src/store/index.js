import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: JSON.parse(localStorage.getItem("user")) || "",
        userInfo: JSON.parse(localStorage.getItem("userInfo")) || "",
        category: [],
        devBackgroundFamily: [
            "background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);",
            "background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);",
            "background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);",
            "background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);",
            "background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);",
            "background-image: linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);",
            "background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);",
            "background-image: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);",
            "background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);",
            "background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);",
            "background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);",
            "background-image: linear-gradient(120deg, #fccb90 0%, #d57eeb 100%);",
            "background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);",
            "background-image: linear-gradient(to top, #fddb92 0%, #d1fdff 100%);",
            "background-image: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);",
            "background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);",
        ],
    },
    mutations: {
        setUser(state, x) {
            if (x) {
                localStorage.setItem('user', JSON.stringify(x))
                state.user = x
            } else {
                localStorage.removeItem('user')
                state.user = ""
            }
        },
        setUserInfo(state, x) {
            if (x) {
                localStorage.setItem('userInfo', JSON.stringify(x))
                state.userInfo = x
            } else {
                localStorage.removeItem('userInfo')
                state.userInfo = ""
            }
        },
        setCategory(state, x) {
            if (x) {
                localStorage.setItem('category', JSON.stringify(x))
                state.user = x
            } else {
                localStorage.removeItem('category')
                state.user = ""
            }
        }
    },
    actions: {},
    modules: {},
});
