<template>
    <el-form-item :label="(name===undefined)?'账户':name">
        <el-select v-model="accountId" @change="$emit('change',accountId)">
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
</template>

<script>
    import {getAccountListData} from '@/js/db/RendererDB';

    export default {
        name: "AccountSelector",
        mounted() {
            this.loadAccountListData().then(() => {
                if (this.addFlag === true) {
                    if (Number(this.$route.query.account) !== 0)
                        this.accountId = Number(this.$route.query.account);
                }
            });
            this.$on('updateId', () => {
                this.accountId = this.account;
            });
        },
        data() {
            return {
                accountData: [],
                accountId: undefined
            }
        },
        props: ['account', 'addFlag', 'name'],
        methods: {
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
                console.log('AccountSelector', this.accountData);
            },
        },
        watch: {
            account: {
                handler(newId) {
                    console.log('watch account', newId);
                    this.accountId = newId;
                    this.loadAccountListData();
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>
