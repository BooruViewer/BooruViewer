<script>
  import {Component, Watch, namespace, Vue} from "nuxt-property-decorator"
  import {booru} from "~/store"
  import {TagsPresenter} from "~/components";
  import { debounce } from "lodash"

  const RouteNS = namespace("route")
  const BooruNS = namespace("booru")

  @Component({
    components: {TagsPresenter}
  })
  export default class PostsPresenter extends Vue {

    @RouteNS.State(s => s.params.tags)
    Tags
    @RouteNS.State(s => s.params.page)
    _page

    @BooruNS.Getter(booru.Posts)
    Posts
    @BooruNS.Getter(booru.Limit)
    Limit
    @BooruNS.Getter(booru.SourceBooru)
    SourceBooru
    @BooruNS.Action(booru.Posts)
    FetchPosts

    isLoading = false
    activeIdx = 0

    getPosts = debounce(this._getPosts, 500)

    get VisiblePosts() {
      if (!this.Posts)
        return []
      return this.Posts.filter(p => p.isVisible)
    }

    get Page() {
      return parseInt(this._page, 10)
    }

    created() {
      this._getPosts()
    }

    @Watch("_page")
    _pageChanged() {
      this.getPosts()
    }

    @Watch("tags")
    _tagsChanged() {
      this.getPosts()
    }

    _getPosts() {
      this.isLoading = true
      this.activeIdx = 0

      return this.FetchPosts()
        .then(() => {
          this.$emit('postSelected', this.VisiblePosts[0])
          this.isLoading = false
        })
        .catch(console.error)
    }

    __postClicked(e) {
      if (e.button === 1)
        return
      if (e.ctrlKey)
        return

      e.stopPropagation()
      e.preventDefault()

      const {idx} = e.target.dataset
      const post = this.VisiblePosts[idx]

      this.activeIdx = idx
      this.$emit('postSelected', post)
    }

    __postDoubleClicked(e) {
      const {idx} = e.target.dataset
      const post = this.VisiblePosts[idx]

      window.open(`${this.SourceBooru.href}posts/${post.id}`, '_blank')
    }

    __previousClicked(e) {
      this.$router.push({
        name: "page-tags",
        params: {
          page: this.Page - 1
        }
      })
    }

    __nextClicked(e) {
      this.$router.push({
        name: "page-tags",
        params: {
          page: this.Page + 1
        }
      })
    }

    _renderPost(post, index) {
      const elevations = {
        'elevation-6': index == this.activeIdx,
        'elevation-0': index != this.activeIdx,
      }

      const tags = post.tags.flatMap(t => t.name)
      const imageClasses = {
        'favorite': post.isFavourited,
        'pending': post.isPending,
        'deleted': post.isDeleted,
      }

      const tooltipSlots = {
        activator: ({on}) => {
          return <div
            data-has-sound={post.hasSound}
            data-is-favorite={post.isFavourited}
            data-is-pending={post.isPending}
            data-idx={index}
            data-file-ext={post.files.extension}
            data-tags={tags.join(" ")}
          >
            <img src={post.files && post.files.thumbnail}
                 alt={post.hash}
                 class={imageClasses}
                 data-idx={index}
                 {...{on}}
            />
          </div>
        }
      }

      return <a href={`${this.SourceBooru.href}posts/${post.id}`}
                data-idx={index}
                onClick={this.__postClicked}
                onDblClick={this.__postDoubleClicked}>
        <v-layout class={["align-center", "justify-center", "thumbnail", {...elevations}]}
                  data-idx={index}>
          <v-tooltip bottom offset-overflow open-delay="500" close-delay="250" max-width="25vw"
                     scopedSlots={tooltipSlots}>
            <TagsPresenter tags={post.tags}/>
          </v-tooltip>
        </v-layout>
      </a>
    }

    render() {
      const posts = this.VisiblePosts.map(this._renderPost);

      return <overlay-scrollbars ref="scroller">
        <v-layout class="align-center justify-center wrap os-host-flexbox">
          {posts}
        </v-layout>

        <v-layout style="bottom: 0">
          <v-btn icon onClick={this.__previousClicked} disabled={this.Page <= 1}>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-spacer/>
          <v-btn icon onClick={this.__nextClicked} disabled={this.Posts.length !== this.Limit}>
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-layout>

        <v-overlay value={this.isLoading} absolute>
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

    img {
      object-fit: cover;
      max-width: $imageSize;
      max-height: $imageSize;

      &.favorite {
        box-shadow: 0px 2px 4px -1px rgba(255, 105, 180, 0.8), 0px 4px 5px 0px rgba(255, 105, 180, 0.6), 0px 1px 10px 0px rgba(255, 105, 180, 0.5) !important;
      }

      &.pending {
        box-shadow: 0px 2px 4px -1px rgba(238, 255, 65, 0.8), 0px 4px 5px 0px rgba(238, 255, 65, 0.6), 0px 1px 10px 0px rgba(238, 255, 65, 0.5);
      }

      &.deleted {
        box-shadow: 0px 2px 4px -1px rgba(216, 67, 21, 0.8), 0px 4px 5px 0px rgba(216, 67, 21, 0.6), 0px 1px 10px 0px rgba(0216, 67, 21, 0.5);
      }
    }

    div {

      @mixin post-icon-style {
        position: absolute;
        width: 20px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        text-align: center;
        line-height: 1.25em;
        font-size: 87.5%;
      }

      &[data-file-ext=".mp4"]::before,
      &[data-file-ext=".swf"]::before,
      &[data-file-ext=".webm"]::before,
      &[data-file-ext=".zip"]::before,
      &[data-tags~="animated"]::before {
        @include post-icon-style;

        content: "►";
        height: 20px;
      }

      &[data-has-sound="true"]::before {
        @include post-icon-style;

        content: "♪";
        height: 20px;
      }

      &[data-file-ext=".mp4"][data-has-sound="true"]::before,
      &[data-file-ext=".swf"][data-has-sound="true"]::before,
      &[data-file-ext=".webm"][data-has-sound="true"]::before,
      &[data-file-ext=".zip"][data-has-sound="true"]::before,
      &[data-tags~="animated"][data-has-sound="true"]::before {
        @include post-icon-style;

        content: "► ♪";
        height: 40px;
      }
    }

  }

</style>
