const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // 除函数之外，我们也可以暴露变量
})

contextBridge.exposeInMainWorld('setTitle', (newTitle) => {
  ipcRenderer.send('set-title', newTitle)
})

contextBridge.exposeInMainWorld('openFile', () => {
  return ipcRenderer.invoke('dialog:openFile')
})

contextBridge.exposeInMainWorld('listenUpdateCount', (callback) => {
  ipcRenderer.on('update-counter', callback)
})

const channel = new MessageChannel()
const port1 = channel.port1
const port2 = channel.port2
port2.postMessage('hello world')
ipcRenderer.postMessage('port', null, [port1])

contextBridge.exposeInMainWorld('changeTheme', () => {
  ipcRenderer.send('change-theme')
})
