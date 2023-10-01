const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
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

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => win.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => win.webContents.send('update-counter', -1),
                    label: 'Decrement'
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)

    win.loadFile('src/index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', async () => {
        const { filePaths } = await dialog.showOpenDialog()
        return filePaths[0]
    })
    createWindow()
    ipcMain.on('set-title', (event, newTitle) => {
        win.setTitle(newTitle)
    })
})
