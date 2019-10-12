<script>
  import { Component, Vue, namespace } from "nuxt-property-decorator"
  import { api } from "~/store/api"
  import { booru } from "~/store/booru"

  const Api = namespace("api")
  const Booru = namespace("booru")
  const Route = namespace("route")

  @Component
  export default class BooruSwitcherPart extends Vue {

    @Route.State(s => s.params.tags)
    Tags
    @Route.State(s => s.params.Page)
    Page

    @Api.Getter(api.getters.AllEndpoints)
    Endpoints
    @Api.Getter(api.getters.CurrentEndpoint)
    Current
    @Api.Mutation(api.mutations.ChangeEndpoint)
    SetCurrent

    @Booru.Action(booru.actions.RefreshPosts)
    RefreshPosts

    onChange(e) {
      this.SetCurrent(e)

      // When the router loads from cold, Page is a string.
      // When the route is set from code, it's an integer.
      // noinspection EqualityComparisonWithCoercionJS
      if (this.Page == 1) {
        // Refresh posts because you cannot navigate to the same route
        this.RefreshPosts()
        return;
      }

      this.$router.push({
        name: "tags-page",
        params: {
          tags: this.Tags,
          page: 1,
        }
      })
    }

    open() {
      if (!this.$refs.selector)
        return
      this.$refs.selector.activateMenu()
    }

    close() {
      if (!this.$refs.selector)
        return
      this.$refs.selector.isMenuActive = false
    }

    render() {
      return <v-select ref="selector"
                       items={this.Endpoints}
                       value={this.Current}
                       label="Booru Selector"
                       dense
                       hide-details
                       onChange={this.onChange}/>
    }
  }
</script>
