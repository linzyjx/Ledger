// 注册和管理全局ipc事件
import {ipcMain} from 'electron';

export {mainWindowInit};

// import * as Demo1 from "./js/MiniWindowDemo1";
import {mainWindow} from "./js/MainWindow";

import {startWindow} from './js/BackGroundMiniWindow';
import {
    updateDetailItem,
    addDetailItem,
    deleteDetailItem,
    updateCategoryList,
    addCategoryItem,
    deleteCategoryItem,
    updateCategoryItem,
    updateAccountList
} from './js/db/MainDB';

// 主窗口创建时
function mainWindowInit() {
    ipcMain.on('WinDemo1Set', () => {
        // startWindow(mainWindow);
        // console.log('aaa');
    });

    ipcMain.on('updateDetailItem', (e, id, type, changeData) => {
        updateDetailItem(id, type, changeData).then(() => {
            mainWindow.webContents.send('updateBillDetail');
        });
    });

    ipcMain.on('addDetailItem', (e, data) => {
        addDetailItem(data).then(() => {
            mainWindow.webContents.send('updateBillDetail');
        });
    });
    ipcMain.on('delDetailItem', (e, id) => {
        deleteDetailItem(id).then(() => {
            mainWindow.webContents.send('updateBillDetail');
        });
    });

    ipcMain.on('updateCateList', (e, id, dropNodeId, dropType) => {
        updateCategoryList(id, dropNodeId, dropType).catch(() => {
            mainWindow.webContents.send('updateCateList');
        });
    });

    ipcMain.on('addCateItem', (e, type) => {
        addCategoryItem(type).then(() => {
            e.sender.send('updateCateList');
        });
    });

    ipcMain.on('delCateItem', (e, id) => {
        deleteCategoryItem(id).then(() => {
            e.sender.send('updateCateList');
            e.sender.send('delCateItemDone');
        });
    });
    ipcMain.on('updateCateItem', (e, id, data) => {
        updateCategoryItem(id, data).then(() => {
            e.sender.send('updateCateList');
        });
    });

    ipcMain.on('updateAccountList', (e, id, dropNodeId, dropType) => {
        updateAccountList(id, dropNodeId, dropType)
            .then(() => {
                e.sender.send('freshAccountList');
            })
            .catch(() => {
                e.sender.send('freshAccountList');
            });
    });

    startWindow(mainWindow);
    // console.log(mainWindow);
}
