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
            height="86vh"
            :highlight-current-row="false"
            style="max-width: 100%;"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-background="rgba(0, 0, 0, .6)"
        >
            <el-table-column width="100" prop="id" label="留言编号" align="center"></el-table-column>
            <el-table-column prop="from" label="留言用户" width="100" align="center"></el-table-column>
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
            :page-size="15"
            layout="prev, pager, next"
            :total="messageToT"
            hideOnSinglePage
        ></el-pagination>
    </div>
</template>

<script>
function Message(id, from, content, time) {
    this.id = id
    this.from = from
    this.content = content
    this.time = time
}

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
            messageToT: 500,
            small: document.documentElement.clientWidth < 600
        }
    },
    methods: {
        getMessage(type = '') {
            this.$axios
                .post('/manage/excuteMessage', {
                    pageSize: 15,
                    pageId: this.pageId,
                    type: type,
                    messageId: type === '' ? -1 : this.focus_row_id
                })
                .then((successRespone) => {
                    let responseResult = JSON.parse(successRespone.data)
                    console.log(responseResult)
                    if (successRespone.data.code === 200) {
                        this.message_info.length = 0
                        this.messageToT = responseResult.messageToT
                        this.message_info = responseResult.message_info
                    }
                    this.loading = false
                })
                .catch((failRespone) => {
                    console.log(failRespone)
                    this.loading = false
                })
        },
        runClick(row) {
            this.focus_row_content = row.content
            this.focus_row_from = row.from
            this.focus_row_id = row.id
            this.delete_control = true
        },
        excute() {
            this.delete_control = false
            this.loading = true
            this.getMessage('delete')
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
        this.message_info.push(new Message(1, 'dasdasdasdioj', 'dsafaopi dfapoiejf aija32', '1900-02-12 12:23:21'))
        this.message_info.push(new Message(2, 'dasdsadsaioj', 'faefaevgfedrfvesfeafaedfaesdd', '1900-02-12 12:23:21'))
        this.message_info.push(new Message(3, 'dasisadsadoj', 'faesfaesfesdvgffesdfc', '1900-02-12 12:23:21'))
        this.message_info.push(
            new Message(
                4,
                'dasioj',
                'asdfaefasedawsdj发哦欸附件奥fewuiofewi欧菲哈饿哦哎符合奥i肺癌藕粉奥i发啊饿哦i发饿哦哎附件啊饿哦发饿哦i罚恶婆i减肥安排减肥啊减肥非法进啊饿哦i放假啊饿哦i积分啊额尔多faefiaehf oiaehf oeuifo iaef oaiefodi aefoia efoaefniefnoae soifaioejfijaegoivjedoifvneswodifj ewjfgoiewj fger f weoijfeois rfnerfnv ergoerng orenf onrgwoejf wesdon发哦欸发哦都阿斯都i阿散井佛埃斯蒂骚',
                '1900-02-12 12:23:21'
            )
        )
        this.message_info.push(new Message(5, 'dasioj', 'sergfesf', '1900-02-12 12:23:21'))
        this.message_info.push(new Message(6, 'dasioj', 'feasgwesrgfewff', '1900-02-12 12:23:21'))
        this.message_info.push(new Message(7, 'daasdasdsasioj', 'aewfeagaevgfaefaefvgae', '1900-02-12 12:23:21'))
        this.message_info.push(new Message(8, 'dasioj', 'afewvgaedgvawedvfgrdwgbwefvedws', '1900-02-12 12:23:21'))
        this.message_info.push(new Message(9, 'dadsadsasioj', 'aefeasfewgfvwesfvwefvgwef', '1900-02-12 12:23:21'))
        this.message_info.push(new Message(10, 'dasioj', 'faefaesw', '1900-02-12 12:23:21'))
        this.message_info.push(new Message(11, 'dasdasddioj', 'faegaefaewfvgrsdfvsd', '1900-02-12 12:23:21'))
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
