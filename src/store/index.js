import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

export default new vuex.Store({
    state: {
        isDialogVisible: false
    },
    mutations: {
        hideDialog(state) {
            state.isDialogVisible = false;
        },
        showDialog(state) {
            state.isDialogVisible = true;
        }
    }
});
