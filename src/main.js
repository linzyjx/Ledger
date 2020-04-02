import Vue from 'vue';
import VueRouter from "vue-router";
import ElementUI from 'element-ui';
import store from './store';

import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import HelloWorld from "./components/HelloWorld";
import MainWindow from "./components/Windows/MainWindow/MainWindow";
import MiniWindow from "./components/Windows/MiniWindow/MiniWindow";
// import MiniWindowDemo1 from "./components/Windows/MiniWindow/MiniWindowDemo1";
import MiniWindowHome from "./components/Windows/MiniWindow/MiniWindowHome";
import BillListItemEditor from "./components/BillList/MiniWindow/DetailItemEditor";

import AccountsList from "./components/AccountsList/AccountsList";
import BillList from "./components/BillList/BillList";
import BillListMain from "./components/BillList/BillListMain";


Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);

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
                        path: '/App/HelloWorld',
                        name: 'HelloWorld',
                        component: HelloWorld
                    },]
            },
            {
                path: '/MiniWindow',
                name: 'MiniWindow',
                component: MiniWindow,
                children: [
                    {
                        path: '/MiniWindow/Home',
                        name:'MiniWondowHome',
                        component: MiniWindowHome
                    },
                    {
                        path: '/MiniWindow/BillItemEditor/:id',
                        name: 'BillItemEditor',
                        component: BillListItemEditor
                    }]
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
