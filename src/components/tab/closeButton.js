import { renderGroups, renderTabs } from "../../index.js"

export function createCloseButton(tabId, groupId) {
  const closeButton = document.createElement('button')
  closeButton.id = `close-btn-${tabId}`
  closeButton.setAttribute('title', 'Close tab')
  closeButton.innerHTML = 'X'

  closeButton.addEventListener('click', async () => {
    const remainingTabs = await chrome.tabs.query({
      groupId
    })
    await chrome.tabs.remove(tabId)
    if(remainingTabs.length === 1) {
      renderTabs()
      renderGroups()
    } else {
      renderTabs(groupId)
    }
  })

  return closeButton
}
