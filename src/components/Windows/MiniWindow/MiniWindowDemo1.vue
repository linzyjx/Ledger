<template>
    <div>
        <span>MiniDemo2:{{this.$route.params.id}}</span>
        <el-button type="primary" v-on:click="sayHi">主要按钮</el-button>
    </div>
</template>

<script>
    // 子窗口内容模板
    export default {
        name: "MiniWindowDemo1",
        created() {
            this.init();
        },
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

        methods: {
            init() {
                this.$emit('init', this.initData);
            },
            sayHi: function () {
                alert('Hi!(' + this.winData.initarg + ')');
            }
        }
    }
</script>

<style scoped>

</style>
