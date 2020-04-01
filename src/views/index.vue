<template>
    <el-container>
        <el-scrollbar>
            <el-aside
                :width="isCollapse ? '205px' : '80px'"
                :class="!isCollapse ? 'transition-set-slow' : 'transition-set-fast'"
            >
                <el-switch v-model="isCollapse" active-color="#13ce66" inactive-color="#ff4949" />
                <div v-show="isCollapse" style="display: flex; align-items: center; justify-content: center;">
                    <el-avatar :size="120" :src="require('assets/avatar.png')" />
                </div>
                <el-menu
                    default-active="1"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    :collapse="!isCollapse"
                    background-color="rgba(0, 0, 0, 0)"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    :unique-opened="true"
                    v-if="isloaded"
                >
                    <template v-for="item in naviItem">
                        <el-submenu :index="item.id" :key="item.id + 's'" v-if="item.childItem.length > 0">
                            <template slot="title">
                                <i :class="item.iconName" style="color: white !important"></i>
                                <span slot="title">{{ item.itemName }}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item
                                    v-for="childItem in item.childItem"
                                    :index="childItem.id"
                                    :key="childItem.id"
                                >
                                    <i
                                        :class="childItem.iconName"
                                        style="color: white !important"
                                    ></i>
                                    <span slot="title">
                                        {{ childItem.itemName }}
                                    </span>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-menu-item :index="item.id" :key="item.id + 'n'" v-if="item.childItem.length == 0">
                            <i :class="item.iconName" style="color: white !important"></i>
                            <span slot="title">{{ item.itemName }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>
        </el-scrollbar>
        <el-container>
            <el-header :height="'8vh'"/>
            <el-main :height="'92vh'">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import 'assets/icon/font_icon_navigate/iconfont.css'
import route from '@/router/index'

function Item(iconName, itemName, childItem = []) {
    this.iconName = iconName
    this.itemName = itemName
    this.id = ''
    if (typeof childItem === 'undefined') this.childItem = []
    else this.childItem = childItem.slice(0)
}

export default {
    route,
    data() {
        return {
            isCollapse: document.documentElement.clientWidth > 500,
            naviItem: [
                new Item('el-icon-user-solid', '个人中心'),
                new Item('el-icon-s-home', '文章管理', [
                    new Item('el-icon-notebook-1', '博文管理'),
                    new Item('el-icon-notebook-2', '日记管理'),
                ]),
                new Item('el-icon-takeaway-box', '草稿箱'),
                new Item('el-icon-asuka-announce', '公告设置'),
                new Item('el-icon-s-grid', '分类管理', [
                    new Item('el-icon-asuka-class', '类别管理'),
                    new Item('el-icon-asuka-label', '标签管理'),
                ]),
                new Item('el-icon-chat-dot-round', '评论管理'),
                new Item('el-icon-asuka-message', '留言板'),
                new Item('el-icon-asuka-user', '用户管理'),
            ],
            isloaded: false
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
        }
    },
    mounted: function() {
        window.addEventListener('resize', () => {
            this.isCollapse = document.documentElement.clientHeight > 500
        })
        for (let i = 0; i < this.naviItem.length; ++i) {
            let id = i + 1
            this.naviItem[i].id = id.toString()
            for (let j = 0; j < this.naviItem[i].childItem.length; ++j) {
                let cid = j + 1
                this.naviItem[i].childItem[j].id = id.toString() + '-' + cid.toString()
            }
        }
        this.isloaded = true
    }
}
</script>

<style scoped>
.transition-set-slow {
    -webkit-transition: all 0.6s;
    -moz-transition: all 0.6s;
    -ms-transition: all 0.6s;
    -o-transition: all 0.6s;
    transition: all 0.6s;
}
.transition-set-fast {
    -webkit-transition: all 0.2s;
    -moz-transition: all 0.2s;
    -ms-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;
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
.el-aside {
    background-image: linear-gradient(to bottom, #09203f 0%, #537895 125%);
    min-height: 100vh;
}
.el-header {
    color: #333;
    text-align: center;
    line-height: 8vh;
    background-image: linear-gradient(to right, #09203f 0%, #537895 100%);
}
.el-main {
    background-image: linear-gradient(160deg, #09203f 0%, #537895 100%);
    color: #333;
    text-align: center;
}
</style>

<style>
.el-menu-item-group__title {
    padding-top: 0;
    padding-bottom: 0;
}
.el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>