/**
 * Electron
 * main.js
 * electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional]
 * electron-builder
 * https://qiita.com/zaburo/items/828051fc7dabb258f0de
 * 
 *  electron-builder --windows nsis:ia32 
 * electron-builder 
 *  electron-builder build --windows portable:x64
 */

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});