<template>
    <div class="topbar">
        <el-menu
                class="el-topbar"
                mode="horizontal"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <div class="el-topbar-text-div"><span class="el-topbar-text-span">{{title}}</span></div>
            <div class="el-topbar-button-row">
                <el-button class="el-topbar-button" v-on:click="minimize" type="text" icon="el-icon-minus"
                           circle></el-button>
                <el-button class="el-topbar-button" v-on:click="windowing" v-show="isMaxmun" type="text"
                           icon="el-icon-copy-document"
                           circle></el-button>
                <el-button class="el-topbar-button" v-on:click="maximize" v-show="!isMaxmun" type="text"
                           icon="el-icon-full-screen"
                           circle></el-button>
                <el-button class="el-topbar-button" v-on:click="closeWin" type="text" icon="el-icon-close"
                           circle></el-button>
            </div>
        </el-menu>
    </div>
</template>

<style>
    .el-topbar-text-div {
        float: left;
        position: relative;
        left: 50%;
    }
    .el-topbar-text-span{
        position: relative;
        left: -50%;
        line-height: 1.8;
        font-size: 20px;
        color: #C0C4CC;
    }

    .el-topbar {
        -webkit-app-region: drag;
        height: auto;
    }

    .el-topbar-button-row {
        float: right;
        -webkit-app-region: no-drag;
        text-align: right;
        width: auto;
    }

    .el-topbar-button {
        -webkit-app-region: no-drag;
        color: #909399;
    }
</style>

<script>
    const {ipcRenderer: ipc} = require('electron');
    // import {ipcRenderer:ipc} from 'electron';
    export default {
        created() {
            ipc.on('maximize', () => {
                this.isMaxmun = true;
                console.log('maximize');
            });
            ipc.on('unmaximize', () => {
                this.isMaxmun = false;
                console.log('unmaximize');
            });
        },
        data() {
            return {
                isMaxmun: false,
                title:document.title
            };
        },
        methods: {
            minimize() {
                ipc.send('MainWindowsMinimize');
            },
            windowing() {
                ipc.send('MainWindowsWindowing');
            },
            maximize() {
                ipc.send('MainWindowsMaximize');
            },
            closeWin() {
                ipc.send('MainWindowsClose');
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }


</script>
