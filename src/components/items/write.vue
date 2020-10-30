<template>
    <div class="opacity-set" style="text-align: initial;">
        <div class="title-input">
            <el-input v-model="title" placeholder="请输入标题" maxlength="40" show-word-limit />
            <el-select v-model="category" placeholder="请选择类别" style="height: 100%; width: 120px;">
                <el-option
                    v-for="item in catagoty_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
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
                    :key="item.key"
                    :label="item.name"
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
        <mavon-editor
            v-model="content"
            :style="{ height: eidtor_height }"
            @fullScreen="fullScreen"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
            v-if="show"
            ref="md"
        />
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
            category: '',
            label_options: [],
            label: [],
            label_id: [],
            saveLabel: [],
            loadingInstance: '',
            imgFiles: [],
            show: true,
            jumpCheck: true
        }
    },
    methods: {
        imgAdd(pos, file) {
            this.imgFiles.push(file)
        },
        // 参数pos为长度为二的数组，第一个数为该图片是从1开始第几个图片(包括已经被删除的图片)，第二个是该文件的对象
        imgDel(pos) {
            this.imgFiles.splice(pos[0] - 1, 1)
        },
        fullScreen(status) {
            this.eidtor_height = status ? '100%' : '90%'
        },
        //特殊字符过滤
        checkSpecificKey(str) {
            let specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘' "
            for (let i = 0; i < str.length; i++) if (specialKey.indexOf(str.substr(i, 1)) != -1) return false
            return true
        },
        submit(type) {
            if (type === 'post') {
                if (this.title === '') {
                    alert('标题为空')
                    return
                }
                if (this.category === '') {
                    alert('未选择文章类型')
                    return
                }
            }
            if (this.content === '') {
                alert('文章内容为空')
                return
            }
            let labels = []
            for (let label of this.label) {
                if (typeof label === Number) labels.push(this.label_options[label].value)
                else {
                    let flag = false
                    for (let option of this.label_options) {
                        if (label === option.name) {
                            labels.push(option.value)
                            flag = true
                            break
                        }
                    }
                    if (flag)
                        continue
                    if (label.length > 8 || !this.checkSpecificKey(label)) {
                        this.$message.error('标签长度超出限制或含非法字符')
                        return
                    }
                    labels.push(label)
                }
            }
            this.loadingInstance = this.$loading({ fullScreen: true, background: 'rgba(0, 0, 0, .4)' })
            this.postType = type
            let formData = new FormData()
            for (let i = 0; i < this.imgFiles.length; ++i) formData.append('file', this.imgFiles[i])
            formData.append(
                'properties',
                new Blob(
                    [
                        JSON.stringify({
                            id: this.postId,
                            rnd: this.$store.state.rnd
                        })
                    ],
                    {
                        type: 'application/json'
                    }
                )
            )
            // 第一步.将图片上传到服务器.
            this.$axios
                .post('/manage/write/upload/img', formData, {
                    headers: { 'Content-Type': undefined }
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code !== 200) {
                        this.Logout()
                        return
                    }
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    // $vm.$img2Url 详情见本页末尾
                    for (let i = 0; i < this.imgFiles.length; ++i)
                        this.$refs.md.$img2Url(i + 1, responseResult.data.url[i])
                    this.$store.commit('setRnd', responseResult.data.rnd)
                    this.postId = responseResult.data.id
                    this.$axios
                        .post('/manage/write/upload/post', {
                            id: parseInt(this.postId),
                            title: this.title,
                            category: this.category,
                            labels: labels,
                            description: this.description,
                            type: this.postType,
                            content: this.content,
                            rnd: this.$store.state.rnd,
                        })
                        .then((successRespone) => {
                            let responseResult = successRespone.data
                            if (responseResult.code !== 200) {
                                this.Logout()
                                return
                            }
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            })
                            this.jumpCheck = false
                            this.$store.commit('setRnd', responseResult.data.rnd)
                            this.loadingInstance.close()
                            this.$router.push({ path: '/write/' + this.postType + '/' + this.postId })
                        })
                        .catch((failRespone) => {
                            this.$message.error('提交失败')
                            this.loadingInstance.close()
                            return failRespone
                        })
                })
                .catch((failRespone) => {
                    this.$message.error('图片上传失败')
                    this.loadingInstance.close()
                    return failRespone
                })
        },
        getLabel(to) {
            this.label_options.length = 0
            this.label.length = 0
            if (to === '') return
            this.$axios
                .post('/manage/write/label/get', {
                    category: to
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    for (let i = 0; i < responseResult.data.labels.length; ++i) {
                        let label = responseResult.data.labels[i]
                        this.label_options.push({
                            value: label.id,
                            key: i,
                            name: label.name
                        })
                    }
                    for (let j = 0; j < this.saveLabal.length; ++j) {
                        let label = this.saveLabal[j]
                        for (let i = 0; i < responseResult.data.labels.length; ++i) {
                            if (label != responseResult.data.labels[i].name) continue
                            this.label.push(label)
                            break
                        }
                    }
                    this.saveLabal.length = 0
                })
                .catch((failRespone) => {
                    console.log('Get Labels failed')
                    return failRespone
                })
        },
        getPost() {
            this.content = ''
            this.title = ''
            this.description = ''
            this.category = ''
            this.saveLabel.length = 0
            this.$axios
                .post('/manage/write/post/get', {
                    postId: this.postId,
                    postType: this.postType,
                    rnd: this.$store.state.rnd
                })
                .then((successRespone) => {
                    let responseResult = successRespone.data
                    if (responseResult.code === 404) {
                        this.$message.error('获取文章失败')
                        this.loadingInstance.close()
                        return
                    }
                    if (responseResult.code !== 200) {
                        this.Logout()
                        return
                    }
                    this.title = responseResult.data.title
                    this.saveLabal = responseResult.data.label
                    this.category = responseResult.data.category
                    this.description = responseResult.data.description
                    this.content = responseResult.data.content
                    this.$message({
                        message: '获取文章成功',
                        type: 'success'
                    })
                    this.$store.commit('setRnd', responseResult.data.rnd)
                    this.loadingInstance.close()
                })
                .catch((failRespone) => {
                    this.loadingInstance.close()
                    this.$message.error('获取文章失败')
                    return failRespone
                })
        },
        Logout() {
            this.$store.commit('Logout')
            this.loadingInstance.close()
            this.$router.push({ path: '/login', query: { redirect: this.$route.fullpath } })
        }
    },
    created: function() {
        this.jumpCheck = true
        if (typeof this.$route.params.id !== 'undefined') {
            this.postId = this.$route.params.id
            this.postType = this.$route.path.split('/')[2]
            this.content = ''
        } else {
            this.postId = '-1'
            this.postType = ''
            this.content = Content()
            return
        }
        this.loadingInstance = this.$loading({ fullScreen: true, background: 'rgba(0, 0, 0, .4)' })
        this.getPost()
    },
    watch: {
        $route(to) {
            this.show = false
            this.imgFiles.length = 0
            this.$nextTick(() => {
                this.show = true
                if (typeof to.params.id !== 'undefined') {
                    this.postId = to.params.id
                    this.postType = to.path.split('/')[2]
                    this.content = ''
                } else {
                    this.title = ''
                    this.description = ''
                    this.category = ''
                    this.label.length = 0
                    this.label_id.length = 0
                    this.postId = '-1'
                    this.postType = ''
                    this.content = Content()
                    return
                }
                this.loadingInstance = this.$loading({ fullScreen: true, background: 'rgba(0, 0, 0, .4)' })
                this.getPost()
            })
        },
        category(to) {
            this.getLabel(to)
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.jumpCheck === false) {
            this.jumpCheck = true
            next()
        } else {
            const answer = window.confirm('当前页面数据未保存，确定要离开？')
            if (answer) {
                next()
            } else {
                next(false)
            }
        }
    },
    beforeRouteUpdate(to, from, next) {
        if (this.jumpCheck === false) {
            this.jumpCheck = true
            next()
        } else {
            const answer = window.confirm('当前页面数据未保存，确定要离开？')
            if (answer) {
                next()
            } else {
                next(false)
            }
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

<style>
.title-input > .el-input {
    width: calc(98% - 700px);
    min-width: 0;
}
.title-input .el-input,
.title-input .el-input__inner {
    height: 100%;
    line-height: 100%;
}
</style>
