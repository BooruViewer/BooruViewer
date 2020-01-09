<script>
  import {Component, namespace, Vue} from "nuxt-property-decorator"
  import {SplitView, PostsPresenter, PreviewPresenter} from "~/components"
  import { ui } from "~/store"

  const UiNS = namespace("ui")

  @Component({
    components: {
      SplitView, PostsPresenter, PreviewPresenter
    }
  })
  export default class TagsPage extends Vue {

    @UiNS.Getter(ui.SplitViewOrientation)
    SplitViewOrientation
    @UiNS.Getter(ui.SplitViewOrientations)
    SplitViewOrientations

    @UiNS.Getter(ui.FirstPaneSize)
    FirstPaneSize
    @UiNS.Getter(ui.LastPaneSize)
    LastPaneSize

    @UiNS.Mutation(ui.FirstPaneSize)
    SetFirstPaneSize
    @UiNS.Mutation(ui.LastPaneSize)
    SetLastPaneSize

    post = null

    // Nuxt.js magic method.
    validate({params}) {
      return /^\d+$/.test(params.page)
    }

    // This is the key for vue router
    key() {
      // Set it to static to re-use components
      return "page-tags"
    }

    _svResized({ firstPaneSize, lastPaneSize }) {
      console.log(firstPaneSize, lastPaneSize)
      this.SetFirstPaneSize(firstPaneSize)
      this.SetLastPaneSize(lastPaneSize)
    }

    _postSelected(post) {
      this.post = post
    }

    render() {
      const isHorizontal = this.SplitViewOrientation === this.SplitViewOrientations.Horizontal

      const minSize = isHorizontal ? 33 : 20
      const maxSize = isHorizontal ? 66 : 80

      const firstPaneStyle = {
        width: !isHorizontal ? this.FirstPaneSize : null,
        height: isHorizontal ? this.FirstPaneSize : null,
        'min-width': !isHorizontal ? "20vw" : null,
        'min-height':  isHorizontal ? "20vh" : null,
      }
      const lastPaneStyle = {
        width: !isHorizontal ? this.LastPaneSize : null,
        height: isHorizontal ? this.LastPaneSize : null,
        'min-width': !isHorizontal ? "20vw" : null,
        'min-height':  isHorizontal ? "20vh" : null,
      }

      return <div style="height: 100%">
        <split-view onResized={this._svResized} min-size={minSize} max-size={maxSize} default-width="50vw" default-height="50vh" horizontal={isHorizontal}>
          <template slot="left-content">
            <div class="pane" style={firstPaneStyle}>
              <PostsPresenter onPostSelected={this._postSelected} />
            </div>
          </template>
          <template slot="right-content">
            <div class="pane" style={lastPaneStyle}>
              <PreviewPresenter post={this.post} />
            </div>
          </template>
        </split-view>
      </div>

    }

  }
</script>

<style lang="scss">

  .pane {
    overflow-x: hidden;
  }

</style>
