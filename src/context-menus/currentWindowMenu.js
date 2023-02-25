import { renderGroups, renderTabs } from "../index.js"

export function createCurrentWindowContextMenu() {
  chrome.contextMenus.create({
    id: 'group-all-tabs',
    title: 'Add ungrouped tabs to new group',
    onclick: GroupAllUngroupedTabs
  })
}

export async function GroupAllUngroupedTabs() {
  const ungroupedTabs = await chrome.tabs.query({
    currentWindow: true,
    groupId: -1
  })

  const ungroupedTabsIds = ungroupedTabs.map(tab => tab.id)

  await chrome.tabs.group({
    tabIds: ungroupedTabsIds
  }, async (groupId) => {
    await chrome.tabGroups.update(groupId, {
      title: 'Previously ungrouped'
    })

    renderTabs()
    renderGroups()
  })
}