import VuexPersistence from 'vuex-persist'
import * as localforage from "localforage"
import _ from "lodash"

localforage.config({
  storeName: "BooruViewer",
  name: "PersistedState",
  description: "The persistence storage engine for VueX",
})

const blacklistReducer = state => {
  console.log('[VueX/Persist] Blacklist Reducer running.')

  const filtered = _.cloneDeep(state)

  for (const key in state) {
    if (key === "route") {
      filtered["route"] = {
        from: {},
        to: {},
      }
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

// TODO: Reducer!
// TODO: Debounce saveState!

let registered = false

const persistence = new VuexPersistence({
  key: "persist",
  storage: localforage,
  asyncStorage: true,
  strictMode: true,
  reducer: blacklistReducer,
})

export const RestoreMutation = persistence.RESTORE_MUTATION

export default ({ store }) => {
  // console.log('VueX-Persist: ', store)
  // if (store && !registered) {
  //   persistence.plugin(store)
  //   registered = true
  // }
}
