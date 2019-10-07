<script>
  import { Component, Vue } from "nuxt-property-decorator"
  import SplitView from "~/components/SplitView"
  import PostsPresenter from "~/components/Presenters/PostsPresenter"


  @Component({
    components: {
      SplitView, PostsPresenter
    },
  })
  export default class Index extends Vue {

    image = null

    onResized(widths) {
      console.log("Resized!")
    }

    onPostSelected(e) {
      this.image = e
    }

    render(h) {
      return <div>
        <split-view style="height: calc(100vh - 24px - 64px)" onResized={this.onResized}>
          <template slot="left-content">
            <div class="pane" style={{ 'min-width': '20vw' }}>
              <posts-presenter onPostSelected={this.onPostSelected} />
            </div>
          </template>
          <template slot="right-content">
            <div class="pane" style={{ 'min-width': '20vw' }}>

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
