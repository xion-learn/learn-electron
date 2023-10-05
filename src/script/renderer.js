const information = document.getElementById('info')
information.innerText =
  `本应用正在使用 Chrome (v${window.versions.chrome()}),Node.js (v${window.versions.node()}),和 Electron (v${window.versions.electron()})`

// 通信：渲染器进程 => 主进程
const button = document.getElementById('button')
button.addEventListener('click', () => {
  const input = document.getElementsByTagName('input')[0]
  const newTitle = input.value
  window.setTitle(newTitle)
})

// 通信：渲染器进程 <=> 主进程
const openFileButton = document.getElementById('openFile')
const pathSpan = document.getElementById('path')
openFileButton.addEventListener('click', async () => {
  const path = await window.openFile()
  console.log('path', path)
  pathSpan.innerText = path
})

// 通信：主进程 => 渲染器进程
const selectedValueSpan = document.getElementById('selectedValue')
window.listenUpdateCount((event, value) => {
  selectedValueSpan.innerText = value
})

// 实践：切换主题
const changeThemeButton = document.getElementById('changeTheme')
changeThemeButton.addEventListener('click', () => {
  window.changeTheme()
})
