<template>
    <el-container
        style="background-image: url('https://saitoasuka-1258793314.file.myqcloud.com/manage/index/index-bg.jpg')"
    >
        <el-scrollbar :style="{ minWidth: isCollapse ? '205px' : '80px' }">
            <el-aside
                :width="isCollapse ? '205px' : '80px'"
                :class="!isCollapse ? 'transition-set-slow' : 'transition-set-fast'"
            >
                <el-switch v-model="isCollapse" active-color="#13ce66" inactive-color="#ff4949" />
                <div v-show="isCollapse" style="display: flex; align-items: center; justify-content: center;">
                    <el-avatar :size="120" :src="require('assets/avatar.png')" />
                </div>
                <el-menu
                    router
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    :collapse="!isCollapse"
                    background-color="rgba(0, 0, 0, 0)"
                    text-color="white"
                    active-text-color="white"
                    :unique-opened="true"
                >
                    <template v-for="item in naviItem">
                        <el-submenu :index="item.id" :key="item.id + 's'" v-if="item.childItem.length > 0">
                            <template slot="title">
                                <i :class="item.iconName" style="color: white !important"></i>
                                <span slot="title">
                                    {{ item.itemName }}
                                </span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item
                                    v-for="childItem in item.childItem"
                                    :index="childItem.id"
                                    :key="childItem.id"
                                >
                                    <i :class="childItem.iconName" style="color: white !important"></i>
                                    <span slot="title" :class="{ 'is-active2': onRoutes === childItem.id }">
                                        {{ childItem.itemName }}
                                    </span>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-menu-item :index="item.id" :key="item.id + 'n'" v-if="item.childItem.length == 0">
                            <i :class="item.iconName" style="color: white !important"></i>
                            <span slot="title" :class="{ 'is-active2': onRoutes === item.id }">
                                {{ item.itemName }}
                            </span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>
        </el-scrollbar>
        <el-container>
            <el-main :height="'100vh'">
                <transition name="index-main-view" mode="out-in">
                    <router-view />
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import 'assets/icon/font_icon_navigate/iconfont.css'
import route from '@/router/index'

function Item(iconName, itemName, id, childItem = []) {
    this.iconName = iconName
    this.itemName = itemName
    this.id = id
    if (typeof childItem === 'undefined') this.childItem = []
    else this.childItem = childItem.slice(0)
}

export default {
    route,
    data() {
        return {
            isCollapse: document.documentElement.clientWidth > 700,
            naviItem: [
                new Item('el-icon-user-solid', '个人中心', '/'),
                new Item('el-icon-s-home', '博客管理', 'blog', [
                    new Item('el-icon-asuka-write', '写文章', '/write'),
                    new Item('el-icon-notebook-1', '文章管理', '/post'),
                    new Item('el-icon-takeaway-box', '草稿箱', '/draft')
                ]),
                new Item('el-icon-asuka-message', '留言板', '/message'),
                new Item('el-icon-s-grid', '标签管理', 'label', [
                    new Item('el-icon-asuka-algorithm', '算法', '/algorithm'),
                    new Item('el-icon-asuka-development', '开发', '/development'),
                    new Item('el-icon-asuka-other', '其他', '/other')
                ]),
                new Item('el-icon-asuka-user', '用户管理', '/user-manage'),
                new Item('el-icon-chat-dot-round', '评论管理', '/comment-manage')
            ]
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        goBack() {
            return true
        },
        listenWidth() {
            this.isCollapse = document.documentElement.clientWidth > 700
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path
        }
    },
    created: function() {
        window.addEventListener('resize', this.listenWidth)
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.listenWidth)
    }
}
</script>

<style lang="scss" scoped>
.transition-set-slow {
    @include transition-set(0.6s);
}
.transition-set-fast {
    @include transition-set(0.2s);
}
.el-aside {
    @include opacity-set(0.4);
    min-height: 100vh;
}
.el-main {
    @include opacity-set(0);
    color: #333;
    text-align: center;
    padding: 3vh;
}
</style>

<style scoped>
.is-active2 {
    color: #ffd04b !important;
}
.el-container {
    background-size: cover;
    background-position: 100%;
    background-repeat: no-repeat;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    border: 0;
}
.el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 0px;
    min-width: 180px;
}
.el-menu--vertical .el-menu .el-menu-item:not(.el-menu--collapse) {
    float: none;
    height: 23px;
    line-height: 23px;
    width: auto;
    margin: 0;
    padding-right: 0;
}
.el-scrollbar {
    height: 100vh;
}
.index-main-view-enter,
.index-main-view-leave-to {
    opacity: 0;
}
.index-main-view-enter-active,
.index-main-view-leave-active {
    transition: all 1s;
}
.index-main-view-enter-to,
.index-main-view-leave {
    opacity: 1;
}
</style>

<style deep>
.el-scrollbar__view {
    min-width: 80px;
}
</style>
