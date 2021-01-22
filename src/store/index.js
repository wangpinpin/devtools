import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: JSON.parse(localStorage.getItem("user")) || "",
        userInfo: JSON.parse(localStorage.getItem("userInfo")) || ""
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
        }
    },
    actions: {},
    modules: {}
});
