import {createMiniWindow} from "./CreateMiniWindow";

function startWindow(mainWindow) {
    let minWin, minWinId;
    let minWinOptions = {
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: mainWindow, // mainWindow是主窗口
    };
    let miniWinData = {initarg: 1234};
    [minWin, minWinId] = createMiniWindow('/MiniWindow/Demo1/233?a=111', minWinOptions, miniWinData);
    console.log(`Get Window ID: ${minWinId}`);
    if (!process.env.IS_TEST) minWin.webContents.openDevTools();
    minWin.once('ready-to-show', () => {
        minWin.show();
    });
}

export {startWindow};
