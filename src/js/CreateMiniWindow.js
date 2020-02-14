import {BrowserWindow, ipcMain} from 'electron';
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

const miniWindows = new Set();  //子窗口表
const miniWindowsId = new Set();    //子窗口ID表

function createMiniWindow(windowBaseURI, windowOptions, windowData) {
    let newWindow = new BrowserWindow(windowOptions);   //新窗口对象
    let newWindowId;    //新窗口ID

    //随机生成一个ID，保证不与表中的ID相同
    do {
        newWindowId = Math.floor(Math.random() * 10000);
    } while (miniWindowsId.has(newWindowId));
    miniWindowsId.add(newWindowId);

    //将窗口ID添加到URI里
    let windowURI = windowBaseURI.split('?')[0] + `?winid=${newWindowId}` + (windowBaseURI.split('?')[1] === undefined ? '' : ('&' + windowBaseURI.split('?')[1]));
    console.log(windowURI);

    //等待渲染进程的初始化事件
    ipcMain.on(`win${newWindowId}Init`, (event) => {
        event.returnValue = windowData;
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        newWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#' + windowURI)
            .then(() => {
                console.log(`Mini Window ${newWindowId} Load Done.`);
            }).catch(() => {
            ipcMain.removeAllListeners(`win${newWindowId}Init`);
            console.log(`Mini Window ${newWindowId} Load Error.`);
            // 加载窗口失败，关闭窗口
            newWindow.close();
        });
        console.log(process.env.WEBPACK_DEV_SERVER_URL + windowURI);
        if (!process.env.IS_TEST) newWindow.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        newWindow.loadURL('app://./index.html/' + '#' + windowURI)
            .then(() => {
                console.log(`Mini Window ${newWindowId} Load Done.`);
            }).catch(() => {
            ipcMain.removeAllListeners(`win${newWindowId}Init`);
            console.log(`Mini Window ${newWindowId} Load Error.`);
            // 加载窗口失败，关闭窗口
            newWindow.close();
        });
    }
    newWindow.on('closed', () => {
        try {
            ipcMain.removeAllListeners(`win${newWindowId}Init`);
            miniWindows.delete(newWindow); //从已关闭的窗口Set中移除引用
            miniWindowsId.delete(newWindowId);
        } catch (e) {
            console.log(e);
            console.log('Error at newWindow.on')
        }

    });

    miniWindows.add(newWindow);
    return [newWindow, newWindowId];
}

export {createMiniWindow};
