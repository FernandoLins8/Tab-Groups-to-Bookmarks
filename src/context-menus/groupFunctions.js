import { renderGroups, renderTabs } from '../index.js'

export async function toggleGroupCollapse(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  await chrome.tabGroups.update(groupId, {
    collapsed: !group.collapsed
  })
}

export async function saveGroupInStorage(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  const groupTabs = await chrome.tabs.query({
    groupId
  })
  const serializedGroupTabs = groupTabs.map(tab => { return { title: tab.title, url: tab.url } })

  try {
    await chrome.storage.local.set({
      [groupId]: JSON.stringify([serializedGroupTabs].sort((a, b) => a.title - b.title))
    })
    alert('Group saved in storage')
  } catch(err) {
    alert('Error saving group')
  }
}

export async function removeOpenGroupFromStorage(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  
  try {
    await chrome.storage.local.remove(group.title)
    alert('Group removed from storage')
  } catch(err) {
    alert('Error deleting group from storage')
  }
}

export async function saveGroupAsBookmarkFolder(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  const groupTabs = await chrome.tabs.query({
    groupId
  })
  
  try {
    await chrome.bookmarks.create({
      parentId: '1', // Bookmark Bar Id
      title: group.title
    }, (folder) => {
      groupTabs.forEach(async tab => {
        await chrome.bookmarks.create({
          parentId: folder.id,
          title: tab.title,
          url: tab.url,
        })
      })
    })
  } catch(err) {
    alert('Error creating bookmark')
  }
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
    filename: `${group.title}.text`
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
  renderTabs(groupId)
}

export async function closeGroup(groupId) {
  const groupTabs = await chrome.tabs.query({
    groupId
  })
  const tabIds = groupTabs.map(tab => tab.id)
  await chrome.tabs.remove(tabIds)

  // Refresh the list of groups and tabs
  renderGroups()
  renderTabs(groupId)
}