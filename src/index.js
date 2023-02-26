import { createTabElements } from './components/tab/index.js'
import { createCurrentWindowContextMenu } from './context-menus/currentWindowMenu.js'
import { createGroupContextMenu, removeContextMenus } from './context-menus/groupMenu.js'

const groupListElement = document.querySelector('#group-list')
const tabListElement = document.querySelector('#tab-list')

const windowTabsGroupElement = document.querySelector('#window-tabs-group')
windowTabsGroupElement.addEventListener('click', () => renderTabs())
windowTabsGroupElement.addEventListener('contextmenu', createCurrentWindowContextMenu)
windowTabsGroupElement.addEventListener('mouseleave', removeContextMenus)

const tabListCurrentGroupElement = document.querySelector('#tab-list-current-group')

const groupColorMapper = {
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

export async function renderTabs(groupId=-1) {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    groupId
  })

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

  groupListElement.innerHTML = ''

  groups.forEach(group => {
    const groupElement = document.createElement('div')
    groupElement.className = 'group'
    groupElement.style.backgroundColor = groupColorMapper[group.color]
    groupElement.innerHTML = `
      <span class="group-name">${group.title}</span>
    `

    groupElement.addEventListener('click', () => renderTabs(group.id))
    groupElement.addEventListener('contextmenu', () => createGroupContextMenu(group.id))
    groupElement.addEventListener('mouseleave', removeContextMenus)

    groupListElement.appendChild(groupElement)
  })
  removeContextMenus()
}

renderTabs()
renderGroups()
