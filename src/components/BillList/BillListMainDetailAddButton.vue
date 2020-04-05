<template>
    <el-dropdown class="dropdown" trigger="click" @command="handleCommand">
        <el-button class="dropdown-button" type="primary" icon="el-icon-plus" circle></el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">支出</el-dropdown-item>
            <el-dropdown-item command="0">收入</el-dropdown-item>
            <el-dropdown-item command="2">转账</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    import {ipcRenderer as ipc} from "electron";

    export default {
        name: "BillListMainDetailAddButton",
        methods: {
            handleCommand(command){
                //收入 income 0
                //支出 spending 1
                //转账 transfer 2
                ipc.send('RoutePush', `/MiniWindow/BillItemAdder/${command}?account=${this.$route.params.id}`);
            }
        }
    }
</script>

<style>
    .billlist-main-detail .dropdown .dropdown-button {
        font-size: 24px;
        box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    }

    .billlist-main-detail .dropdown {
        position: fixed;
        right: 20px;
        bottom: 20px;
    }
</style>
