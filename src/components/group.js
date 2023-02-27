import { renderTabs } from "../index.js"
import { createCurrentWindowContextMenu } from "../context-menus/currentWindowMenu.js"
import { createGroupContextMenu, removeContextMenus } from "../context-menus/groupMenu.js"

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
}

export function createGroupElement(groupId, title, color) {
  const groupElement = document.createElement('div')
  groupElement.className = 'group'
  groupElement.style.backgroundColor = groupColorMapper[color]
  groupElement.innerHTML = `
    <span class="group-name">${title}</span>
  `

  groupElement.addEventListener('click', () => renderTabs(groupId))
  groupElement.addEventListener('contextmenu', () => createGroupContextMenu(groupId))
  groupElement.addEventListener('mouseleave', removeContextMenus)

  return groupElement
}
