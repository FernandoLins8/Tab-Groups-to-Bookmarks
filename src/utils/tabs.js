import { findOrCreateBookmarkFolder } from "./bookmarks.js"

export async function saveTabsAsBookmarks(tabsArray, folderTitle) {
  try {
    const groupBookmark = await findOrCreateBookmarkFolder(folderTitle)
    const folderPreviousTabs = await chrome.bookmarks.getChildren(groupBookmark.id)
    const folderPreviousURLs = folderPreviousTabs.map(tab => tab.url)
  
    await Promise.all(
      tabsArray.map((tab) => {
        if(!folderPreviousURLs.includes(tab.url)) {
          return chrome.bookmarks.create({
            parentId: groupBookmark.id,
            title: tab.title,
            url: tab.url,
          })
        }
      })
    )
    alert('Group Saved as Bookmark')
  } catch(err) {
    alert('Error creating bookmark')
  }  
}

export async function syncTabsFromGroup(groupId, groupFolder) {
  let addedNewTabs = false
  let removedOldTabs = false

  const currentUnsavedGroupTabs = await chrome.tabs.query({
    groupId
  })
  
  try {
    const folderPreviousTabs = await chrome.bookmarks.getChildren(groupFolder.id)

    await Promise.all(
      currentUnsavedGroupTabs.map(tab => {
        return chrome.bookmarks.create({
          parentId: groupFolder.id,
          title: tab.title,
          url: tab.url,
        })
      })
    )
    addedNewTabs = true

    await Promise.all(
      folderPreviousTabs.map(tab => {
        return chrome.bookmarks.remove(tab.id)
      })
    )
    removedOldTabs = true
    alert('Saved Group Synchronized')
  } catch(err) {
    let message = !removedOldTabs ? 'error removing old tabs.' : ''
    message = !addedNewTabs ? 'error adding new tabs' : message

    alert(`Error Synchronizing Bookmark: ${message}`)
  }
}