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
