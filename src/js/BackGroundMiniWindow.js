import {createMiniWindow} from "./CreateMiniWindow";
import {BrowserWindow, ipcMain} from 'electron';

let minWin, minWinId;



function startWindow(mainWindow) {
    let minWinOptions = {
        width: 600,
        height: 800,
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
    if (!process.env.IS_TEST) minWin.webContents.openDevTools();
    minWin.once('ready-to-show', () => {
        minWin.show();
    });
}

function ipcListener(arg) {
    console.log('Create Linstener',arg);
    ipcMain.on('RoutePush', (event, url) => {
        console.log('get RoutePush:',url);
        minWin.webContents.send('RoutePush', url);
        minWin.show();
    })
}


export {startWindow};
