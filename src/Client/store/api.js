import {BooruApi} from "~/assets/BVApi"
import {Sites, Endpoints} from "~/assets/site-configs"

export const api = {
  Instance: "__instance",
  Endpoint: "__endpoint",
  Endpoints: "__endpoints",
  Initialize: "__initialize"
}

export const state = () => ({
  booru: null,
  currentEndpoint: "Safe Danbooru",
  blacklist: ["booru"],
})

export const getters = {
  [api.Instance]: s => s.booru,
  [api.Endpoint]: s => s.currentEndpoint,
  [api.Endpoints]: s => Sites,
}

export const mutations = {
  [api.Endpoint](state, payload) {
    const endpoint = payload.endpoint || payload
    if (!Endpoints[endpoint])
      throw new Error(`Unknown Endpoint "${endpoint}"`)

    state.booru = new BooruApi(Endpoints[endpoint])
    state.currentEndpoint = endpoint
  }
}

export const actions = {
  [api.Initialize]({state, commit}) {
    if (state.booru != null)
      return

    console.log(`[VueX/api] Initializing Booru API with endpoint ${state.currentEndpoint}`)
    commit(api.Endpoint, { endpoint: state.currentEndpoint })
  }
}
