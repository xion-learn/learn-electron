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
  win.loadFile('src/index.html')
}

function createMenu() {
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
}

app.whenReady().then(() => {
  createWindow()
  createMenu()
  ipcMain.on('set-title', setTitleHandler)
  ipcMain.handle('dialog:openFile', openFileHandler)
})

function setTitleHandler(event, newTitle) {
  win.setTitle(newTitle)
}

async function openFileHandler() {
  const { filePaths } = await dialog.showOpenDialog()
  return filePaths[0]
}
