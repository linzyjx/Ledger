// 注册和管理全局ipc事件
import {ipcMain} from 'electron';

export {mainWindowInit};

// import * as Demo1 from "./js/MiniWindowDemo1";
import {mainWindow} from "./js/MainWindow";
import SQL from 'sql-template-strings';
import sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

import {startWindow} from './js/BackGroundMiniWindow';
import {updateDetailItem, addDetailItem, deleteDetailItem} from './js/db/MainDB';

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

    startWindow(mainWindow);
    // console.log(mainWindow);
}
