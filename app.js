const { app, BrowserWindow } = require('electron')
require('electron-reload')(__dirname)

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: false
        }
    })

    mainWindow.loadFile(__dirname + '/view/mainWindow.html')
    mainWindow.removeMenu();
    mainWindow.show()
}

app.whenReady().then(createMainWindow)