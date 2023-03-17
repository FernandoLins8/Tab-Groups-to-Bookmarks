export function createSavedTabContextMenu(tabBookmarkId) {
  chrome.contextMenus.create({
    id: 'open-saved-tab',
    title: 'Open Tab',
    onclick: () => openSavedTab(tabBookmarkId)
  })
}

async function openSavedTab(tabBookmarkId) {
  const tabBookmarkSearchResult = await chrome.bookmarks.get(tabBookmarkId)
  const tabBookmark = tabBookmarkSearchResult[0]
  chrome.tabs.create({
    url: tabBookmark.url,
    active: false
  })
}
