<template>
    <div class="category-list">
        <el-scrollbar style="height: 100%">
            <el-tree
                    :data="data" node-key="id"
                    @node-click="handleNodeClick"
                    :expand-on-click-node="false"
                    @node-drag-start="handleDragStart"
                    @node-drag-enter="handleDragEnter"
                    @node-drag-leave="handleDragLeave"
                    @node-drag-over="handleDragOver"
                    @node-drag-end="handleDragEnd"
                    @node-drop="handleDrop"
                    draggable
                    :default-expand-all="true">
                <span slot-scope="{node,data}" class="cate-slot-scope">
                    <i :class="['cate-icon',data.icon]"
                       :style="{'background-color':(data.color?data.color:'#ffffff')}"></i>
                    <span>{{data.label}}</span>
                </span>
            </el-tree>
        </el-scrollbar>
    </div>
</template>

<script>
    import {getCategoryListTree} from '@/js/db/RendererDB';
    import {ipcRenderer as ipc} from 'electron';

    export default {
        name: "CategorySelector",
        mounted() {
            console.log('mounted:', this.type);
            if (this.type !== undefined) {
                this.getCategoryListData(this.type);
            }
            ipc.on('updateCateList', () => {
                this.getCategoryListData(this.type);
            })
        },
        data() {
            return {
                data: [],
                value: '指南',
                visible: false,
                selectedLabel: undefined,
                flag: false
            }
        },
        props: ['type'],
        methods: {
            handleNodeClick(data) {
                if (parseInt(data.id) !== parseInt(this.$route.params.id)) {
                    this.$router.push(`/App/Category/${data.id}`);
                    // ipc.send('RoutePush',`/MiniWindow/Demo1/${data.id}?a=111`);
                    console.log('send RoutePush');
                }
            },
            async getCategoryListData(type) {
                let rowData = await getCategoryListTree(type);
                let categoryListTree = [];
                for (let item of rowData.children) {
                    categoryListTree.push(item);
                }
                this.data = categoryListTree;
                console.log('categoryListTree:', categoryListTree);
            },
            handleDragStart() {
                // console.log('drag start', node, ev);
            },
            handleDragEnter(draggingNode, dropNode, ev) {
                // console.log('tree drag enter: ', dropNode.label, ev);
                ev
            },
            handleDragLeave(draggingNode, dropNode, ev) {
                // console.log('tree drag leave: ', dropNode.label, ev);
                ev
            },
            handleDragOver(draggingNode, dropNode, ev) {
                // console.log('tree drag over: ', dropNode.label, ev);
                ev
            },
            handleDragEnd(draggingNode, dropNode, dropType, ev) {
                // console.log('tree drag end: ', dropNode && dropNode.label, dropType, ev);
                ev
            },
            handleDrop(draggingNode, dropNode, dropType) {
                console.log('tree drop: ', draggingNode.data.id, dropNode.data.id, dropType);
                ipc.send('updateCateList', draggingNode.data.id, dropNode.data.id, dropType);
            }
        },
        watch: {
            type: {
                handler(newType) {
                    console.log('type watch:', newType);
                    this.getCategoryListData(newType);
                },
                deep: true
            }
        }
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

    .category-list {
        height: 100%;
        padding: 0 10px;
        overflow: hidden;
    }
</style>

<style>
    .category-list .el-tree-node__content {
        /*height: 30px;*/
    }

    .category-list .el-tree-node {
        padding: 3px 0 3px 0;
    }

    .category-list .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>
