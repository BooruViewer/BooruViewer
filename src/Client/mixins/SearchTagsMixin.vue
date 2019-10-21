<!--suppress UnnecessaryReturnStatementJS -->
<script>
  import { Component, Vue, mixins, namespace } from "nuxt-property-decorator"
  import { booru } from "~/store/booru"
  import { ui } from "~/store/ui"

  const Booru = namespace("booru")
  const Route = namespace("route")
  const Ui = namespace("ui")

  @Component
  export default class SearchTagsMixin extends Vue {

    @Route.State(s => s.params.tags)
    CurrentTags
    @Route.State(s => s.params.page)
    CurrentPage

    @Ui.Getter(ui.getters.TagSearchSelected)
    SearchedTags

    @Booru.Action(booru.actions.RefreshPosts)
    RefreshPosts

    get page() {
      return parseInt(this.CurrentPage, 10)
    }

    SearchTags(tags) {
      if (typeof tags === "string") {
        if (this.CurrentTags === tags && this.page === 1) {
          this.RefreshPosts()
          return
        }

        this.$router.push({
          name: "tags-page",
          params: {
            tags,
            page: 1,
          },
        })
        return
      }

      let tagObjs

      if (typeof tags === "object") {
        tagObjs = tags
      } else {
        tagObjs = this.SearchedTags
      }

      if (tagObjs.length === 0) {
        tagObjs = [{ name: "*" }]
      }

      const searchTags = tagObjs.map(obj => obj.name).join("+")
      if (searchTags === this.currentTags && this.page === 1) {
        this.RefreshPosts()
        return
      }

      this.$router.push({
        name: 'tags-page',
        params: {
          tags: searchTags,
          page: 1,
        },
      })
    }

  }
</script>
