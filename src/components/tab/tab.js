import { removeContextMenus } from "../../context-menus/groupMenu.js"
import { createTabContextMenu } from "../../context-menus/tabContextMenu.js"
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

function dragStart(e) {
  const draggedTabId = e.target.getAttribute('data-tab-id')
  e.dataTransfer.clearData()
  e.dataTransfer.setData("text", draggedTabId);
}
