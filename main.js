/*
    This is the JS entry point file for the application.
    It handles the Node.js and server-side parts of the app,
    such as creation of app windows, and file system actions.
*/

// get required modules from electron
const { app, BrowserWindow, ipcMain } = require('electron');

// get Node.js modules used in app
const fs = require('fs');

// global window object
let window;

function createWindow() {
    // window options
    const windowWidth = 400;
    const windowHeight = 700;

    let windowOptions = {
        width: windowWidth,
        height: windowHeight,
        minWidth: windowWidth,
        minHeight: windowHeight,
        maxWidth: windowWidth,
        maxHeight: windowHeight,
        webPreferences: {
            nodeIntegration: true
        }
    };

    // macOS has an inset titlebar
    if (process.platform === 'darwin') {
        windowOptions.titleBarStyle = 'hiddenInset';
    }

    // create window with options
    window = new BrowserWindow(windowOptions);

    // load main HTML file into window with platform info
    window.loadFile('./public/beta_version.html');
}

// create window
app.on('ready', createWindow);

// quit when all windows are closed
app.on('window-all-closed', () => {
    // on macOS apps stay open until quit in menu-bar or w/Cmd+Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// on macOS re-create app window when app icon is clicked
app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});

/* app module for communicating with frontend, APIs, etc. */
require('./app/app');
