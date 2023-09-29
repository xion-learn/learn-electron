const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
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
    console.log(process.versions)
})
