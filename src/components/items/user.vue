<template>
    <el-card class="opacity-set" style="color: white;">
        <div slot="header" class="clearfix">
            <span style="float: left; font-size: 1.5rem;">个人中心</span>
        </div>
        <el-scrollbar style="height: 77.5vh;">
            <div style="color: white;">
                <el-avatar :size="120" :src="require('assets/avatar.png')" />
                <ul style="text-align: left;">
                    <li>username: {{ user_info.username }}</li>
                    <li>
                        nickname: {{ user_info.nickname }}&nbsp;&nbsp;
                        <el-button
                            style="font-size: 1.2rem; padding: 3px 0"
                            type="text"
                            @click="showDialog('nickname')"
                        >
                            修改昵称
                        </el-button>
                    </li>
                    <li>
                        E-mail: {{ user_info.email }}&nbsp;&nbsp;
                        <el-button style="font-size: 1.2rem; padding: 3px 0" type="text" @click="showDialog('e_mail')">
                            更换绑定邮箱
                        </el-button>
                    </li>
                    <li>
                        <p>公告:&nbsp;&nbsp;&nbsp;{{ user_info.announce }}</p>
                        <el-button
                            style="font-size: 1.2rem; padding: 3px 0"
                            type="text"
                            @click="showDialog('announce')"
                        >
                            编辑公告
                        </el-button>
                    </li>
                </ul>
            </div>
        </el-scrollbar>
        <el-dialog :title="dialogTitle" :visible.sync="Visible" width="500px" :close-on-click-modal="false">
            <el-form :model="form" ref="user_info">
                <el-form-item
                    label="昵称"
                    v-if="dialogTitle === '昵称修改'"
                    :label-width="labelWidth"
                    :rules="[{ required: true, message: '昵称不能为空' }]"
                    prop="nickname"
                >
                    <el-input
                        type="nickname"
                        placeholder="请输入昵称"
                        v-model="form.nickname"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="已绑定的邮箱" v-if="dialogTitle === '邮箱修改'" :label-width="labelWidth">
                    <el-input v-model="user_info.email" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item
                    label="验证码"
                    v-if="dialogTitle === '邮箱修改'"
                    :label-width="labelWidth"
                    :rules="[{ required: true, message: '验证码不能为空' }]"
                    prop="icode"
                >
                    <el-input type="icode" v-model="form.icode">
                        <el-button slot="append" @click="sendIcode()">{{ icodeButton }}</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="要绑定的邮箱"
                    v-if="dialogTitle === '邮箱修改'"
                    :label-width="labelWidth"
                    :rules="[{ required: true, message: '邮箱不能为空' }]"
                    prop="E-mail"
                >
                    <el-input type="E-mail" v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="公告" v-if="dialogTitle === '公告修改'" :label-width="labelWidth">
                    <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入公告"
                        v-model="form.announce"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="Visible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">提 交</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            user_info: {
                username: '',
                nickname: '',
                email: '',
                announce: ''
            },
            Visible: false,
            form: {
                nickname: '',
                email: '',
                announce: '',
                icode: ''
            },
            dialogTitle: '',
            labelWidth: '120',
            time: 60,
            icodeButton: '点击发送邮箱验证码',
            loadingInstance: this.$loading({ fullScreen: true, background: 'rgba(0, 0, 0, .4)' })
        }
    },
    methods: {
        showDialog(type) {
            this.form = {
                nickname: this.user_info.nickname,
                email: '',
                announce: this.user_info.announce,
                icode: ''
            }
            this.dialogTitle = type === 'nickname' ? '昵称修改' : type === 'e_mail' ? '邮箱修改' : '公告修改'
            this.Visible = true
        },
        Logout() {
            this.$store.commit('Logout')
            this.loadingInstance.close()
            this.$router.push({ path: '/login', query: { redirect: this.$route.fullpath } })
        },
        sendIcode() {
            this.$axios
                .post('/operator/send/iCode')
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code === 401) {
                        this.$store.commit('Logout')
                        this.$router.push({ path: '/login', query: { redirect: this.$route.fullpath } })
                        return
                    }
                    if (responseResult.code === 200) {
                        this.icodeButton = this.time + '秒后可重新发送'
                        let interval = window.setInterval(() => {
                            this.time -= 1
                            this.icodeButton = this.time + '秒后可重新发送'
                            if (this.time < 0) {
                                this.icodeButton = '点击发送邮箱验证码'
                                this.time = 30
                                window.clearInterval(interval)
                            }
                        }, 1000)
                    }
                    else
                        this.$message.error('验证码发送失败')
                })
                .catch((failRespone) => {
                    this.$message.error('验证码发送失败')
                    return failRespone
                })
        },
        submit() {
            this.$refs.user_info.validate((valid) => {
                if (valid) {
                    this.loadingInstance = this.$loading({ fullScreen: true, background: 'rgba(0, 0, 0, .4)' })
                    if (this.dialogTitle === '昵称修改') {
                        this.$axios
                            .post('/operator/submitNickName', {
                                nickname: this.form.nickname,
                                rnd: this.$store.state.rnd
                            })
                            .then((successRespone) => {
                                let responseResult = successRespone.data
                                if (responseResult.code === 401) {
                                    this.Logout()
                                    return
                                }
                                if (responseResult.code === 200) {
                                    this.user_info.nickname = responseResult.data.nickname
                                    this.$store.commit('setRnd', responseResult.data.rnd)
                                    this.$store.commit('setNickName', responseResult.data.nickname)
                                    this.Visible = false
                                }
                                else
                                    this.$message.error('提交失败')
                                this.loadingInstance.close()
                            })
                            .catch((failRespone) => {
                                this.$message.error('提交失败')
                                this.loadingInstance.close()
                                return failRespone
                            })
                    } else if (this.dialogTitle === '邮箱修改') {
                        this.$axios
                            .post('/manage/submitEmail', {
                                email: this.form.email,
                                icode: this.form.icode,
                                rnd: this.$store.state.rnd
                            })
                            .then((successRespone) => {
                                let responseResult = successRespone.data
                                if (responseResult.code === 404 && responseResult.message === '验证码超时或错误') {
                                    this.$message.error(responseResult.message)
                                    this.loadingInstance.close()
                                    return
                                }
                                if (responseResult.code === 401) {
                                    this.Logout()
                                    return
                                }
                                if (responseResult.code === 200) {
                                    this.user_info.email = responseResult.data.email
                                    this.$store.commit('setRnd', responseResult.data.rnd)
                                    this.$store.commit('setEmail', responseResult.data.email)
                                    this.Visible = false
                                }
                                else
                                    this.$message.error('提交失败')
                                this.loadingInstance.close()
                            })
                            .catch((failRespone) => {
                                this.$message.error('提交失败')
                                this.loadingInstance.close()
                                return failRespone
                            })
                    } else if (this.dialogTitle === '公告修改') {
                        this.$axios
                            .post('/manage/submitAnnounce', {
                                announce: this.form.announce,
                                rnd: this.$store.state.rnd
                            })
                            .then((successRespone) => {
                                let responseResult = successRespone.data
                                if (responseResult.code === 401) {
                                    this.Logout()
                                    return
                                }
                                if (responseResult.code === 200) {
                                    this.user_info.announce = responseResult.data.announce
                                    this.$store.commit('setRnd', responseResult.data.rnd)
                                    this.Visible = false
                                }
                                else
                                    this.$message.error('提交失败')
                                this.loadingInstance.close()
                            })
                            .catch((failRespone) => {
                                this.$message.error('提交失败')
                                this.loadingInstance.close()
                                return failRespone
                            })
                    }
                } else
                    this.$message.error('提交的信息不满足格式要求')
            })
        }
    },
    created: function() {
        this.$axios
            .post('/operator/getUserInfo')
            .then((successRespone) => {
                let responseResult = successRespone.data
                if (responseResult.code === 401) {
                    this.Logout()
                    return
                }
                if (responseResult.code === 200) {
                    this.user_info.username = responseResult.data.username
                    this.user_info.nickname = responseResult.data.nickname
                    this.user_info.email = responseResult.data.email
                    this.user_info.announce = responseResult.data.announce
                }
                else
                    this.$message.error('获取信息失败')
                this.loadingInstance.close()
            })
            .catch((failRespone) => {
                this.$message.error('获取信息失败')
                this.loadingInstance.close()
                return failRespone
            })
    }
}
</script>

<style lang="scss" scoped>
.opacity-set {
    @include opacity-set(0.4);
    height: 93.5vh;
    width: 100%;
}
</style>

<style scoped>
p {
    display: -webkit-box;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    white-space: normal;
}
ul {
    margin-top: 3vh;
    width: 40vw;
    list-style: none;
}
li {
    margin: 0.5rem 0 0.5rem 0;
    font-size: 1.2rem;
    width: 100%;
    height: 10vh;
}
.el-card {
    border: 1px solid rgba(0, 0, 0, 0.4);
}
.el-card__header {
    padding: 2.5vh 1.3vw;
}
.clearfix {
    height: 5vh;
}
.el-card__body {
    padding: 2.8vh;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}
.content {
    display: inline-block;
    width: 50%;
    height: 50%;
}
@media screen and (min-width: 900px) {
    .el-avatar {
        position: absolute;
    }
}
</style>