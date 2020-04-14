<template>
    <div @contextmenu="handleContextMenu">
        <el-card class="box-card" shadow="hover"
                 :body-style="{'background-color':(this.node.isCurrent?'#F5F7FA':undefined)}"
                 @contextmenu="handleContextMenu">
            <el-row align="middle" type="flex" justify="center">
                <el-col :span="6" class="accounts-list-card-icon-col">
                    <i class="icon el-icon-folder"></i>
                    <div class="accounts-list-card-group-color-marker"
                         :style="{'background-color':backgroundColor}"></div>
                </el-col>
                <el-col :span="14">
                    <div>
                        <div>{{node.label}}</div>
                        <div>￥{{parseFloat(node.data.balance).toFixed(2)}}</div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-button class="accounts-list-card-expand-icon"
                               type="text" @click.stop="clickAccountListCardExpandSwitch(node)"
                               :icon="(node.expanded?'el-icon-arrow-up':'el-icon-arrow-down')"
                               circle>
                    </el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import {ipcRenderer as ipc, remote} from 'electron';

    const {Menu, MenuItem} = remote;

    export default {
        data() {
            return {
                backgroundColor: this.node.data.color,
                isCurrent: this.node.isCurrent
            }
        },
        mounted() {
            // console.log(this.node);
            // console.log(this.backgroundColor);
            // this.$el.style.setProperty("--color", this.backgroundColor);

        },
        name: "AccountsListCardTypeGroup",
        props: ['node'],
        methods: {
            clickAccountListCardExpandSwitch(tNode) {
                // this.$refs.treetest.store.nodesMap[tNode.data.id].expanded = !this.$refs.treetest.store.nodesMap[tNode.data.id].expanded;
                tNode.expanded = !tNode.expanded;
                console.log(tNode.isCurrent);
            },
            handleContextMenu(e) {
                e.preventDefault();
                const menu = new Menu();
                menu.append(new MenuItem({
                    label: '编辑项目', click: this.handleEdit
                }));
                menu.append(new MenuItem({
                    label: '新建账户', click: function () {
                        ipc.send('RoutePush', `/MiniWindow/AccountEditor/new?type=1`);
                    }
                }));
                menu.append(new MenuItem({
                    label: '新建分组', click: function () {
                        ipc.send('RoutePush', `/MiniWindow/AccountEditor/new?type=0`);
                    }
                }));
                menu.append(new MenuItem({
                    label: '删除此分组', click: this.handleDelete
                }));
                menu.popup();
            },
            handleEdit() {
                ipc.send('RoutePush', `/MiniWindow/AccountEditor/${this.node.data.id}`);
            },
            handleDelete() {
                if (this.node.childNodes.length > 0) {
                    this.$message({
                        message: '请先移除组内账户',
                        type: 'error',
                        offset: 50,
                        duration: 2000,
                    });
                    return;
                }
                this.$confirm(`此操作将永久删除账户组"${this.node.data.label}"，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ipc.send('delAccountItem', this.node.data.id);
                })
            }
        }
    }
</script>

<style scoped>
    .accounts-list-card-group-color-marker {
        height: 300%;
        float: left;
        position: absolute;
        width: 10px;
        /*background-color: #f56c6c80;*/
        top: -20px;
    }
</style>

<style>
    .accounts-list .accounts-list-card-icon-col {
        text-align: center;
    }

    .accounts-list .accounts-list-card-icon-col .icon {
        font-size: x-large;
        font-weight: 200;
    }

    .accounts-list .el-card__body {
        padding-left: 0;
    }

    .accounts-list .accounts-list-card-expand-icon {
        float: right;
        padding: 10px;
        color: #303133;
    }

    .accounts-list .el-card {
        /*background-color: var(--color);*/
    }
</style>
