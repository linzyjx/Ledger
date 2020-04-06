<template>
    <div class="accounts-list">
        <el-tree
                ref="treetest"
                :data="data"
                node-key="id"
                @node-drag-start="handleDragStart"
                @node-drag-enter="handleDragEnter"
                @node-drag-leave="handleDragLeave"
                @node-drag-over="handleDragOver"
                @node-drag-end="handleDragEnd"
                @node-drop="handleDrop"
                draggable
                highlight-current
                :indent="0"
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                @node-click="nodeClick"
                :expand-on-click-node="false"
                :default-expand-all="true"
        >
            <span slot-scope="{node}" style="width: 100%">
                <AccountsListCardTypeGroup :node="node" v-if="node.data.type==='group'"/>
                <AccountsListCardTypeAccount v-else :node="node"/>
            </span>
        </el-tree>
    </div>
</template>

<script>
    import AccountsListCardTypeGroup from "./AccountsListCardTypeGroup";
    import AccountsListCardTypeAccount from "./AccountsListCardTypeAccount";
    // import * as AccountListData from "../../testdata/AccountListData";
    import {getAccountListData} from '@/js/db/RendererDB';
    import {ipcRenderer as ipc} from 'electron';

    export default {
        components: {AccountsListCardTypeAccount, AccountsListCardTypeGroup},
        mounted() {
            this.loadAccountListData();
            ipc.on('updateBillDetail', () => {
                this.loadAccountListData();
            })
        },
        data() {
            return {
                data: []
            };
        },
        methods: {
            handleDragStart(node) {
                console.log('drag start', node);
            },
            handleDragEnter(draggingNode, dropNode) {
                console.log('tree drag enter: ', dropNode.label);
            },
            handleDragLeave(draggingNode, dropNode) {
                console.log('tree drag leave: ', dropNode.label);
            },
            handleDragOver(draggingNode, dropNode) {
                console.log('tree drag over: ', dropNode.label);
            },
            handleDragEnd(draggingNode, dropNode, dropType) {
                console.log('tree drag end: ', dropNode && dropNode.label, dropType);
            },
            handleDrop(draggingNode, dropNode, dropType) {
                console.log('tree drop: ', dropNode.label, dropType);
            },
            allowDrop(draggingNode, dropNode, type) {
                if (draggingNode.data.type === 'account') {
                    if ((dropNode.level === 2)) {
                        console.log(dropNode.label, type);
                        return type !== 'inner';
                        // return true;
                    } else {
                        return true;
                    }
                } else {
                    return type !== 'inner';
                }
            },
            allowDrag() {
                return true;
            },
            nodeClick(data) {
                // console.log('nodeClick:', node.label, data, node);
                // console.log(node.isCurrent);
                if (parseInt(data.id) !== parseInt(this.$route.params.id)) {
                    this.$router.push(`/App/BillList/Account/${data.id}`);
                    // ipc.send('RoutePush',`/MiniWindow/Demo1/${data.id}?a=111`);
                    console.log('send RoutePush');
                }
            },
            async loadAccountListData() {
                this.data = await getAccountListData();
                this.data[0].balance = 0;
                for (let item of this.data) {
                    if (item.type === 'group') {
                        item.balance = 0;
                        for (let child_item of item.children) {
                            item.balance = Math.round((child_item.balance + item.balance) * 100) / 100;
                        }
                    }
                    this.data[0].balance = Math.round((this.data[0].balance + item.balance) * 100) / 100;
                }
                console.log('loadAccountListData:', this.data);
            }
        }
    };
</script>

<style>
    .accounts-list .el-tree-node__content {
        height: auto;
        /*padding-bottom: 2px;*/
    }

    .accounts-list .el-tree-node__expand-icon {
        display: none;
        width: 0;
    }

    /*.accounts-list .el-tree-node__content>.el-tree-node__expand-icon{*/
    /*    padding: 0;*/
    /*    height: 100%;*/
    /*}*/
    .accounts-list .el-tree__drop-indicator {
        height: 5px;
    }

    .accounts-list {
        /*width: 300px;*/
    }


</style>
