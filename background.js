// port communication
let portToBackground;

// Create a context menu item on installation
browser.runtime.onInstalled.addListener(function() {
    browser.menus.create({
        id: "manga2text",
        title: "Translate",
        contexts: ["image"]
    });
})

function connectToTab(info, tabs) {
  if (tabs.length > 0) {
    console.log("Sending : ", info.srcUrl, " to ", tabs[0].title)
    let examplePort = browser.tabs.sendMessage(tabs[0].id, {srcUrl: info.srcUrl });
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}

// Add click event listener to the entire document
browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "manga2text") {
        console.log("manga2text")
        let activeTab = browser.tabs.query({
            currentWindow: true,
            active: true,
        }).then(tabs => connectToTab(info, tabs))
        .catch(onError)
    }
})

