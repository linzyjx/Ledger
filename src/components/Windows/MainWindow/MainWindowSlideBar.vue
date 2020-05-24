<template>
    <div class="sidebar" style="height: 100%">
        <el-menu default-active="1-4-1"
                 class="el-menu-vertical-demo"
                 @open="handleOpen"
                 @close="handleClose"
                 router
                 :collapse="isCollapse"
                 style="height: 100%">
            <el-container style="height: 100%">
                <el-main>
                    <el-menu-item index="/App/BillList/Account/0">
                        <i class="el-icon-notebook-2"></i>
                        <template slot="title">账目</template>
                    </el-menu-item>
                    <el-menu-item index="/App/Category">
                        <i class="el-icon-paperclip"></i>
                        <template slot="title">类别</template>
                    </el-menu-item>
                    <el-menu-item index="/App/Statistics">
                        <i class="el-icon-data-analysis"></i>
                        <template slot="title">统计</template>
                    </el-menu-item>
                </el-main>
                <el-footer :height="null">
                    <el-menu-item>
                        <el-dropdown class="dropdown" trigger="click" @command="handleCommand" placement="right-start">
                            <el-button type="text" icon="el-icon-plus"></el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1">新建账户</el-dropdown-item>
                                <el-dropdown-item command="0">新建账户组</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <template slot="title">新建</template>
                    </el-menu-item>
                    <el-menu-item index="/App/Setting">
                        <i class="el-icon-setting"></i>
                        <template slot="title">设置</template>
                    </el-menu-item>
                    <el-menu-item v-on:click="isCollapse=!isCollapse">
                        <i v-bind:class="[isCollapse?'el-icon-arrow-right':'el-icon-arrow-left']"></i>
                        <span slot="title">{{isCollapse?'展开':'折叠'}}</span>
                    </el-menu-item>
                </el-footer>
            </el-container>
        </el-menu>
    </div>
</template>

<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 150px;
        min-height: 400px;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar > ul {
        height: 100%;
    }

    .sidebar .el-main {
        padding: 0;
    }

    .sidebar .el-footer {
        padding: 0;
    }

    /*隐藏收缩动画时出现的滚动条*/
    .el-main::-webkit-scrollbar {
        width: 0;
    }
</style>

<script>
    import {ipcRenderer as ipc} from "electron";

    export default {
        props: {},
        data() {
            return {
                isCollapse: true
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleCommand(command){
                ipc.send('RoutePush', `/MiniWindow/AccountEditor/new?type=${command}`);
            }
        }
    }
</script>
