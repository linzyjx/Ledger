<template>
    <div class="billlist-item-adder">
        <el-form :model="data" label-position="right" size="small" label-width="auto">
            <div class="type-radio-group">
                <el-radio-group v-model="data.type" size="medium">
                    <el-radio-button :label="0">收入</el-radio-button>
                    <el-radio-button :label="1">支出</el-radio-button>
                    <el-radio-button :label="2">转账</el-radio-button>
                </el-radio-group>
            </div>
            <AccountSelector :add-flag="true" :account="data.account" @change="data.account=$event"
                             ref="account_selector"/>
            <AccountSelector v-if="data.type===2" name="转入账户" :account="data.transfer_deal_account"
                             ref="transfer_deal_selector"
                             @change="data.transfer_deal_account=$event"/>
            <CategorySelector v-if="data.type!==2" :id="data.category" :type="data.type" @change="data.category=Number($event)"/>
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
    import {getAccountList} from '@/js/db/RendererDB';
    import {ipcRenderer as ipc} from 'electron';
    import AccountSelector from "./AccountSelector";
    import CategorySelector from "./CategorySelector";
    // 子窗口内容模板
    export default {
        name: "DetailAdder",
        components: {CategorySelector, AccountSelector},
        mounted() {
            this.getAccountList();
            if (Number(this.$route.params.type) === 0) {
                this.data.name = '收入';
            } else if (Number(this.$route.params.type) === 1) {
                this.data.name = '支出';
            }
            console.log(this.data.name)
        },
        data() {
            return {
                data: {
                    name,
                    type: Number(this.$route.params.type),
                    account: Number(this.$route.query.account),
                    amount: 0,
                    time: new Date(),
                    transfer_deal_account: undefined,
                    category: undefined
                },
                accountData: [],
                rawData: {},
            }
        },

        methods: {
            async getData() {
                // this.data = await getBilllistDataById(this.$route.params.id);
                // console.log('open:', this.$route.params.id, this.data);
                // console.log(this.$route.query.account);
                // this.data=this.rawData;
                // this.rawData = {};
                // Object.assign(this.rawData, this.data);
            },
            onSubmit() {
                console.log(this.data, this.rawData);
                if (Number(this.data.account) === 0 || this.data.account === undefined) {
                    this.$message({
                        message: '未指定转出账户',
                        type: 'error',
                        offset: 50,
                        duration: 2000,
                        center: true
                    });
                    return;
                }
                if (this.data.type === 2) {
                    if (this.data.transfer_deal_account === undefined) {
                        this.$message({
                            message: '未指定转入账户',
                            type: 'error',
                            offset: 50,
                            duration: 2000,
                            center: true
                        });
                        return;
                    }
                }
                //直接提交有问题，拷贝一个副本
                let changeData = {};
                for (let rawItem of Object.keys(this.data)) {
                    changeData[rawItem] = this.data[rawItem];
                    if (rawItem === 'time') {
                        changeData[rawItem] = Math.floor(changeData[rawItem] / 1000);
                    }
                }
                if (changeData.name === '') changeData = '交易';
                if (changeData.type === 1) {
                    changeData.amount *= -1.0
                }
                ipc.send('addDetailItem', changeData);
                this.closeWin();
            },
            closeWin() {
                const {remote} = require('electron');
                const currentWindow = remote.getCurrentWindow();
                currentWindow.hide();
                this.$router.push(`/MiniWindow/`);
                // ipc.send('MainWindowsClose');
            },
            fetchData() {
                // this.data.account = this.$route.query.account;
                // this.data.type=Number(this.$route.params.type);
                console.log(this.$route.query.account);
            },
            focus(event) {
                event.currentTarget.select();
            },
            async getAccountList() {
                this.accountList = await getAccountList();
                console.log(this.accountList);
            }
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
                this.data.name = `${this.accountList[this.data.account].name} 到 ${this.accountList[newVal].name} 的转账`;

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
                if (this.data.transfer_deal_account !== undefined) {
                    this.data.name = `${this.accountList[newVal].name} 到 ${this.accountList[this.data.transfer_deal_account].name} 的转账`;
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
    .billlist-item-adder {
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
    .billlist-item-adder .type-radio-group .el-radio-button__inner {
        width: 150px;
    }

</style>

