<template>
    <!--    <div ref="detailitem" style="">-->
    <el-collapse-item :name="id" style="height: 100%;overflow: hidden">
        <template slot="title" @change="aaa">
            <div class="billlist-main-detail-item-title">
                <el-row>
                    <el-col :span="2" class="billlist-main-detail-item-icon"><i
                            class="icon-background el-icon-s-grid"></i></el-col>
                    <el-col :span="13">
                        <div class="billlist-main-detail-item-text">
                            <div class="name bond">{{node.name}}</div>
                            <div>{{(new Date(node.time*1000)).Format('yyyy年M月d日 hh:mm')}}</div>
                        </div>
                    </el-col>
                    <el-col :span="4" class="billlist-main-detail-item-num bond">
                        {{parseFloat(node.amount).toFixed(2)}}
                    </el-col>
                    <el-col :span="4" class="billlist-main-detail-item-num bond">
                        {{parseFloat(node.balance).toFixed(2)}}
                    </el-col>
                    <el-col :span="1"></el-col>
                </el-row>
            </div>
            <!--                <div class="color-marker" :style="{height:colorMarkerHeight}"></div>-->
        </template>
        <el-row type="flex" align="middle">
            <el-col :span="6" :offset="2">
                <div>商家：{{node.party_name}}</div>
                <div>类别：</div>
            </el-col>
            <el-col :span="6" :offset="10">
                <el-popconfirm
                        confirmButtonText='确认'
                        cancelButtonText='取消'
                        confirmButtonType="danger"
                        icon="el-icon-info"
                        iconColor="#F56C6C"
                        title="确认删除这条账目吗？"
                        @onConfirm="delItem"
                >
                    <el-button icon="el-icon-delete" slot="reference" size="small">删除</el-button>
                </el-popconfirm>
                <el-button icon="el-icon-edit" size="small" style="margin-left: 7px" @click="openEditor">修改</el-button>
            </el-col>
        </el-row>
        <!--        <BillListMainDetailItemEditor/>-->
    </el-collapse-item>
    <!--    </div>-->
</template>

<script>
    // import BillListMainDetailItemEditor from "./BillListMainDetailItemEditor";
    import {ipcRenderer as ipc} from 'electron';
    import sqlite from "sqlite";
    import SQL from "sql-template-strings";
    // import Popconfirm from '@/components/utils/popconfirm/Popconfirm.vue';
    // import db from '@/js/db/RendererDB';

    export default {
        components: {},
        mounted() {
            // this.colorMarkerHeight = window.getComputedStyle(this.$refs.detailitem).height;
            // console.log('aaa');
        },
        updated() {
            // this.colorMarkerHeight = '100px'
        },
        name: "BillListMainDetailItem",
        props: {
            id: Number,
            node: Object,
            closeMethod: () => {
                this.dialogVisible = false;
            }
        },
        data() {
            return {
                colorMarkerHeight: '0px',
                dialogVisible: false
            }
        }
        ,
        methods: {
            aaa() {
                // console.log(window.getComputedStyle(this.$refs.detailitem).height);
            },
            async showDialog() {
                // this.$store.commit({type: "showDialog"});
                var db = await sqlite.open(':memory:');
                await db.run(SQL`CREATE TABLE lorem (info TEXT)`);
                var stmt = await db.prepare("INSERT INTO lorem VALUES (?)");
                try {
                    console.log('aaa');
                    stmt.run("Ipsum " + 5);
                } catch (e) {
                    console.log('111:' + e);
                }
                await db.each("SELECT rowid AS id, info FROM lorem").then((row) => {
                    console.log(row.id + ": " + row.info);
                    return row;
                }).then((row) => {
                    alert(row.id + ": " + row.info)
                })
                    .catch(err => {
                        console.log('444' + err)
                    });
                await db.close().catch((e) => {
                    console.log('222:' + e);
                });
            },
            sqliteTest() {
                // db();
                ipc.send('sqliteTest');
                ipc.on('aaa', (event, result) => {
                    alert(result);
                })
            },
            openEditor() {
                console.log('send RoutePush');
                ipc.send('RoutePush', `/MiniWindow/BillItemEditor/${this.node.id}?a=111`);
            },
            delItem() {
                console.log('delete node:', this.node.id);
                ipc.send('delDetailItem', this.node.id);
            }

        },
        computed: {}
    }
    //格式化日期
    Date.prototype.Format = function (fmt) {
        var o = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S+": this.getMilliseconds()             //毫秒
        };
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                if (k == "y+") {
                    fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
                } else if (k == "S+") {
                    var lens = RegExp.$1.length;
                    lens = lens == 1 ? 3 : lens;
                    fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
                } else {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
        }
        return fmt;
    }
</script>

<style scoped>
    .billlist-main-detail-item-title {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .billlist-main-detail-item-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .billlist-main-detail-item-text {
        line-height: 1.5;
    }

    .billlist-main-detail-item-text .name {
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .billlist-main-detail-item-num {
        text-align: center;
        font-size: 16px;
    }

    .bond {
        font-weight: 600;
    }

    .billlist-main-detail-item-icon {
        text-align: center;
    }

    .billlist-main-detail-item-icon .icon-background {
        color: #ffffff;
        background-color: #3a8ee6;
        border-radius: 40px;
        height: 40px;
        width: 39px;
        font-size: 26px;
        line-height: 1.6;
        margin-top: 2px;
        /*padding-left: 2px;*/
    }

    .billlist-main-detail-item {
        padding: 5px 0 0 0;
    }

    .billlist-main-detail-item .left-box {
        padding-left: 10%;
        width: 40%;
    }

    .billlist-main-detail-item .right-box {
        padding-left: 10%;
        width: 40%;
    }

    .color-marker {
        float: right;
        /*position: absolute;*/
        width: 10px;
        background-color: #f56c6c80;
        top: -20px;
        overflow: hidden;
    }
</style>

<style>
    .billlist-main-detail-item .el-collapse-item__content {
        padding-bottom: 10px;
    }
</style>
