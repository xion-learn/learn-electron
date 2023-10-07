const { app, Tray, BrowserWindow, ipcMain, dialog, Menu, MenuItem, nativeTheme, globalShortcut } = require('electron')
const path = require('node:path')

let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'script/preload.js')
    },
    icon: path.join(__dirname,'../public/logo.png')
  })
  win.webContents.openDevTools()
  win.loadFile('src/index.html')
}

function createMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: '菜单',
      submenu: [
        {
          click: () => win.webContents.send('update-counter', 'Increment'),
          label: 'Increment'
        },
        {
          click: () => win.webContents.send('update-counter', 'Decrement'),
          label: 'Decrement'
        }
      ]
    }
  ])
  menu.append(new MenuItem({
    label: 'Electron',
    submenu: [{
      role: 'help',
      // 监听快捷键，需要应用获取焦点
      accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
      click: () => { console.log('Electron rocks!') }
    }]
  }))
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  createMenu()
  ipcMain.on('set-title', setTitleHandler)
  ipcMain.handle('dialog:openFile', openFileHandler)
  ipcMain.on('port', portHandler)
  ipcMain.on('change-theme', changeThemeHandler)
  // 全局快捷键监听，无需获取焦点
  globalShortcut.register('Alt+CommandOrControl+J', () => {
    console.log('Electron loves global shortcuts!')
  })
})

function setTitleHandler(event, newTitle) {
  win.setTitle(newTitle)
}

async function openFileHandler() {
  const { filePaths } = await dialog.showOpenDialog()
  return filePaths[0]
}

function portHandler(event) {
  const port = event.ports[0]
  port.on('message',(e) => {
    const data = e.data
    console.log(data)
  })
  port.start()
}

function changeThemeHandler() {
  if (nativeTheme.themeSource === 'dark') {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
}
