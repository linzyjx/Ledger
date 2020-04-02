<template>
    <el-card class="box-card" shadow="hover" :body-style="{'background-color':(this.node.isCurrent?'#F5F7FA':undefined)}">
        <el-row align="middle" type="flex" justify="center">
            <el-col :span="node.level*2-2">
                <div class="accounts-list-card-group-color-marker" :style="{'background-color':parentBackgroundColor}"></div>
            </el-col>
            <el-col :span="4" class="accounts-list-card-icon-col">
                <i class="icon el-icon-s-finance"></i>
            </el-col>
            <el-col :span="20-(node.level-1)*2">
                <div>
                    <div>{{node.label}}</div>
                    <div>bbb</div>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    export default {
        data(){
            return{
                parentBackgroundColor:(this.node.level===2?this.node.parent.data.color:'#fff'),
            }
        },
        name: "AccountsListCardTypeAccount",
        props: ['node'],
        methods: {
        },
        watch:{
            isCurrent:function (n,o) {
                console.log(n,o);
            }
        }
    }
</script>

<style scoped>
    .accounts-list-card-group-color-marker{
        height: 300%;
        float: left;
        position: absolute;
        width: 10px;
        /*background-color: #f56c6c80;*/
        top: -20px;
    }
</style>
<style>
    .accounts-list .accounts-list-card-icon-col {
        text-align: center;
    }

    .accounts-list .accounts-list-card-icon-col .icon {
        font-size: x-large;
        font-weight: 200;
    }

    .accounts-list .el-card__body {
        padding-left: 0;
    }
</style>
