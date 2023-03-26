import { renderGroups, renderTabs } from '../../index.js'
import { saveTabsAsBookmarks } from '../../utils/tabs.js'

export async function toggleGroupCollapse(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  await chrome.tabGroups.update(groupId, {
    collapsed: !group.collapsed
  })
}

export async function saveGroupAsBookmarkFolder(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  const groupTabs = await chrome.tabs.query({
    groupId
  })

  saveTabsAsBookmarks(groupTabs, group.title)
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

export async function downloadGroupTabsUrls(groupId) {
  const tabs = await chrome.tabs.query({
    groupId
  })

  const textToDownload = tabs.map(tab => tab.url)
    .filter(url => !url.includes('chrome://'))
    .join('\n')
  
  const textBlob = new Blob([textToDownload], {type: 'text/plain'})
  const url = URL.createObjectURL(textBlob)
  
  const group = await chrome.tabGroups.get(groupId)
  await chrome.downloads.download({
    url,
    filename: `${group.title ? group.title : 'tab-group'}.txt`
  })
}

export async function ungroupAllTabsFromGroup(groupId) {
  const groupTabs = await chrome.tabs.query({
    groupId
  })
  const tabIds = groupTabs.map(tab => tab.id)
  await chrome.tabs.ungroup(tabIds)

  // Refresh the list of groups and tabs
  renderGroups()
  renderTabs()
}

export async function closeGroup(groupId) {
  const groupTabs = await chrome.tabs.query({
    groupId
  })
  const tabIds = groupTabs.map(tab => tab.id)
  await chrome.tabs.remove(tabIds)

  // Refresh the list of groups and tabs
  renderGroups()
  renderTabs()
}
