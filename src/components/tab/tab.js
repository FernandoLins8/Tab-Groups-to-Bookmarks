import { removeContextMenus } from "../../context-menus/openGroup/openGroupMenu.js"
import { createTabContextMenu } from "../../context-menus/tabContextMenu.js"
import { hideCreateNewGroupElement, showCreateNewGroupElement } from "../group/newGroupElement.js"
import { createCloseButton } from "./closeButton.js"
import { createUnlinkButton } from "./unlinkButton.js"

export function createTabElements(tab, groupId) {
  const tabElement = document.createElement('div')
  tabElement.className = 'tab'
  tabElement.setAttribute('draggable', true)
  tabElement.setAttribute('data-tab-id', tab.id)
  tabElement.innerHTML = `
    <span
      class="tab-url"
      title="${tab.title}"
    >
      ${tab.title}
    </span>
    <div class="tab-btns"></div>
  `

  tabElement.addEventListener('contextmenu', () => createTabContextMenu(tab.id))
  tabElement.addEventListener('mouseleave', removeContextMenus)
  tabElement.addEventListener('dragstart', dragStart)
  tabElement.addEventListener('dragend', hideCreateNewGroupElement)

  // Add tab buttons
  const btnContainer = tabElement.querySelector('.tab-btns')
  if(groupId !== -1) {
    // If tab has a group add ungroup button
    const ungroupBtn = createUnlinkButton(tab.id, groupId)
    btnContainer.appendChild(ungroupBtn)
  }  
  const closeBtn = createCloseButton(tab.id, groupId)
  btnContainer.appendChild(closeBtn)

  return tabElement
}

export function createSavedGroupTabElement(urlId, urlTitle, groupBookmarkId) {
  const tabElement = document.createElement('div')
  tabElement.className = 'tab'
  tabElement.setAttribute('draggable', true)
  tabElement.setAttribute('data-bookmark-tab-id', urlId)
  tabElement.innerHTML = `
    <span
      class="tab-url"
      title="${urlTitle}"
    >
      ${urlTitle}
    </span>
    <div class="tab-btns"></div>
  `

  // tabElement.addEventListener('contextmenu', () => createTabContextMenu(tab.id))
  // tabElement.addEventListener('mouseleave', removeContextMenus)

  tabElement.addEventListener('dragstart', (e) => dragStart(e, 'bookmark'))

  // Add tab buttons
  const btnContainer = tabElement.querySelector('.tab-btns')
  const closeBtn = createCloseButton(urlId, groupBookmarkId, 'bookmark')
  btnContainer.appendChild(closeBtn)

  return tabElement
}

function dragStart(e, itemType='tab') {
  let dataAttribute = 'data-bookmark-tab-id'

  if(itemType == 'tab') {
    showCreateNewGroupElement()
    dataAttribute = 'data-tab-id'
  }
  
  const draggedTabId = e.target.getAttribute(dataAttribute)
  e.dataTransfer.clearData()
  e.dataTransfer.setData("text", draggedTabId);
}
