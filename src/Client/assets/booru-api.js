import qs from "qs"

const qsOpts = {
  arrayFormat: "repeat",
}

export class BooruApi {

  constructor(endpoint) {
    this.endpoint = endpoint
  }

  authenticate(username, password) {
    const route = `/api/${this.endpoint}/auth`

    const params = {
      username,
      password,
    }

    return fetch(route + '?' + qs.stringify(params, qsOpts))
      .then(res => res.json())
  }

  getPosts(tags, page, limit) {
    const route = `/api/${this.endpoint}/posts`

    const params = {
      page,
      limit,
      tags,
      // tagOrder: BooruApi.TagOrder,
    }

    return fetch(route + '?' + qs.stringify(params, qsOpts))
      .then(res => res.json());
  }

  get imageRoute() {
    return `/api/${this.endpoint}/image/`
  }

  getNotes(postId) {
    const route = `/api/${this.endpoint}/notes/${postId}`

    const params = {}

    return fetch(route + '?' + qs.stringify(params, qsOpts))
      .then(res => res.json())
  }

  getAutocompleteSuggestions(tag) {
    const route = `/api/${this.endpoint}/autocomplete`

    const params = {
      tag,
      limit: 7,
    }

    return fetch(route + '?' + qs.stringify(params, qsOpts))
      .then(res => res.json())
  }

  getRelatedTags(tags) {
    const route = `/api/${this.endpoint}/related-tags`

    const params = {
      tags,
    }

    return fetch(route + '?' + qs.stringify(params, qsOpts))
      .then(res => res.json());
  }

  addFavorite(postId) {
    const route = `/api/${this.endpoint}/favorites/add/${postId}`

    return fetch(route)
      .then(res => res.json());
  }

  removeFavorite(postId) {
    const route = `/api/${this.endpoint}/favorites/remove/${postId}`

    return fetch(route)
      .then(res => res.json());
  }

}
