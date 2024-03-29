import { renderGroups, renderSavedGroups, renderTabs, renderTabsFromSavedGroup } from "../../index.js"
import { createCurrentWindowContextMenu } from "../../context-menus/currentWindowMenu.js"
import { createGroupContextMenu, removeContextMenus } from "../../context-menus/openGroup/openGroupMenu.js"
import { createGroupInput, focusGroupInputFromParent } from "./input.js"
import { createSavedGroupContextMenu } from "../../context-menus/savedGroup/savedGroupMenu.js"
import { createSyncButton } from "./syncButton.js"
import { createSaveButton } from "./saveButton.js"
import { findSavedBookmarkFolderByName } from "../../utils/bookmarks.js"

export const groupColorMapper = {
  grey: '#dadce0',
  blue: '#8ab4f8',
  red: '#f28b82',
  yellow: '#fdd663',
  green: '#81c995',
  pink: '#ff8bcb',
  purple: '#c58af9',
  cyan: '#78d9ec',
  orange: '#fcad70',
}

export function addWindowTabsEventListeners() {
  const windowTabsGroupElement = document.querySelector('#window-tabs-group')
  windowTabsGroupElement.addEventListener('click', () => renderTabs())
  windowTabsGroupElement.addEventListener('mouseover', createCurrentWindowContextMenu)
  windowTabsGroupElement.addEventListener('mouseout', removeContextMenus)

  windowTabsGroupElement.addEventListener('dragover', allowDragOver)
  windowTabsGroupElement.addEventListener('drop', dropTabIntoGroup)
}

export async function createGroupElement(groupId, title, color) {
  const groupElement = document.createElement('div')
  groupElement.className = 'group'
  groupElement.setAttribute('data-group-id', groupId)
  groupElement.style.backgroundColor = groupColorMapper[color]

  const btnContainerElement = document.createElement('div')
  btnContainerElement.className = 'tab-btns'
  groupElement.appendChild(btnContainerElement)

  const groupTitleInput = createGroupInput(groupId, title)
  groupElement.appendChild(groupTitleInput)
  groupElement.addEventListener('dblclick', focusGroupInputFromParent)

  // Render of tabs and context menu
  groupElement.addEventListener('click', () => renderTabs(groupId))
  groupElement.addEventListener('mouseover', () => createGroupContextMenu(groupId))
  groupElement.addEventListener('mouseout', removeContextMenus)

  // Drag events to add tabs to group
  groupElement.addEventListener('dragover', allowDragOver)
  groupElement.addEventListener('drop', dropTabIntoGroup)

  const savedGroup = await findSavedBookmarkFolderByName(title)

  if (savedGroup) {
    const syncButtonElement = createSyncButton(groupId, savedGroup)
    btnContainerElement.appendChild(syncButtonElement)
  } else {
    const saveButtonElement = createSaveButton(groupId)
    btnContainerElement.appendChild(saveButtonElement)
  }

  return groupElement
}

export function createGroupElementFromBookmark(bookmarkId, title, index) {
  const groupElement = document.createElement('div')
  groupElement.className = 'group saved'
  groupElement.setAttribute('data-bookmark-group-id', bookmarkId)
  
  // Selects background color (array order)
  const colorValues = Object.values(groupColorMapper)
  const color = colorValues[index % colorValues.length]
  groupElement.style.backgroundColor = color

  // Creates group input (group title) adding the event listener to rename it
  const groupTitleInput = createGroupInput(bookmarkId, title, 'bookmark', color)
  groupElement.appendChild(groupTitleInput)
  groupElement.addEventListener('dblclick', focusGroupInputFromParent)

  groupElement.addEventListener('click', () => renderTabsFromSavedGroup(bookmarkId, color))
  groupElement.addEventListener('mouseover', () => createSavedGroupContextMenu(bookmarkId))
  groupElement.addEventListener('mouseout', removeContextMenus)

  // Drag events to add tabs to group
  groupElement.addEventListener('dragover', allowDragOver)
  groupElement.addEventListener('drop', (e) => dropTabIntoSavedGroup(e))
  
  return groupElement
}

async function dropTabIntoGroup(e) {
  const groupId = +this.getAttribute('data-group-id')
  const draggedTabId = +e.dataTransfer.getData('text')

  const tab = await chrome.tabs.get(draggedTabId)
  const previousGroupId = tab.groupId
  const remainingItemsBeforeDelete = await chrome.tabs.query({ groupId: previousGroupId })
  
  // Add tab to group
  if(groupId) {
    await chrome.tabs.group({
      groupId,
      tabIds: draggedTabId
    })
  } else {
    // Ungroup tab if dragged to window group element
    await chrome.tabs.ungroup(draggedTabId)
  }
  
  if(remainingItemsBeforeDelete.length === 1) {
    // Group was deleted, passing its id would throw an error
    renderTabs()
  } else {
    renderTabs(previousGroupId)
  }

  renderGroups()
}

async function dropTabIntoSavedGroup(e) {
  const bookmarkNewGroupId = e.target.getAttribute('data-bookmark-group-id')
  const draggedTabBookmarkId = e.dataTransfer.getData('text')

  const bookmarkTabArray = await chrome.bookmarks.get(draggedTabBookmarkId)
  const bookmarkTab = bookmarkTabArray[0]
  const oldBookmarkGroupId = bookmarkTab.parentId
  
  // Add to new bookmark group
  await chrome.bookmarks.move(bookmarkTab.id, {
    parentId: bookmarkNewGroupId
  })

  renderTabsFromSavedGroup(oldBookmarkGroupId, null)
  
  // Delete bookmark folder if empty
  const remainingItems = await chrome.bookmarks.getChildren(oldBookmarkGroupId)
  if (remainingItems.length === 0) {
    await chrome.bookmarks.remove(oldBookmarkGroupId)
    renderSavedGroups()
  }
}

// default behavior is not letting an element being dragged into another
function allowDragOver(e) {
  e.preventDefault()
}
