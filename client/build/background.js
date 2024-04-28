function myFunction() {
    chrome.windows.create({
      url: chrome.runtime.getURL("index.html"),
      type: "panel",
      width: 600, // Specify the width you desire
      height: 600 // Specify the height you desire
    });
  }
  
  chrome.action.onClicked.addListener(myFunction);