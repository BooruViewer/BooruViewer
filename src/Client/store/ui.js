
const SplitViewOrientations = {
  Vertical: "vertical",
  Horizontal: "horizontal",
}

const TagBlacklistModes = {
  Blur: "blur",
  Hide: "hide",
  None: "none",
}

export const ui = {
  FirstPaneSize: "__firstPaneSize",
  LastPaneSize: "__lastPaneSize",
  SplitViewOrientation: "__splitViewOrientation",
  SplitViewOrientations: "__splitViewOrientations",
  DrawerOpen: "__drawerOpen",
  DrawerMini: "__drawerMini",
  DialogOpen: "__dialogOpen",
  TagBlacklistMode: "__tahBlacklistMode",
  TagBlacklistModes: "__tagBlacklistModes",
  TagsBlacklisted: "__tagsBlacklisted", // Getter only
  ToggleTagBlacklisted: "__toggleTagBlacklisted", // Mutation only
}

export const state = () => ({
  firstPaneSize: "50vw",
  lastPaneSize: "50vw",
  splitViewOrientation: SplitViewOrientations.Vertical,
  drawerOpen: false,
  drawerMini: false,
  dialogs: { auth: false, settings: false },
  blacklistMode: TagBlacklistModes.Blur,
  blacklistTags: [],
  blacklist: ["dialogs"]
})

export const getters = {
  [ui.FirstPaneSize]: s => s.firstPaneSize,
  [ui.LastPaneSize]: s => s.lastPaneSize,
  [ui.SplitViewOrientation]: s => s.splitViewOrientation,
  [ui.SplitViewOrientations]: s => SplitViewOrientations,
  [ui.DrawerOpen]: s => s.drawerOpen,
  [ui.DrawerMini]: s => s.drawerMini,
  [ui.DialogOpen]: s => d => s.dialogs[d],
  [ui.TagBlacklistMode]: s => s.blacklistMode,
  [ui.TagBlacklistModes]: s => TagBlacklistModes,
  [ui.TagsBlacklisted]: s => s.blacklistTags,
}

export const mutations = {
  [ui.FirstPaneSize]: (s, p) => s.firstPaneSize = p,
  [ui.LastPaneSize]: (s, p) => s.lastPaneSize = p,
  [ui.SplitViewOrientation]: (state, payload) => {
    if (!SplitViewOrientations.includes(payload))
      state.splitViewOrientation = payload
    if (state.splitViewOrientation === SplitViewOrientations.Horizontal)
      state.firstPanesize = state.lastPaneSize = "50vh"
    else state.firstPanesize = state.lastPaneSize = "50vw"
  },
  [ui.DrawerOpen]: (s, p) => s.drawerOpen = p,
  [ui.DrawerMini]: (s, p) => s.drawerMini = p,
  [ui.DialogOpen]: (s, { dialog, open }) => s.dialogs[dialog] = open,
  [ui.TagBlacklistMode]: (s, p) => TagBlacklistModes.include(p) && (s.TagBlacklistMode = p),
  [ui.ToggleTagBlacklisted](state, payload) {
    const tagIsBlacklisted = state.blacklistTags.findIndex(t => t.name === payload)
    if (tagIsBlacklisted < 0) {
      state.blacklistTags.push(payload)
      return
    }

    state.blacklistTags.slice(tagIsBlacklisted)
  },
}

export const actions = {
  [ui.DialogOpen]({ commit }, { dialog }) {
    commit(ui.DialogOpen, { dialog, open: true })
  },
  [ui.DrawerOpen]({ commit, state }) {
    commit(ui.DrawerOpen, !state.drawerOpen)
  }
}
