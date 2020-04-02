<template>
    <div class="billlist-item-editor">
        <el-form :model="data" label-position="right" size="small" label-width="auto">
            <el-form-item label="账户">
                <!--                <el-input v-model="data.account"></el-input>-->
                <el-select v-model="data.account">
                    <el-option-group
                            v-for="group in accountData"
                            :key="group.id"
                            :label="group.label"
                    >
                        <el-option
                                v-for="item in group.children"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                        >
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="data.name"></el-input>
            </el-form-item>
            <el-form-item label="金额">
                <el-input v-model.number="data.amount"></el-input>
            </el-form-item>
            <el-form-item label="交易方">
                <el-input v-model="data.party_name"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="data.name"></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker
                        v-model="data.time"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="timestamp">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {getBilllistDataById, getAccountListData} from '@/js/RendererDB';
    import {ipcRenderer as ipc} from 'electron';
    // 子窗口内容模板
    export default {
        name: "BillListItemEditor",
        created() {
        },
        data() {
            return {
                data: {},
                accountData: [],
                rawData:{}
            }
        },

        methods: {
            sayHi: function () {
                alert('Hi!(' + this.winData.initarg + ')');
            },
            async getData() {
                this.data = await getBilllistDataById(this.$route.params.id);
                console.log('open:', this.$route.params.id, this.data);
                this.data.time=this.data.time*1000;
                // this.data=this.rawData;
                this.rawData={};
                Object.assign(this.rawData,this.data);
            },
            async loadAccountListData() {
                let accountData = await getAccountListData();
                console.log(this.data);
                //转换数据格式
                this.accountData = [];
                let tmp = [];
                for (let data of accountData) {
                    if (data.id === 0) continue;
                    if (data.type === 'account') {
                        tmp.push(data);
                    } else {
                        let tp = {
                            label: '',
                            id: tmp[0].id,
                            children: tmp
                        };
                        this.accountData.push(tp);
                        tmp = [];
                        this.accountData.push(data);
                    }
                }
                if (tmp.length !== 0) {
                    let tp = {
                        label: '',
                        id: tmp[0].id,
                        children: tmp
                    };
                    this.accountData.push(tp);
                }
                console.log(this.accountData);
            },
            onSubmit(){
                console.log(this.data,this.rawData);
                //遍历不同值并提交
                let changeData={};
                for(let rawItem of Object.keys(this.rawData)){
                    if(this.rawData[rawItem]!==this.data[rawItem]){
                        changeData[rawItem]=this.data[rawItem];
                        if(rawItem==='time'){
                            changeData[rawItem]=changeData[rawItem]/1000;
                        }
                    }
                }
                ipc.send('updateDetailItem',this.$route.params.id,changeData);
                console.log(changeData);
            }
        },
        beforeRouteEnter(to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next((vm) => {
                console.log('beforeRouteEnter');
                vm.getData();
                vm.loadAccountListData();
            })
        },
        beforeRouteUpdate(to, from, next) {
            // just use `this`
            console.log('beforeRouteUpdate');
            this.getData();
            this.loadAccountListData();
            next();
        }
    }
</script>

<style scoped>
    .billlist-item-editor {
        margin: 20px;
    }
</style>
