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
            },
            {
                path: "post",
                component: () => import("components/items/post"),
            },
            {
                path: "draft",
                component: () => import("components/items/user"),
            },
            {
                path: "message",
                component: () => import("components/items/user"),
            },
            {
                path: "class",
                component: () => import("components/items/user"),
            },
            {
                path: "label",
                component: () => import("components/items/user"),
            },
            {
                path: "user-manage",
                component: () => import("components/items/user"),
            },
            {
                path: "comment-manage",
                component: () => import("components/items/user"),
            },
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
