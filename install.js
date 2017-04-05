const defaultConfig = {
    maxTabsPerWindow: 3,
    fifo: false,
    ignorePinnedTabs: true
};

chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason = 'install') {
        chrome.storage.sync.set({ config: defaultConfig });
    }
});
