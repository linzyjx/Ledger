<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        name: 'App',
        components: {},
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

    html, body, #app{
        /*设置内部填充为0，几个布局元素之间没有间距*/
        padding: 0;
        /*外部间距也是如此设置*/
        margin: 0;
        /*统一设置高度为100%*/
        height: 100%;
        /*禁止文字选中*/
        -webkit-user-select:none;
    }
</style>
