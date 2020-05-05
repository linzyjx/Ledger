<template>
    <el-container class="category-container">
        <el-aside width="350px" class="aside">
            <el-container>
                <el-header>
                    <CategoryListHeader :type="type" @change="type=$event"/>
                </el-header>
                <el-main>
                    <CategoryList :type="type"/>
                </el-main>
            </el-container>
        </el-aside>
        <el-container>
            <el-main class="category-container-main">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import CategoryList from "./CategoryList";
    import CategoryListHeader from "./CategoryListHeader";

    export default {
        name: "Category",
        components: {CategoryListHeader, CategoryList},
        data() {
            return {
                type: 1
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

    .category-container .aside {
        overflow: hidden;
        border-right-style: solid;
        border-right-width:1px;
        border-right-color: #DCDFE6;
    }
</style>
