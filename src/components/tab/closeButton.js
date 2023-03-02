import { renderGroups, renderSavedGroups, renderTabs, renderTabsFromSavedGroup } from "../../index.js"

const renderFunctions = {
  tab: { renderTabsFn: renderTabs, renderGroupsFn: renderGroups },
  bookmark: { renderTabsFn: renderTabsFromSavedGroup, renderGroupsFn: renderSavedGroups }
}

export function createCloseButton(tabId, groupId, itemType = 'tab') {
  const closeButton = document.createElement('button')
  closeButton.setAttribute('title', `Close ${itemType}`)
  closeButton.innerHTML = 'X'

  closeButton.addEventListener('click', async () => {
    if (itemType === 'tab') {
      await chrome.tabs.remove(tabId)
    } else if (itemType === 'bookmark') {
      await chrome.bookmarks.remove(tabId)
    }

    const remainingItems = itemType === 'tab'
      ? await chrome.tabs.query({ groupId })
      : await chrome.bookmarks.getChildren(groupId)

    const { renderTabsFn, renderGroupsFn } = renderFunctions[itemType]

    renderTabsFn(groupId, null)
    renderGroupsFn()
    
    // Delete bookmark folder if all urls were deleted
    // The check is not needed for tabs since they're automatically deleted
    if (remainingItems.length === 0 && itemType == 'bookmark') {
      await chrome.bookmarks.remove(groupId)
    }
  })

  return closeButton
}
