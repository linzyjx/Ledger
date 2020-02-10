<template>
    <div id="app">
        <el-container>
            <el-header class="el-header" style="height: auto">
                <ElementNavTopBar/>
            </el-header>

            <el-container>
                <el-aside width="auto">
                    <ElementNavSlideBar :is-collapse="isc"/>
                </el-aside>
                <el-main>
                    <el-radio-group v-model="isc">
                        <el-radio-button :label="false">展开</el-radio-button>
                        <el-radio-button :label="true">收起</el-radio-button>
                    </el-radio-group>
                    <p/>
                    <router-link to="HelloWorld">HelloWorld</router-link>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import ElementNavTopBar from "./components/ElementNavTopBar";
    import ElementNavSlideBar from './components/ElementNavSlideBar'

    export default {
        data() {
            return {
                isc: true
            };
        },
        name: 'App',
        components: {
            ElementNavTopBar,
            ElementNavSlideBar
        },
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

    body {
        margin: 0;
    }
    .el-header {
        padding: 0;
    }
</style>
