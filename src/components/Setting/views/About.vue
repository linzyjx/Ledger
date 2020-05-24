<template>
    <div style="padding: 10px">
        <h1 style="font-size: 26px">{{name}}</h1>
        版本：{{version}}<p/>
        Copyright © 2020, linzyjx (linzyjx@gmail.com)
        <div style="padding-top: 20px">
            <h2>开放源代码声明</h2>
            <el-table :data="openSourceData">
                <el-table-column prop="name" label="组件名" width="100px"></el-table-column>
                <el-table-column prop="version" label="版本" width="100px"></el-table-column>
                <el-table-column prop="license" label="许可证" width="100px"></el-table-column>
                <el-table-column prop="src" label="项目地址" width="600px">
                    <template slot-scope="scope">
                        <a href="#" @click="handleSrcClick(scope.row)">{{scope.row.src}}</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {name, version} from '@/../package.json';
    import {dependencies} from '@/../package-lock.json';
    import {shell} from 'electron';

    export default {
        name: "About",
        mounted() {
            console.log(dependencies);
        },
        data() {
            return {
                name: name,
                version: version,
                openSourceData: [
                    {
                        name: 'Electron',
                        version: process.versions.electron,
                        src: 'https://github.com/electron/electron',
                        license: 'MIT'
                    },
                    {
                        name: 'Vue.js',
                        version: dependencies.vue.version,
                        src: 'https://github.com/vuejs/vue',
                        license: 'MIT'
                    },
                    {
                        name: 'element-ui',
                        version: dependencies['element-ui'].version,
                        src: 'https://github.com/ElemeFE/element',
                        license: 'MIT'
                    },
                    {
                        name: 'node-sqlite',
                        version: dependencies.sqlite.version,
                        src: 'https://github.com/kriasoft/node-sqlite',
                        license: 'MIT'
                    },
                    {
                        name: 'node-sqlite3',
                        version: dependencies.sqlite3.version,
                        src: 'https://github.com/mapbox/node-sqlite3',
                        license: 'BSD'
                    },
                    {
                        name: 'echarts',
                        version: dependencies.echarts.version,
                        src: 'https://github.com/apache/incubator-echarts',
                        license: 'Apache-2.0'
                    },
                ]
            }
        },
        methods: {
            handleSrcClick(node) {
                shell.openExternal(node.src);
            }
        }
    }
</script>

<style scoped>

</style>
