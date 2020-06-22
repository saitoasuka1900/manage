<template>
    <div>
        <el-dialog
            title="编辑文章"
            :visible.sync="edit_control"
            :width="small ? '70%' : '30%'"
            :close-on-click-modal="false"
        >
            <span>是否打开并编辑文章 {{ focus_row_title }}({{ focus_row_time }})</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="edit_control = false">取 消</el-button>
                <el-button type="primary" @click="excute('edit')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="删除文章"
            :visible.sync="delete_control"
            :width="small ? '70%' : '30%'"
            :close-on-click-modal="false"
        >
            <span>是否删除文章 {{ focus_row_title }}({{ focus_row_time }})</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delete_control = false">取 消</el-button>
                <el-button type="primary" @click="excute('delete')">确 定</el-button>
            </span>
        </el-dialog>
        <el-table
            :data="post_info"
            :height="postToT <= pageSize ? '94vh' : '89vh'"
            :highlight-current-row="false"
            style="max-width: 100%;"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-background="rgba(0, 0, 0, .6)"
        >
            <el-table-column min-width="100" prop="title" label="标题" align="center"></el-table-column>
            <el-table-column prop="time" label="发布时间" width="160" align="center"></el-table-column>
            <el-table-column prop="category" label="所属" width="100" align="center"></el-table-column>
            <el-table-column prop="label" label="标签" align="center"></el-table-column>
            <el-table-column prop="comment" label="评论数" width="90" align="center"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button @click="runClick(scope.row, 'edit')" type="text" size="medium">编辑</el-button>
                    <el-button @click="runClick(scope.row, 'delete')" type="text" size="medium">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :small="small"
            @current-change="handleCurrentChange"
            :current-page.sync="pageId"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="postToT"
            hideOnSinglePage
        ></el-pagination>
    </div>
</template>

<script>
export default {
    data() {
        return {
            post_info: [],
            loading: true,
            edit_control: false,
            delete_control: false,
            focus_row_title: '',
            focus_row_time: '',
            focus_row_id: 0,
            pageId: Number(this.$route.params.id),
            pageSize: 15,
            postToT: 500,
            small: document.documentElement.clientWidth < 600,
            where: this.$route.path.split('/')[1]
        }
    },
    methods: {
        getPost() {
            this.$axios
                .post('/get/post', {
                    type: this.where,
                    pageSize: this.pageSize,
                    pageId: this.pageId
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code === 200) {
                        this.postToT = responseResult.data.postToT
                        this.post_info = responseResult.data.post_info
                        this.$message({
                            message: '获取文章成功',
                            type: 'success'
                        })
                    }
                    else
                        this.$message.error('获取文章失败')
                    this.loading = false
                })
                .catch((failRespone) => {
                    console.log(failRespone)
                    this.$message.error('获取文章失败')
                    this.loading = false
                })
        },
        delPost() {
            this.$axios
                .post('/manage/post/del', {
                    id: this.focus_row_id,
                    pageSize: this.pageSize,
                    pageId: this.pageId,
                    type: this.where,
                    rnd: this.$store.state.rnd
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code === 401) {
                        this.Logout()
                        return
                    }
                    if (responseResult.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.$store.commit('setRnd', responseResult.data.rnd)
                        this.postToT = responseResult.data.postToT
                        this.post_info = responseResult.data.post_info
                    }
                    else
                        this.$message.error('删除失败')
                    this.loading = false
                })
                .catch((failRespone) => {
                    this.$message.error('删除失败')
                    console.log(failRespone)
                    this.loading = false
                })
        },
        runClick(row, type) {
            this.focus_row_title = row.title
            this.focus_row_time = row.time
            this.focus_row_id = row.id
            console.log(row)
            if (type === 'edit') this.edit_control = true
            else this.delete_control = true
        },
        excute(type) {
            if (type === 'edit') this.edit_control = false
            else this.delete_control = false
            if (type === 'edit') {
                let path = '/write/' + this.where + '/' + this.focus_row_id.toString()
                this.$router.push({ path: path })
                return
            }
            this.loading = true
            this.delPost()
        },
        handleCurrentChange(val) {
            let path = '/write/' + this.where + '/' + val.toString()
            this.$router.push({ path: path })
        },
        listenWidth() {
            this.small = document.documentElement.clientWidth < 600
        },
        Logout() {
            this.$store.commit('Logout')
            this.loading = false
            this.$router.push({ path: '/login', query: { redirect: this.$route.fullpath } })
        }
    },
    created: function() {
        this.loading = true
        this.getPost()
        window.addEventListener('resize', this.listenWidth)
    },
    watch: {
        $route(to) {
            this.where = to.path.split('/')[1]
            this.pageId = Number(to.params.id)
            this.loading = true
            this.getPost()
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
.el-pagination {
    background-color: rgba(0, 0, 0, 0.4);
}
.el-pagination ul li,
.el-pagination .btn-next,
.el-pagination .btn-prev,
.el-pager li.btn-quicknext,
.el-pager li.btn-quickprev,
.el-pagination button:disabled,
.el-pagination__jump {
    background-color: rgba(0, 0, 0, 0);
    color: white;
}
</style>