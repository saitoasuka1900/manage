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
                        E-mail: {{ user_info.E_mail }}&nbsp;&nbsp;
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
        <el-dialog :title="dialogTitle" :visible.sync="Visible" width="500px">
            <el-form :model="form">
                <el-form-item label="昵称" v-if="dialogTitle === '昵称修改'" :label-width="form.labelWidth">
                    <el-input placeholder="请输入昵称" v-model="form.nickname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="已绑定的邮箱" v-if="dialogTitle === '邮箱修改'" :label-width="form.labelWidth">
                    <el-input v-model="user_info.E_mail" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="验证码" v-if="dialogTitle === '邮箱修改'" :label-width="form.labelWidth">
                    <el-input v-model="form.icode">
                        <el-button slot="append" @click="sendIcode()">{{ icodeButton }}</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="要绑定的邮箱" v-if="dialogTitle === '邮箱修改'" :label-width="form.labelWidth">
                    <el-input v-model="form.E_mail"></el-input>
                </el-form-item>
                <el-form-item label="公告" v-if="dialogTitle === '公告修改'" :label-width="form.labelWidth">
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
                E_mail: '',
                announce: ''
            },
            Visible: false,
            dialogTitle: '',
            form: {
                nickname: '',
                E_mail: '',
                announce: '',
                labelWidth: 120,
                icode: ''
            },
            time: 30,
            icodeButton: '点击发送邮箱验证码'
        }
    },
    methods: {
        showDialog(type) {
            this.dialogTitle = type === 'nickname' ? '昵称修改' : type === 'e_mail' ? '邮箱修改' : '公告修改'
            this.form = {
                nickname: this.user_info.nickname,
                E_mail: '',
                announce: this.user_info.announce
            }
            this.Visible = true
        },
        sendIcode() {
            this.$axios
                .post('/manage/sendIcode')
                .then(() => {
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
                })
                .catch((failRespone) => {
                    alert('验证码发送失败')
                    return failRespone
                })
        },
        submit() {
            this.$axios
                .post('/manage/submit_user_info', this.form)
                .then((successRespone) => {
                    let responseResult = JSON.parse(successRespone.data)
                    console.log(responseResult)
                    this.user_info.nickname = responseResult.user_info.nickname
                    this.user_info.E_mail = responseResult.user_info.E_mail
                    this.user_info.announce = responseResult.user_info.announce
                    alert('提交成功')
                })
                .catch((failRespone) => {
                    alert('提交失败')
                    return failRespone
                })
        }
    },
    created: function() {
        this.$axios
            .post('/manage/getUserInfo')
            .then((successRespone) => {
                let responseResult = JSON.parse(successRespone.data)
                console.log(responseResult)
                this.user_info.username = responseResult.user_info.username
                this.user_info.nickname = responseResult.user_info.nickname
                this.user_info.E_mail = responseResult.user_info.E_mail
                this.user_info.announce = responseResult.user_info.announce
            })
            .catch((failRespone) => {
                console.log('Get Info failed')
                return failRespone
            })
        this.user_info = {
            username: 'saitoasuka',
            nickname: 'saitoasuka',
            E_mail: '???',
            announce:
                'Ffaoijdfoaaedfgeasfveaswdvsdrvge swvgeswrvgdrvgeswvgeswrvgdrvgeswvgeswrvgdrvgeswvgeswrvgdrvgeswvgeswrvgbsewfveswfcewsfsefesfesaeweijfio'
        }
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