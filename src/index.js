import { createGroupContextMenu, removeGroupContextMenu } from './context-menu/groupMenu.js'

const groupListElement = document.querySelector('#group-list')
const tabListElement = document.querySelector('#tab-list')

const windowTabsGroupElement = document.querySelector('#window-tabs-group')
windowTabsGroupElement.addEventListener('click', () => renderTabs())

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

  tabs.forEach(tab => {
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
      <button class="close-tab-btn">X</button>
    `

    const closeBtn = tabElement.querySelector('button')
    closeBtn.addEventListener('click', async () => {
      await chrome.tabs.remove(tab.id)
      renderTabs()
    })

    tabListElement.appendChild(tabElement)
  })
}

export async function getAllGroupsFromCurrentWindow() {
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
    groupElement.addEventListener('mouseleave', removeGroupContextMenu)

    groupListElement.appendChild(groupElement)
  })
}

renderTabs()
getAllGroupsFromCurrentWindow()
