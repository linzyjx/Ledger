<template>
    <div class="billlist-main-detail" style="height: 100%">
        <el-collapse style="height: 100%" accordion v-if="tradingData.length!==0">
            <ul class="billlist-main-detail-ul"
                v-infinite-scroll="load"
                :infinite-scroll-delay="100"
                :infinite-scroll-distance="0"
                :infinite-scroll-disabled="disabled"
                style="overflow:auto;"
            >
                <li v-for="i in count" :key="i" class="billlist-main-detail-item">
                    <BillListMainDetailItem :node="tradingData[i-1]" :id="tradingData[i-1].id"/>
                </li>
                <p v-show="noMore">没有更多了</p>
                <el-button @click="updateData">click</el-button>
                <bill-list-main-detail-add-button/>
            </ul>
        </el-collapse>
        <div v-else>
            还没有数据
            <bill-list-main-detail-add-button/>
        </div>
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
    import {getBilllistDataByAccountId} from '@/js/db/RendererDB';
    import {ipcRenderer as ipc} from 'electron';
    import BillListMainDetailAddButton from "./BillListMainDetailAddButton";

    export default {
        name: "BillListMainDetail",
        components: {BillListMainDetailAddButton, BillListMainDetailItem},
        mounted() {
            this.getData();
            ipc.on('updateBillDetail', () => {
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
                console.log('load:', this.count);
            },
            async getData() {
                // console.log(await getBilllistData(1));
                this.tradingData = await getBilllistDataByAccountId(this.$route.params.id);
                // console.log('open:', this.$route.params.id, this.tradingData);
                // if (this.count > this.tradingData.length) this.count = this.tradingData.length;
            },
            async updateData() {
                // console.log('updateData:',this.$route.params.id);
                this.tradingData = await getBilllistDataByAccountId(this.$route.params.id);
                // console.log('open:', this.$route.params.id, this.tradingData);
                // if (this.count > this.tradingData.length) this.count = this.tradingData.length;
            }

        },
        computed: {
            noMore() {
                console.log(this.count, this.tradingData.length, this.count >= this.tradingData.length);
                return this.count >= this.tradingData.length;
            },
            disabled() {
                console.log(this.noMore);
                return this.noMore;
            }
        },
        watch: {
            $route() {
                this.id = this.$route.query.id; //获取传来的参数
                this.getData(); //路由变化时就重新执行这个方法 更新传来的参数
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
