// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const {mainMenu}                                  = require('./src/menu.js')
const path                                        = require('path')
const Config                                      = require("./src/config");

try {
  require('electron-reloader')(module);
} catch {}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'src/img/icons/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  Menu.setApplicationMenu(mainMenu)

  ipcMain.handle('dialog', (event, method, params) => dialog[method](params))
  ipcMain.handle('setTitle', (event, params) => mainWindow.setTitle(params))
  ipcMain.handle('config', (event, method, params) => Config[method](...params))

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  if (process.env.APP_DEV !== undefined) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
