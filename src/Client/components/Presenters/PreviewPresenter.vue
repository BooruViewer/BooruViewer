<script>
  import { Component, Prop, Watch, namespace, Vue } from "nuxt-property-decorator"
  import saveAs from "file-saver"
  import TagsPresenter from "~/components/TagsPresenter"
  import { booru } from "~/store/booru"
  import { api } from "~/store/api"

  const Booru = namespace("booru")
  const Api = namespace("api")

  // Example post for notes. Contains lots of notes, of various sizes and locations.
  // https://danbooru.donmai.us/posts/784834
  // https://danbooru.donmai.us/notes.json?group_by=note&search[post_id]=784834
  // Example implementation: https://github.com/bipface/galkontinuum/blob/66269ec2d1590b89180bc215deba105542843ba2/galkontinuum-debug.user.js#L1504
  @Component({
    components: { TagsPresenter },
  })
  export default class PreviewPresenter extends Vue {

    @Booru.Getter(booru.getters.SourceBooru)
    SourceBooru

    @Api.Getter(api.getters.Instance)
    ApiInstance

    @Prop(Object)
    image

    previewUrl = null

    currentPostId = 0

    isLoading = false
    isSaving = false

    imageLoader = null

    @Watch("image")
    async onImageChanged(image, previous) {
      if (!image)
        return

      if (this.isSaving && image !== previous) {
        this.image = previous
        return;
      }

      this._scrollToTop()
      // this.currentPostId = image.id
      this.previewUrl = image.files.thumbnail
      this.isLoading = true

      await this.downloadViaImgEl()
    }

    downloadViaImgEl() {
      // If the Current Post Id is not the same as the new image, cancel the download
      if (this.currentPostId !== this.image.id)
        this.imageLoader.src = ""
      // And then update the current post id.
      this.currentPostId = this.image.id

      // Trigger the download, and when it finishes the load event.
      this.imageLoader.src = this.ApiInstance.imageRoute + this.image.files.preview
    }

    _scrollToTop() {
      // Ensure the scroller element exists first
      if (!this.$refs.scroller)
        return;

      const osInstance = this.$refs.scroller.osInstance()
      osInstance.scroll({ y: '0%' }, 200)
    }

    onImageLoaded(e) {
      console.log(`[PreviewPresenter] Finished loading image.`)
      // Ensure that we are still the same post!
      if (this.image && this.currentPostId !== this.image.id)
        return

      console.log(`[PreviewPresenter] Setting image with id of ${this.image.id}`)
      this.previewUrl = this.ApiInstance.imageRoute + this.image.files.preview
      this.isLoading = false
    }

    onDoubleClick(e) {
      const url = this.ApiInstance.imageRoute + this.image.files.original
      const name = `${this.SourceBooru.name}-${this.image.hash}${this.image.files.extension}`
      this._scrollToTop()
      this.isSaving = true
      fetch(url)
          .then(res => res.blob())
          .then(blob => {
            saveAs(blob, name)
            this.isSaving = false
          })
    }

    created() {
      this.imageLoader = document.createElement("img")
      this.imageLoader.addEventListener("load", this.onImageLoaded, false)

      if (this.image) {
        // For hot reloading, if the image prop exists force a re-download.
        this.onImageChanged(this.image)
      }
    }

    destroy() {
      this.imageLoader.removeEventListener("load", this.onImageLoaded, false)
    }

    render(h) {

      let content = null
      if (this.image) {
        const filledHeart = <v-icon small>mdi-heart</v-icon>
        const hollowHeart = <v-icon small>mdi-heart-outline</v-icon>
        const postScores =
            <span class="post-scores">
              <h1>Score&nbsp;</h1>
              <span class="fav-count">
                {this.image.favourites}&nbsp;
                {this.image.isFavourited ? filledHeart : hollowHeart}&nbsp;
              </span>
            </span>

        const thumbsUp = <v-icon small>mdi-thumb-up-outline</v-icon>
        const thumbsDown = <v-icon small>mdi-thumb-down</v-icon>
        const score =
            <span class="score">
              {this.image.score}&nbsp;
              {thumbsUp}&nbsp;
              {thumbsDown}&nbsp;
            </span>

        const uploader =
            <span class="uploader-name">
              <h1>Uploader</h1>&nbsp;
              <a href="#">{this.image.uploader.friendlyName}</a>&nbsp;
              <time class="created-at" title={this.$moment(this.image.uploadedAt).fromNow()}>
                {this.$moment(this.image.uploadedAt).fromNow()}&nbsp;
              </time>
            </span>

        const rating =
            <span class="rating">
              <h1>Rating</h1>&nbsp;
              {this.image.rating}&nbsp;
            </span>

        let hrefSrc, textSrc
        if (this.image.source) {
          hrefSrc = <span><a href-={this.image.source.href}>{this.image.source.friendlyName}</a></span>
          textSrc = <span>{this.image.source.friendlyName}</span>
        }
        const naSrc = <span>N/A</span>
        const src = this.image.source
            ? this.image.source.href
                ? hrefSrc
                : textSrc
            : naSrc;
        const source =
            <span class="source">
              <h1>Source</h1>&nbsp;
              {src}&nbsp;
            </span>

        const dimensions =
            <span class="dimensions">
              <h1>Size</h1>
              &nbsp;
              {this.image.size.width}x{this.image.size.height}&nbsp;
            </span>

        const metadata = <div class="metadata">
          <div class="post-info">
            {postScores}
            {score}
            {uploader}
            {rating}
            {source}
            {dimensions}
          </div>
          <div class="tags">
            <tags-presenter tags={this.image.tags} is-chip/>
          </div>
        </div>

        const postBody = <div class="post-body">
          <div class="preview"
               style={{ width: this.image.size.width + 'px' }}>
            <img src={this.previewUrl}
                 style={{ 'max-width': '100%', 'max-height': this.image.size.height + 'px' }}
                 ref="img"
                 alt="Image!"
                 onDblclick={this.onDoubleClick}/>
          </div>
        </div>

        content = <div class="preview">
          {metadata}
          {postBody}
        </div>
      } else {
        content = <div>
          <h1>Oh noes!</h1>
          <p>There appears to be no posts available!</p>
        </div>
      }

      return <overlay-scrollbars options={{ overflowBehaviour: { x: 'h' }, scrollbars: { autoHide: 'leave' } }}
                                 ref="scroller">
        <div>
          {content}

          <v-overlay absolute value={this.isSaving}>
            <v-progress-circular indewterminate color="primary"/>
          </v-overlay>
        </div>
      </overlay-scrollbars>
    }

  }
</script>

<style scoped lang="scss">

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

      .preview {
        max-width: 100% !important;;
        /*height: auto;*/
        margin: auto !important;

        img {
          object-fit: contain;
          height: 100%;
          width: 100%;
        }
      }
    }
  }

</style>
