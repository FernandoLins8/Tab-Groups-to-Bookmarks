import { renderGroups, renderTabs } from "../../index.js"
import { getCurrentDateTimeString } from "../../utils/datetime.js"

export function createNewGroupElement() {
  const createNewGroupElement = document.createElement('div')
  createNewGroupElement.id = 'new-group-item'
  createNewGroupElement.className = 'group new-group-hidden'
  createNewGroupElement.innerHTML = '<span>New Group</span>'

  // Default behavior is not letting an element being dragged into another
  createNewGroupElement.addEventListener('dragover', (e) => e.preventDefault())
  createNewGroupElement.addEventListener('drop', createNewGroupFromDraggedTab)
  
  return createNewGroupElement
}

// Create new group from dragged tab
async function createNewGroupFromDraggedTab(e) {
  const draggedTabId = +e.dataTransfer.getData('text')

  const tab = await chrome.tabs.get(draggedTabId)
  const previousGroupId = tab.groupId
  const remainingItemsBeforeDelete = await chrome.tabs.query({ groupId: previousGroupId })
  
  const newGroupId = await chrome.tabs.group({
    tabIds: draggedTabId
  })
  await chrome.tabGroups.update(newGroupId, { title: getCurrentDateTimeString() })

  hideCreateNewGroupElement()

  if(remainingItemsBeforeDelete.length === 1) {
    // Previous Group Tab was removed and trying to render its tabs would throw an error
    renderTabs()
  } else {
    renderTabs(previousGroupId)
  }
  renderGroups()
}

export function hideCreateNewGroupElement() {
  const createNewGroupEl = document.querySelector('#new-group-item')
  createNewGroupEl.classList.remove('new-group-shown')
  createNewGroupEl.classList.add('new-group-hidden')
}

export function showCreateNewGroupElement() {
  const createNewGroupEl = document.querySelector('#new-group-item')
  createNewGroupEl.classList.add('new-group-shown')
  createNewGroupEl.classList.remove('new-group-hidden')
}