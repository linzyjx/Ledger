<template>
    <el-container>
        <el-header height="50px">
            <BillListMainDetailFilter/>
        </el-header>
        <el-main>
            <BillListMainDetail/>
        </el-main>
    </el-container>
</template>

<script>
    import BillListMainDetail from "./BillListMainDetail";
    import BillListMainDetailFilter from "./BillListMainDetailFilter";
    export default {
        name: "BillListMain",
        components: {BillListMainDetailFilter, BillListMainDetail}
    }
</script>

<style>

</style>
