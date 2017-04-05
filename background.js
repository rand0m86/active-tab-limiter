const ActiveTabLimiter = (function() {
    function onTabAdded(tabInfo) {
        chrome.storage.sync.get('config', config => {
            const settings = config.config;
            chrome.tabs.query({ windowId: tabInfo.windowId }, tabs => {
                const tabsByConfigCriterias = tabs.filter(tab => !!tab.id && chrome.tabs.TAB_ID_NONE !== tab.id)
                    .filter(tab => settings.ignorePinnedTabs ? !tab.pinned : true)
                    .sort((t1, t2) => settings.fifo ? t1.id < t2.id : t1.id > t2.id);

                closeSpecifiedTabs(tabsByConfigCriterias.slice(settings.maxTabsPerWindow));
            });
        });
    }

    function closeSpecifiedTabs(tabs) {
        const tabIds = tabs.map(tab => tab.id);
        chrome.tabs.remove(tabIds);
    }

    return {
        handleNewTab: onTabAdded
    };
}());

chrome.tabs.onCreated.addListener(ActiveTabLimiter.handleNewTab);
chrome.tabs.onAttached.addListener(ActiveTabLimiter.handleNewTab);

