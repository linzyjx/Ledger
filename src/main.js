import Vue from 'vue'
import VueRouter from "vue-router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import HelloWorld from "./components/HelloWorld";
import MainWindow from "./components/MainWindow";
import MiniWindow from "./components/MiniWindow";
import MiniWindowDemo1 from "./components/MiniWindowDemo1";


Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);

let router = new VueRouter({
        // mode: 'history',
        base: '/',
        routes: [
            {
                path: '/App',
                name: 'app',
                component: MainWindow,
                children: [{
                    path: '/App/HelloWorld',
                    name: 'HelloWorld',
                    component: HelloWorld
                }]
            },
            {
                path: '/MiniWindow',
                name: 'MiniWindow',
                component: MiniWindow,
                children: [
                    {
                        path: '/MiniWindow/Demo1/:id',
                        name: 'MiniWindowDemo1',
                        component: MiniWindowDemo1
                    }]
            }
        ]
    })
;

let vm = new Vue({
    el: '#app',
    router,
    render: h => h(App),
});

// eslint-disable-next-line no-console
console.log('aaa', vm.$data.msg);
