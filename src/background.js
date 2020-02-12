'use strict';

import {app, protocol, BrowserWindow, Menu, globalShortcut, ipcMain} from 'electron'
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let minWin;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

function createMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/app');
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        mainWindow.loadURL('app://./index.html#/app')
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('maximize');
    });

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('unmaximize');
    });
    createMenu();
    // console.log(mainWindow);
    createMinWindow('MiniWindow/Demo1');
    // ipcMain.on('mini', (event, win) => {
    //     // console.log('Window same test:');
    //     // if (win === minWin) {
    //     //     console.log('Window is same');
    //     // } else {
    //     //     console.log('Window not same');
    //     //     console.log(win);
    //     //     console.log(minWin);
    //     // }
    // })
}

function createMenu() {
    if (process.platform === 'darwin') {    //Mac: save 'about' and 'quit'
        const template = [
            {
                label: 'App Demo',
                submenu: [
                    {role: 'about'},
                    {role: 'quit'}
                ]
            }
        ];
        let menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    } else {
        //Win and Linus
        Menu.setApplicationMenu(null);
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow()
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // Devtools extensions are broken in Electron 6.0.0 and greater
        // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
        // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
        // If you are not using Windows 10 dark mode, you may uncomment these lines
        // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
        try {
            await installVueDevtools()
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
        globalShortcut.register('CommandOrControl+Shift+i', function () {
            mainWindow.webContents.openDevTools();
        })
    }
    createMainWindow()
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

//执行窗口状态变更
ipcMain.on('MainWindowsMinimize', () => mainWindow.minimize());
ipcMain.on('MainWindowsClose', () => mainWindow.close());
ipcMain.on('MainWindowsWindowing', () => mainWindow.unmaximize());
ipcMain.on('MainWindowsMaximize', () => mainWindow.maximize());


function createMinWindow(windowURI) {
    // Menu.setApplicationMenu(null); // 关闭子窗口菜单栏
// 使用hash对子页面跳转，这是vue的路由思想
    minWin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: mainWindow // mainWindow是主窗口
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // createProtocol('false');
        // Load the url of the dev server if in development mode
        minWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/' + windowURI);
        console.log(process.env.WEBPACK_DEV_SERVER_URL + windowURI);
        if (!process.env.IS_TEST) minWin.webContents.openDevTools()
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        minWin.loadURL('app://./index.html/' + '#/' + windowURI)
    }

    minWin.on('closed', () => {
        minWin = null
    });
}


