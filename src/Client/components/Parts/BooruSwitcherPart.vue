<script>
    import {Component, namespace, mixins} from "nuxt-property-decorator"
    import { RouteParamsMixin} from "~/mixins";
    import { booru, api } from "~/store"

    const BooruNS = namespace("booru")
    const ApiNS = namespace("api")

    @Component({})
    export default class BooruSwitcherPart extends mixins(RouteParamsMixin) {

      @ApiNS.Getter(api.Endpoints)
      Endpoints
      @ApiNS.Getter(api.Endpoint)
      Current
      @ApiNS.Mutation(api.Endpoint)
      SetCurrent

      @BooruNS.Action(booru.Posts)
      RefreshPosts

      _onChange(e) {
        // Sanity check
        if (e === this.Current)
          return

        this.SetCurrent(e)

        if (this.Page === 1) {
          this.RefreshPosts()
          return
        }

        this.$router.push({
          name: "page-tags",
          params: {
            tags: this.Tags,
            page: 1,
          }
        })
      }

      open() {
        if (!this.$refs.selector)
          return
        this.$refs.selector.activateMenu();
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
                         onChange={this._onChange}
                         />
      }
    }
</script>

<style lang="scss">

</style>
