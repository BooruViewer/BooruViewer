import qs from "qs"

const qsOpts = {
  arrayFormat: "repeat",
}

// TODO: Make the BooruAPI class capability aware. The server should respond with what endpoints it supports, and what features those endpoints support.
// This would be done via the class having a `getCapabilities` method that would be called, and then a `setEndpoint` method (along with `getEndpoints`)
// Methods on this class would then check to see if the current endpoint supports the method being used. EG: Some sites might not have "Saved Searches"
export class BooruApi {

  constructor(endpoint) {
    this.endpoint = endpoint
  }

  authenticate(username, password) {
    const route = `${this.__routePrefix}/auth`

    const params = { username, password }

    return this.__createRequest(route, params)
      .then(res => res.json())
  }

  getPosts(tags, page, limit) {
    const route = `${this.__routePrefix}/posts`

    const params = { tags, page, limit }

    return this.__createRequest(route, params)
      .then(res => res.json())
  }

  getNotes(postId) {
    const route = `${this.__routePrefix}/notes/${postId}`

    const params = {  }

    return this.__createRequest(route, params)
      .then(res => res.json())
  }

  getAutocompleteSuggestions(tag) {
    const route = `${this.__routePrefix}/autocomplete`

    const params = { tag, limit: 7 }

    return this.__createRequest(route, params)
      .then(res => res.json())
  }

  getRelatedTags(tags) {
    const route = `${this.__routePrefix}/related-tags`

    const params = { tags }

    return this.__createRequest(route, params)
      .then(res => res.json())
  }

  setFavorite(postId, isFavorite) {
    let route = `${this.__routePrefix}/favorites/`
    route += isFavorite ? 'add' : 'remove'
    route += `/${postId}`

    const params = { }

    return this.__createRequest(route, params)
      .then(res => res.json())
  }

  getSavedSearches() {
    const route = `${this.__routePrefix}/saved-searches`

    const params = { }

    return this.__createRequest(route, params)
      .then(res => res.json())
  }

  get imageBasePath() {
    return `${this.__routePrefix}/image/`
  }

  get __routePrefix() {
    return `/api/${this.endpoint}`
  }

  __createRequest(to, _with) {
    return fetch(to + '?' + qs.stringify(_with, qsOpts))
  }

}
