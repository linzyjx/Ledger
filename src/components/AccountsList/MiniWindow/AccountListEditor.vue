<template>
    <div class="accounts-list-editor">
        <el-form :model="data" label-position="right" size="small" label-width="auto">
            <el-form-item label="名称">
                <el-input v-model="data.name" @focus="focus($event)"></el-input>
            </el-form-item>
            <el-form-item label="颜色" v-if="data.type===0">
                <el-input v-model="data.color" :readonly="true">
                    <el-color-picker slot="suffix" v-model="data.color"/>
                </el-input>
            </el-form-item>
            <el-form-item label="分组" v-if="data.type===1">
                <el-select v-model="data.group">
                    <el-option
                            v-for="item in group"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {getAccountListDataById, getAccountGroup} from '@/js/db/RendererDB';
    import {ipcRenderer as ipc} from "electron";

    export default {
        name: "AccountListEditor",
        mounted() {
            this.getData();
        },
        data() {
            return {
                data: {},
                group: []
            }
        },
        methods: {
            focus(event) {
                event.currentTarget.select();
            },
            closeWin() {
                const {remote} = require('electron');
                const currentWindow = remote.getCurrentWindow();
                currentWindow.hide();
                this.$router.push(`/MiniWindow/`);
                // ipc.send('MainWindowsClose');
            },
            async getData() {
                this.group = await getAccountGroup();
                this.rawData = {};
                if (this.$route.params.id === 'new') {
                    this.data = {
                        name: Number(this.$route.query.type) === 0 ? 'New Group' : 'New Account',
                        color: Number(this.$route.query.type) === 0 ? '#66B1FF' : undefined,
                        type: Number(this.$route.query.type),
                        group: 0
                    }
                    return;
                }
                this.data = await getAccountListDataById(this.$route.params.id);
                Object.assign(this.rawData, this.data);
                // console.log(this.data);
            },
            onSubmit() {
                if (this.$route.params.id === 'new') {
                    ipc.send('addAccountItem', this.data);
                } else {
                    let changeData = {};
                    for (let rawItem of Object.keys(this.data)) {
                        if (this.rawData[rawItem] !== this.data[rawItem]) {
                            changeData[rawItem] = this.data[rawItem];
                        }
                    }
                    if (Object.keys(changeData).length !== 0) {
                        ipc.send('updateAccountItem', this.data.id, changeData);
                        console.log('onSubmit: send', changeData);
                    }
                }
                this.closeWin();
            }
        },
        beforeRouteEnter(to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next((vm) => {
                console.log('beforeRouteEnter');
                vm.getData();
            })
        },
        beforeRouteUpdate(to, from, next) {
            // just use `this`
            console.log('beforeRouteUpdate');
            this.getData();
            next();
        }
    }
</script>

<style scoped>
    .accounts-list-editor {
        margin: 20px;
    }
</style>
<style>
    .accounts-list-editor .el-color-picker__trigger {
        border: none;
    }
</style>
