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

export async function findSavedBookmarkFolderByName(groupFolderName) {
  const groupsSavedRootFolder = await findOrCreateRootFolder()
  const groupsSavedRootFolderChildren = await chrome.bookmarks.getChildren(groupsSavedRootFolder.id)

  let searchResults = groupsSavedRootFolderChildren.filter(bookmark => bookmark.title === groupFolderName)
  searchResults = searchResults.filter(result => result.url === undefined) // filter non folder bookmarks

  // Folder does not exist
  if(searchResults.length === 0) {
    return null
  }

  // Folder exists
  return searchResults[0]
}

export async function findOrCreateBookmarkFolder(bookmarkTitle) {
  const groupsSavedRootFolder = await findOrCreateRootFolder()

  let folder = await findSavedBookmarkFolderByName(bookmarkTitle)

  if(!folder) {
    folder = await chrome.bookmarks.create({
      parentId: groupsSavedRootFolder.id,
      title: bookmarkTitle,
    })
  }

  return folder
}

export async function deleteAllEmptySavedGroupFolders() {
  const rootFolder = await findOrCreateRootFolder()
  const savedGroupFolders = await chrome.bookmarks.getChildren(rootFolder.id)

  savedGroupFolders.forEach(async (savedGroup) => {
    // Check for folders
    if(savedGroup.url === undefined) {
      const savedGroupUrls = await chrome.bookmarks.getChildren(savedGroup.id)
      if(savedGroupUrls.length === 0) {
        chrome.bookmarks.remove(savedGroup.id)
      }
    }
  })
}
