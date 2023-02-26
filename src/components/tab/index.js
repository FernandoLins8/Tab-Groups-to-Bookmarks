import { createCloseButton } from "./closeButton.js"
import { createUnlinkButton } from "./unlinkButton.js"

export function createTabElements(tab, groupId) {
  const tabElement = document.createElement('div')
  tabElement.className = 'tab'
  tabElement.innerHTML = `
    <span
      id="tab-${tab.id}"
      class="tab-url"
      title="${tab.title}"
    >
      ${tab.title}
    </span>
    <div class="tab-btns"></div>
  `

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
