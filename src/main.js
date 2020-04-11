import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import '@/styles/index.css'

// 引用axios，并设置基础URL为后端服务api地址
const axios = require('axios')
// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    (config) => {
        if (localStorage.getItem('token')) {
            config.headers.Authorization = localStorage.getItem('token')
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
axios.defaults.baseURL = 'https://localhost:8443/api'
// 将API方法绑定到全局
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable */
new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')
