export function createTabContextMenu(tabId) {
  chrome.contextMenus.create({
    id: 'go-to-tab',
    title: 'Go to tab',
    onclick: () => goToTab(tabId)
  })
}

function goToTab(tabId) {
  chrome.tabs.update(tabId, { active: true })
}
