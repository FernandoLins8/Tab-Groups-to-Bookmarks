import { addWindowTabsEventListeners, createGroupElement, groupColorMapper } from './components/group.js'
import { createTabElements } from './components/tab/tab.js'
import { removeContextMenus } from './context-menus/groupMenu.js'


export async function renderTabs(groupId=-1) {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    groupId
  })

  const tabListElement = document.querySelector('#tab-list')
  tabListElement.innerHTML = ''

  // Update heading indicating from which group the listed tabs are
  let groupLabelInfo = { title: 'Current Window Tabs', background: '#cfdbeb' }
  if(groupId != -1) {
    const group = await chrome.tabGroups.get(groupId)
    groupLabelInfo = {
      title: `${group.title} Tabs`,
      background: groupColorMapper[group.color]
    }
  }
  const tabListCurrentGroupElement = document.querySelector('#tab-list-current-group')
  tabListCurrentGroupElement.innerHTML = groupLabelInfo.title
  tabListCurrentGroupElement.style.background = groupLabelInfo.background

  // Create Tabs
  tabs.forEach(tab => {
    const tabElement = createTabElements(tab, groupId)
    tabListElement.appendChild(tabElement)
  })
}

export async function renderGroups() {
  const groups = await chrome.tabGroups.query({
    windowId: -2 // represents the current window
  })
  
  // Reset current groups
  const groupListElement = document.querySelector('#group-list')
  groupListElement.innerHTML = ''
  removeContextMenus()

  groups.forEach(group => {
    const groupElement = createGroupElement(group.id, group.title, group.color)
    groupListElement.appendChild(groupElement)
  })
}

addWindowTabsEventListeners()
renderTabs()
renderGroups()
