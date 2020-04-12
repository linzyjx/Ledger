<template>
    <div class="category-list-header">
        <el-radio-group v-model="selectedType" size="medium" @change="handleChange">
            <el-radio-button :label="0">收入</el-radio-button>
            <el-radio-button :label="1">支出</el-radio-button>
        </el-radio-group>
        <el-button @click="handlePlusButton" circle icon="el-icon-plus" size="medium"
                   style="margin-left: 5px"></el-button>
    </div>
</template>

<script>
    import {ipcRenderer as ipc} from 'electron';

    export default {
        name: "CategoryListHeader",
        data() {
            return {
                selectedType: this.type
            }
        },
        props: ['type'],
        methods: {
            handleChange(val) {
                this.$emit('change', val);
            },
            handlePlusButton() {
                ipc.send('addCateItem', this.type);
            }
        },
        watch: {
            type: {
                handler(newType) {
                    this.selectedType = newType;
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    .category-list-header {
        height: 100%;
        width: 100%;
        text-align: center;
        display: flex; /*Flex布局*/
        display: -webkit-flex; /* Safari */
        align-items: center; /*指定垂直居中*/
        padding: 0 10px;
    }
</style>
<style>
    .category-list-header .el-radio-button__inner {
        width: 145px;
    }
</style>
