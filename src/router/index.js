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
        path: '/login',
        name: 'login',
        component: () => import('@/views/login'),
    },
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index'),
        children: [
            {
                path: "user",
                component: () => import("components/items/user"),
                alias: "",
            },
            {
                path: "post",
                component: () => import("components/items/post"),
            },
            {
                path: "draft",
                component: () => import("components/items/post"),
            },
            {
                path: "message",
                component: () => import("components/items/message"),
            },
            {
                path: "algorithm",
                component: () => import("components/items/label"),
            },
            {
                path: "development",
                component: () => import("components/items/label"),
            },
            {
                path: "other",
                component: () => import("components/items/label"),
            },
            {
                path: "user-manage",
                component: () => import("components/items/user"),
            },
            {
                path: "comment-manage",
                component: () => import("components/items/user"),
            },
            {
                path: "*",
                component: () => import("components/items/404"),
            },
        ],
    },
]

const router = new VueRouter({
    routes
})
export default router
