import { renderGroups, renderTabs } from '../index.js'

export async function toggleGroupCollapse(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  await chrome.tabGroups.update(groupId, {
    collapsed: !group.collapsed
  })
}

// TODO:
// Refactor me plz :(
export async function saveGroupAsBookmarkFolder(groupId) {
  const group = await chrome.tabGroups.get(groupId)
  const groupTabs = await chrome.tabs.query({
    groupId
  })

  const groupsSavedFolderName = 'Groups (Tab Groups Saved Extension)'
  try {
    await chrome.bookmarks.search({
      title: groupsSavedFolderName
    }, async (resultList) => {
      if(resultList.length > 0) {
        // Default folder for groups already exist
        console.log(resultList)
        await chrome.bookmarks.create({
          parentId: resultList[0].id,
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
      } else {
        // Default folder does not exist yet, lets create it
        await chrome.bookmarks.create({
          parentId: '1',
          index: 0,
          title: groupsSavedFolderName
        }, async (defaultGroupFolder) => {
          await chrome.bookmarks.create({
            parentId: defaultGroupFolder.id,
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
        })
      }
    })
    alert('Group Saved as Bookmark')
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