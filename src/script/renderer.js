const information = document.getElementById('info')
information.innerText =
  `本应用正在使用 Chrome (v${window.versions.chrome()}),
  Node.js (v${window.versions.node()}),
  和 Electron (v${window.versions.electron()})`

const button = document.getElementById('button')
button.addEventListener('click', () => {
  const input = document.getElementsByTagName('input')[0]
  const newTitle = input.value
  window.setTitle(newTitle)
})
