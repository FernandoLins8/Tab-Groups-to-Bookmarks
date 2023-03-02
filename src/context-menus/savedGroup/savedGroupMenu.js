import { copySavedGroupURLs, deleteSavedGroup, downloadSavedGroupTabsURLs, openSavedGroup } from "./savedGroupFunctions.js"

export function createSavedGroupContextMenu(groupBookmarkId) {
  chrome.contextMenus.create({
    id: 'saved-group-context-menu',
    title: 'Saved Group Options'
  })

  chrome.contextMenus.create({
    id: 'open-saved-group',
    title: 'Open saved group',
    parentId: 'saved-group-context-menu',
    onclick: () => openSavedGroup(groupBookmarkId)
  })

  chrome.contextMenus.create({
    id: 'copy-saved-group',
    title: 'Copy URLs',
    parentId: 'saved-group-context-menu',
    onclick: () => copySavedGroupURLs(groupBookmarkId)
  })

  chrome.contextMenus.create({
    id: 'export-saved-group-as-file',
    title: 'Export URLs as file',
    parentId: 'saved-group-context-menu',
    onclick: () => downloadSavedGroupTabsURLs(groupBookmarkId)
  })

  chrome.contextMenus.create({
    id: 'saved-group-separator',
    type: 'separator',
    parentId: 'saved-group-context-menu',
  })

  chrome.contextMenus.create({
    id: 'delete-saved-group',
    title: 'Delete saved group',
    parentId: 'saved-group-context-menu',
    onclick: () => deleteSavedGroup(groupBookmarkId)
  })
}
