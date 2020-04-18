<template>
    <div>
        <el-dialog
            title="修改标签名称"
            :visible.sync="edit_control"
            :width="small ? '70%' : '30%'"
            :close-on-click-modal="false"
        >
            <el-input v-model="input_name" :placeholder="focus_row_name" maxlength="6"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="edit_control = false">取 消</el-button>
                <el-button type="primary" @click="editLabel()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="删除标签"
            :visible.sync="delete_control"
            :width="small ? '70%' : '30%'"
            :close-on-click-modal="false"
        >
            <span>是否删除类别 {{ LabelType }} 的标签 {{ focus_row_name }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delete_control = false">取 消</el-button>
                <el-button type="primary" @click="delLabel()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="添加标签"
            :visible.sync="add_control"
            :width="small ? '70%' : '30%'"
            :close-on-click-modal="false"
        >
            <el-input v-model="input_name" placeholder="输入要添加的标签名字" maxlength="6"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="add_control = false">取 消</el-button>
                <el-button type="primary" @click="addLabel()">确 定</el-button>
            </span>
        </el-dialog>
        <el-table
            :data="label_info.filter((data) => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
            height="94vh"
            :highlight-current-row="false"
            style="max-width: 100%;"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-background="rgba(0, 0, 0, .6)"
        >
            <el-table-column width="100" prop="row_id" label="标签编号" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="100" align="center"></el-table-column>
            <el-table-column prop="count" label="数量" min-width="100" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
                </template>
                <template slot-scope="scope">
                    <el-button @click="runClick(scope.row, 'edit')" type="text" size="medium">编辑</el-button>
                    <el-button @click="runClick(scope.row, 'delete')" type="text" size="medium">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column label="添加" width="150" align="center">
                <template slot="header">
                    <el-button type="primary" circle @click="add_control = true">添加</el-button>
                </template> 
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

export default {
    data() {
        return {
            labelType: this.$route.path.split('/')[1],
            label_info: [],
            loading: true,
            delete_control: false,
            edit_control: false,
            add_control: false,
            focus_row_name: '',
            focus_row_id: 0,
            focus_row: 0,
            small: document.documentElement.clientWidth < 600,
            input_name: '',
            search: ''
        }
    },
    methods: {
        Logout() {
            this.$store.commit('Logout')
            this.loading = false
            this.$router.push({ path: '/login', query: { redirect: this.$route.fullpath } })
        },
        //特殊字符过滤
        checkSpecificKey(str) {
            let specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘' "
            for (let i = 0; i < str.length; i++) if (specialKey.indexOf(str.substr(i, 1)) != -1) return false
            return true
        },
        addLabel() {
            for (let i = 0; i < this.label_info.length; ++i) {
                if (this.input_name === this.label_info[i].name) {
                    this.$message.error('标签名字重复')
                    return
                }
            }
            if (this.checkSpecificKey(this.input_name) == false) {
                this.$message.error('名字不能有特殊字符')
                return
            }
            this.add_control = false
            this.loading = true
            this.$axios
                .post('manage/label/add', {
                    name: this.input_name,
                    belong: this.LabelType,
                    rnd: this.$store.state.rnd
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code === 404) {
                        this.$message.error(responseResult.message)
                        this.loading = false
                        return
                    }
                    if (responseResult.code !== 200) {
                        this.Logout()
                        return
                    }
                    this.label_info.push({
                        id: responseResult.data.id,
                        name: responseResult.data.name,
                        count: responseResult.data.count,
                        row_id: this.label_info.length
                    })
                    this.$store.commit('setRnd', responseResult.data.rnd)
                    this.loading = false
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                })
                .catch((failRespone) => {
                    this.$message.error('添加失败')
                    this.loading = false
                    return failRespone
                })
        },
        delLabel() {
            this.delete_control = false
            this.loading = true
            this.$axios
                .post('/manage/label/del', {
                    id: this.focus_row,
                    rnd: this.$store.state.rnd
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code === 404) {
                        this.$message.error(responseResult.message)
                        this.loading = false
                        return
                    }
                    if (responseResult.code !== 200) {
                        this.Logout()
                        return
                    }
                    this.label_info.splice(this.focus_row_id, 1)
                    for (let i = this.focus_row_id; i < this.label_info.length; ++i) this.label_info[i].row_id = i
                    this.$store.commit('setRnd', responseResult.data.rnd)
                    this.loading = false
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                })
                .catch((failRespone) => {
                    this.$message.error('删除失败')
                    console.log(failRespone)
                    this.loading = false
                })
        },
        editLabel() {
            if (this.checkSpecificKey(this.input_name) == false) {
                this.$message.error('名字不能有特殊字符')
                return
            }
            this.edit_control = false
            this.loading = true
            this.$axios
                .post('/manage/label/edit', {
                    id: this.focus_row,
                    name: this.input_name,
                    belong: this.LabelType,
                    rnd: this.$store.state.rnd
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code === 404) {
                        this.$message.error(responseResult.message)
                        this.loading = false
                        return
                    }
                    if (responseResult.code !== 200) {
                        this.Logout()
                        return
                    }
                    this.label_info[this.focus_row_id].name = responseResult.data.label_name
                    this.$store.commit('setRnd', responseResult.data.rnd)
                    this.loading = false
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    })
                })
                .catch((failRespone) => {
                    this.$message.error('编辑失败')
                    console.log(failRespone)
                    this.loading = false
                })
        },
        getLabel() {
            this.$axios
                .post('/manage/label/get', {
                    belong: this.LabelType
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code !== 200) {
                        this.Logout()
                        return
                    }
                    console.log(responseResult)
                    this.label_info = responseResult.data.label_info
                    for (let i = 0; i < this.label_info.length; ++i) this.label_info[i].row_id = i
                    this.loading = false
                    this.$message({
                        message: '获取标签成功',
                        type: 'success'
                    })
                })
                .catch((failRespone) => {
                    this.$message.error('获取标签失败')
                    console.log(failRespone)
                    this.loading = false
                })
        },
        runClick(row, type) {
            this.focus_row_id = row.row_id
            this.focus_row_name = row.name
            this.focus_row = row.id
            if (type === 'delete') this.delete_control = true
            else {
                this.input_name = this.focus_row_name
                this.edit_control = true
            }
        },
        listenWidth() {
            this.small = document.documentElement.clientWidth < 600
        }
    },
    created: function() {
        for (let i = 0; i < this.label_info.length; ++i) this.label_info[i].row_id = i
        this.getLabel()
        window.addEventListener('resize', this.listenWidth)
    },
    watch: {
        $route(to) {
            this.labelType = to.path.split('/')[1]
            this.loading = true
            this.search = ''
            this.delete_control = this.edit_control = this.add_control = false
            this.getLabel()
        }
    },
    computed: {
        LabelType: function() {
            return this.labelType === 'algorithm' ? '算法' : this.labelType === 'development' ? '开发' : '其他'
        }
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.listenWidth)
    }
}
</script>

<style lang="scss" deep>
el-table-column {
    @include opacity-set(0.4);
    text-align: center;
    line-height: 100%;
    min-width: 30px;
    padding: 2vh 0;
}
.el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 纵向滚动条
    height: 8px; // 横向滚动条
}
// 滚动条的滑块
.el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
}
</style>

<style deep>
tr {
    height: 5vh;
    width: 100%;
}
.el-table {
    background-color: rgba(0, 0, 0, 0.4);
    min-width: 0;
}
.el-table th,
.el-table tr {
    background-color: rgba(0, 0, 0, 0);
    color: white;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #374255 !important;
}
</style>
