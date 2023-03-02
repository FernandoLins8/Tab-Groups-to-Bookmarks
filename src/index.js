import { addWindowTabsEventListeners, createGroupElement, createGroupElementFromBookmark, groupColorMapper } from './components/group/group.js'
import { createNewGroupElement } from './components/group/newGroupElement.js'
import { createSavedGroupTabElement, createTabElements } from './components/tab/tab.js'
import { removeContextMenus } from './context-menus/groupMenu.js'

const openGroupsBtn = document.querySelector('#open-btn')
const savedGroupsBtn = document.querySelector('#saved-btn')

openGroupsBtn.addEventListener('click', () => renderOpenGroupsScreen())
savedGroupsBtn.addEventListener('click', () => renderSavedGroupsScreen())

function renderOpenGroupsScreen() {
  openGroupsBtn.classList.add('active')
  savedGroupsBtn.classList.remove('active')
  
  renderTabs()
  renderGroups()
}

function renderSavedGroupsScreen() {
  openGroupsBtn.classList.remove('active')
  savedGroupsBtn.classList.add('active')

  renderSavedGroups()
  renderTabsFromSavedGroup()
}

export async function renderSavedGroups() {
  let savedGroupsParentFolder = await chrome.bookmarks.search('Groups (Tab Groups Saver)')
  savedGroupsParentFolder = savedGroupsParentFolder.filter(bookmark => bookmark.url === undefined)
  if(savedGroupsParentFolder.length === 0) {
    alert('Saved groups parent folder not found')
    return
  }
  savedGroupsParentFolder = savedGroupsParentFolder[0]

  const savedGroupsParentFolderChildren = await chrome.bookmarks.getChildren(savedGroupsParentFolder.id)
  const groupsAsBookmarks = savedGroupsParentFolderChildren.filter(bookmark => bookmark.url === undefined)

  const windowTabsGroup = document.querySelector('#window-tabs-group')
  windowTabsGroup.classList.remove('show')
  const groupsHeading = document.querySelector('#groups-heading')
  groupsHeading.innerHTML = 'Saved Groups'

  const groupListElement = document.querySelector('#group-list')
  groupListElement.innerHTML = ``
  removeContextMenus()

  groupsAsBookmarks.forEach((bookmark, index) => {
    const groupElement = createGroupElementFromBookmark(bookmark.id, bookmark.title, index)
    groupListElement.appendChild(groupElement)
  })
}

export async function renderTabsFromSavedGroup(groupBookmarkId, groupColor='#cfdbeb') {
  const tabListElement = document.querySelector('#tab-list')
  tabListElement.innerHTML = ''
    
  // Update heading indicating from which group the listed tabs are
  const tabListCurrentGroupElement = document.querySelector('#tab-list-current-group')
  tabListCurrentGroupElement.innerHTML = 'Tabs'

  // Allows passing null to keep the current color (not reseting)
  if(groupColor) {
    tabListCurrentGroupElement.style.background = groupColor
  }
  
  // If not bookmark is specified stop after clearing the tabs
  if(!groupBookmarkId) {
    return
  }
  
  const groupBookmark = await chrome.bookmarks.get(groupBookmarkId)
  tabListCurrentGroupElement.innerHTML = groupBookmark[0].title + ' Tabs'
  
  const groupBookmarkChildren = await chrome.bookmarks.getChildren(groupBookmarkId)
  const groupSavedUrls = groupBookmarkChildren.filter(bookmark => bookmark.url !== undefined)
  // Create Tabs
  groupSavedUrls.forEach(url => {
    const tabElement = createSavedGroupTabElement(url.id, url.title, groupBookmarkId)
    tabListElement.appendChild(tabElement)
  })
}

export async function renderTabs(groupId=-1) {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    groupId
  })

  const tabListElement = document.querySelector('#tab-list')
  tabListElement.innerHTML = ''

  // Update heading indicating from which group the listed tabs are
  let groupLabelInfo = { title: 'Tabs', background: '#cfdbeb' }
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
  
  const windowTabsGroup = document.querySelector('#window-tabs-group')
  windowTabsGroup.classList.add('show')
  const groupsHeading = document.querySelector('#groups-heading')
  groupsHeading.innerHTML = 'Groups'
  
  // Reset current groups
  const groupListElement = document.querySelector('#group-list')
  groupListElement.innerHTML = ``

  // Append element to create a new group when dragging a tab
  groupListElement.appendChild(createNewGroupElement())
  
  removeContextMenus()

  groups.forEach(group => {
    const groupElement = createGroupElement(group.id, group.title, group.color)
    groupListElement.appendChild(groupElement)
  })
}

addWindowTabsEventListeners()
renderTabs()
renderGroups()
