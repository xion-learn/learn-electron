const { app, Tray, nativeImage, BrowserWindow, ipcMain, dialog, Menu, MenuItem, nativeTheme, globalShortcut, Notification } = require('electron')
const path = require('node:path')

let win
let progressInterval

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

const gotTheLock = app.requestSingleInstanceLock()

// 如果窗口存在，则不打开新窗口，并focus原窗口
if (!gotTheLock) {
  app.quit()
} else {
  createJumpList()
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
  })

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
    setProtocolClient()
    openNotification()
    createProgress()
    createTray()
  })

  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  })

  app.on('before-quit', () => {
    clearInterval(progressInterval)
  })
}

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

function setProtocolClient() {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient('electron-fiddle')
  }
}

// 主进程中使用通知
function openNotification() {
  const NOTIFICATION_TITLE = 'Basic Notification'
  const NOTIFICATION_BODY = 'Notification from the Main process'

  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY
  }).show()
}

// 创建一个进度条，类似于Chrome下载
function createProgress() {
  const INCREMENT = 0.03
  const INTERVAL_DELAY = 100 // ms

  let c = 0
  progressInterval = setInterval(() => {
    win.setProgressBar(c)

    if (c < 2) {
      c += INCREMENT
    } else {
      c = (-INCREMENT * 5)
    }
  }, INTERVAL_DELAY)
}

function quitApplication() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

// 创建托盘，也就是右下角里的小图标
function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname,'../public/logo.png'))
  const tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' },
    { label: '退出', type: 'normal', click: quitApplication },
  ])
  tray.setContextMenu(contextMenu)
}

// 创建自定义任务栏，JumpList(其实是创建一个任务快捷键)
function createJumpList() {
  app.setUserTasks([
    {
      program: process.execPath,
      arguments: '--new-window',
      iconPath: process.execPath,
      iconIndex: 0,
      title: 'New Window',
      description: 'Create a new window'
    }
  ])
}
