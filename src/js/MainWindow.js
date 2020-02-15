import {BrowserWindow, Menu, ipcMain} from 'electron'
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

let mainWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
function createMainWindow() {
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
    createMenu();
    createListener();
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

function createListener() {
    //注册窗口行为
    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('maximize');
    });

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('unmaximize');
    });

    //执行窗口状态变更
    ipcMain.on('MainWindowsMinimize', () => mainWindow.minimize());
    ipcMain.on('MainWindowsClose', () => mainWindow.close());
    ipcMain.on('MainWindowsWindowing', () => mainWindow.unmaximize());
    ipcMain.on('MainWindowsMaximize', () => mainWindow.maximize());

}

export {mainWindow, createMainWindow};
