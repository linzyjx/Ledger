<template>
    <div>
        <span>MiniDemo2</span>
        <el-button type="primary" v-on:click="sayHi">主要按钮</el-button>
    </div>

</template>

<script>
    const {ipcRenderer: ipc} = require('electron');
    // 子窗口内容模板
    export default {
        name: "MiniWindowDemo1",
        data() {
            return {
                initData: {
                    title: 'Demo1',
                    showMaximizeButton: false,
                    showMinimizeButton: false,
                    showCloseButton: true
                },
            }
        },
        created() {
            this.init();
            console.log(this.$route.params.id);
            this.winid = this.$route.query.winid;
            console.log(this.winid);
            this.winData = ipc.sendSync(`win${this.winid}Init`);
            console.log(this.winData.initarg);
        },
        methods: {
            init() {
                this.$emit('init', this.initData);
            },
            sayHi: function () {
                alert('Hi!('+this.winData.initarg+')');
            }
        }
    }
</script>

<style scoped>

</style>
