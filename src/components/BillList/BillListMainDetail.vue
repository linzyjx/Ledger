<template>
    <div>
        <span>BillListMainDetail</span>
        <br/>
        <span>id:{{this.$route.params.id}}</span>
        <br/>
        <span>label:{{accountData('id',this.$route.params.id).label}}</span>
        <br/>
        <el-button @click="test">aaa</el-button>
    </div>
</template>

<script>
    import * as AccountListData from "../../testdata/AccountListData";

    export default {
        name: "BillListMainDetail",
        mounted() {
        },
        data() {
            return {
            }
        },

        methods:{
            test(){
                console.log('getNode:',this.accountData);
            },
            accountData:function (key,value) {
                // console.log(AccountListData.findNode(key,value));
                return AccountListData.findNode(key,value);
            }
        }
    }
</script>

<style scoped>

</style>
