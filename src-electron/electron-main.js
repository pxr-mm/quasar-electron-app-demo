import { app, BrowserWindow, nativeTheme, ipcMain, Tray, Menu } from "electron";
import path from "path";
import { updateHandle } from "./update"; //引入更新检测
try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;
let tray;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    useContentSize: true,
    frame: false, //窗口视图菜单
    webPreferences: {
      contextIsolation: false, //傻逼配置
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      nodeIntegration: true,
    },
    // webPreferences: {
    //   contextIsolation: true,
    //   // More info: /quasar-cli/developing-electron-apps/electron-preload-script
    //   preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    // }
    icon: path.join(__dirname, "icon.ico"),
  });
  // createTray()

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  // updateHandle(mainWindow);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  // 监听窗口状态,最大,不是最大
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window_state", true);
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window_state", false);
  });
}

// 托盘
function createTray() {
  tray = new Tray(path.join(__dirname, "icon.ico"));
  // tray = new Tray(path.join(__dirname,"/icon.ico"));

  let menu = Menu.buildFromTemplate([
    {
      label: "显示/隐藏",
      click: () =>
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show(),
    },
    {
      label: "退出",
      click: () => {
        app.quit();
        mainWindow.destroy();
      },
    },
  ]);
  // 把菜单挂到托盘
  tray.setContextMenu(menu);
  tray.on("click", () =>
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  );
  // 托盘气球通知
  tray.displayBalloon({
    icon: path.join(__dirname, "10.jpg"),
    title: "僵尸助手程序已启动",
    content: "快来使用吧",
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
// 窗口最小化
ipcMain.on("window-min", () => {
  mainWindow.minimize();
  // 回应渲染进程--页面
  // event.reply('asynchronous-reply', 'pong')
});
// 退出最大化
ipcMain.on("window-unmax", () => {
  mainWindow.unmaximize();
});
ipcMain.on("window-max", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on("window-close", () => {
  mainWindow.destroy();
  // mainWindow.hide()
});
