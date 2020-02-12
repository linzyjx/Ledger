<template>
    <el-container class="mini-window">
        <el-header class="el-header" style="height: auto">
            <MiniWindowTopBar :initData="initData"/>
        </el-header>

        <el-container>
            <el-aside width="auto">
            </el-aside>
            <el-main>
                <router-view v-on:init="listenEvent"></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import MiniWindowTopBar from "./MiniWindowTopBar";

    export default {
        data() {
            return {
                isc: true,
                initData: {
                    title: '',
                    showMaximizeButton: false,
                    showMinimizeButton: false,
                    showCloseButton: true
                }
            };
        },
        name: 'App',
        components: {
            MiniWindowTopBar,
        },
        methods: {
            listenEvent(v) {
                this.initData = v;
                console.log('bbb', v);
            }
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*text-align: center;*/
        color: #2c3e50;
        /*margin-top: 60px;*/
    }

    .el-container {
        /*设置内部填充为0，几个布局元素之间没有间距*/
        padding: 0;
        /*外部间距也是如此设置*/
        margin: 0;
        /*统一设置高度为100%*/
        height: 100%;
    }

    .el-header, .mini-window .el-main {
        padding: 0;
    }
</style>
