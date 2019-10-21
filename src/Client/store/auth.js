import { Sites } from "~/assets/site-configs"
import { api as apis } from "~/store/api"

export const auth = {
  getters: {},
  mutations: {},
  actions: {},
  Auth: "authenticated",
  RemoveAuth: "removeAuthenticated",
  EnsureAuth: "ensureAuthenticated",
  WhichBooru: "whichBooru",
}

export const state = () => ({
  whichBooru: Sites[0],
  blacklist: ["*"],
})

export const getters = {
  [auth.Auth]: s => {
    return p => {
      return (s[p] && s[p].loggedIn === true)
    }
  },
  [auth.WhichBooru]: s => s.whichBooru,
}

export const mutations = {
  [auth.Auth](state, { id, key, expires, currentSite }) {
    state[currentSite] = {
      id, key, expires, loggedIn: true
    }
  },
  [auth.RemoveAuth](state, { currentSite }) {
    state[currentSite] = null
  },
  [auth.WhichBooru](state, booru) {
    state.whichBooru = booru
  },
}

export const actions = {
  async [auth.Auth](context, { id, key, site }) {
    const { state, commit, rootGetters, rootState, dispatch } = context

    dispatch('api/' + apis.actions.Initialize, null, { root: true })
    const api = rootGetters['api/' + apis.getters.Instance]
    const currentSite = site || state.whichBooru || rootGetters['api/' + apis.getters.CurrentEndpoint]

    const res = await api.authenticate(id, key)

    if (res.isSuccess) {
      const expires = new Date(res.data * 1000)
      commit(auth.Auth, { id, key, expires, currentSite })
    } else {
      commit(auth.RemoveAuth, { currentSite })
      throw new Error(res.error.message)
    }
  },
  async [auth.EnsureAuth](context) {
    const { dispatch, rootGetters, getters, state } = context
    const isAuthed = getters[auth.Auth]
    const currentSite = rootGetters['api/' + apis.getters.CurrentEndpoint]
    if (!isAuthed(currentSite))
      return

    const expires = state[currentSite].expires
    const currentTime = new Date()

    if (expires > currentTime)
      return

    return dispatch(auth.Auth, { ...state[currentSite], site: currentSite })
  },
}



