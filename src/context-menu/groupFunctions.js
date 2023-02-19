import { getAllGroupsFromCurrentWindow, getUngroupedTabsFromCurrentWindow } from '../index.js'

export async function toggleGroupCollapse(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  await chrome.tabGroups.update(groupId, {
    collapsed: !group.collapsed
  })
}

export async function copyGroupURLs(groupId) {
  const tabs = await chrome.tabs.query({
    groupId
  })

  const tabsUrls = tabs.map(tab => tab.url)
    .filter(url => !url.includes('chrome://'))
  const textToCopy = tabsUrls.join('\n')

  try {
    await navigator.clipboard.writeText(textToCopy)
    alert(`Copied ${tabsUrls.length} urls to clipboard.`)
  } catch(err) {
    alert('Error copying urls.')
  }
}

export async function ungroupAllTabsFromGroup(groupId) {
  const tabs = await chrome.tabs.query({
    groupId
  })
  const tabIds = tabs.map(tab => tab.id)
  await chrome.tabs.ungroup(tabIds)

  getAllGroupsFromCurrentWindow()
  getUngroupedTabsFromCurrentWindow()
}