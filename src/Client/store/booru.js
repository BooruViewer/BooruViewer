import { api as apis } from "~/store/api"

const options = {
  hidePostsWhileLoading: true,
}

export const booru = {
  getters: {
    Posts: "getPosts",
    Limit: "getLimit",
    SourceBooru: "getSourceBooru",
    Notes: "getNotes",
  },
  mutations: {
    Posts: "setPosts",
    Limit: "setLimit",
    SourceBooru: "setSourceBooru",
    Notes: "setNotes",
  },
  actions: {
    FetchPosts: "fetchPosts",
    RefreshPosts: "refreshPosts",
    FetchNotes: "fetchNotes",
    ClearNotes: "clearNotes",
  },
}

export const state = () => ({
  posts: [],
  notes: [],
  limit: 100,
  sourceBooru: null,
  blacklist: ["*"],
})

export const getters = {
  [booru.getters.Posts]: s => s.posts,
  [booru.getters.Notes]: s => s.notes,
  [booru.getters.Limit]: s => s.limit,
  [booru.getters.SourceBooru]: s => s.sourceBooru,
}

export const mutations = {
  [booru.mutations.Posts](state, posts) {
    state.posts = posts
  },
  [booru.mutations.Notes](state, notes) {
    state.notes = notes
  },
  [booru.mutations.Limit](state, limit) {
    state.limit = limit
  },
  [booru.mutations.SourceBooru](state, val) {
    state.sourceBooru = val
  },
}

export const actions = {
  async [booru.actions.FetchPosts](context) {
    const { state, commit, rootGetters, rootState, dispatch } = context

    if (options.hidePostsWhileLoading)
      commit(booru.mutations.Posts, [])

    dispatch('api/' + apis.actions.Initialize, null, { root: true })
    const api = rootGetters['api/' + apis.getters.Instance]

    // await dispatch('auth/ensureAuth', null, { root: true })

    let tags = rootState.route.params.tags
    if (tags === "*")
      tags = ""

    const res = await api.getPosts(tags, rootState.route.params.page, state.limit)
    if (res.isSuccess) {
      commit(booru.mutations.SourceBooru, res.data.sourceBooru)
      commit(booru.mutations.Posts, res.data.posts)
    } else {
      throw new Error(res.error.message)
    }
  },
  [booru.actions.RefreshPosts]({ dispatch }) {
    dispatch(booru.actions.FetchPosts)
  },
  async [booru.actions.FetchNotes](context, postId) {
    const { commit, rootGetters, dispatch } = context

    dispatch('api/' + apis.actions.Initialize, null, { root: true })
    const api = rootGetters['api/' + apis.getters.Instance]

    // await dispatch('auth/ensureAuth', null, { root: true })

    const id = postId.id || postId.postId || postId

    const res = await api.getNotes(id)
    if (res.isSuccess) {
      commit(booru.mutations.Notes, res.data)
    } else {
      throw new Error(res.error.nessage);
    }
  },
  [booru.actions.ClearNotes]({ commit }) {
    commit(booru.mutations.Notes, [])
  }
}



