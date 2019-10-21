import createLogger from 'vuex/dist/logger'
import * as localforage from "localforage"
import VuexPersistence from "vuex-persist"
import { cloneDeep, debounce } from "lodash"

const loggerPlugin = process.env.NODE_ENV !== "production"
  ? [createLogger()]
  : []

localforage.config({
  storeName: "BooruViewer",
  name: "PersistedState",
  description: "The persistence storage engine for VueX",
})

const blacklistReducer = state => {
  console.log('[VueX/Persist] Blacklist Reducer running.')

  const filtered = cloneDeep(state)

  for (const key in state) {
    if (key === "route") {
      delete filtered[key]
      continue
    }

    if (state.hasOwnProperty(key) && state[key]["blacklist"]) {
      const blacklist = state[key]["blacklist"];
      if (blacklist[0] === "*") {
        delete filtered[key]
        continue;
      }

      blacklist.forEach(blacklistKey => {
        delete filtered[key][blacklistKey]
      })
      delete filtered[key]["blacklist"]
    }
  }

  return filtered
}

const customSaveState = (key, state, storage) => {
  const modules = []

  for (const module in state) {
    if (!state.hasOwnProperty(module))
      continue

    const moduleKey = `${key}-${module}`
    modules.push(moduleKey)

    storage.setItem(moduleKey, state[module])
  }

  storage.setItem(`${key}-modules`, modules)
}

const customRestoreState = async (key, storage) => {
  const modules = await storage.getItem(`${key}-modules`)
  if (!modules)
    return {}
  const klen = key.length + 1

  const state = {}

  for (const idx in modules) {
    const key = modules[idx]
    const module = key.substring(klen)
    const value = await storage.getItem(key)
    state[module] = value
  }

  return state
}

function subscribeHandler(mutation, state) {
  // this = VuexPersistence instance
  this._mutex.enqueue(this.saveState(this.key, this.reducer(state), this.storage))
}

const subscriber = store => {
  return handler => {
    store.subscribe(debounce(subscribeHandler.bind(persistence), 1000))
  }
}

const persistence = new VuexPersistence({
  key: "persist",
  storage: localforage,
  asyncStorage: true,
  strictMode: true,
  reducer: blacklistReducer,
  restoreState: customRestoreState,
  saveState: customSaveState,
})

persistence.subscriber = subscriber

export const plugins = [...loggerPlugin, persistence.plugin]

export const mutations = {
  RESTORE_MUTATION: persistence.RESTORE_MUTATION,
}
