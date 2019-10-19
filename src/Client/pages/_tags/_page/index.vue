<script>
  import { Component, namespace, Vue } from "nuxt-property-decorator"
  import { ui } from "~/store/ui"
  import SplitView from "~/components/SplitView"
  import PostsPresenter from "~/components/Presenters/PostsPresenter"
  import PreviewPresenter from "~/components/Presenters/PreviewPresenter"

  const Ui = namespace("ui")
  const Route = namespace("route")

  @Component({
    components: {
      SplitView, PostsPresenter, PreviewPresenter
    },
  })
  export default class Index extends Vue {

    @Route.State(s => s.params.tags)
    Tags

    @Ui.Getter(ui.getters.PaneWidths)
    PaneWidths

    @Ui.Mutation(ui.mutations.PaneWidths)
    SetPaneWidths

    @Ui.Getter(ui.getters.TagSearchSelected)
    TagSearch
    @Ui.Mutation(ui.mutations.TagSearchSelected)
    SetTagSearch

    image = null

    created() {
      const tagsRoute = this.TagSearch.map(t => t.name).join("+")

      if (tagsRoute !== this.Tags) {
        if (this.Tags === "*") {
          this.SetTagSearch([])
          return
        }

        const tags = this.Tags.split(/\+/g)
            .map(s => ({
              name: s,
              type: "unknown",
              count: -1,
            }))
        this.SetTagSearch(tags)
      }
    }

    onResized(widths) {
      console.log("Resized!")
      this.SetPaneWidths(widths)
    }

    onPostSelected(e) {
      this.image = e
    }

    render(h) {
      return <div style="height: 100%;">
        <split-view onResized={this.onResized} min-width={20} max-width={80} default-width="50vw">
          <template slot="left-content">
            <div class="pane" style={{ width: this.PaneWidths.left, 'min-width': '20vw' }}>
              <posts-presenter onPostSelected={this.onPostSelected} />
            </div>
          </template>
          <template slot="right-content">
            <div class="pane" style={{ width: this.PaneWidths.right, 'min-width': '20vw' }}>
              <preview-presenter image={this.image} />
            </div>
          </template>
        </split-view>
      </div>
    }
  }
</script>

<style scoped land="scss">
  .pane {
    overflow-x: hidden;
  }
</style>
