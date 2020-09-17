import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: JSON.parse(sessionStorage.getItem("user")) || ""
    },
    mutations: {
        setUser(state, x) {
            if (x) {
                sessionStorage.setItem('user', JSON.stringify(x))
                state.user = x
            } else {
                sessionStorage.removeItem('user')
                state.user = ""
            }

        }
    },
    actions: {},
    modules: {}
});