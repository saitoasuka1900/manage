<template>
    <el-container style="height: 100vh;">
        <el-main :style="{ backgroundImage: 'url(\'' + bgurl + '\')' }">
            <el-button @click="loginDialogVisible = true">点击打开登录框</el-button>
            <el-dialog title="后台登陆" :visible.sync="loginDialogVisible" :width="ModuleSize" center :close-on-click-modal='false'>
                <div>
                    <span class="label">用户名：</span>
                    <el-input placeholder="请输入用户名" v-model="username" />
                </div>
                <div style="margin-top: 5px">
                    <span class="label">密码：</span>
                    <el-input placeholder="请输入密码" v-model="password" />
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="loginDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="Login()">登 录</el-button>
                </span>
            </el-dialog>
            <el-button @click="registerDialogVisible = true">点击打开注册框</el-button>
            <el-dialog title="后台注册" :visible.sync="registerDialogVisible" :width="ModuleSize" center :close-on-click-modal='false'>
                <div>
                    <span class="label">用户名：</span>
                    <el-input placeholder="请输入用户名" v-model="username" />
                </div>
                <div>
                    <span class="label">昵称：</span>
                    <el-input placeholder="请输入昵称" v-model="nickname" />
                </div>
                <div style="margin-top: 5px">
                    <span class="label">密码：</span>
                    <el-input placeholder="请输入密码" v-model="password" />
                </div>
                <div>
                    <span class="label">邮箱：</span>
                    <el-input placeholder="请输入邮箱" v-model="Email" />
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="registerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="Register()">注册</el-button>
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
            registerDialogVisible: false,
            ModuleSize: '',
            username: '',
            password: '',
            Email: '',
            nickname: '',
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
                    this.$store.commit('Login', {token: responseResult.data.token, rnd: responseResult.data.rnd})
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
        Register() {
            if (this.username === '' || this.password === '') {
                this.$message({
                    message: '用户名或密码为空',
                    type: 'warning'
                })
                return
            }
            this.$axios
                .post('/Register', {
                    username: this.username,
                    nickname: this.nickname,
                    password: this.password,
                    email: this.Email
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code !== 200) {
                        this.$message.error(responseResult.message);
                        return
                    }
                    this.$store.commit('Login', {token: responseResult.data.token, rnd: responseResult.data.rnd})
                    let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                    this.$message({
                        message: '注册成功',
                        type: 'success'
                    })
                    this.$router.push({ path: redirect })
                })
                .catch((failRespone) => {
                    this.$message.error('注册失败')
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
