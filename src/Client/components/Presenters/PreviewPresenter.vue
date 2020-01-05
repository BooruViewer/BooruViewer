<script>
  import {Component, Prop, Watch, namespace, Vue} from "nuxt-property-decorator"
  import {TagsPresenter, ImagePresenter} from "~/components"
  import {booru, api} from "~/store"
  import saveAs from "file-saver"

  const BooruNS = namespace("booru")
  const ApiNS = namespace("api")

  @Component({
    components: {TagsPresenter, ImagePresenter}
  })
  export default class PreviewPresenter extends Vue {

    @BooruNS.Getter(booru.SourceBooru)
    SourceBooru

    @BooruNS.Mutation(booru.Notes)
    SetNotes
    @BooruNS.Action(booru.Notes)
    FetchNotes

    @BooruNS.Action(booru.ToggleFavorites)
    ToggleFavorite

    @ApiNS.Getter(api.Instance)
    ApiInstance

    @ApiNS.Getter(api.Endpoint)
    CurrentSite

    @Prop(Object)
    post

    previewUrl = null

    currentPostId = 0

    isLoading = false
    isSaving = false

    imageLoader = null

    created() {
      this.imageLoader = document.createElement("img")
      this.imageLoader.addEventListener("load", this._imageLoaded, false)
    }

    destroy() {
      this.imageLoader.removeEVentListener("load", this._imageLoaded, false)
    }

    _scrollToTop() {
      if (!this.$refs.scroller)
        return

      const osInstance = this.$refs.scroller.osInstance()
      osInstance.scroll({y: '0%'}, 200)
    }

    _scrollLock() {
      if (!this.$refs.scroller)
        return

      const osInstance = this.$refs.scroller.osInstance()
      osInstance.options("overflowBehavior.y", "hidden")
    }

    _scrollUnlock() {
      if (!this.$refs.scroller)
        return

      const osInstance = this.$refs.scroller.osInstance()
      osInstance.options("overflowBehavior.y", "scroll")
    }

    _startPostDownload() {
      const url = this.ApiInstance.imageBasePath + this.post.files.original
      const name = `${this.SourceBooru.name}-${this.post.hash}${this.post.files.extension}`

      this._scrollToTop()
      this._scrollLock()
      this.isSaving = true
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          saveAs(blob, name)
          this._scrollUnlock()
          this.isSaving = false
        })
    }

    _predownloadImage() {
      // Sanity check to ensure we're downloading the correct post
      if (this.currentPostId !== this.post.id)
        this.imageLoader.src = ""

      this.currentPostId = this.post.id
      this.imageLoader.src = this.ApiInstance.imageBasePath + this.post.files.preview
    }

    _imageLoaded() {
      // Sanity check to ensure we're displaying the correct post
      if (!!this.post && this.currentPostId !== this.post.id)
        return

      this.previewUrl = this.ApiInstance.imageBasePath + this.post.files.preview
      this.isLoading = false
    }

    @Watch("post")
    _postChanged(post, previousPost) {
      if (!post)
        return

      if (this.isSaving && post !== previousPost) {
        this.post = post
        return;
      }

      this.SetNotes([])
      this._scrollToTop()

      this.previewUrl = post.files.thumbnail
      this.isLoading = true
      this._predownloadImage()
    }

    _onFavoriteClicked(e) {
      // TODO: Ensure user is authenticated then call this.ToggleFavorite
    }

    __renderNoPost() {
      return <div>
        <h1>Oh noes!</h1>
        <p>There appears to be no posts available!</p>
      </div>
    }

    __renderPostScores() {
      const filledHeart = <v-icon small onClick={this._onFavoriteClicked}>mdi-heart</v-icon>
      const hollowHeart = <v-icon small onClick={this._onFavoriteClicked}>mdi-heart-outline</v-icon>
      return <span class="post-scores">
              <h1>Score&nbsp;</h1>
              <span class="fav-count">
                {this.post.favourites}&nbsp;
                {this.post.isFavourited ? filledHeart : hollowHeart}&nbsp;
              </span>
            </span>
    }

    __renderPostVotes() {
      // TODO: Implement voting!?
      const thumbsUp = <v-icon small>{this.post.isFavourited ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'}</v-icon>
      const thumbsDown = <v-icon small>mdi-thumb-down-outline</v-icon>
      return <span class="score">
              {this.post.score}&nbsp;{thumbsUp}&nbsp;{thumbsDown}&nbsp;
            </span>
    }

    __renderPostUploader() {
      return <span class="uploader-name">
              <h1>Uploader</h1>&nbsp;
        <a href="#">{this.post.uploader.friendlyName}</a>&nbsp;
        <time class="created-at" title={this.$moment(this.post.uploadedAt).fromNow()}>
                {this.$moment(this.post.uploadedAt).fromNow()}&nbsp;
              </time>
            </span>
    }

    __renderPostRating() {
      return <span class="rating">
              <h1>Rating</h1>&nbsp;{this.post.rating}&nbsp;
            </span>
    }

    __renderPostSource() {
      let hrefSrc, textSrc
      if (this.post.source) {
        hrefSrc = <span><a href={this.post.source.href}>{this.post.source.friendlyName}</a></span>
        textSrc = <span>{this.post.source.friendlyName}</span>
      }
      const naSrc = <span>N/A</span>
      const src = this.post.source
        ? this.post.source.href
          ? hrefSrc
          : textSrc
        : naSrc;
      return <span class="source">
              <h1>Source</h1>&nbsp;{src}&nbsp;
            </span>
    }

    __renderPostDimensions() {
      return <span class="dimensions">
              <h1>Size</h1>&nbsp;{this.post.size.width}x{this.post.size.height}&nbsp;
            </span>
    }

    __renderPostMedia() {
      const clickEventHandlers = {
        'dblclick': this._startPostDownload,
      }

      return <ImagePresenter media={this.post} media-click-handlers={clickEventHandlers} preview-url={this.previewUrl}
                             is-loading={this.isLoading}/>
    }

    render() {
      if (!this.post)
        return this.__renderNoPost();

      return <overlay-scrollbars ref="scroller"
                                 options={{overflowBehaviour: {x: 'h'}, scrollbars: {autoHide: 'leave'}}}>
        <div style="margin-right: 12.5px">
          <div class="preview">
            <div class="metadata">
              {this.__renderPostScores()}
              {this.__renderPostVotes()}
              {this.__renderPostUploader()}
              {this.__renderPostRating()}
              {this.__renderPostSource()}
              {this.__renderPostDimensions()}
            </div>
            <div class="tags">
              <TagsPresenter tags={this.post.tags} isChipStyle={true}/>
            </div>
            {this.__renderPostMedia()}

            <v-overlay absolute value={this.isSaving}>
              <v-progress-circular inderterminate color="primary"/>
            </v-overlay>
          </div>
        </div>
      </overlay-scrollbars>

    }

  }
</script>

<style lang="scss">

  .preview {
    margin: .25vw .25vh;
    max-width: 100%;

    .metadata {
      margin-right: 1em;
      display: inline;

      h1 {
        display: inline;
        font-size: 1em;
      }

      .tag-list {
        ul {
          display: inline;
        }

        li {
          display: inline-block;
        }

        &.tag-list-inline {
          display: inline;
          font-size: 1em;

          ul {
            margin: 0 !important;
            padding: 0 !important;
          }

          .v-icon {
            vertical-align: unset;
          }
        }
      }

    }

    .post-body {
      max-width: 100%;

      .contentStack {
        display: grid;
        place-items: center;
        position: relative;
        margin: 0 auto;

        > * {
          grid-area: 1 / 1 / auto / auto;
        }
      }

    }
  }


</style>
