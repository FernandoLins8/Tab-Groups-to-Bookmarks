import { closeGroup, copyGroupURLs, downloadGroupTabsUrls, saveGroupAsBookmarkFolder, toggleGroupCollapse, ungroupAllTabsFromGroup } from './groupFunctions.js'

export function createGroupContextMenu(groupId) {
  chrome.contextMenus.create({
    id: 'group-context-menu',
    title: 'Group Options',
  })
  
  chrome.contextMenus.create({
    id: 'expand-shrink-group',
    title: 'Expand / Shrink group',
    parentId: 'group-context-menu',
    onclick: () => toggleGroupCollapse(groupId)
  })
  
  chrome.contextMenus.create({
    id: 'save',
    title: 'Save',
    parentId: 'group-context-menu',
  })
  
  chrome.contextMenus.create({
    id: 'save-as-bookmark-folder',
    title: 'Save as bookmark folder',
    parentId: 'group-context-menu',
    onclick: () => saveGroupAsBookmarkFolder(groupId)
  })
  
  chrome.contextMenus.create({
    id: 'copy',
    title: 'Copy URLs',
    parentId: 'group-context-menu',
    onclick: () => copyGroupURLs(groupId)
  })
  
  chrome.contextMenus.create({
    id: 'export-as-file',
    title: 'Export URLs as file',
    parentId: 'group-context-menu',
    onclick: () => downloadGroupTabsUrls(groupId)
  })
  
  chrome.contextMenus.create({
    id: 'separator',
    type: 'separator',
    parentId: 'group-context-menu',
  })
  
  chrome.contextMenus.create({
    id: 'remove-from-saved',
    title: 'Remove from saved',
    parentId: 'group-context-menu',
  })
  
  chrome.contextMenus.create({
    id: 'ungroup',
    title: 'Ungroup',
    parentId: 'group-context-menu',
    onclick: () => ungroupAllTabsFromGroup(groupId)
  })
  
  chrome.contextMenus.create({
    id: 'close',
    title: 'Close',
    parentId: 'group-context-menu',
    onclick: () => closeGroup(groupId)
  })
}

export function removeGroupContextMenu() {
  chrome.contextMenus.removeAll()
}
