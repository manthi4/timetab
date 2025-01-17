function createNewTab() {
  chrome.tabs.create({
    'url': 'chrome://newtab'
  });
}

chrome.browserAction.onClicked.addListener(createNewTab);

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    'clocks': [{
      'timeZone': 'Local',
      'label': 'Local'
    }],
    'settings': {
      'hour24': false,
      'labels': true,
      'customColor': '30, 30, 30',
      'customOpacity': '.05'
    },
  });

  chrome.storage.local.set({
    'scheme': 'light'
  });

  createNewTab();
});