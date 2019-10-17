import { get, set, merge, cloneDeep as clone, debounce } from "lodash"

export default function (options) {
  options = options || {}

  const promisify = _ => Promise.resolve(_)

  async function canWriteStorage(storage) {
    try {
      await promisify(storage.setItem("@@", 1))
      await promisify(storage.removeItem("@@"))
      return true;
    } catch (crap) {
      console.error(crap)
    }
    return false
  }

  async function writeState(key, state, storage) {
    await promisify(storage.setItem(key, state))
  }

  async function readState(key, storage) {
    try {
      const value = await promisify(storage.getItem(key))
      if (typeof value !== "undefined")
        return value
    } catch (crap) {
      console.error(crap)
    }
    return undefined
  }

  function filter(mutation) {
    return true
  }

  function reducer(state, paths) {
    if (paths.length === 0)
      return state

    return paths.reduce((subState, path) => {
      return set(subState, path, get(state, path))
    }, {})
  }

  function subscriber(store) {
    return h => store.subscribe(h)
  }

  return (store) => {
    const storage = get(options, "storage", (window && window.localStorage))
    const key = get(options, "key", "vuex")
    const paths = get(options, "paths", [])
    const readFn = get(options, "readState", readState)
    const writeFn = get(options, "writeState", writeState)
    const filterFn = get(options, "filter", filter)
    const reducerFn = get(options, "reducer", reducer)
    const subscriberFn = get(options, "subscriber", subscriber)
    const debounceTime = get(options, "debounceTime", false)

    canWriteStorage(storage).then(can => {
      if (!can)
        throw new Error("Invalid storage instance given")
    }).then(() => {
      // Rehydrate state
      readFn(key, storage)
        .then(savedState => {
          if (typeof savedState === "object" && savedState !== null) {
            const storeState = clone(store.state)
            store.replaceState(merge(storeState, savedState))
          }
        })
    })

    const handlerFn = async (mutation, state) => {
      if (!filterFn(mutation))
        return

      await writeFn(key, reducerFn(state, paths), storage)
    }

    subscriberFn(store)(debounceTime !== false
      ? debounce(handlerFn, debounceTime)
      : handlerFn)
  }
}
