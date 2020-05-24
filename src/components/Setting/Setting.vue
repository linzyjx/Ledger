<template>
    <el-container>
        <el-aside width="200px" style="padding: 10px;border-right: 1px solid #E4E7ED;">
            <div class="side-nav">
                <ul>
                    <li v-for="node of data" :key="node.src" class="nav-item" @click="handleNodeClick(node)"><a
                            href="#">{{node.name}}</a></li>
                </ul>
            </div>
        </el-aside>
        <el-main style="padding: 10px">
            <router-view/>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "Setting",
        data() {
            return {
                data: [
                    {
                        name: 'about 关于',
                        src: 'About'
                    },
                    {
                        name: 'common 常规',
                        src: 'Common'
                    }
                ],
            }
        },
        methods: {
            handleNodeClick(data) {
                console.log(`/App/Setting/${data.src}`);
                this.$router.push(`/App/Setting/${data.src}`);

            }
        },
    }
</script>

<style scoped>
    .side-nav {
        width: 100%;
        box-sizing: border-box;
        transition: opacity .3s;
        height: 100%;
        padding-right: 0;
    }

    .side-nav.is-fade {
        transition: opacity 3s
    }

    .side-nav li {
        list-style: none;
    }

    .side-nav ul {
        padding: 0;
        margin: 0;
        overflow: hidden;
    }

    .side-nav > ul > .nav-item > a {
        margin-top: 15px
    }

    .side-nav > ul > .nav-item:nth-child(-n+4) > a {
        margin-top: 0
    }

    .side-nav .nav-item a {
        font-size: 16px;
        color: #333;
        line-height: 40px;
        height: 40px;
        margin: 0;
        padding: 0;
        text-decoration: none;
        display: block;
        position: relative;
        transition: .15s ease-out;
        font-weight: 700
    }

    .side-nav .nav-item a.active {
        color: #409eff
    }

    .side-nav .nav-item a {
        display: block;
        height: 40px;
        color: #444;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 400;
        margin: 0;
        padding: 0;
        text-decoration: none;
        position: relative;
        transition: .15s ease-out;
    }

    .side-nav .nav-item a.active, .side-nav .nav-item a:hover {
        color: #409eff
    }

    .side-nav .nav-item.sponsors > .sub-nav {
        margin-top: -10px
    }

    .side-nav .nav-item.sponsors > a {
        color: #777;
        font-weight: 300;
        font-size: 14px
    }

    .side-nav .nav-item.sponsors .nav-item {
        display: inline-block
    }

    .side-nav .nav-item.sponsors .nav-item a {
        height: auto;
        display: inline-block;
        vertical-align: middle;
        margin: 8px 12px 12px 0
    }

    .side-nav .nav-item.sponsors .nav-item a img {
        width: 42px
    }

    .side-nav .nav-item.sponsors .nav-item:first-child a img {
        width: 36px
    }

    .side-nav .nav-group__title {
        font-size: 12px;
        color: #999;
        line-height: 26px;
        margin-top: 15px
    }

    .side-nav #code-sponsor-widget {
        margin: 0 0 0 -20px
    }
</style>
