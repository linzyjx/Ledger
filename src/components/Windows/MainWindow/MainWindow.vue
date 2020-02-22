<template>
    <el-container>
        <el-header class="el-header" style="height: auto">
            <MainWindowTopBar/>
        </el-header>

        <el-container>
            <el-aside width="auto">
                <MainWindowSlideBar/>
            </el-aside>
            <el-main>
<!--                <router-link to="/App/HelloWorld">HelloWorld</router-link>-->
<!--                <el-button v-on:click="setDemo1">Demo1</el-button>-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import {ipcRenderer as ipc} from 'electron';
    import MainWindowTopBar from "./MainWindowTopBar";
    import MainWindowSlideBar from './MainWindowSlideBar'

    export default {
        data() {
            return {
            };
        },
        name: 'App',
        components: {
            MainWindowTopBar,
            MainWindowSlideBar
        },
        methods:{
            setDemo1(){
                ipc.send('WinDemo1Set');
                console.log('aaa')
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

    .el-header ,.el-main{
        padding: 0;
    }
</style>
