<template>
    <div class="billlist-item-editor">
        <el-form :model="data" label-position="right" size="small" label-width="auto">
            <div class="type-radio-group">
                <el-radio-group v-model="data.type" size="medium">
                    <el-radio-button :label="0">收入</el-radio-button>
                    <el-radio-button :label="1">支出</el-radio-button>
                    <el-radio-button :label="2">转账</el-radio-button>
                </el-radio-group>
            </div>

            <AccountSelector :account="data.account" @change="data.account=$event" ref="account_selector"/>
            <AccountSelector v-show="data.type===2" name="转入账户" :account="data.transfer_deal_account"
                             @change="data.transfer_deal_account=$event" ref="transfer_deal_selector"/>
            <CategorySelector v-if="data.type!==2" :id="data.category" :type="data.type"
                              @change="data.category=Number($event)"></CategorySelector>
            <el-form-item label="名称">
                <el-input v-model="data.name" @focus="focus($event)"></el-input>
            </el-form-item>
            <el-form-item label="金额">
                <el-input v-model="data.amount" @focus="focus($event)" @input="(val) => {
                data.amount= val
              .replace(/[^0-9.]/g, '')
              .replace('.', '#*')
              .replace(/\./g, '')
              .replace('#*', '.')
              .replace(/^(\d+)(\.\d{0,2})(\d{0,})?$/g,'$1$2');
            }">
                    <i slot="prefix" v-if="data.type<2"
                       :class="['el-input__icon',(data.type===0)?'el-icon-plus':'el-icon-minus']">
                    </i>
                </el-input>
            </el-form-item>
            <el-form-item v-if="data.type!==2" label="交易方">
                <el-input v-model="data.party_name" @focus="focus($event)"></el-input>
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
    import {getBilllistDataById} from '@/js/db/RendererDB';
    import {ipcRenderer as ipc} from 'electron';
    import AccountSelector from "./AccountSelector";
    import CategorySelector from "./CategorySelector";
    // 子窗口内容模板
    export default {
        name: "BillListItemEditor",
        components: {CategorySelector, AccountSelector},
        created() {
        },
        data() {
            return {
                data: {},
                accountData: [],
                rawData: {},
                rules: {}
            }
        },

        methods: {
            sayHi: function () {
                alert('Hi!(' + this.winData.initarg + ')');
            },
            async getData() {
                this.data = await getBilllistDataById(this.$route.params.id);
                console.log('open:', this.$route.params.id, this.data);
                if (this.data.type === 2) {
                    if (this.data.amount > 0) {
                        console.log('push to ', this.data.transfer_deal);
                        this.$route.params.id = this.data.transfer_deal;
                        this.data = await getBilllistDataById(this.$route.params.id);
                        console.log('open:', this.$route.params.id, this.data);
                    }
                    this.data.amount = Math.abs(this.data.amount);
                }
                this.data.time = this.data.time * 1000;
                this.data.amount = Math.abs(this.data.amount);
                // this.data=this.rawData;
                this.rawData = {};
                Object.assign(this.rawData, this.data);
            },
            onSubmit() {
                console.log('onSubmit:', this.data, this.rawData);
                //遍历不同值并提交
                let changeData = {};
                for (let rawItem of Object.keys(this.rawData)) {
                    if (this.rawData[rawItem] !== this.data[rawItem]) {
                        changeData[rawItem] = this.data[rawItem];
                        if (rawItem === 'time') {
                            changeData[rawItem] = changeData[rawItem] / 1000;
                        }
                    }
                }
                if (this.data.type === 1) {
                    changeData.amount *= -1.0
                }
                if (Object.keys(changeData).length !== 0) {
                    ipc.send('updateDetailItem', this.$route.params.id, this.data.type, changeData);
                    console.log('onSubmit: send');
                }
                console.log('changeData:', this.$route.params.id, changeData);
                this.closeWin();
            },
            closeWin() {
                const {remote} = require('electron');
                const currentWindow = remote.getCurrentWindow();
                currentWindow.hide();
                this.$router.push(`/MiniWindow/`);
                // ipc.send('MainWindowsClose');
            },
            focus(event) {
                event.currentTarget.select();
            },
        },
        watch: {
            'data.transfer_deal_account': function (newVal, oldVal) {
                console.log('transfer_deal_account watch:', newVal, oldVal);
                if (newVal === this.data.account) {
                    this.data.transfer_deal_account = oldVal;
                    this.$refs.transfer_deal_selector.$emit('updateId');
                    this.$message({
                        message: '转出和转入账户不能相同',
                        type: 'error',
                        offset: 50,
                        duration: 2000,
                        center: true
                    });
                    return
                }
            },
            'data.account': function (newVal, oldVal) {
                if (newVal === this.data.transfer_deal_account) {
                    this.data.account = oldVal;
                    this.$refs.account_selector.$emit('updateId');
                    this.$message({
                        message: '转出和转入账户不能相同',
                        type: 'error',
                        offset: 50,
                        duration: 2000,
                        center: true
                    });
                    return
                }
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
    .billlist-item-editor {
        margin: 20px;
    }

    .type-radio-group {
        width: 100%;
    }

    .type-radio-group {
        padding-bottom: 20px;
        text-align: center;
    }
</style>

<style>
    .billlist-item-editor .type-radio-group .el-radio-button__inner {
        width: 150px;
    }

</style>
