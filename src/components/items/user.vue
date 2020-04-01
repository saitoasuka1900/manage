<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span style="float: left; font-weight: bold; font-size: 1.5rem;">个人中心</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
        </div>
    </el-card>
</template>

<script>
export default {}
</script>

<style>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}

.box-card {
    width: 100%;
    height: 100%;
    border: 0;
}
</style>