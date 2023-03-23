import { removeContextMenus } from "../../context-menus/openGroup/openGroupMenu.js"
import { renderGroups, renderTabs } from "../../index.js"

export function createUnlinkButton(tabId, groupId) {
  const unlinkButton = document.createElement('button')
  unlinkButton.id = `unlink-btn-${tabId}`
  unlinkButton.setAttribute('title', 'Ungroup tab')
  unlinkButton.innerHTML = '<i class="fas fa-unlink"></i>'
  unlinkButton.style = "padding: 0.29rem 0.5rem"

  unlinkButton.addEventListener('click', async () => {
    const remainingTabs = await chrome.tabs.query({
      groupId
    })
    await chrome.tabs.ungroup(tabId)
    removeContextMenus()
    if(remainingTabs.length === 1) {
      renderTabs()
      renderGroups()
    } else {
      renderTabs(groupId)
    }
  })

  return unlinkButton
}
