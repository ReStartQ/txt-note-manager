/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs, { readFileSync } from "fs";
import open from "open";
import readline from "readline";
import { v4 as uuidv4 } from 'uuid';
//use trash when electron is able to use it or when electron react-boilerplate updates it
//import trash from 'trash';



export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;


ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));

  if(arg=="pong"){
    console.log("pong");
  }

});



ipcMain.on('getTextFiles', async (event, message:string)=>{
  const data = fs.readFileSync(message,{encoding:'utf8', flag:'r'});

  let stats: fs.Stats;
  let lastModifiedDate;
  try {
    stats = fs.statSync(message);
    // print file last modified date
    lastModifiedDate=stats.mtime;
    lastModifiedDate=lastModifiedDate.toLocaleString();
    console.log(`File Data Last Modified: ${stats.mtime}`);
    console.log(`File Status Last Modified: ${stats.ctime}`);
  } catch (error) {
      console.log(error);
  }

  console.log(data);
  event.reply('getTextFiles', [lastModifiedDate, data, message]);
});



ipcMain.on('saveTextFile', async (event, message:string[])=>{
  console.log(message[0]);
  console.log(message[1]);
  console.log(message[3]);
  let flag=true;
  let counter=1;
  let renameFlag = false;
  let myNewName;
  let fsDate;
  if(message[1]!=message[2]+'.txt'){ //check to see if they are the same and if not check what is available
    console.log('save: old file name does not match new file name');
    while(flag==true){
      if(counter==1){ 
        if(fs.existsSync(message[0]+message[2]+'.txt')&&message[1]!=message[2]+ ' ('  + counter + ')' + '.txt'){ //if new name exists, then don't make the change and increase counter
          counter++;
        }
        else{
          fs.renameSync(message[0]+message[1], message[0]+message[2]+'.txt');
          fs.writeFileSync(message[0]+message[2]+'.txt', message[3]);
          fsDate=fs.statSync(message[0]+message[2]+'.txt');
          myNewName=message[2] + '.txt';
          flag=false;
        }
      }
      else{
        if(fs.existsSync(message[0]+message[2]+ ' ('  + counter + ')' + '.txt')&&message[1]!=message[2]+ ' ('  + counter + ')' + '.txt'){ //if new name exists, then don't make the change and increase counter
          counter++;
        }
        else{
          fs.renameSync(message[0]+message[1], message[0]+message[2]+ ' ('  + counter + ')' + '.txt');
          fs.writeFileSync(message[0]+message[2]+ ' ('  + counter + ')' + '.txt', message[3]);
          myNewName=message[2] + ' ('  + counter + ')' + '.txt';
          fsDate=fs.statSync(message[0]+message[2]+ ' ('  + counter + ')' + '.txt');
          flag=false;
          renameFlag=true;
        }
      }
    }
  }
  else{ //if they are the same, then go ahead and make the change
    fs.renameSync(message[0]+message[1], message[0]+message[2]+'.txt');
    fs.writeFileSync(message[0]+message[2]+'.txt', message[3]);
    fsDate=fs.statSync(message[0]+message[2]+'.txt');
    myNewName=message[2] + '.txt';
  }
  //also dont forget to return date and time
  event.reply('saveTextFile', [message[0],message[1],message[2],message[3],renameFlag,myNewName, fsDate]);
});

ipcMain.on('deleteTextFile', async (event, message:string)=>{
  console.log(message);
  try {
    fs.unlinkSync(message);
    event.reply('deleteTextFile', message);
    //file removed
  } catch(err) {
    console.error(err);
  }
});


ipcMain.on('addTextFile', async (event, message:string)=>{
  let flag = true;
  let counter = 1;
  let lastIndex = message.lastIndexOf('\\')+1;
  console.log(lastIndex);
  let myFileName = message.substring(lastIndex, message.length+1); 
  console.log(myFileName);
  let myFileNameNew = myFileName.slice(0, 17) + ' (' + counter + ')' + myFileName.slice(17);
  console.log(myFileNameNew);
  while(flag===true){
    if (fs.existsSync(message)) {
      myFileNameNew = myFileName.slice(0, 17) + ' (' + counter + ')' + myFileName.slice(17);
      if(counter==1){
        message = message.slice(0,lastIndex) + myFileName;
      }
      else{
        message = message.slice(0,lastIndex) + myFileNameNew;
      }
      counter++;
      console.log(message);
    }
    else {
      if(counter==1){ 
        fs.writeFileSync((message.substring(0,lastIndex)+myFileName), '');
        let myStats=fs.statSync(message.substring(0,lastIndex)+myFileName);
        event.reply('addTextFile', [false,myFileName,myStats.mtime.toLocaleDateString(),myStats.mtime.toLocaleTimeString(),myStats.mtime]);
      }
      else{
        fs.writeFileSync((message.substring(0,lastIndex)+myFileNameNew), '');
        let myStats=fs.statSync(message.substring(0,lastIndex)+myFileNameNew);
        event.reply('addTextFile', [false,myFileNameNew,myStats.mtime.toLocaleDateString(),myStats.mtime.toLocaleTimeString(),myStats.mtime]);
      }
      flag=false;
    }
  }
});

ipcMain.on('update-notify-value', function (event, arg) {
  console.log("hey");
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
