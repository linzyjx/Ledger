<template>
    <el-container>
        <el-header class="header">
            <el-row type="flex" align="middle" justify="center" style="height: 100%;padding-left: 10px">
                <el-col :span="12">
                    <date-picker :init-date="dateValue" @change="handleChange"/>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
        </el-header>
        <el-main class="main">
            <v-chart :options="polar"/>
        </el-main>
    </el-container>

</template>

<style>
    /**
     * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
     * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
     */
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>

<script>
    import ECharts from 'vue-echarts';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/polar';
    import 'echarts/lib/component/dataZoomSlider';
    // import {getBilllistDataByAccountId} from '@/js/db/RendererDB';
    import DatePicker from "../../utils/DatePicker";

    import SQL from 'sql-template-strings';
    import {loadReadDBFile} from '@/js/db';

    const end = new Date();
    const start = new Date();
    const today = new Date(new Date().toLocaleDateString());
    start.setTime(today.getTime() - 90 * 24 * 3600 * 1000);
    end.setTime(today.getTime() + 24 * 3600 * 1000 - 1);

    export default {
        name: "NetBalance",
        components: {
            'v-chart': ECharts,
            'date-picker': DatePicker
        },
        created() {
            this.getData();
        },
        data() {
            return {
                today: new Date(new Date().toLocaleDateString()).getTime(),
                endTime: end.getTime(),
                startTime: start.getTime(),
                dateValue: [start, end],
                polar: {
                    dataset: {
                        dimension: ['time', 'balance'],
                        source: []
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time'
                    },
                    yAxis: {
                        type: 'value'
                    },
                    dataZoom: [{
                        start: 0,
                        end: 100,
                        left: '5%',
                        right: '5%'
                    }],
                    series: [{
                        type: 'line',
                        areaStyle: {},
                        encode: {
                            x: 'time',
                            y: 'balance'
                        }
                    }],
                    grid: {
                        x: '5%',
                        y: '3%',
                        x2: '3%',
                        y2: '12%'
                    }
                }
            }
        },
        methods: {
            handleChange(date) {
                this.dateValue = date;
                this.startTime = date[0].getTime();
                this.endTime = date[1].getTime();
                this.getData();
                console.log(date);
            },
            getData() {
                let endTime = this.endTime;
                let startTime = this.startTime;

                getData().then((data) => {
                    // console.log('getData', data);
                    //重算余额
                    let sum = 0;
                    for (let item of data) {
                        sum += item.amount;
                        item.balance = sum;
                    }
                    let balanceData = [];
                    let time = startTime;
                    let i = 0;
                    let balance = 0;
                    while (time < endTime && data[i] !== undefined) {
                        // console.log(new Date(time), i, data[i]);
                        if (time < data[i].time) {
                            balanceData.push({time: time, balance: balance});
                            time += 24 * 3600 * 1000;
                        } else {
                            if (time < (data[i].time + 24 * 3600 * 1000)) {
                                if (data[i + 1] !== undefined && data[i + 1].time < (data[i].time + 24 * 3600 * 1000)) {
                                    i += 1;
                                } else {
                                    balanceData.push({time: time, balance: data[i].balance});
                                    balance = data[i].balance;
                                    i += 1;
                                    time += 24 * 3600 * 1000;
                                }
                            } else {
                                balance = data[i].balance;
                                i += 1;
                            }
                        }
                    }
                    while (time < endTime) {
                        balanceData.push({time: time, balance: balance});
                        time += 24 * 3600 * 1000;
                    }
                    for (let item of balanceData) {
                        item.balance = item.balance.toFixed(2);
                    }
                    this.polar.dataset.source = balanceData;
                })
            }
        }
    }

    async function getData() {
        let db = await loadReadDBFile();
        let data = await db.all(SQL`SELECT time*1000 as time, amount FROM bill_list WHERE type = 0 OR type = 1 ORDER BY time`);
        return data;
    }
</script>

<style scoped>
    .main {
        padding: 10px 10px 10px 15px;
    }

    .header {
        padding: 5px;
        border-bottom: 1px solid #E4E7ED;
    }
</style>
