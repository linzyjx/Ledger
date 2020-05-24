<template>
    <div style="padding: 10px">
        <h1>备份/还原</h1>
        <el-button @click="handleExportClick">备份数据</el-button>
        <el-button @click="handleImportClick">还原数据</el-button>
    </div>
</template>

<script>
    import {ipcRenderer as ipc} from 'electron';

    export default {
        name: "Common",
        mounted() {

        },
        methods: {
            handleExportClick() {
                ipc.send('exportDBFile');
                ipc.once('exportFallback', (e, m) => {
                    this.$message(m);
                });
            },
            handleImportClick(){
                ipc.send('importDBFile');
                ipc.once('importFallback', (e, m) => {
                    this.$message(m);
                });
            }
        }
    }
</script>

<style scoped>

</style>
