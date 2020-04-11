import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 从localStorage中获取token
        token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
    },
    mutations: {
        // 修改token，并将token存入localStorage
        changeLogin(state, user) {
            state.token = user.token
            localStorage.setItem('token', user.token)
        }
    },
    actions: {},
    modules: {}
})
