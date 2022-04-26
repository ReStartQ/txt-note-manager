const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    getTextFiles(message){
      ipcRenderer.send('getTextFiles', message);
    },
    saveTextFile(message){
      ipcRenderer.send('saveTextFile', message);
    },
    addTextFile(message){
      ipcRenderer.send('addTextFile', message);
    },
    updateTextFile(message){
      ipcRenderer.send('updateTextFile', message);
    },
    renameTextFile(message){
      ipcRenderer.send('renameTextFile', message);
    },
    deleteTextFile(message){
      ipcRenderer.send('deleteTextFile', message);
    },
    on(channel, func) {
      const validChannels = ['ipc-example', 'getTextFiles', 'saveTextFile','addTextFile','updateTextFile','openUpload','clickAdd','clickSave'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example','addTextFile','deleteTextFile','saveTextFile','openUpload','clickAdd','clickSave'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
