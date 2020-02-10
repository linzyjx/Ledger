import Vue from 'vue'
import VueRouter from "vue-router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import HelloWorld from "./components/HelloWorld";


Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);

let router = new VueRouter({
    mode: 'history',
    base: '/',
    routes: [
        {
            path: '/app',
            name: 'App',
            component: App
        },
        {
            path: '/HelloWorld',
            name: 'HelloWorld',
            component: HelloWorld
        }
    ]
});

let vm = new Vue({
    el: '#app',
    router,
    render: h => h(App),
});

// eslint-disable-next-line no-console
console.log('aaa', vm.$data.msg);
