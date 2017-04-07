const defaultConfig = {
    maxTabsPerWindow: 3,
    fifo: true,
    ignorePinnedTabs: true
};

chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason = 'install') {
        chrome.storage.sync.set({ config: defaultConfig });
    }
});
