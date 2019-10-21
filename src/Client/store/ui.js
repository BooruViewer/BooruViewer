export const ui = {
  getters: {
    PaneWidths: "getPaneWidths",
    BlacklistModes: "getAllBlacklistModes",
    CurrentBlacklistMode: "getBlacklistMode",
    BlacklistedTags: "getBlacklistedTags",
    DrawerOpen: "getDrawerOpen",
    DrawerMini: "getDrawerMini",
    TagSearchSelected: "getTagSearchSelected",
    DialogOpen: "isDialogOpen",
  },
  mutations: {
    PaneWidths: "setPaneWidth",
    DialogVisibility: "setDialogVisibility",
    BlacklistMode: "setBlacklistMode",
    AddBlacklistTag: "addBlacklistTag",
    RemoveBlacklistTag: "removeBlacklistTag",
    DrawerOpen: "setDrawerOpen",
    DrawerMini: "setDrawerMini",
    TagSearchSelected: "setTagSearchSelected",
    RemoveTagSearchSelectedItem: "removeTagSearchSelectedItem",
    AddTagSearchSelectedItem: "addTagSearchSelectedItem",
    DialogOpen: "setDialogOpen",
  },
  actions: {
    OpenDialog: "openDialog",
    DialogVisible: "isDialogVisible",
    ToggleDrawer: "toggleDrawer",
  },
  HorizontalSplitView: "horizontalSplitView",
}

export const state = () => ({
  paneWidths: {
    left: '50vw',
    right: '50vw',
  },
  drawerOpen: true,
  drawerMini: true,
  horizontalSplitView: false,
  dialogs: { auth: false, settings: false },
  tagSearchText: "",
  tagSearchSelected: [],
  blacklist: ["dialogs", "tagSearchText", "dialogs"],
})

export const getters = {
  [ui.getters.PaneWidths]: s => s.paneWidths,
  [ui.getters.DrawerOpen]: s => s.drawerOpen,
  [ui.getters.DrawerMini]: s => s.drawerMini,
  [ui.getters.TagSearchSelected]: s => s.tagSearchSelected,
  [ui.getters.DialogOpen]: s => {
    return d => {
      return s.dialogs[d]
    }
  },
  [ui.HorizontalSplitView]: s => s.horizontalSplitView,
}

export const mutations = {
  [ui.mutations.PaneWidths](state, { leftWidth, rightWidth }) {
    state.paneWidths.left = leftWidth
    state.paneWidths.right = rightWidth
  },
  [ui.mutations.DrawerOpen](state, open) {
    state.drawerOpen = open
  },
  [ui.mutations.DrawerMini](state, mini) {
    state.drawerMini = mini
  },
  [ui.mutations.TagSearchSelected](state, selected) {
    state.tagSearchSelected = selected
  },
  [ui.mutations.RemoveTagSearchSelectedItem](state, item) {
    const idx = state.tagSearchSelected.indexOf(item)

    if (idx === -1)
      return

    state.tagSearchSelected.splice(idx, 1)
  },
  [ui.mutations.AddTagSearchSelectedItem](state, item) {
    state.tagSearchSelected.push(item)
  },
  [ui.mutations.DialogOpen](state, { dialog, open }) {
    state.dialogs[dialog] = open
  },
  [ui.HorizontalSplitView](state, isHorizontal) {
    state.horizontalSplitView = isHorizontal
    if (isHorizontal) {
      state.paneWidths.right = state.paneWidths.left = '50vh'
    } else {
      state.paneWidths.right = state.paneWidths.left = '50vw'
    }
  }
}

export const actions = {
  [ui.actions.OpenDialog]({ commit }, { dialog }) {
    commit(ui.mutations.DialogVisibility, ({ dialog, visible: true }))
  },
  [ui.actions.ToggleDrawer]({ commit, state }) {
    commit(ui.mutations.DrawerOpen, !state.drawerOpen)
  },
}
