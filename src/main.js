const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

let win

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'script/preload.js')
        }
    })
    win.webContents.openDevTools()
    win.loadFile('src/index.html')
}

app.whenReady().then(() => {
    createWindow()
    ipcMain.on('set-title', (event, newTitle) => {
        win.setTitle(newTitle)
    })
})
