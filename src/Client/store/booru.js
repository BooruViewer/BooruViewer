import { api } from "~/store"

const options = {
  hidePostsWhileLoading: true,
}

export const booru = {
  Posts: "__posts",
  Limit: "__limit",
  SourceBooru: "__sourceBooru",
  Notes: "__notes",
  RelatedTags: "__relatedTags",
  SavedSearches: "__savedSearches",
  TagSearchResults: "__tagSearchResults",
  ToggleFavorites: "__toggleFavorites",
}

export const state = () => ({
  posts: [],
  limit: 100,
  sourceBooru: null,
  notes: [],
  relatedTags: [],
  savedSearches: [],
  autocompleteResults: [],
  blacklist: ["*"]
})

export const getters = {
  [booru.Posts]: s => s.posts,
  [booru.Limit]: s => s.limit,
  [booru.SourceBooru]: s => s.sourceBooru,
  [booru.Notes]: s => s.notes,
  [booru.RelatedTags]: s => s.relatedTags,
  [booru.SavedSearches]: s => s.savedSearches,
  [booru.TagSearchResults]: s => s.autocompleteResults,
}

export const mutations = {
  [booru.Posts]: (s, p) => s.posts = p,
  [booru.Limit]: (s, p) => s.limit = p,
  [booru.SourceBooru]: (s, p) => s.sourceBooru = p,
  [booru.Notes]: (s, p) => s.notes = p,
  [booru.RelatedTags]: (s, p) => s.relatedTags = p,
  [booru.SavedSearches]: (s, p) => s.savedSearches = p,
  [booru.TagSearchResults]: (s, p) => s.autocompleteResults = p,
  [booru.ToggleFavorites](state, postId) {
    const post = state.posts.find(p => p.Id === postId)

    post.isFavourited = !post.isFavourited

    if (post.isFavourited) post.favourites++
    else post.favourites--
  }
}

export const actions = {
  async [booru.Posts](context) {
    const { state, commit, rootGetters, rootState, dispatch } = context

    if (options.hidePostsWhileLoading)
      commit(booru.Posts, [])

    dispatch('api/' + api.Initialize, null, { root: true })
    const app = rootGetters['api/' + api.Instance]

    // TODO: Ensure the user is authenticated?

    let tags = rootState.route.params.tags || ""

    const res = await app.getPosts(tags.replace(/\+/g, " "), rootState.route.params.page, state.limit)
    if (res.isSuccess) {
      commit(booru.SourceBooru, res.data.sourceBooru)
      commit(booru.Posts, res.data.posts)
    } else {
      // commIt('ui/' + ui.error, res.error) // TODO!
      throw new Error(res.error.message)
    }
  }
}
