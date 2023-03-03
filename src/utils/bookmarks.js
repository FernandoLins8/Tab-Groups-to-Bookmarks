export async function findOrCreateSavedGroupsBookmarkFolder() {
  const groupsSavedFolderName = 'Groups (Tab Groups Saver)'
  
  let searchResults = await chrome.bookmarks.search({
    title: groupsSavedFolderName  
  })
  searchResults = searchResults.filter(result => result.url === undefined) // filter non folder bookmarks

  let groupsSavedBookmarkFolder
  
  if(searchResults.length === 0) {
    groupsSavedBookmarkFolder = await chrome.bookmarks.create({
      parentId: '1',
      index: 0,
      title: groupsSavedFolderName
    })
  } else {
    // Default folder exists
    groupsSavedBookmarkFolder = searchResults[0]
  }
  
  return groupsSavedBookmarkFolder
}

export async function findOrCreateBookmarkFolder(bookmarkTitle) {
  const groupsSavedBookmarkFolder = await findOrCreateSavedGroupsBookmarkFolder()
  const groupsSavedBookmarkFolderChildren = await chrome.bookmarks.getChildren(groupsSavedBookmarkFolder.id)

  let searchResults = groupsSavedBookmarkFolderChildren.filter(bookmark => bookmark.title === bookmarkTitle)
  searchResults = searchResults.filter(result => result.url === undefined) // filter non folder bookmarks

  let folder
  // Folder does not exist yet, lets create it
  if(searchResults.length === 0) {
    folder = await chrome.bookmarks.create({
      parentId: groupsSavedBookmarkFolder.id,
      title: bookmarkTitle,
    })
  } else {
    // Folder exists
    folder = searchResults[0]
  }

  return folder
}
