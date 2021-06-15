import axios from 'axios'
import {
  autoUpdater
} from 'electron-updater'
import jsyaml from 'js-yaml'
import {
  ipcMain, dialog
} from 'electron'
let mainWindow = null;
autoUpdater.autoDownload = false;
const release = 'http://localhost:4567/public/latest.yml';
const feedUrl = 'http://localhost:4567/public/' // 安装包latest.yml所在服务器地址
// const release = 'https://cdn.xksoft.com/botclient/latest.yml';
// const feedUrl = 'https://cdn.xksoft.com/botclient/' // 安装包latest.yml所在服务器地址

let updateMessage

export function updateHandle(window) {
  mainWindow = window;
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  //设置更新包的地址
  autoUpdater.setFeedURL(feedUrl);
  //监听升级失败事件
  autoUpdater.on('error', function (error) {
    sendUpdateMessage({
      cmd: 'error',
      message: error
    })
  });
  //监听开始检测更新事件
  autoUpdater.on('checking-for-update', function (message) {
    sendUpdateMessage({
      cmd: 'checking-for-update',
      message: message
    })
  });
  //监听发现可用更新事件
  autoUpdater.on('update-available', function (message) {
    axios.get(release).then(res=>{
      let data = JSON.parse(toJson(res.data))
      console.log('发现可用更新',res.data)
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
    sendUpdateMessage({
      cmd: 'update-available',
      message: message
    })
  });
  //监听没有可用更新事件
  autoUpdater.on('update-not-available', function (message) {
    sendUpdateMessage({
      cmd: 'update-not-available',
      message: message
    })
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    sendUpdateMessage({
      cmd: 'download-progress',
      message: progressObj
    })
  });
  //监听下载完成事件
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
    sendUpdateMessage({
      cmd: 'update-downloaded',
      message: {
        releaseNotes,
        releaseName,
        releaseDate,
        updateUrl
      }
    })
    //退出并安装更新包
    autoUpdater.quitAndInstall();
  });

  //接收渲染进程消息，开始检查更新
  ipcMain.on("checkForUpdate", (e, arg) => {
    //执行自动更新检查
    // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
    autoUpdater.checkForUpdates();
  })
}
const toJson = function (yaml) {
  if (yaml) {
    try {
      let json = JSON.stringify(jsyaml.load(yaml), null, 2)
      return json
    } catch (e) {
      console.log(e)
    }
  }
}
//给渲染进程发送消息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}
