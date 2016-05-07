'use strict';

const electron = require('electron');
const path = require('path');
const five = require("johnny-five");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let button;
let led;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 720, height: 1283});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + path.resolve(__dirname, '../renderer/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', () => {
    five.Board({ repl: false }).on("ready", function() {
      button = new five.Button({
        pin: 2,
        isPullup: true
      });

      led = new five.Led(13);

      button.on("press", function(value) {
        console.log('pressed')
        mainWindow.webContents.send('buttonClick');
      });

      button.on("down", function(value) {
        led.on();
      });

      button.on("up", function() {
        led.off();
      });
    });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  console.log('quitting')
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
