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
        component: () => import('@/views/login')
    },
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index'),
        children: [
            {
                path: 'user',
                component: () => import('components/items/user'),
                alias: '',
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            },
            {
                path: 'write',
                component: () => import('components/items/write'),
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            },
            {
                path: 'write/(post|draft)/:id(\\d+)', // this route will only be matched if :id is all numbers
                component: () => import('components/items/write'),
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            },
            {
                path: '(post|draft)',
                component: () => import('components/items/post'),
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            },
            {
                path: 'message',
                component: () => import('components/items/message'),
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            },
            {
                path: '(algorithm|development|other)',
                component: () => import('components/items/label'),
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            },
            {
                path: 'user-manage',
                component: () => import('components/items/user'),
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            },
            {
                path: 'comment-manage',
                component: () => import('components/items/user'),
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            },
            {
                path: '*',
                component: () => import('components/items/404'),
                meta: {
                    requireAuth: true // 该路由项需要权限校验
                }
            }
        ]
    }
]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (localStorage.getItem('token'))
            next()
        else {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }
    }
    else
        next()
})
export default router
