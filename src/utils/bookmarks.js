export async function findOrCreateRootFolder() {
  const groupsSavedFolderName = 'Tab Groups'
  
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
  const groupsSavedRootFolder = await findOrCreateRootFolder()
  const groupsSavedRootFolderChildren = await chrome.bookmarks.getChildren(groupsSavedRootFolder.id)

  let searchResults = groupsSavedRootFolderChildren.filter(bookmark => bookmark.title === bookmarkTitle)
  searchResults = searchResults.filter(result => result.url === undefined) // filter non folder bookmarks

  let folder
  // Folder does not exist yet, lets create it
  if(searchResults.length === 0) {
    folder = await chrome.bookmarks.create({
      parentId: groupsSavedRootFolder.id,
      title: bookmarkTitle,
    })
  } else {
    // Folder exists
    folder = searchResults[0]
  }

  return folder
}
