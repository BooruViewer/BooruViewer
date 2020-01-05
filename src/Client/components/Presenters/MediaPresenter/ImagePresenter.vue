<script>
  import {Component, Prop, namespace, Vue} from "nuxt-property-decorator"
  import {booru} from "~/store"

  const BooruNS = namespace("booru")

  @Component({})
  export default class ImagePresenter extends Vue {

    @Prop(Object)
    media

    @Prop(Object)
    mediaClickHandlers

    @Prop(String)
    previewUrl

    @Prop(Boolean)
    isLoading

    @BooruNS.Getter(booru.Notes)
    Notes

    render() {
      return <div class="post-body">
        <div class="contentStack"
             style={{'max-width': this.media.size.width + 'px', 'max-height': this.media.size.height + 'px'}}>
          <img src={this.previewUrl}
               class={[{isLoading: this.isLoading}]}
               alt={this.media.tags.flatMap(t => t.name).join(" ")}
               {...{on: this.mediaClickHandlers}} />
        </div>
      </div>
    }

  }
</script>

<style lang="scss">
  .preview .post-body .contentStack {

    .notesOverlay {
      z-index: 4;
      width: 100%;
      height: 100%;
      position: relative;
    }

    img {
      z-index: 2;

      // TODO: Decide to respect the Preview Image dimensjons, just use the original, or continue like this.
      object-fit: contain;
      /*height: 100%;*/ // This causes vivaldi from showing the image... It shrinks it to basically 0px.
      width: 100%;

      &.isLoading {
        filter: blur(4px) grayscale(.66);
      }
    }

  }
</style>
