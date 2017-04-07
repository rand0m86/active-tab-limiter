const tabsApi = chrome.tabs;
const storageApi = chrome.storage;

const ActiveTabLimiter = ((tabsApi, storageApi) => {
    const promiseOf = fn => new Promise(fn);

    const getSettings = storageApi => {
        return promiseOf((resolve) => {
                storageApi.sync.get('config', resolve)
        }).then(data => data.config);
    }

    const closeSpecifiedTabs = (tabsApi, tabs) => {
        const tabIds = tabs.map(tab => tab.id);
        tabsApi.remove(tabIds);
    };

    const tabIdIsPresent = tabsApi => tab =>
                tab.id && tabsApi.TAB_ID_NONE !== tab.id;

    const getTabsForWindow = (tabsApi, windowId) =>
                promiseOf((resolve) =>
                    tabsApi.query({ windowId: windowId }, resolve));

    const filterByPinnedFlag = ignorePinnedTabs => tab =>
                ignorePinnedTabs ? !tab.pinned : true;

    const sortByTabAddedOrder = ascending => (firstTab, secondTab) =>
                ascending ? firstTab.id < secondTab.id : firstTab.id > secondTab.id;

    async function onTabAdded(tabInfo) {
        const settings = await getSettings(storageApi);
        const tabs = await getTabsForWindow(tabsApi, tabInfo.windowId);
        const filteredTabs = tabs.filter(tabIdIsPresent(tabsApi))
                    .filter(filterByPinnedFlag(settings.ignorePinnedTabs))
                    .sort(sortByTabAddedOrder(settings.fifo));

        closeSpecifiedTabs(tabsApi, filteredTabs.slice(settings.maxTabsPerWindow));
    }

    return {
        handleNewTab: onTabAdded
    };
})(tabsApi, storageApi);

tabsApi.onCreated.addListener(ActiveTabLimiter.handleNewTab);
tabsApi.onAttached.addListener(ActiveTabLimiter.handleNewTab);

