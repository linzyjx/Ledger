<template>

    <el-container class="statistics-container">
        <el-collapse-transition>
            <el-aside :width="showList?'250px':'0px'" style="float: left" class="aside">
                <el-container>
                    <el-main>
                        <StatisticsList :type="type"/>
                    </el-main>
                </el-container>
            </el-aside>
        </el-collapse-transition>

        <el-container>
            <el-aside width="20px" class="aside-button">
                <div style="width: 20px;height: 100%" @click="showList=!showList">
                    <el-button style="height: 100%;color: #909399" size="mini" type="text"
                               :icon="showList?'el-icon-caret-left':'el-icon-caret-right'"></el-button>
                </div>
            </el-aside>
            <el-main class="statistics-container-main">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import StatisticsList from "./StatisticsList";

    export default {
        name: "Statistics",
        components: {StatisticsList},
        data() {
            return {
                type: 1,
                showList: true
            }
        }
    }
</script>


<style>
    .billlist-container .el-main {
        height: 100%;
    }

    .el-container, .el-main {
        height: 100%;
    }

    .statistics-container-main .aside {
        overflow: hidden;
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #DCDFE6;
    }
</style>

<style scoped>
    .aside-button {
        position: fixed;
        /* top: 50%; */
        height: 100%;
        z-index: 50;
        border-left: 1px solid #E4E7ED;
    }
</style>
