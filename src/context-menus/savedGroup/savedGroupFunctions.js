import { renderSavedGroups, renderTabsFromSavedGroup } from "../../index.js"

export async function openSavedGroup(groupBookmarkId) {
  const groupBookmarkChildren = await chrome.bookmarks.getChildren(groupBookmarkId)

  const groupBookmarkURLs = groupBookmarkChildren.filter(bookmarkEntry => bookmarkEntry.url !== undefined)

  const createdTabsIds = []
  for (const bookmark of groupBookmarkURLs) {
    const tab = await chrome.tabs.create({
      url: bookmark.url,
      active: false
    })
    createdTabsIds.push(tab.id)
  }

  const createdGroupId = await chrome.tabs.group({
    tabIds: createdTabsIds
  })
  const groupBookmarkSearchResult = await chrome.bookmarks.get(groupBookmarkId)
  chrome.tabGroups.update(createdGroupId, { title: groupBookmarkSearchResult[0].title })    
}

export async function copySavedGroupURLs(groupBookmarkId) {
  const groupBookmarkChildren = await chrome.bookmarks.getChildren(groupBookmarkId)

  const groupBookmarkURLs = groupBookmarkChildren
    .filter(bookmarkEntry => bookmarkEntry.url !== undefined)
    .map(bookmark => bookmark.url)

  const textToCopy = groupBookmarkURLs.join('\n')

  try {
    await navigator.clipboard.writeText(textToCopy)
    alert(`Copied ${groupBookmarkURLs.length} urls to clipboard.`)
  } catch(err) {

    alert('Error copying urls.')
  }
}

export async function downloadSavedGroupTabsURLs(groupBookmarkId) {
  const groupBookmarkChildren = await chrome.bookmarks.getChildren(groupBookmarkId)

  const groupBookmarkURLs = groupBookmarkChildren
    .filter(bookmarkEntry => bookmarkEntry.url !== undefined)
    .map(bookmark => bookmark.url)

  const textToDownload = groupBookmarkURLs.join('\n')

  const textBlob = new Blob([textToDownload], {type: 'text/plain'})
  const url = URL.createObjectURL(textBlob)

  const resultArray = await chrome.bookmarks.get(groupBookmarkId)
  const groupBookmarkFolder = resultArray[0]

  await chrome.downloads.download({
    url,
    filename: `${groupBookmarkFolder.title ? groupBookmarkFolder.title :  'tab-group'}.txt`
  })
}

export async function deleteSavedGroup(groupBookmarkId) {
  await chrome.bookmarks.removeTree(groupBookmarkId)
  renderSavedGroups()
  renderTabsFromSavedGroup()
}
