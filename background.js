const config = {
    maxTabsPerWindow: 11,
    fifo: false,
    ignorePinnedTabs: true,
    ignoredOrigins: []
};


const ActiveTabLimiter = (function() {
    function onTabAdded(tabInfo) {
        chrome.tabs.query({ windowId: tabInfo.windowId }, tabs => {
            const tabsByConfigCriterias = tabs.filter(tab => !!tab.id && chrome.tabs.TAB_ID_NONE !== tab.id)
                .filter(tab => config.ignorePinnedTabs ? !tab.pinned : true)
                .filter(tab => config.ignoredOrigins.find(origin => (tab.url || '').indexOf(origin) === 0)? false : true)
                .sort((t1, t2) => config.fifo ? t1.id < t2.id : t1.id > t2.id);

            closeSpecifiedTabs(tabsByConfigCriterias.slice(config.maxTabsPerWindow - 1));
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

