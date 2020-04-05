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
<!--                    <el-menu-item index="/App/AccountsList">-->
<!--                        <i class="el-icon-menu"></i>-->
<!--                        <span slot="title">App</span>-->
<!--                    </el-menu-item>-->
                    <el-menu-item index="/App/BillList/Account/0">
                        <i class="el-icon-document"></i>
                        <template slot="title">HelloWorld</template>
                    </el-menu-item>
                </el-main>
                <el-footer>
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
            }
        }
    }
</script>
