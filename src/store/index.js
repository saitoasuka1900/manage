import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 从localStorage中获取token
        token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
        rnd: localStorage.getItem('rnd') ? localStorage.getItem('rnd') : null
    },
    mutations: {
        // 修改token，并将token存入localStorage
        Login(state, user) {
            state.token = user.token
            state.rnd = user.rnd
            localStorage.setItem('token', user.token)
            localStorage.setItem('rnd', user.rnd)
        },
        Logout(state) {
            state.token = null
            state.rnd = null
            localStorage.removeItem('token')
            localStorage.removeItem('rnd')
        },
        setRnd(state, rnd) {
            state.rnd = rnd
            localStorage.setItem('rnd', rnd)
        }
    },
    actions: {},
    modules: {}
})
