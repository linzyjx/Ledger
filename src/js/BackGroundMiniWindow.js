import {createMiniWindow} from "./CreateMiniWindow";
import {BrowserWindow, globalShortcut, ipcMain} from 'electron';
import {mainWindow} from "./MainWindow";

let minWin, minWinId;


function startWindow(mainWindow) {
    let minWinOptions = {
        width: 500,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: mainWindow, // mainWindow是主窗口
    };
    console.log(mainWindow);
    let miniWinData = {initarg: 1234};
    [minWin, minWinId] = createMiniWindow('/MiniWindow/Home', minWinOptions, miniWinData);
    console.log(`Get Window ID: ${minWinId}`);

    ipcListener('aa');
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        if (!process.env.IS_TEST) minWin.webContents.openDevTools();
    }
    globalShortcut.register('CommandOrControl+Shift+u', function () {
        minWin.webContents.openDevTools();
    });
    minWin.once('ready-to-show', () => {
        // minWin.show();
    });
}

function ipcListener(arg) {
    console.log('Create Linstener', arg);
    ipcMain.on('RoutePush', (event, url) => {
        console.log('get RoutePush:', url);
        minWin.webContents.send('RoutePush', url);
        minWin.show();
    });
    ipcMain.on('openDevTools', () => {
        minWin.webContents.openDevTools();
    })
}


export {startWindow};
