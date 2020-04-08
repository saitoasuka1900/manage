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
                        <el-button style="font-size: 1.2rem; padding: 3px 0" type="text">修改昵称</el-button>
                    </li>
                    <li>
                        E-mail: {{ user_info.E_mail }}&nbsp;&nbsp;
                        <el-button style="font-size: 1.2rem; padding: 3px 0" type="text">更换绑定邮箱</el-button>
                    </li>
                    <li>
                        <p>公告:&nbsp;&nbsp;&nbsp;{{ user_info.announce }}</p>
                        <el-button style="font-size: 1.2rem; padding: 3px 0" type="text">编辑公告</el-button>
                    </li>
                </ul>
            </div>
        </el-scrollbar>
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
            }
        }
    },
    created: function() {
        this.$axios
            .post('/manage/getUserInfo')
            .then((successRespone) => {
                let responseResult = JSON.parse(successRespone.data)
                console.log(responseResult)
                this.user_info = responseResult.user_info
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