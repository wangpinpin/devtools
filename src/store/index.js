import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: JSON.parse(localStorage.getItem("user")) || ""
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

        }
    },
    actions: {},
    modules: {}
});