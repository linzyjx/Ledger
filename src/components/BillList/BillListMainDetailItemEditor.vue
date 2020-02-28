<template>
    <el-dialog
            :visible.sync="dialogVisible"
            width="30%"
            :modal-append-to-body="false"
            :show-close="false"
            class="billlist-main-detail-item-editor"
    >
        <div slot="title">
            <BillListMainDetailItemEditorTopBar :init-data="initData"/>
        </div>
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleClose">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import BillListMainDetailItemEditorTopBar from './BillListMainDetailItemEditorTopBar';

    export default {
        name: "BillListMainDetailItemEditor",
        components: {BillListMainDetailItemEditorTopBar},
        props: {},
        data() {
            return {
                initData: {
                    title: 'Demo1',
                    showMaximizeButton: false,
                    showMinimizeButton: false,
                    showCloseButton: true
                }
            }
        },
        methods: {
            handleClose() {
                this.dialogVisible = false
            }
        },
        computed: {
            dialogVisible: {
                get: function () {
                    return this.$store.state.isDialogVisible;
                },
                set: function () {
                    this.$store.commit({type: "hideDialog"});
                }
            }
        }
    }
</script>

<style scoped>

</style>

<style>
    .billlist-main-detail-item-editor .el-dialog__header{
        padding: 0;
    }
</style>
