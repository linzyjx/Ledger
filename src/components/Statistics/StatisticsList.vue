<template>
    <div class="statistics-list">
        <el-scrollbar style="height: 100%">
            <ul class="infinite-list">
                <li v-for="node of data" :key="node.src" class="infinite-list-item"
                    @click="handleNodeClick(node)">
                    <el-button plain class="box-card">{{node.name}}</el-button>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script>
    // import {getCategoryListTree} from '@/js/db/RendererDB';
    // import {ipcRenderer as ipc} from 'electron';

    export default {
        name: "CategorySelector",
        mounted() {
        },
        data() {
            return {
                data: [
                    {
                        name: '净值',
                        src: 'NetBalance'
                    },
                    {
                        name:'收入/支出统计',
                        src:'NetIO'
                    }
                ],
            }
        },
        props: ['type'],
        methods: {
            handleNodeClick(data) {
                console.log(`/App/Statistics/${data.src}`);
                this.$router.push(`/App/Statistics/${data.src}`);

            }
        },
        watch: {}
    }
</script>

<style scoped>
    .cate-icon-span {
        padding-right: 5px;
    }

    .cate-icon {
        color: #ffffff;
        font-size: 20px;
        border-radius: 40px;
        height: 30px;
        width: 29px;
        line-height: 1.5;
        text-align: center;
        margin: 5px 5px 5px 0;
    }

    .cate-slot-scope {
        height: auto;
    }

    .statistics-list {
        height: 100%;
        padding: 0 8px;
        overflow: hidden;
    }
</style>

<style>
    .statistics-list .el-tree-node__content {
        /*height: 30px;*/
    }

    .statistics-list .el-tree-node {
        padding: 3px 0 3px 0;
    }

    .statistics-list .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    /*.statistics-list{*/
    /*    margin:10px 0;*/
    /*}*/
</style>

<style scoped>
    .infinite-list {
        height: 100%;
        padding: 0;
        margin: 8px 0;
        list-style: none;
    }

    .infinite-list .infinite-list-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: auto;
        /*background: #e8f3fe;*/
        margin: 4px 0;
        /*color: #7dbcfc;*/
    }

    .box-card {
        width: 100%;
        align-items: center;
        justify-content: center;
        height: 50px;
        display: flex;
    }
</style>
