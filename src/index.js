const groupListElement = document.querySelector('#group-list')
const tabListElement = document.querySelector('#tab-list')

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

async function getUngroupedTabsFromCurrentWindow() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    groupId: -1
  })

  tabListElement.innerHTML = ''

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
    closeBtn.addEventListener('click', () => {
      chrome.tabs.remove(tab.id)
    })

    tabListElement.appendChild(tabElement)
  })
}

async function getAllGroupsFromCurrentWindow() {
  const groups = await chrome.tabGroups.query({
    windowId: -2 // represents the current window
  })

  groupListElement.innerHTML = ''

  groups.forEach(group => {
    const groupElement = document.createElement('div')
    groupElement.className = 'group'
    groupElement.style.backgroundColor = groupColorMapper[group.color]
    console.log(group.color)
    groupElement.innerHTML = `
      <span class="group-name">${group.title}</span>
    `

    groupListElement.appendChild(groupElement)
  })
}

getUngroupedTabsFromCurrentWindow()
getAllGroupsFromCurrentWindow()