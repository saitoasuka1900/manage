<template>
    <el-container style="height: 100vh;">
        <el-main :style="{ backgroundImage: 'url(\'' + bgurl + '\')' }">
            <el-button @click="loginDialogVisible = true">点击打开登录框</el-button>
            <el-dialog title="后台登陆" :visible.sync="loginDialogVisible" :width="ModuleSize" center :close-on-click-modal='false'>
                <div>
                    <el-input type="text" name="username" placeholder="请输入用户名" v-model="username" >
                        <template slot="prepend">用户名: </template>
                    </el-input>
                </div>
                <div style="margin-top: 15px;">
                    <el-input name="password" type="password" placeholder="请输入密码" v-model="password" >
                        <template slot="prepend">密码: </template>
                    </el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="loginDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="Login()">登 录</el-button>
                </span>
            </el-dialog>
        </el-main>
        <el-footer :height="'8vh'">
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
            bgurl: '',
            loginDialogVisible: true,
            ModuleSize: '',
            username: '',
            password: '',
        }
    },
    methods: {
        Login() {
            if (this.username === '' || this.password === '') {
                alert('用户名或密码为空')
                return
            }
            this.$axios
                .post('/Login', {
                    username: this.username,
                    password: this.password,
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code !== 200) {
                        this.$message.error(responseResult.message)
                        return
                    }
                    this.$store.commit('Login', responseResult.data)
                    this.$message({
                        message: '登陆成功',
                        type: 'success'
                    })
                    let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                    this.$router.push({ path: redirect })
                })
                .catch((failRespone) => {
                    this.$message.error('登录失败')
                    return failRespone
                })
        },
        listenWidth() {
            this.bgurl =
                document.documentElement.clientWidth > 950
                    ? this.url_root + 'login_bg_max.jpg'
                    : document.documentElement.clientWidth > 630
                    ? this.url_root + 'login_bg_mid.jpg'
                    : this.url_root + 'login_bg_min.jpg'

            this.ModuleSize = document.documentElement.clientWidth > 750 ? '450px' : '350px'
        }
    },
    created: function() {
        if (this.$store.state.token !== null && this.$store.state.rnd !== null)
            this.$router.push({ path: '/' })
        this.bgurl =
            document.documentElement.clientWidth > 950
                ? this.url_root + 'login_bg_max.jpg'
                : document.documentElement.clientWidth > 630
                ? this.url_root + 'login_bg_mid.jpg'
                : this.url_root + 'login_bg_min.jpg'

        this.ModuleSize = document.documentElement.clientWidth > 750 ? '450px' : '350px'

        window.addEventListener('resize', this.listenWidth)
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.listenWidth)
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
    line-height: 8vh;
    text-align: center;
    flex-direction: row;
    justify-content: center;
}
.label {
    display: inline-block;
    font-size: 14px;
    margin-bottom: 5px;
}
</style>
