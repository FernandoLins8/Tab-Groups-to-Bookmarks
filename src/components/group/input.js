import { renderTabs, renderTabsFromSavedGroup } from "../../index.js"

export function createGroupInput(groupId, groupTitle, groupType = 'tab', color) {
  const inputElement = document.createElement('input')
  inputElement.className = 'group-name'
  inputElement.setAttribute('type', 'text')
  inputElement.value = groupTitle

  // Rename group
  inputElement.addEventListener('input', async (e) => {
    const newTitle = e.target.value

    if(groupType == 'tab') {
      await chrome.tabGroups.update(groupId, {
        title: newTitle
      })
      renderTabs(groupId)
    } else if(groupType == 'bookmark') {
      await chrome.bookmarks.update(groupId, {
        title: newTitle
      })
      renderTabsFromSavedGroup(groupId, color)
    }
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
