<template>
    <div @contextmenu="handleContextMenu">
        <el-card class="box-card" shadow="hover"
                 :body-style="{'background-color':(this.node.isCurrent?'#F5F7FA':undefined)}">
            <el-row align="middle" type="flex" justify="center">
                <el-col :span="node.level*2-2">
                    <div class="accounts-list-card-group-color-marker"
                         :style="{'background-color':parentBackgroundColor}"></div>
                </el-col>
                <el-col :span="4" class="accounts-list-card-icon-col">
                    <i class="icon el-icon-s-finance"></i>
                </el-col>
                <el-col :span="20-(node.level-1)*2">
                    <div>
                        <div>{{node.label}}</div>
                        <div>￥{{parseFloat(node.data.balance).toFixed(2)}}</div>
                    </div>
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
                parentBackgroundColor: (this.node.level === 2 ? this.node.parent.data.color : '#fff'),
            }
        },
        name: "AccountsListCardTypeAccount",
        props: ['node'],
        methods: {
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
                    label: '删除此账户', click: this.handleDelete
                }));
                menu.popup();
            },
            test() {
                alert('bbb');
            },
            handleEdit() {
                ipc.send('RoutePush', `/MiniWindow/AccountEditor/${this.node.data.id}`);
            },
            handleDelete() {
                this.$confirm(`此操作将永久删除账户"${this.node.data.label}"，是否继续？`,'提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    ipc.send('delAccountItem', this.node.data.id);
                })
            }
        },
        computed: {},
        watch: {
            isCurrent: function (n, o) {
                console.log(n, o);
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
</style>
