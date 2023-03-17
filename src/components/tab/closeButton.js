import { renderGroups, renderSavedGroups, renderTabs, renderTabsFromSavedGroup } from "../../index.js"

const renderFunctions = {
  tab: { renderTabsFn: renderTabs, renderGroupsFn: renderGroups },
  bookmark: { renderTabsFn: renderTabsFromSavedGroup, renderGroupsFn: renderSavedGroups }
}

export function createCloseButton(tabId, groupId, itemType = 'tab') {
  const closeButton = document.createElement('button')
  closeButton.setAttribute('title', itemType === 'tab' ? 'Close Tab' : 'Delete Tab Bookmark')
  closeButton.innerHTML = 'X'

  closeButton.addEventListener('click', async () => {
    // Searching for a groupId that does not exist throws an error
    // so we need to get this before deleting
    const remainingItemsBeforeDelete = itemType === 'tab'
      ? await chrome.tabs.query({ groupId })
      : await chrome.bookmarks.getChildren(groupId)
    
    if (itemType === 'tab') {
      await chrome.tabs.remove(tabId)
    } else if (itemType === 'bookmark') {
      await chrome.bookmarks.remove(tabId)
    }

    const { renderTabsFn, renderGroupsFn } = renderFunctions[itemType]

    if(remainingItemsBeforeDelete.length === 1) {
      if(itemType === 'tab') {
        // Since a group is deleted automatically if all tabs are removed
        // we should call the renderTabFn without group ids
        renderTabsFn()
        renderGroupsFn()
        return
      } else if(itemType == 'bookmark') {
        // Different from groups, a bookmark folder is not deleted if empty
        // so we need to remove it manually
        await chrome.bookmarks.remove(groupId)
        renderTabsFn(null, null)
        renderGroupsFn()
        return
      }
    }

    renderGroupsFn()
    renderTabsFn(groupId, null)
  })

  return closeButton
}
