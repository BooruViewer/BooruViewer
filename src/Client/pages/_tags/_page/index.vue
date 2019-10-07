<script>
  import { Component, namespace, Vue } from "nuxt-property-decorator"
  import { ui } from "~/store/ui"
  import SplitView from "~/components/SplitView"
  import PostsPresenter from "~/components/Presenters/PostsPresenter"
  import PreviewPresenter from "~/components/Presenters/PreviewPresenter"

  const Ui = namespace("ui")


  @Component({
    components: {
      SplitView, PostsPresenter, PreviewPresenter
    },
  })
  export default class Index extends Vue {

    @Ui.Getter(ui.getters.PaneWidths)
    PaneWidths

    @Ui.Mutation(ui.mutations.PaneWidths)
    SetPaneWidths

    image = null

    onResized(widths) {
      console.log("Resized!")
      this.SetPaneWidths(widths)
    }

    onPostSelected(e) {
      this.image = e
    }

    render(h) {
      return <div>
        <split-view style="height: calc(100vh - 24px - 64px)" onResized={this.onResized}>
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
