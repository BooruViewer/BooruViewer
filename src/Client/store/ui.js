export const ui = {
  getters: {
    PaneWidths: "getPaneWidths",
    BlacklistModes: "getAllBlacklistModes",
    CurrentBlacklistMode: "getBlacklistMode",
    BlacklistedTags: "getBlacklistedTags",
    DrawerOpen: "getDrawerOpen",
    DrawerMini: "getDrawerMini",
  },
  mutations: {
    PaneWidths: "setPaneWidth",
    DialogVisibility: "setDialogVisibility",
    BlacklistMode: "setBlacklistMode",
    AddBlacklistTag: "addBlacklistTag",
    RemoveBlacklistTag: "removeBlacklistTag",
    DrawerOpen: "setDrawerOpen",
    DrawerMini: "setDrawerMini",
  },
  actions: {
    OpenDialog: "openDialog",
    DialogVisible: "isDialogVisible",
    ToggleDrawer: "toggleDrawer",
  },
}

export const state = () => ({
  paneWidths: {
    left: '50vw',
    right: '50vw',
  },
  drawerOpen: true,
  drawerMini: true,
  blacklist: ["dialogs"],
})

export const getters = {
  [ui.getters.PaneWidths]: s => s.paneWidths,
  [ui.getters.DrawerOpen]: s => s.drawerOpen,
  [ui.getters.DrawerMini]: s => s.drawerMini,
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
}

export const actions = {
  [ui.actions.OpenDialog]({ commit }, { dialog }) {
    commit(ui.mutations.DialogVisibility, ({ dialog, visible: true }))
  },
  [ui.actions.ToggleDrawer]({ commit, state }) {
    commit(ui.mutations.DrawerOpen, !state.drawerOpen)
  },
}
