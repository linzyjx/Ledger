<template>
    <el-container class="billlist-container">
        <el-aside width="350px">
            <el-container>
                <el-main>
                    <AccountsList/>
                </el-main>
                <el-footer>
                    <BillListFooter/>
                </el-footer>
            </el-container>
        </el-aside>
        <el-container>
            <el-main class="billlist-container-main">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import AccountsList from "../AccountsList/AccountsList";
    import BillListFooter from "./BillListFooter";

    export default {
        name: "BillList",
        components: {BillListFooter, AccountsList}
    }
</script>


<style>
    .billlist-container .el-main {
        height: 100%;
    }
    .el-container,.el-main{
        height: 100%;
    }
</style>
