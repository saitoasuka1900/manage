<template>
    <el-container style="height: 100vh;">
        <el-main :style="{ backgroundImage: 'url(\'' + bgurl + '\')' }"></el-main>
        <el-footer :height="'4vh'">
            <a href="http://www.beian.miit.gov.cn" target="_blank" style="color: white; text-decoration: none;">
                闽ICP备20003864号
            </a>
        </el-footer>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            url_root: 'https://saitoasuka-1258793314.file.myqcloud.com/manage/login/',
            bgurl: ''
        }
    },
    mounted: function() {
        this.bgurl =
            document.documentElement.clientWidth > 950
                ? this.url_root + 'login_bg_max.jpg'
                : document.documentElement.clientWidth > 630
                ? this.url_root + 'login_bg_mid.jpg'
                : this.url_root + 'login_bg_min.jpg'
        window.addEventListener('resize', () => {
            this.bgurl =
                document.documentElement.clientWidth > 950
                    ? this.url_root + 'login_bg_max.jpg'
                    : document.documentElement.clientWidth > 630
                    ? this.url_root + 'login_bg_mid.jpg'
                    : this.url_root + 'login_bg_min.jpg'
        })
    }
}
</script>

<style scoped>
.el-main {
    background-size: cover;
    background-position: 100%;
    background-repeat: no-repeat;
}
.el-footer {
    background-color: rgb(0, 0, 0);
    line-height: 4vh;
    text-align: center;
}
</style>