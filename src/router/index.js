import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 防止重复访问同一路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err)
}

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index'),
        children: [
            {
                path: "user",
                component: () => import("components/items/user"),
                alias: "",
            }
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login'),
    }
]

const router = new VueRouter({
    routes
})
export default router
