<script>
  import { Component, Prop, Vue, namespace } from "nuxt-property-decorator"
  import NotePresenter from "~/components/Presenters/NotePresenter"
  import { booru } from "~/store/booru"

  const Booru = namespace("booru")

  @Component({
    components: { NotePresenter }
  })
  export default class ImagePresenter extends Vue {

    @Prop(Object)
    media

    @Prop(Object)
    mediaClickHandlers

    @Prop(String)
    previewUrl

    @Prop(Boolean)
    isLoading

    @Booru.Getter(booru.getters.Notes)
    Notes

    render() {
      let notesOverlay = false
      if (this.media.hasNotes) {
        const notes = this.Notes.map((note) => {
              // Maybe replace with babel-plugin-jsx-display-if ??
              // Would then be display-if={note.isActive} on note-presenter
              if (!note.isActive)
                return null // null = do not render, in JSX.
              return <note-presenter note={note} image-dimensions={this.media.size} />
            }
        )
        notesOverlay = notes &&
            <section class="notesOverlay" {...{ on: this.mediaClickHandlers}}>
              {notes}
            </section>
      }

      return <div class="post-body">
        <div class="contentStack"
             style={{ 'max-width': this.media.size.width + 'px', 'max-height': this.media.size.height + 'px' }}>
          {notesOverlay || null}
          <img src={this.previewUrl}
               class={[{isLoading: this.isLoading}]}
               ref="img"
               alt="Image!"
               {...{ on: this.mediaClickHandlers}}/>
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
