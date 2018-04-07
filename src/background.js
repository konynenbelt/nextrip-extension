chrome.extension.onConnect.addListener(port => {
  console.log("Connected to extension");
  
  chrome.storage.sync.get(['key'], function(result) {
    port.postMessage(result.key);
  });
  
  port.onMessage.addListener(message => {
    chrome.storage.sync.set({key: message});
  });
});