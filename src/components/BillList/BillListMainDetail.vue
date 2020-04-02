<template>
    <div class="billlist-main-detail" style="height: 100%">
        <el-collapse style="height: 100%" accordion>
            <ul class="billlist-main-detail-ul"
                v-infinite-scroll="load"
                :infinite-scroll-delay="100"
                :infinite-scroll-distance="20"
                infinite-scroll-disabled="disabled"
                style="overflow:auto;"
                ref="tableWrapper"
            >
                <li v-for="i in count" :key="i" class="billlist-main-detail-item">
                    <BillListMainDetailItem :node="tradingData[i-1]" :id="tradingData[i-1].id"/>
                </li>
                <p v-if="noMore">没有更多了</p>
                <el-button @click="updateData">click</el-button>
            </ul>
        </el-collapse>
    </div>
</template>

<script>
    import * as AccountListData from "../../testdata/AccountListData";
    // import * as BillListDetailData from "../../testdata/BillListDetailData";
    import BillListMainDetailItem from "./BillListMainDetailItem";
    // import SQL from "sql-template-strings";
    // import sqlite from "sqlite";
    // import sqlite3 from 'sqlite3';
    // import SQL from "sql-template-strings";
    import {getBilllistDataByAccountId} from '@/js/RendererDB';
    import {ipcRenderer as ipc} from 'electron';

    export default {
        name: "BillListMainDetail",
        components: {BillListMainDetailItem},
        mounted() {
            this.getData();
            ipc.on('updateBillDetail',()=>{
                this.updateData();
                console.log('updateBillListMainDetail');
            })
        },
        // beforeUpdate() {
        //     this.getData();
        // },
        data() {
            return {
                count: 0,
                tradingData: {}
            }
        },

        methods: {
            test() {
                console.log('getNode:', this.accountData);
            },
            accountData: function (key, value) {
                // console.log(AccountListData.findNode(key,value));
                return AccountListData.findNode(key, value);
            },
            load() {
                if ((this.count + 10) > this.tradingData.length) {
                    this.count = this.tradingData.length;
                } else {
                    this.count += 10;
                }

                console.log(this.count);
            },
            async getData() {
                // console.log(await getBilllistData(1));
                this.tradingData = await getBilllistDataByAccountId(this.$route.params.id);
                console.log('open:', this.$route.params.id, this.tradingData);
                this.count = 0;
                // let db1 = await sqlite.open('C:\\Users\\linzyjx\\AppData\\Roaming\\DemoAPP\\example.db', {
                //     mode: sqlite3.OPEN_READONLY
                // });
                // console.log(db1);
                // let accountId=1;
                // this.tradingData = await db.all(SQL`SELECT * FROM bill_list ORDER BY time DESC`);
                // db.close();
            },
            async updateData() {
                // console.log(await getBilllistData(1));
                this.tradingData = await getBilllistDataByAccountId(this.$route.params.id);
                console.log('open:', this.$route.params.id, this.tradingData);
            }

        },
        computed: {
            noMore() {
                console.log(this.count, this.tradingData.length);
                return this.count >= this.tradingData.length;
            },
            disabled() {
                return this.noMore
            }
        },
        watch: {
            $route() {
                this.id = this.$route.query.id; //获取传来的参数
                this.getData(); //路由变化时就重新执行这个方法 更新传来的参数
            }
        },
    }
</script>

<style>
    .billlist-main-detail {
        height: 100%;
        padding: 0;
        margin: 0;
    }

    .billlist-main-detail-ul {
        height: 100%;
        padding: 0;
        margin: 0;
    }

    /*.billlist-container-main .el-scrollbar__view {*/
    /*    height: 100%;*/
    /*}*/
    .billlist-main-detail-item {
        padding: 2px;
    }

</style>
<style scoped>
    /*控制整个滚动条*/
    ::-webkit-scrollbar {
        /*background-color: lightgray;*/
        width: 8px;
        /*height: 10px;*/
        /*background-clip: padding-box;*/
    }

    ::-webkit-scrollbar:hover {
        background-color: lightgray;
    }

    /*滚动条两端方向按钮*/
    ::-webkit-scrollbar-button {
        /*background-color: pink;*/
    }

    /*滚动条中间滑动部分*/
    ::-webkit-scrollbar-thumb {
        /*background-color: blue;*/
        border-radius: 5px;
        /*background-color: rgba(144, 147, 153, .5);*/
    }

    ::-webkit-scrollbar-thumb:hover {
    }

    /*滚动条右下角区域*/
    ::-webkit-scrollbar-corner {
        /*background-color: red;*/
    }

    .billlist-main-detail:hover ::-webkit-scrollbar-thumb {
        background-color: rgba(144, 147, 153, .5);
    }
</style>
<style>
    .billlist-main-detail .el-collapse-item__arrow {
        display: none;
    }
</style>

<style scoped>
    .billlist-main-detail-item-title {
        height: 100%;
    }
</style>
