<template>
    <div class="billlist-main-detail" style="height: 100%">
        <el-collapse style="height: 100%" accordion>
            <ul class="billlist-main-detail-ul"
                v-infinite-scroll="load"
                :infinite-scroll-delay="100"
                :infinite-scroll-distance="0"
                infinite-scroll-disabled="disabled"
                style="overflow:auto;"
                ref="tableWrapper"
            >
                <li v-for="i in count" :key="i" class="billlist-main-detail-item">
                    <BillListMainDetailItem :node="tradingData[i-1]" :id="i"/>
                </li>
                <p v-if="noMore">没有更多了</p>
            </ul>
        </el-collapse>
    </div>
</template>

<script>
    import * as AccountListData from "../../testdata/AccountListData";
    import * as BillListDetailData from "../../testdata/BillListDetailData";
    import BillListMainDetailItem from "./BillListMainDetailItem";

    export default {
        name: "BillListMainDetail",
        components: {BillListMainDetailItem},
        mounted() {
        },
        data() {
            return {
                count: 0,
                tradingData: BillListDetailData.data
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
