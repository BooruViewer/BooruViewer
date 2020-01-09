import createLogger from "vuex/dist/logger"
import * as localforage from "localforage"
import VuexPersistence from "vuex-persist";
import {debounce} from "lodash"

export { api } from "./api"
export { booru } from "./booru"
export { ui } from "./ui"

const loggerPlugin = process.env.NODE_ENV !== "production"
  ? [createLogger()]
  : []

localforage.config({
  storeName: "BooruViewer",
  name:"PersistedStore",
  description: "Storage enginee for VueX / BooruViewer"
})

const reducer = state => {
  const filtered = {}

  for (const key in state) {
    if (key === "route")
      continue

    if (!state.hasOwnProperty(key))
      continue

    if (!state[key]["blacklist"]) {
      filtered[key] = state[key]
      continue
    }

    const blacklist = state[key]["blacklist"]
    if (blacklist[0] === "*")
      continue

    filtered[key] = {}
    for (const subKey in state[key]) {
      if (subKey === "blacklist")
        continue

      if (blacklist.includes(subKey))
        continue

      filtered[key][subKey] = state[key][subKey]
    }
  }

  return filtered
}

const persistence = new VuexPersistence({
  key: "BooruViewer",
  storage: localforage,
  asyncStorage: true,
  strictMode: true,
  reducer,
})

export const plugins = [
  ...loggerPlugin, persistence.plugin,
]

export const mutations = {
  RESTORE_MUTATION: persistence.RESTORE_MUTATION
}
