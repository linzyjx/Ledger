<template>
    <div class="topbar">
        <el-menu
                class="el-topbar"
                mode="horizontal"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-row justify="space-between" align="middle">
                <el-col :span="6" :offset="9" class="el-topbar-text-col">
                    <span class="el-topbar-text-span">{{initData.title}}</span>
                </el-col>
                <el-col :span="4" class="el-topbar-button-col">
                    <el-button class="el-topbar-button" v-on:click="minimize" v-if="initData.showMinimizeButton" type="text" icon="el-icon-minus"
                               circle></el-button>
                    <el-button class="el-topbar-button" v-on:click="windowing" v-if="(initData.showMaximizeButton && isMaxmun)" type="text"
                               icon="el-icon-copy-document"
                               circle></el-button>
                    <el-button class="el-topbar-button" v-on:click="maximize" v-if="(initData.showMaximizeButton &&!isMaxmun)" type="text"
                               icon="el-icon-full-screen"
                               circle></el-button>
                    <el-button class="el-topbar-button" v-on:click="closeWin" v-if="initData.showCloseButton" type="text" icon="el-icon-close"
                               circle></el-button>
                </el-col>
            </el-row>
        </el-menu>
    </div>
</template>

<style>
    .el-topbar-text-col {
        text-align: center;
    }

    .el-topbar-text-span {
        line-height: 2;
        font-size: 20px;
        color: #C0C4CC;
    }

    .el-topbar {
        -webkit-app-region: drag;
        height: auto;
    }

    .el-topbar-button-col {
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
    const {remote,ipcRenderer} = require('electron');
    const currentWindow = remote.getCurrentWindow();
    export default {
        created() {
            currentWindow.on("maximize", () => {
                this.isMaxmun = true;
                console.log('maximize');
            });
            currentWindow.on("unmaximize", () => {
                this.isMaxmun = false;
                console.log('unmaximize');
            });
            ipcRenderer.send('mini',currentWindow);
            // console.log(currentWindow);
        },
        data() {
            return {
                isMaxmun: false,

            };
        },
        props:['initData'],
        methods: {
            minimize() {
                currentWindow.minimize();
                // ipc.send('MainWindowsMinimize');
            },
            windowing() {
                currentWindow.unmaximize();
                // ipc.send('MainWindowsWindowing');
            },
            maximize() {
                currentWindow.maximize();
                // ipc.send('MainWindowsMaximize');
            },
            closeWin() {
                currentWindow.hide();
                this.$router.push(`/MiniWindow/`);
                // ipc.send('MainWindowsClose');
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }


</script>
