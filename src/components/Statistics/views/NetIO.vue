<template>
    <el-container>
        <el-header class="header">
            <el-row type="flex" align="middle" justify="center" style="height: 100%;padding-left: 10px">
                <el-col>
                    <date-picker :init-date="dateValue" @change="handleChangeDate"/>
                    <el-radio-group v-model="typeValue" style="padding-left:20px" @change="handleChangeType">
                        <el-radio-button :label="0">收入</el-radio-button>
                        <el-radio-button :label="1">支出</el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-model="viewValue" style="padding-left:20px" @change="handleChangeView">
                        <el-radio-button :label="0">日视图</el-radio-button>
                        <el-radio-button :label="1">周视图</el-radio-button>
                        <el-radio-button :label="2">月视图</el-radio-button>
                    </el-radio-group>
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
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    start.setTime(today.getTime() - 90 * 24 * 3600 * 1000);
    end.setTime(today.getTime() + 24 * 3600 * 1000 - 1);

    export default {
        name: "NetIO",
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
                typeValue: 1,
                viewValue: 0,
                polar: {
                    dataset: {
                        dimension: ['startTime', 'amount'],
                        source: []
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
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
                        type: 'bar',
                        areaStyle: {},
                        encode: {
                            x: 0,
                            y: 2
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
            handleChangeDate(date) {
                this.dateValue = date;
                this.startTime = date[0].getTime();
                this.endTime = date[1].getTime();
                this.getData();
                console.log(date);
            },
            handleChangeView() {
                this.computeData(this.data);
            },
            handleChangeType() {
                this.getData();
            },
            computeData(data) {
                let endTime = addDateStep(startDateStep(this.endTime, this.viewValue), this.viewValue) - 1;
                let startTime = startDateStep(this.startTime, this.viewValue);
                let netData = [];
                let i = 0;
                console.log(startTime, endTime);

                for (let i_time = startTime; i_time <= endTime; i_time = addDateStep(i_time, this.viewValue)) {
                    console.log(new Date(i_time), i);
                    let i_timeEnd = addDateStep(i_time, this.viewValue) - 1;
                    let sumAmount = 0;
                    while (data[i] !== undefined && data[i].time <= i_timeEnd) {
                        if (data[i].time < i_time) {
                            i++;
                            continue;
                        }
                        sumAmount += data[i].amount;
                        i++;
                    }
                    netData.push({
                        startTime: new Date(i_time),
                        endTime: new Date(i_timeEnd),
                        amount: sumAmount.toFixed(2)
                    });
                }
                if (this.viewValue === 0) {
                    this.polar.xAxis.type = 'time';
                }
                if (this.viewValue === 1) {
                    for (let item of netData) {
                        let getDate = getMonthWeek(item.endTime);
                        item.startTime = `${getDate.getMonth}-${getDate.getWeek} ${getDate.getYear % 100}`;
                    }
                    this.polar.xAxis.type = 'category';
                }
                if (this.viewValue === 2) {
                    for (let item of netData) {
                        let getDate = getMonthWeek(item.startTime);
                        item.startTime = `${getDate.getYear}.${getDate.getMonth}`;
                    }
                    this.polar.xAxis.type = 'category';
                }
                this.polar.dataset.source = netData;

                console.log('computeData', netData);
            },
            getData() {
                getData(this.typeValue, this.startTime / 1000, this.endTime / 1000).then((data) => {
                    // console.log('getData', data);
                    this.data = data;
                    this.computeData(data);
                })
            }
        }
    }

    async function getData(type, start, end) {
        let db = await loadReadDBFile();
        let data = await db.all(SQL`SELECT time*1000 as time, amount FROM bill_list WHERE type = ${type} AND time>=${start} AND time<=${end} ORDER BY time`);
        if (type === 1) {
            for (let item of data) {
                item.amount *= -1;
            }
        }
        return data;
    }

    function startDateStep(tDate, type = 0) {
        let date = new Date(tDate);
        date.setHours(0, 0, 0, 0);
        // 根据输入时间返回周期的开始时间戳,type不对返回原值
        if (type === 0) {
            return date.getTime();
        } else if (type === 1) {
            return date.setDate(date.getDate() - date.getDay() + 1);
        } else if (type === 2) {
            return date.setDate(1);
        } else {
            return tDate;
        }
    }

    function addDateStep(tDate, type = 0) {
        //0:+1天
        //1:+7周
        //2:+1月
        if (type === 0) {
            return tDate + 24 * 3600 * 1000;
        } else if (type === 1) {
            return tDate + 7 * 24 * 3600 * 1000;
        } else if (type === 2) {
            let date = new Date(tDate);
            return date.setMonth(date.getMonth() + 1);
        } else {
            return tDate;
        }
    }

    function getMonthWeek(t_date) {
        /**
         * a = d = 当前日期
         * b = 6 - w = 当前周的还有几天过完(不算今天)
         * a + b 的和在除以7 就是当天是当前月份的第几周
         */
        let date = new Date(t_date),
            w = date.getDay(),
            d = date.getDate();
        if (w === 0) {
            w = 7;
        }
        return {
            getMonth: date.getMonth() + 1,
            getYear: date.getFullYear(),
            getWeek: Math.ceil((d + 6 - w) / 7),
        };
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
