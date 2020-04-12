<template>
    <div class="billlist-footer">
        <el-row type="flex" align="bottom">
            <el-col :span="10" class="title"><span>净值：</span></el-col>
            <el-col :span="10" :offset="2" class="value"><span>{{netBalance}}</span></el-col>
        </el-row>
        <el-row type="flex" align="bottom">
            <el-col :span="10" class="title"><span>本月支出：</span></el-col>
            <el-col :span="10" :offset="2" class="value"><span>{{monthlySpending}}</span></el-col>
        </el-row>
        <el-row type="flex" align="bottom">
            <el-col :span="10" class="title"><span>本月收入：</span></el-col>
            <el-col :span="10" :offset="2" class="value"><span>{{monthlyIncome}}</span></el-col>
        </el-row>
    </div>
</template>

<script>
    import {getBalanceSummary} from '@/js/db/RendererDB';
    import {ipcRenderer as ipc} from "electron";

    export default {
        name: "BillListFooter",
        mounted() {
            this.getBalanceSummaryData();
            ipc.on('updateBillDetail', () => {
                this.getBalanceSummaryData();
            })
        },
        data() {
            return {
                netBalance: undefined,
                monthlyIncome: undefined,
                monthlySpending: undefined
            }
        },
        methods: {
            async getBalanceSummaryData() {
                let [netBalance, monthlyIncome, monthlySpending] = await getBalanceSummary();
                this.netBalance = Math.round(netBalance * 100) / 100;
                this.monthlyIncome = Math.round(monthlyIncome * 100) / 100;
                this.monthlySpending = Math.round(monthlySpending * 100) / 100;
            }
        }
    }
</script>

<style scoped>
    .billlist-footer {
        padding: 8px 0;
    }
    .billlist-footer .title{
        text-align: right;
    }
</style>
