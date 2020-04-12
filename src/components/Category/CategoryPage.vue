<template>
    <div class="category-page">
        <div class="top-part">
            <el-row type="flex" justify="center" align="middle" :gutter="20">
                <el-col :span="4" class="test">
                    <div style="padding-bottom: 20px">
                        <i :class="['cate-icon',data.icon]"
                           :style="{'background-color':(data.color?data.color:'#ffffff')}"></i>
                    </div>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form :model="data" label-position="right" label-width="auto" size="small">
                        <el-form-item label="id">
                            <el-input readonly v-model="data.id"></el-input>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="data.name"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" label-position="right" label-width="auto" size="small">
                        <el-form-item label="颜色">
                            <el-input v-model="data.color"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-color-picker size="small" v-model="data.color"/>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="6" :offset="1">
                    <div class="button-group">
                        <el-row>
                            <el-button @click="handleSubmitButton" type="success" icon="el-icon-check" size="medium">
                                确认修改
                            </el-button>
                        </el-row>
                        <el-row>
                            <el-button @click="getData" type="primary" icon="el-icon-edit" size="medium">
                                重置修改
                            </el-button>
                        </el-row>
                        <el-row>
                            <el-popconfirm
                                    confirmButtonText='确认'
                                    cancelButtonText='取消'
                                    confirmButtonType="danger"
                                    icon="el-icon-info"
                                    iconColor="#F56C6C"
                                    title="确认删除这个类别吗？"
                                    @onConfirm="handleDeleteButton"
                            >
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="medium">
                                    删除类别
                                </el-button>
                            </el-popconfirm>

                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="bottom-part">
            <el-row align="bottom" justify="center" class="row">
                <el-col :span="3" v-for="icon in icons" :key="icon" style="text-align: center;padding: 5px 0">
                    <i @click="handleIconClick(icon)" :class="['cate-icon-list',icon]"
                       :style="{'background-color':(data.color?data.color:'#ffffff')}" :alt="icon"></i>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {getCategoryDataById} from '@/js/db/RendererDB';
    import {ipcRenderer as ipc} from 'electron';

    export default {
        name: "CategoryPage",
        mounted() {
            this.id = this.$route.params.id; //获取传来的参数
            this.getData(); //路由变化时就重新执行这个方法 更新传来的参数
        },
        data() {
            return {
                data: {},
                id: this.$route.params.id,
                icons: [
                    'el-icon-goods',
                    'el-icon-star-off',
                    'el-icon-help',
                    'el-icon-picture-outline',
                    'el-icon-picture-outline-round',
                    'el-icon-camera',
                    'el-icon-video-camera',
                    'el-icon-bell',
                    'el-icon-s-ticket',
                    'el-icon-date',
                    'el-icon-takeaway-box',
                    'el-icon-monitor',
                    'el-icon-mobile',
                    'el-icon-scissors',
                    'el-icon-umbrella',
                    'el-icon-headset',
                    'el-icon-brush',
                    'el-icon-mouse',
                    'el-icon-coordinate',
                    'el-icon-magic-stick',
                    'el-icon-reading',
                    'el-icon-data-board',
                    'el-icon-data-analysis',
                    'el-icon-pie-chart',
                    'el-icon-film',
                    'el-icon-suitcase',
                    'el-icon-suitcase-1',
                    'el-icon-receiving',
                    'el-icon-collection',
                    'el-icon-files',
                    'el-icon-notebook-1',
                    'el-icon-notebook-2',
                    'el-icon-toilet-paper',
                    'el-icon-office-building',
                    'el-icon-school',
                    'el-icon-table-lamp',
                    'el-icon-house',
                    'el-icon-no-smoking',
                    'el-icon-smoking',
                    'el-icon-shopping-cart-full',
                    'el-icon-shopping-cart-1',
                    'el-icon-shopping-cart-2',
                    'el-icon-shopping-bag-1',
                    'el-icon-shopping-bag-2',
                    'el-icon-sold-out',
                    'el-icon-sell',
                    'el-icon-present',
                    'el-icon-box',
                    'el-icon-bank-card',
                    'el-icon-money',
                    'el-icon-coin',
                    'el-icon-wallet',
                    'el-icon-discount',
                    'el-icon-price-tag',
                    'el-icon-news',
                    'el-icon-guide',
                    'el-icon-male',
                    'el-icon-female',
                    'el-icon-thumb',
                    'el-icon-cpu',
                    'el-icon-link',
                    'el-icon-connection',
                    'el-icon-open',
                    'el-icon-turn-off',
                    'el-icon-set-up',
                    'el-icon-chat-round',
                    'el-icon-chat-line-round',
                    'el-icon-chat-square',
                    'el-icon-chat-dot-round',
                    'el-icon-chat-dot-square',
                    'el-icon-chat-line-square',
                    'el-icon-message',
                    'el-icon-postcard',
                    'el-icon-position',
                    'el-icon-turn-off-microphone',
                    'el-icon-microphone',
                    'el-icon-close-notification',
                    'el-icon-bangzhu',
                    'el-icon-time',
                    'el-icon-odometer',
                    'el-icon-crop',
                    'el-icon-aim',
                    'el-icon-switch-button',
                    'el-icon-full-screen',
                    'el-icon-copy-document',
                    'el-icon-mic',
                    'el-icon-stopwatch',
                    'el-icon-medal-1',
                    'el-icon-medal',
                    'el-icon-trophy',
                    'el-icon-trophy-1',
                    'el-icon-first-aid-kit',
                    'el-icon-discover',
                    'el-icon-place',
                    'el-icon-location',
                    'el-icon-location-outline',
                    'el-icon-location-information',
                    'el-icon-add-location',
                    'el-icon-delete-location',
                    'el-icon-map-location',
                    'el-icon-alarm-clock',
                    'el-icon-timer',
                    'el-icon-watch-1',
                    'el-icon-watch',
                    'el-icon-lock',
                    'el-icon-unlock',
                    'el-icon-key',
                    'el-icon-service',
                    'el-icon-mobile-phone',
                    'el-icon-bicycle',
                    'el-icon-truck',
                    'el-icon-ship',
                    'el-icon-basketball',
                    'el-icon-football',
                    'el-icon-soccer',
                    'el-icon-baseball',
                    'el-icon-wind-power',
                    'el-icon-light-rain',
                    'el-icon-lightning',
                    'el-icon-heavy-rain',
                    'el-icon-sunrise',
                    'el-icon-sunrise-1',
                    'el-icon-sunset',
                    'el-icon-sunny',
                    'el-icon-cloudy',
                    'el-icon-partly-cloudy',
                    'el-icon-cloudy-and-sunny',
                    'el-icon-moon',
                    'el-icon-moon-night',
                    'el-icon-dish',
                    'el-icon-dish-1',
                    'el-icon-food',
                    'el-icon-chicken',
                    'el-icon-fork-spoon',
                    'el-icon-knife-fork',
                    'el-icon-burger',
                    'el-icon-tableware',
                    'el-icon-sugar',
                    'el-icon-dessert',
                    'el-icon-ice-cream',
                    'el-icon-hot-water',
                    'el-icon-water-cup',
                    'el-icon-coffee-cup',
                    'el-icon-cold-drink',
                    'el-icon-goblet',
                    'el-icon-goblet-full',
                    'el-icon-goblet-square',
                    'el-icon-goblet-square-full',
                    'el-icon-refrigerator',
                    'el-icon-grape',
                    'el-icon-watermelon',
                    'el-icon-cherry',
                    'el-icon-apple',
                    'el-icon-pear',
                    'el-icon-orange',
                    'el-icon-coffee',
                    'el-icon-ice-tea',
                    'el-icon-ice-drink',
                    'el-icon-milk-tea',
                    'el-icon-potato-strips',
                    'el-icon-lollipop',
                    'el-icon-ice-cream-square',
                    'el-icon-ice-cream-round'
                ]
            }
        },
        methods: {
            async getData() {
                this.data = await getCategoryDataById(this.id);
            },
            handleDeleteButton() {
                ipc.once('delCateItemDone', () => {
                    this.$router.push(`/App/Category`);
                });
                ipc.send('delCateItem', Number(this.id));
            },
            handleSubmitButton() {
                ipc.send('updateCateItem', Number(this.id), this.data);
            },
            handleIconClick(icon) {
                this.data.icon = icon;
            }
        },
        watch: {
            $route() {
                this.id = this.$route.params.id; //获取传来的参数
                this.getData(); //路由变化时就重新执行这个方法 更新传来的参数
            }
        },
    }
</script>

<style scoped>
    .category-page {
        overflow: hidden;
        height: 100%;
    }

    .cate-icon {
        color: #ffffff;
        font-size: 58px;
        border-radius: 60px;
        height: 90px;
        width: 89px;
        line-height: 1.5;
        text-align: center;
    }

    .cate-icon-list {
        color: #ffffff;
        font-size: 46px;
        border-radius: 60px;
        height: 70px;
        width: 69px;
        line-height: 1.5;
        text-align: center;
        cursor:pointer;
    }

    .test {
        text-align: center;
    }

    .category-page .top-part {
        height: 20%;
        margin: 10px 20px;
    }

    .category-page .bottom-part {
        /*padding: 10px 0;*/
        border-top-style: solid;
        border-color: #E4E7ED;
        overflow: scroll;
        height: 80%;
    }

    .category-page .bottom-part .row {
        padding: 15px 10px;
    }

    .button-group {
        height: 100%;
        padding-top: 0px;
        padding-bottom: 20px;
    }
</style>

<style>
    .category-page .button-group .el-row {
        margin-bottom: 10px;
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

    .bottom-part:hover ::-webkit-scrollbar-thumb {
        background-color: rgba(144, 147, 153, .5);
    }
</style>
<style>
    .bottom-part .el-collapse-item__arrow {
        display: none;
    }


</style>
