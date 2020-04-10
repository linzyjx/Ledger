<template>
    <el-form-item label="类别">
        <el-popover placement="right-start" popper-class="category-proper">
            <el-scrollbar style="height: 100%">
                <el-tree :data="data" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false">
                <span slot-scope="{node,data}" class="cate-slot-scope">
                    <i :class="['cate-icon',data.icon]"></i>
                    <span>{{data.label}},{{data.id}}</span>
                </span>
                </el-tree>
            </el-scrollbar>
            <el-input v-model="selectedLabel" slot="reference" @focus="visible = true" style="width: 150px"
                      placeholder="点击选择类别" :readonly="true"></el-input>
        </el-popover>
    </el-form-item>
</template>

<script>
    import {getCategoryListTree} from '@/js/db/RendererDB';

    export default {
        name: "CategorySelector",
        mounted() {
            this.selectedLabel = this.getLabelById(this.selectedId);
            this.getCategoryListData(1);
        },
        data() {
            return {
                data: [],
                value: '指南',
                visible: false,
                selectedId: this.id,
                selectedLabel: undefined
            }
        },
        props: ['id'],
        methods: {
            handleNodeClick(data) {
                console.log(data);
                // this.selectedId = data.id;
                this.$emit('change', data.id);
                // console.log(this);
            },
            findNodeById(id, node = this.data) {
                for (let item of node) {
                    if (Number(item.id) === id) {
                        return item;
                    }
                    if (item.children !== undefined) {
                        let result = this.findNodeById(id, item.children);
                        if (result !== undefined) {
                            return result;
                        }
                    }
                }
            },
            getLabelById(id, node = this.data) {
                for (let item of node) {
                    if (Number(item.id) === id) {
                        return item.label;
                    }
                    if (item.children !== undefined) {
                        let result = this.getLabelById(id, item.children);
                        if (result !== undefined) {
                            return `${item.label} > ${result}`;
                        }
                    }
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
            }
        },
        watch: {
            id: {
                handler(newId) {
                    console.log('watch category', newId);
                    this.selectedId = newId;
                    this.selectedLabel = this.getLabelById(newId);
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
        background-color: #3a8ee6;
        color: #ffffff;
        font-size: 16px;
        border-radius: 40px;
        height: 25px;
        width: 24px;
        line-height: 1.5;
        margin-right: 4px;
        text-align: center;
    }
</style>

<style>
    .category-proper {
        width: 200px;
        height: 300px;
        /*overflow: auto;*/
    }

    .category-proper .el-tree-node {
        padding: 3px 0 3px 0;
    }

    .cate-slot-scope {
        height: auto;
    }

    .el-scrollbar__wrap {
        overflow-x: hidden;
    }


</style>
<style>
    /*!*控制整个滚动条*!*/
    /*::-webkit-scrollbar {*/
    /*    !*background-color: lightgray;*!*/
    /*    width: 8px;*/
    /*    !*height: 10px;*!*/
    /*    !*background-clip: padding-box;*!*/
    /*}*/

    /*::-webkit-scrollbar:hover {*/
    /*    background-color: lightgray;*/
    /*}*/

    /*!*滚动条中间滑动部分*!*/
    /*::-webkit-scrollbar-thumb {*/
    /*    !*background-color: blue;*!*/
    /*    border-radius: 5px;*/
    /*    !*background-color: rgba(144, 147, 153, .5);*!*/
    /*}*/

    /*.category-proper:hover ::-webkit-scrollbar-thumb {*/
    /*    background-color: rgba(144, 147, 153, .5);*/
    /*}*/
</style>

