<template>
    <div class="opacity-set" style="text-align: initial;">
        <div class="title-input">
            <el-input v-model="title" placeholder="请输入标题" maxlength="20" show-word-limit />
            <el-select v-model="catagory" placeholder="请选择类别" style="height: 100%; width: 120px;">
                <el-option
                    v-for="item in catagoty_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-select
                v-model="label"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择标签"
                style="display:inline-block; height: 100%; width: 420px"
                :multiple-limit="5"
                size="small"
            >
                <el-option
                    v-for="item in label_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-button-group>
                <el-button type="primary" size="small" @click="submit('post')">发布文章</el-button>
                <el-button type="info" size="small" @click="submit('draft')">保存草稿</el-button>
            </el-button-group>
        </div>
        <el-input
            v-model="description"
            placeholder="请输入简介"
            maxlength="100"
            show-word-limit
            style="width: 100%; height: 5%;"
        ></el-input>
        <mavon-editor v-model="content" :style="{ height: eidtor_height }" @fullScreen="fullScreen" />
    </div>
</template>

<script>
import Content from '@/js/1'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
    components: { mavonEditor },
    data() {
        return {
            postId: -1,
            postType: '',
            title: '',
            description: '',
            content: '',
            eidtor_height: '90%',
            catagoty_options: [
                { label: '算法', value: 1 },
                { label: '开发', value: 2 },
                { label: '其他', value: 3 }
            ],
            catagory: '',
            label_options: [
                { label: '算法', value: 1 },
                { label: '开发', value: 2 },
                { label: '其他', value: 3 }
            ],
            label: [],
            loadingInstance: ''
        }
    },
    methods: {
        fullScreen(status) {
            this.eidtor_height = status ? '100%' : '90%'
        },
        submit(type) {
            if (type === 'post') {
                if (this.title === '') {
                    alert('标题为空')
                    return
                }
                if (this.catagory === '') {
                    alert('未选择文章类型')
                    return
                }
            }
            if (this.value === '') {
                alert('文章内容为空')
                return
            }
            this.$axios
                .post('/manage/submit_post', {
                    postId: this.postId,
                    postType: this.postType,
                    submitType: type,
                    title: this.title,
                    catagory: this.catagory,
                    label: this.label,
                    description: this.description,
                    content: this.content
                })
                .then((successRespone) => {
                    if (successRespone.data.code === 200) alert('提交成功')
                })
                .catch((failRespone) => {
                    alert('提交失败')
                    return failRespone
                })
        },
        getLabel(to) {
            this.label_options.length = 0
            this.label.length = 0
            this.$axios
                .post('/manage/get_label', {
                    catagory: to
                })
                .then((successRespone) => {
                    let responseResult = JSON.parse(successRespone.data)
                    console.log(responseResult)
                    this.label_options = responseResult.label_options.slice()
                })
                .catch((failRespone) => {
                    console.log('Get Labels failed')
                    return failRespone
                })
        },
        getPost() {
            this.$axios
                .post('/manage/get_post', {
                    postId: this.postId,
                    postType: this.postType
                })
                .then((successRespone) => {
                    let responseResult = JSON.parse(successRespone.data)
                    console.log(responseResult)
                    this.title = responseResult.title
                    this.catagory = responseResult.catagory
                    this.label = responseResult.label.slice()
                    this.description = responseResult.description
                    this.content = responseResult.content
                    this.loadingInstance.close()
                })
                .catch((failRespone) => {
                    this.loadingInstance.close()
                    alert('获取失败')
                    return failRespone
                })
        }
    },
    created: function() {
        if (typeof this.$route.params.id !== 'undefined') {
            this.postId = this.$route.params.id
            this.postType = this.$route.path.split('/')[2]
            this.content = ''
        } else {
            this.postId = -1
            this.postType = ''
            this.content = Content()
            return
        }
        this.loadingInstance = this.$loading({ fullScreen: true, background: 'rgba(0, 0, 0, .4)' })
        this.getPost()
    },
    watch: {
        $route(to) {
            if (typeof to.params.id !== 'undefined') {
                this.postId = to.params.id
                this.postType = to.path.split('/')[2]
                this.content = ''
            } else {
                this.postId = -1
                this.postType = ''
                this.content = Content()
                return
            }
            this.loadingInstance = this.$loading({ fullScreen: true, background: 'rgba(0, 0, 0, .4)' })
            this.getPost()
        },
        catagory(to) {
            this.getLabel(to)
        }
    },
    beforeRouteLeave(to, from, next) {
        const answer = window.confirm('当前页面数据未保存，确定要离开？')
        if (answer) {
            next()
        } else {
            next(false)
        }
    },
    beforeRouteUpdate(to, from, next) {
        const answer = window.confirm('当前页面数据未保存，确定要离开？')
        if (answer) {
            next()
        } else {
            next(false)
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
.title-input {
    width: 100%;
    height: 5%;
}
</style>

<style deep>
.title-input > .el-input {
    width: calc(98% - 700px);
    min-width: 0;
}
.el-input,
.el-input__inner {
    height: 100%;
    line-height: 100%;
}
</style>
