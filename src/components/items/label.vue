<template>
    <div>
        <el-dialog
            title="修改标签名称"
            :visible.sync="edit_control"
            :width="small ? '70%' : '30%'"
            :close-on-click-modal="false"
        >
            <el-input v-model="input_name" :placeholder="focus_row_name"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="edit_control = false">取 消</el-button>
                <el-button type="primary" @click="excute('edit')">确 定</el-button>
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
                <el-button type="primary" @click="excute('delete')">确 定</el-button>
            </span>
        </el-dialog>
        <el-table
            :data="label_info"
            height="94vh"
            :highlight-current-row="false"
            style="max-width: 100%;"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-background="rgba(0, 0, 0, .6)"
        >
            <el-table-column width="100" prop="id" label="标签编号" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" min-width="100" align="center"></el-table-column>
            <el-table-column prop="count" label="数量" min-width="100" align="center"></el-table-column>
            <el-table-column label="所属" width="100" align="center">
                {{ LabelType }}
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button @click="runClick(scope.row, 'edit')" type="text" size="medium">编辑</el-button>
                    <el-button @click="runClick(scope.row, 'delete')" type="text" size="medium">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
function Label(id, name, count) {
    this.id = id
    this.name = name
    this.count = count
}

export default {
    data() {
        return {
            labelType: this.$route.path.split('/')[1],
            label_info: [],
            loading: true,
            delete_control: false,
            edit_control: false,
            focus_row_name: '',
            focus_row_id: 0,
            focus_row: 0,
            small: document.documentElement.clientWidth < 600,
            input_name: ''
        }
    },
    methods: {
        getLabel(type = '') {
            this.$axios
                .post('/manage/excuteLabel', {
                    labelType: this.labelType,
                    type: type,
                    labelId: type === '' ? -1 : this.focus_row_id,
                    newName: type === 'edit' ? this.input_name : ''
                })
                .then((successRespone) => {
                    let responseResult = JSON.parse(successRespone.data)
                    console.log(responseResult)
                    this.label_info.length = 0
                    this.label_info = responseResult.label_info.slice
                    if (type === 'edit') {
                        this.label_info[this.focus_row].name = this.input_name
                        this.input_name = ''
                    }
                    this.loading = false
                })
                .catch((failRespone) => {
                    console.log(failRespone)
                    this.loading = false
                })
        },
        runClick(row, type) {
            this.focus_row_id = row.id
            this.focus_row_name = row.name
            this.focus_row = row.row_id
            if (type === 'delete') this.delete_control = true
            else {
                this.input_name = this.focus_row_name
                this.edit_control = true
            }
        },
        excute(type) {
            this.loading = true
            if (type === 'delete') this.delete_control = false
            else {
                this.edit_control = false
                if (this.label_info[this.focus_row].name === this.input_name) {
                    this.loading = false
                    this.input_name = ''
                    return
                }
            }
            this.getLabel(type)
        },
        listenWidth() {
            this.small = document.documentElement.clientWidth < 600
        }
    },
    created: function() {
        this.label_info.push(new Label(1, 'fas', 131))
        this.label_info.push(new Label(2, 'fddwas', 13241))
        this.label_info.push(new Label(1, 'fas', 1231))
        this.label_info.push(new Label(4, 'fafsdafs', 321))
        this.label_info.push(new Label(1, 'fads', 131))
        this.label_info.push(new Label(2, 'fddwas', 13241))
        this.label_info.push(new Label(1, 'fas', 1231))
        this.label_info.push(new Label(4, 'fafsdafs', 321))
        this.label_info.push(new Label(1, 'fads', 131))
        this.label_info.push(new Label(2, 'fddwas', 13241))
        this.label_info.push(new Label(1, 'fas', 1231))
        this.label_info.push(new Label(4, 'fafsdafs', 321))
        this.label_info.push(new Label(1, 'fads', 131))
        this.label_info.push(new Label(2, 'fddwas', 13241))
        this.label_info.push(new Label(1, 'fas', 1231))
        this.label_info.push(new Label(4, 'fafsdafs', 321))
        this.label_info.push(new Label(1, 'fads', 131))
        for (let i = 0; i < this.label_info.length; ++i) this.label_info[i].row_id = i
        this.getLabel()
        window.addEventListener('resize', this.listenWidth)
    },
    watch: {
        $route(to) {
            this.labelType = to.path.split('/')[1]
            this.loading = true
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
