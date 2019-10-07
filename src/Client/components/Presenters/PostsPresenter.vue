<script>
  import { Component, Watch, namespace, Vue } from "nuxt-property-decorator"
  import { Debounce } from "lodash-decorators"
  import { booru } from "~/store/booru"
  import TagsPresenter from "~/components/TagsPresenter"

  const Booru = namespace("nbooru")
  const Route = namespace("route")

  @Component({
    components: {TagsPresenter},
  })
  export default class PostsPresenter extends Vue {

    @Route.State(s => s.params.page)
    Page
    @Route.State(s => s.params.tags)
    Tags

    @Booru.Getter(booru.getters.Posts)
    Posts
    @Booru.Getter(booru.getters.Limit)
    Limit
    @Booru.Getter(booru.getters.SourceBooru)
    SourceBooru
    @Booru.Action(booru.actions.FetchPosts)
    FetchPosts

    isLoading = false
    activeIdx = 0

    get VisiblePosts() {
      return this.Posts.filter(p => p.isVisible)
    }

    @Watch("Posts")
    onPostsChanged(posts, previous) {
      if (posts.length > 0) { // Loaded
        this.isLoading = false
        this.$emit("postSelected", this.VisiblePosts[0])
      } else { // Loading
        this.isLoading = true
        this.$emit("postSelected", null)
      }
    }

    nextPage() {
      this.$router.push({
        name: "tags-page",
        params: {
          tags: this.Tags,
          page: this.Page + 1,
        }
      })
    }

    previousPage() {
      this.$router.push({
        name: "tags-page",
        params: {
          tags: this.Tags,
          page: this.Page - 1,
        }
      })
    }

    onPostClicked(e) {
      if (e.button === 1)
        return
      if (e.ctrlKey)
        return

      e.stopPropagation()
      e.preventDefault()

      const { idx } = e.target.dataset
      const post = this.VisiblePosts[idx]

      this.activeIdx = idx
      this.$emit('postSelected', post)
    }

    onPostDoubleClicked(e) {
      const { idx } = e.target.dataset
      const post = this.VisiblePosts[idx]

      window.open(`${this.SourceBooru.href}posts/${post.id}`, '_blank')
    }

    @Debounce(500)
    getPosts() {
      this.isLoading = true
      this.activeIdx = 0

      return this.FetchPosts()
          .catch(console.error)
          .then(() => {
            this.$emit('postSelected', this.VisiblePosts[0])
            this.isLoading = false
          })
    }

    render() {

      const posts = this.VisiblePosts.map((post, idx) => {
        const elevations = {
          'elevation-6': idx === this.activeIdx,
          'elevation-0': idx !== this.activeIdx,
        }

        const tooltipSlots = {
          activator: ({ on }) => {
            return <img src={post.files && post.files.thumbnail}
                        alt={post.hash}
                        class={{ 'favorite': post.isFavourited }}
                        data-idx={idx}
                        {...{ on }}/>
          },
        }

        return <a href={`${this.SourceBooru.href}posts/${post.id}`}
                  data-idx={idx}
                  onClick={this.onPostClicked}
                  onDblclick={this.onPostDoubleClicked}>
          <v-layout class={["align-center", "justify-center", "thumbnail", { ...elevations }]}
                    data-idx={idx}>
            <v-tooltip bottom offset-overflow open-delay="500" close-delay="250" max-width="25vw" scopedSlots={tooltipSlots}>
              <tags-presenter tags={post.tags} />
            </v-tooltip>
          </v-layout>
        </a>
      })

      return <overlay-scrollbars options={{ overflowBehavior: { x: 'h' }, scrollbars: { autoHide: "leave" } }}
                                 ref="scroller">
        <v-layout class="align-start justify-center wrap os-host-flexbox">
          {posts}
        </v-layout>

        <v-layout style="bottom: 0px">
          <v-btn icon onClick={this.previousPage} disabled={this.Page <= 1}>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-spacer/>
          <v-btn icon onClick={this.nextPage} disabled={this.Posts.length !== this.Limit}>
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-layout>

        <v-overlay value={this.isLoading} absolute={true}>
          <v-progress-circular indeterminate color="primary"/>
        </v-overlay>
      </overlay-scrollbars>
    }
  }
</script>

<style lang="scss">

  .thumbnail {

    $imageSize: var(--thumbnail-image-size);
    $imageMargin: 5px 10px;

    height: $imageSize;
    width: $imageSize;
    // margin: $imageMargin;

    img {
      object-fit: contain;

      // TODO: Other post states, such as deleted, pending, etc
      &.favorite {
        box-shadow: 0px 2px 4px -1px rgba(255, 105, 180, 0.8), 0px 4px 5px 0px rgba(255, 105, 180, 0.6), 0px 1px 10px 0px rgba(255, 105, 180, 0.5) !important;
      }
    }

  }

</style>
