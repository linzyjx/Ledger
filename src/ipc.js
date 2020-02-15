// 注册和管理全局ipc事件
import {ipcMain} from 'electron';

export {mainWindowInit};

import * as Demo1 from "./js/MiniWindowDemo1";

// 主窗口创建时
function mainWindowInit() {
    ipcMain.on('WinDemo1Set', () => {
        Demo1.startWindow();
        console.log('aaa');
    })
}