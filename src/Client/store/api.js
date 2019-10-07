import { BooruApi, Endpoints } from "../assets/booru-api"

export const api = {
  getters: {
    Instance: "instance",
    CurrentEndpoint: "currentEndpoint",
   AllEndpoints: "allEndpoints",
  },
  mutations: {
    ChangeEndpoint: "changeEndpoint",
  },
  actions: {
    Initialize: "init",
  },
}

export const state = () => ({
  booru: null,
  currentEndpoint: "Safe Danbooru",
  blacklist: ["booru"],
})

export const getters = {
  [api.getters.Instance]: s => s.booru,
  [api.getters.CurrentEndpoint]: s => s.currentEndpoint,
  [api.getters.AllEndpoints]: s => Object.keys(Endpoints)
}

export const mutations = {
  [api.mutations.ChangeEndpoint](state, data) {
    const endpoint = data.endpoint || data
    if (!Endpoints[endpoint])
      throw new Error(`Unknown Endpoint "${endpoint}"`)

    state.booru = new BooruApi(Endpoints[endpoint])
    state.currentEndpoint = endpoint
  },
}

export const actions = {
  [api.actions.Initialize]({ state, commit }) {

    if (state.booru != null) {
      return
    }

    console.log(`[VueX/api] Initializing Booru Api with endpoint ${state.currentEndpoint}`)
    commit(api.mutations.ChangeEndpoint, { endpoint: state.currentEndpoint });
  }
}
