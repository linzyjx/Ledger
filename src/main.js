import Vue from 'vue';
import VueRouter from "vue-router";
import ElementUI from 'element-ui';
import store from './store';

import Echarts from 'vue-echarts';
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import HelloWorld from "./components/HelloWorld";
import MainWindow from "./components/Windows/MainWindow/MainWindow";
import MiniWindow from "./components/Windows/MiniWindow/MiniWindow";
// import MiniWindowDemo1 from "./components/Windows/MiniWindow/MiniWindowDemo1";
import MiniWindowHome from "./components/Windows/MiniWindow/MiniWindowHome";
import BillListItemEditor from "./components/BillList/MiniWindow/DetailItemEditor";
import BillListItemAdder from "./components/BillList/MiniWindow/DetailItemAdder";

import AccountsList from "./components/AccountsList/AccountsList";
import BillList from "./components/BillList/BillList";
import BillListMain from "./components/BillList/BillListMain";
import Category from "./components/Category/Category";
import CategoryPage from "./components/Category/CategoryPage";
import AccountListEditor from "./components/AccountsList/MiniWindow/AccountListEditor";

import Setting from "./components/Setting/Setting";
import About from "./components/Setting/views/About";
import Common from "./components/Setting/views/Common";

import Statistics from './components/Statistics/Statistics';
import NetBalance from "./components/Statistics/views/NetBalance";
import NetIO from "./components/Statistics/views/NetIO";

import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';


Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.component('v-chart', Echarts);

const isDev = process.env.NODE_ENV !== "production";
Vue.config.performance = isDev;

const router = new VueRouter({
        // mode: 'history',
        base: '/',
        routes: [
            {
                path: '/App',
                name: 'app',
                component: MainWindow,
                children: [
                    {
                        path: '/App/AccountsList',
                        name: 'AccountsList',
                        component: AccountsList
                    },
                    {
                        path: '/App/BillList',
                        name: 'BillList',
                        component: BillList,
                        children: [{
                            path: '/App/BillList/Account/:id',
                            name: 'BillListMain',
                            component: BillListMain
                        }]
                    },
                    {
                        path: '/App/Category',
                        name: 'Category',
                        component: Category,
                        children: [{
                            path: '/App/Category/:id',
                            name: 'CategoryPage',
                            component: CategoryPage,
                        }]
                    },
                    {
                        path: '/App/Statistics',
                        name: 'Statistics',
                        component: Statistics,
                        children: [
                            {
                                path: '/App/Statistics/NetBalance',
                                name: NetBalance,
                                component: NetBalance
                            },
                            {
                                path: '/App/Statistics/NetIO',
                                name: 'NetIO',
                                component: NetIO
                            }]
                    },
                    {
                        path: '/App/HelloWorld',
                        name: 'HelloWorld',
                        component: HelloWorld
                    },
                    {
                        path: '/App/Setting',
                        name: 'Setting',
                        component: Setting,
                        children: [
                            {
                                path: '/App/Setting/About',
                                name: 'About',
                                component: About
                            },
                            {
                                path: '/App/Setting/Common',
                                name: 'Common',
                                component: Common
                            }]
                    }
                ]
            },
            {
                path: '/MiniWindow',
                name: 'MiniWindow',
                component: MiniWindow,
                children: [
                    {
                        path: '/MiniWindow/Home',
                        name: 'MiniWondowHome',
                        component: MiniWindowHome
                    },
                    {
                        path: '/MiniWindow/BillItemEditor/:id',
                        name: 'BillItemEditor',
                        component: BillListItemEditor
                    },
                    {
                        path: '/MiniWindow/BillItemAdder/:type',
                        name: 'BillItemAdder',
                        component: BillListItemAdder
                    },
                    {
                        path: '/MiniWindow/AccountEditor/:id',
                        name: 'AccountListEditor',
                        component: AccountListEditor
                    }
                ]
            }
        ]
    })
;

let vm = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
});

// eslint-disable-next-line no-console
console.log('aaa', vm.$data.msg);

window
