import axios from 'axios'
const { autoUpdater } = require('electron-updater')
const uploadUrl = 'http://localhost:4567/public/latest.yml' // 安装包latest.yml所在服务器地址
const feedUrl = 'http://localhost:4567/public/' // 安装包latest.yml所在服务器地址
const { ipcMain, dialog } = require('electron') // ipcMain 主线程
let mainWindow = null;
autoUpdater.autoDownload = false;
let updateMessage
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
export const updateHandle = (mainWindow) => {
  console.log('isUpdateAva?')
  let message = {
    error: { status: -1, msg: '检测更新查询异常' },
    checking: { status: 0, msg: '正在检查更新...' },
    updateAva: { status: 1, msg: '检测到新版本' },
    updateNotAva: { status: 2, msg: '您现在使用的版本为最新版本,无需更新!' },
  }
  // 设置更新包地址
  autoUpdater.setFeedURL(feedUrl)

  //在下载之前将autoUpdater的autoDownload属性设置成false，通过渲染进程触发主进程事件来实现这一设置
  autoUpdater.autoDownload = false;

  // 检测更新查询异常
  autoUpdater.on('error',() => {
    sendUpdateMessage(mainWindow, message.error)
  })
// 监听开始检测检查更新事件
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(mainWindow, message.checking)
  })

  // 监听发现可用更新版本
  autoUpdater.on('update-available',(info) => {
    axios.get(uploadUrl).then(res=>{
      let data = JSON.parse(toJson(res.data))
      updateMessage = '发现新版本' + data.version
      updateMessage = updateMessage + '\n是否立马自动更新？' + data.releaseNotes?data.releaseNotes:''
      let selectIndex = dialog.showMessageBoxSync({
        type: 'info',
        title: '发现新版本',
        buttons: ['Yes', 'No'],
        message: updateMessage,
      })
      if (selectIndex === 0) {
        // 选择了更新
        sendUpdateMessage({
          cmd: 'update-update',
          message: null
        })
        autoUpdater.downloadUpdate();
      }
    })
    mainWindow.webContents.send('isUpdateNow', info)
    sendUpdateMessage(mainWindow, message.updateAva)

  })

  // 当发现版本为最新版本触发
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(mainWindow, message.updateNotAva)
  })
  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  // 包下载成功时触发
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    autoUpdater.quitAndInstall() // 包下载完成后，重启当前的应用并且安装更新
  })

  // 收到renderer进程确认更新
  ipcMain.on('updateNow', (e, arg) => {
    console.log('开始更新')
    autoUpdater.downloadUpdate();
  })

  ipcMain.on('checkForUpdate', () => {
    // 收到renderer进程的检查通知后，开始检查更新
    autoUpdater.checkForUpdates()
  })

}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(mainWindow, text) {
  mainWindow.webContents.send('message', text)
}
