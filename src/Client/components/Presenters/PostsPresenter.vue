<script>
  import { Component, Watch, namespace, Vue } from "nuxt-property-decorator"
  import { Debounce } from "lodash-decorators"
  import { booru } from "~/store/booru"
  import { ui } from "~/store/ui"
  import { api } from "~/store/api"
  import TagsPresenter from "~/components/Presenters/TagsPresenter"
  import { unionBy } from "lodash"

  const Booru = namespace("booru")
  const Route = namespace("route")
  const Ui = namespace("ui")
  const Api = namespace("api")

  @Component({
    components: { TagsPresenter },
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

    @Ui.Getter(ui.getters.TagSearchSelected)
    TagSearch
    @Ui.Mutation(ui.mutations.TagSearchSelected)
    SetTagSearch

    @Api.Getter(api.getters.Instance)
    ApiInstance

    isLoading = false
    activeIdx = 0

    get VisiblePosts() {
      return this.Posts.filter(p => p.isVisible)
    }

    @Watch("Posts")
    onPostsChanged(posts, previous) {

      if (this.TagSearch.filter(t => t.type === "unknown")) {

        const typeFixedTags = []
        const map = new Map()
        const allTags = posts.map(post => post.tags).flat()

        for (const tag of allTags) {
          if (map.has(tag.name))
            continue
          map.set(tag.name, true)

          const matchingSearchTag = this.TagSearch.find(t => t.name === tag.name);
          if (matchingSearchTag) {
            typeFixedTags.push({ ...matchingSearchTag, type: tag.type })
          }
        }

        this.SetTagSearch(unionBy(typeFixedTags, this.TagSearch, "name"))
      }


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
          page: parseInt(this.Page, 10) + 1,
        },
      })
    }

    previousPage() {
      this.$router.push({
        name: "tags-page",
        params: {
          tags: this.Tags,
          page: parseInt(this.Page, 10) - 1,
        },
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

    created() {
      this.getPosts()
    }

    render() {
      let root = window.getComputedStyle(document.documentElement)

      const posts = this.VisiblePosts.map((post, idx) => {
        const elevations = {
          'elevation-6': idx == this.activeIdx,
          'elevation-0': idx != this.activeIdx,
        }

        const tags = post.tags.flatMap(p => p.name)
        const thumbnailSize = parseInt(root.getPropertyValue("--thumbnail-image-size").substring(-2), 10)
        const thumbnail = !post.files.isVideo
            ? `/api/thumbnail?size=${thumbnailSize}&imagePath=${this.ApiInstance.imageRoute}${post.files.preview}`
            : post.files.thumbnail

        const tooltipSlots = {
          activator: ({ on }) => {
            return <div
                data-has-sound={post.hasSound}
                data-idx={idx}
                data-file-ext={post.files.extension}
                data-tags={tags.join(" ")}>
              <img src={thumbnail}
                   alt={post.hash}
                   class={{ 'favorite': post.isFavourited }}
                   data-idx={idx}
                   {...{ on }}/>
            </div>
          },
        }

        return <a href={`${this.SourceBooru.href}posts/${post.id}`}
                  data-idx={idx}
                  onClick={this.onPostClicked}
                  onDblclick={this.onPostDoubleClicked}>
          <v-layout class={["align-center", "justify-center", "thumbnail", { ...elevations }]}
                    data-idx={idx}>
            <v-tooltip bottom offset-overflow open-delay="500" close-delay="250" max-width="25vw"
                       scopedSlots={tooltipSlots}>
              <tags-presenter tags={post.tags}/>
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
    margin: $imageMargin;
    // margin: $imageMargin;

    div {
      margin: 0;
      padding: 0;

      img {
        object-fit: cover;
        object-position: 50% 50%;
        max-width: $imageSize;
        max-height: $imageSize;

        // TODO: Other post states, such as deleted, pending, etc
        &.favorite {
          box-shadow: 0px 2px 4px -1px rgba(255, 105, 180, 0.8), 0px 4px 5px 0px rgba(255, 105, 180, 0.6), 0px 1px 10px 0px rgba(255, 105, 180, 0.5) !important;
        }
      }

      &[data-file-ext=".mp4"]::before,
      &[data-file-ext=".swf"]::before,
      &[data-file-ext=".webm"]::before,
      &[data-file-ext=".zip"]::before,
      &[data-tags~="animated"]::before {
        content: "►";
        position: absolute;
        width: 20px;
        height: 20px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        text-align: center;
        line-height: 1.25em;
        font-size: 87.5%;
      }

      &[data-has-sound="true"]::before {
        content: "♪";
        position: absolute;
        width: 20px;
        height: 20px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        text-align: center;
        line-height: 1.25em;
        font-size: 87.5%;
      }

    }

  }

</style>
