import createPersistedState from 'vuex-persistedstate'
import _ from "lodash"

const blacklistReducer = state => {
  console.log('[VueX/PersistedState] Blacklist Reducer running.')

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

// Debounce the blacklist reducer, because it can get quite heavy.
export default ({ store }) => {
  createPersistedState({
    reducer: blacklistReducer
  })(store)
}
