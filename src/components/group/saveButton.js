import { saveGroupAsBookmarkFolder } from "../../context-menus/openGroup/groupFunctions.js"
import { renderGroups } from "../../index.js"

export function createSaveButton(groupId) {
  const syncButton = document.createElement('button')
  syncButton.id = `sync-btn-${groupId}`
  syncButton.setAttribute('title', 'Save Group')
  syncButton.innerHTML = '<i class="fas fa-save"></i>'

  syncButton.addEventListener('click', async () => {
    saveGroupAsBookmarkFolder(groupId)
    setTimeout(renderGroups, 250) // Todo: check why "await" or "then" aren't working here
  })

  return syncButton
}
