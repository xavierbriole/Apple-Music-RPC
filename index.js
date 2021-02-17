const { app, BrowserWindow } = require('electron');
const client = require("discord-rich-presence")('749704287176622170');

const iTunes = require("./libs/iTunesBridge/iTunesBridge");
const iTunesApp = new iTunes();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let startDate = new Date();

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 150,
    webPreferences: {
      nodeIntegration: true
    },
    autoHideMenuBar: true
  })

  // and load the index.html of the app.
  // Open the DevTools.
  //win.webContents.openDevTools()
  setTimeout(loadUrl, 1000);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

app.on('certificate-error', function(event, webContents, url, error,
  certificate, callback) {
      event.preventDefault();
      callback(true);
});

function loadUrl() {
  win.loadURL(`file://${__dirname}/index.html`);

  setInterval(updatePresence, 1000);
}

function updatePresence() {
  const currentSong = iTunesApp.getCurrentSong();

  client.updatePresence({
    largeImageKey: 'music',
    details: currentSong.name,
    state: currentSong.artist,
    startTimestamp: startDate.getTime(),
    instance: true,
  });
}
