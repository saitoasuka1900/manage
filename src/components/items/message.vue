<template>
    <div>
        <el-dialog title="删除留言" :visible.sync="delete_control" :width="small ? '70%' : '30%'" :close-on-click-modal='false'>
            <p>是否删除用户 {{ focus_row_from }} 的留言：{{ focus_row_content }}</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delete_control = false">取 消</el-button>
                <el-button type="primary" @click="excute()">确 定</el-button>
            </span>
        </el-dialog>
        <el-table
            :data="message_info"
            :height="messageToT <= pageSize ? '94vh' : '89vh'"
            :highlight-current-row="false"
            style="max-width: 100%;"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-background="rgba(0, 0, 0, .6)"
        >
            <el-table-column width="100" prop="id" label="留言编号" align="center"></el-table-column>
            <el-table-column prop="username" label="留言用户" width="100" align="center"></el-table-column>
            <el-table-column prop="content" label="内容" min-width="300" align="center"></el-table-column>
            <el-table-column prop="time" label="留言时间" width="160" align="center"></el-table-column>
            <el-table-column label="操作" width="90" align="center">
                <template slot-scope="scope">
                    <el-button @click="runClick(scope.row)" type="text" size="medium">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :small="small"
            @current-change="handleCurrentChange"
            current-page.sync="1"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="messageToT"
            hideOnSinglePage
        ></el-pagination>
    </div>
</template>

<script>

export default {
    data() {
        return {
            message_info: [],
            loading: true,
            delete_control: false,
            focus_row_content: '',
            focus_row_from: '',
            focus_row_id: 0,
            pageId: 1,
            messageToT: 0,
            small: document.documentElement.clientWidth < 600,
            pageSize: 15
        }
    },
    methods: {
        getMessage() {
            this.$axios
                .post('/message/get', {
                    pageSize: this.pageSize,
                    pageId: this.pageId,
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    this.messageToT = responseResult.data.messageToT
                    this.message_info.length = 0
                    let message_infos = responseResult.data.message_infos
                    for (let i = 0; i < message_infos.length; ++i) {
                        let elem = message_infos[i]
                        this.message_info.push({
                            id: elem.id,
                            content: elem.content,
                            time: elem.time,
                            username: elem.username,
                            row_id: i
                        })
                    }
                    this.loading = false
                    this.$message({
                        message: '获取留言成功',
                        type: 'success'
                    })
                })
                .catch((failRespone) => {
                    this.$message.error('获取留言失败')
                    console.log(failRespone)
                    this.loading = false
                })
        },
        delMessage() {
            this.$axios
                .post('/manage/message/del', {
                    id: this.message_info[this.focus_row_id].id,
                    rnd: this.$store.state.rnd,
                    pageSize: this.pageSize,
                    pageId: this.pageId,
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    this.$store.commit('setRnd', responseResult.data.rnd)
                    this.messageToT = responseResult.messageToT
                    this.message_info.length = 0
                    let message_infos = responseResult.message_infos
                    for (let i = 0; i < message_infos.length; ++i) {
                        let elem = message_infos[i]
                        this.message_info.push({
                            id: elem.id,
                            content: elem.content,
                            time: elem.time,
                            username: elem.username,
                            row_id: i
                        })
                    }
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
        runClick(row) {
            this.focus_row_content = row.content
            this.focus_row_from = row.from
            this.focus_row_id = row.row_id
            this.delete_control = true
        },
        excute() {
            this.delete_control = false
            this.loading = true
            this.delMessage()
        },
        handleCurrentChange(val) {
            this.loading = true
            this.pageId = val
            this.getMessage()
        },
        listenWidth() {
            this.small = document.documentElement.clientWidth < 600
        }
    },
    created: function() {
        this.getMessage()
        window.addEventListener('resize', this.listenWidth)
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
p {
    width: 100%;
    display: -webkit-box;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    white-space: normal;
}
div[class='cell'] {
    display: -webkit-box;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal;
}
</style>
