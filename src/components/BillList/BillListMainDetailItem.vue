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
                            <div>{{node.time}}</div>
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
        <el-row>
            <el-col :span="6" :offset="2">
                <div>商家：</div>
                <div>类别：</div>
            </el-col>
            <el-col :span="6" :offset="10">
                <el-button size="small" @click="showDialog">aaa</el-button>
                <el-button size="small" @click="sqliteTest">bbb</el-button>
            </el-col>
        </el-row>
        <BillListMainDetailItemEditor/>
    </el-collapse-item>
    <!--    </div>-->
</template>

<script>
    import BillListMainDetailItemEditor from "./BillListMainDetailItemEditor";

    export default {
        components: {BillListMainDetailItemEditor},
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
            showDialog() {
                this.$store.commit({type: "showDialog"});
            },
            sqliteTest() {
                const {Sequelize, Model, DataTypes} = require('sequelize');
                const sequelize = new Sequelize('sqlite::memory:');

                class User extends Model {
                }

                User.init({
                    username: DataTypes.STRING,
                    birthday: DataTypes.DATE
                }, {sequelize, modelName: 'user'});

                sequelize.sync()
                    .then(() => User.create({
                        username: 'janedoe',
                        birthday: new Date(1980, 6, 20)
                    }))
                    .then(jane => {
                        console.log(jane.toJSON());
                    });
            }

        },
        computed: {}
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
