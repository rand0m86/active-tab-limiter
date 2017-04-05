function saveOptions() {
    const fifo = Boolean(document.getElementById('fifo').value);
    const maxTabsPerWindow = Number(document.getElementById('maxTabsPerWindow').value) || 3;
    const ignorePinnedTabs = Boolean(document.getElementById('ignorePinnedTabs').checked);

    chrome.storage.sync.set({ config: {
        fifo: fifo,
        maxTabsPerWindow: maxTabsPerWindow,
        ignorePinnedTabs: ignorePinnedTabs
    }}, () => {
        const statusNode = document.getElementById('status');
        statusNode.textContent = 'Options saved';
        setTimeout(() => statusNode.textContent = '', 1000);
    });
}

function restoreSettings() {
    chrome.storage.sync.get('config', wrapper => {
        const config = wrapper.config;
        document.getElementById('fifo').value = config.fifo;
        document.getElementById('maxTabsPerWindow').value = config.maxTabsPerWindow;
        document.getElementById('ignorePinnedTabs').checked = config.ignorePinnedTabs;
    });
}

document.addEventListener('DOMContentLoaded', restoreSettings);
document.getElementById('save').addEventListener('click', saveOptions);
