import { syncTabsFromGroup } from "../../utils/tabs.js"

export function createSyncButton(groupId, savedGroup) {
  const syncButton = document.createElement('button')
  syncButton.id = `sync-btn-${groupId}`
  syncButton.setAttribute('title', 'Sync Group with saved one')
  syncButton.innerHTML = '<i class="fas fa-sync"></i>'

  syncButton.addEventListener('click', async () => {
    syncTabsFromGroup(groupId, savedGroup)
  })

  return syncButton
}
