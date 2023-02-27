import { renderTabs } from "../../index.js"

export function createGroupInput(groupId, groupTitle) {
  const inputElement = document.createElement('input')
  inputElement.className = 'group-name'
  inputElement.setAttribute('type', 'text')
  inputElement.value = groupTitle

  inputElement.addEventListener('dblclick', () => {
  })

  // Rename group
  inputElement.addEventListener('input', async (e) => {
    await chrome.tabGroups.update(groupId, {
      title: e.target.value
    })
    renderTabs(groupId)
  })

  // Remove focus on enter
  inputElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  })

  return inputElement
}

export function focusGroupInputFromParent(e) {
  const inputElement = e.target.querySelector('input')
  const inputVal = inputElement.value
  
  inputElement.focus()
  // Place cursor at the end
  inputElement.value = ''
  inputElement.value = inputVal
}