import { renderTabs } from "../../index.js"
import { createCurrentWindowContextMenu } from "../../context-menus/currentWindowMenu.js"
import { createGroupContextMenu, removeContextMenus } from "../../context-menus/groupMenu.js"
import { createGroupInput, focusGroupInputFromParent } from "./input.js"

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
  windowTabsGroupElement.addEventListener('contextmenu', createCurrentWindowContextMenu)
  windowTabsGroupElement.addEventListener('mouseleave', removeContextMenus)

  windowTabsGroupElement.addEventListener('dragover', dragOver)
  windowTabsGroupElement.addEventListener('drop', dragDrop)
}

export function createGroupElement(groupId, title, color) {
  const groupElement = document.createElement('div')
  groupElement.className = 'group'
  groupElement.setAttribute('data-group-id', groupId)
  groupElement.style.backgroundColor = groupColorMapper[color]

  const groupTitleInput = createGroupInput(groupId, title)
  groupElement.appendChild(groupTitleInput)
  groupElement.addEventListener('dblclick', focusGroupInputFromParent)

  // Render of tabs and context menu
  groupElement.addEventListener('click', () => renderTabs(groupId))
  groupElement.addEventListener('contextmenu', () => createGroupContextMenu(groupId))
  groupElement.addEventListener('mouseleave', removeContextMenus)

  // Drag events to add tabs to group
  groupElement.addEventListener('dragover', dragOver)
  groupElement.addEventListener('drop', dragDrop)

  return groupElement
}

async function dragDrop(e) {
  const groupId = +this.getAttribute('data-group-id')
  const draggedTabId = +e.dataTransfer.getData('text')

  const tab = await chrome.tabs.get(draggedTabId)
  const previousGroupId = tab.groupId
  
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
  
  renderTabs(previousGroupId)
}

// default behavior is not letting an element being dragged into another
function dragOver(e) {
  e.preventDefault()
}
