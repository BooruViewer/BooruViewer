<script>
  import {Component, namespace, Vue} from "nuxt-property-decorator"
  import {SplitView, PostsPresenter, PreviewPresenter} from "~/components"

  @Component({
    components: {
      SplitView, PostsPresenter, PreviewPresenter
    }
  })
  export default class TagsPage extends Vue {

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

    _svResized(size) {
      // TODO: Store sizes in persistance
    }

    _postSelected(post) {
      this.post = post
    }

    render() {
      const isHorizontal = false

      const minHeight = isHorizontal ? 33 : 20
      const minWidth = isHorizontal ? 66 : 80

      const firstPaneStyle = {
        width: !isHorizontal ? "50vw" : null, // TODO: Replace with width/height from presisted state
        height: isHorizontal ? "50vh" : null, // TODO: Replace with width/height from presisted state
        'min-width': !isHorizontal ? "20vw" : null,
        'min-height':  isHorizontal ? "20vh" : null,
      }
      const lastPaneStyle = {
        width: !isHorizontal ? "50vw" : null, // TODO: Replace with width/height from presisted state
        height: isHorizontal ? "50vh" : null, // TODO: Replace with width/height from presisted state
        'min-width': !isHorizontal ? "20vw" : null,
        'min-height':  isHorizontal ? "20vh" : null,
      }

      return <div style="height: 100%">
        <split-view onResized={this._svResized} min-width={minWidth} min-height={minHeight} default-width="50vw" default-height="50vh" horizontal={isHorizontal}>
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
