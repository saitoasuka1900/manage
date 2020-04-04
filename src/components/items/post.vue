<template>
    <div style="height: 94vh; width: 100%;">
        <el-scrollbar style="height: 94vh; width: 100%; color: white; text-align: center;">
            <table style="width: 100%; text-align: center; height: 80%;">
                <tr>
                    <th>
                        标题
                    </th>
                    <th>
                        发布时间
                    </th>
                    <th>
                        类别
                    </th>
                    <th>
                        标签
                    </th>
                    <th>
                        操作
                    </th>
                </tr>
                <tr v-for="elem in post_info" :key="elem.title">
                    <th>{{ elem.title }}</th>
                    <th>{{ elem.time }}</th>
                    <th>{{ elem._class }}</th>
                    <th>{{ elem.label }}</th>
                    <th>
                        <el-button style="font-size: 0.9rem; padding: 3px 0" type="text">编辑</el-button>
                        <el-button style="font-size: 0.9rem; padding: 3px 0" type="text">删除</el-button>
                    </th>
                </tr>
            </table>
        </el-scrollbar>
    </div>
</template>

<script>
function Post(title, time, _class, label) {
    this.title = title
    this.time = time
    this._class = _class
    this.label = label
}

export default {
    data() {
        return {
            post_info: []
        }
    },
    methods: {
        getPost() {
            this.$axios
                .post('/manage/getUserInfo')
                .then((successRespone) => {
                    this.responseResult = JSON.stringify(successRespone.data)
                    if (successRespone.data.code === 200) this.user_info = JSON.parse(successRespone.data)
                })
                .catch((failRespone) => {
                    console.log('Get Info failed')
                    return failRespone
                })
        }
    },
    created: function() {
        this.post_info.push(new Post('dasdasdasdioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasdsadsaioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasisadsadoj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dassadasdsaioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasdasdsioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('daasdasdsasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dadsadsasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasdasddioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfa dasdaw wad awdaw dpoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasasdasdioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasidsadasoj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
        this.post_info.push(new Post('dasioj', '1900-02-12 12:23:21', 'dsa', 'faopi dfapoiejf aija'))
    }
}
</script>

<style lang="scss" scoped>
th {
    @include opacity-set(0.4);
    text-align: center;
    line-height: 100%;
    min-width: 30px;
    padding: 2vh 0;
}
</style>

<style scoped>
tr {
    height: 5vh;
    width: 100%;
}
</style>