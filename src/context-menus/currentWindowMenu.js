import { renderGroups, renderTabs } from "../index.js"
import { getCurrentDateTimeString } from "../utils/datetime.js"
import { saveTabsAsBookmarks } from "../utils/tabs.js"

export function createCurrentWindowContextMenu() {
  chrome.contextMenus.create({
    id: 'ungrouped-from-this-window',
    title: 'Ungrouped tabs (window)'
  })
  
  chrome.contextMenus.create({
    id: 'group-all-tabs',
    title: 'New group',
    parentId: 'ungrouped-from-this-window',
    onclick: GroupAllUngroupedTabs
  })

  chrome.contextMenus.create({
    id: 'save-ungrouped-tabs',
    title: 'Save',
    parentId: 'ungrouped-from-this-window',
    onclick: saveUngroupedTabsAsBookmarkFolder
  })
}

async function GroupAllUngroupedTabs() {
  const ungroupedTabs = await chrome.tabs.query({
    currentWindow: true,
    groupId: -1
  })

  const ungroupedTabsIds = ungroupedTabs.map(tab => tab.id)

  await chrome.tabs.group({
    tabIds: ungroupedTabsIds
  }, async (groupId) => {
    await chrome.tabGroups.update(groupId, {
      title: getCurrentDateTimeString()
    })

    renderTabs()
    renderGroups()
  })
}

export async function saveUngroupedTabsAsBookmarkFolder() {
  const ungroupedTabs = await chrome.tabs.query({
    currentWindow: true,
    groupId: -1
  })
  saveTabsAsBookmarks(ungroupedTabs, getCurrentDateTimeString())
}
