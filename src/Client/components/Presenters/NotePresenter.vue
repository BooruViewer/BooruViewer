<script>
  import { Component, Prop, Vue } from "nuxt-property-decorator"
  import Sanitize from "~/assets/DanbooruNoteSanitizer"

  @Component
  export default class NotePresenter extends Vue {

    @Prop(Object)
    Note
    @Prop(Object)
    ImageDimensions

    isNoteVisible = false

    get visibility() {
      return this.isNoteVisible
          ? "visible"
          : "hidden"
    }

    onMouseEnter() {
      this.isNoteVisible = true
    }

    onMouseLeave() {
      this.isNoteVisible = false
    }

    render() {
      const div = document.createElement("div")
      div.append(Sanitize(this.Note.body))

      const { min } = Math
      const { width: imageWidth, height: imageHeight } = this.ImageDimensions

      const leftP = (this.Note.x / imageWidth) * 100
      const topP = (this.Note.y / imageHeight) * 100

      const left = leftP + '%'
      const top = topP + '%'
      const width = (min(this.Note.width, imageWidth - this.Note.x) / imageWidth) * 100 + '%'
      const height = (min(this.Note.height, imageHeight - this.Note.y) / imageHeight) * 100 + '%'

      let verticalSide = 'left'
      let horizontalSide = 'top'

      if (leftP > 75)
        verticalSide = 'right'
      if (topP > 75)
        horizontalSide = 'bottom'

      return <figure style={{ left, top, width, height }} onMouseenter={this.onMouseEnter}
                     onMouseleave={this.onMouseLeave}>
        <section class="noteContainer">
          <figcaption domPropsInnerHTML={div.innerHTML} style={{ visibility: this.visibility, [verticalSide]: 0, [horizontalSide]: 'calc(100% + 1.85mm)' }} ref="caption"/>
        </section>
      </figure>
    }
  }
</script>

<style lang="scss">
  .preview .post-body .contentStack .notesOverlay {
    // TODO: Offer an inline and popout note style
    figure {
      position: absolute;
      margin: 0;
      z-index: 4;
      background: hsla(60, 100%, 96.7%, 0.3);
      border-style: solid;
      border-width: 1px;
      border-color: hsla(0, 0, 0, 0.3);

      &:hover figcaption {
        opacity: 1;
        transition: opacity 200ms;
      }
    }

    .noteContainer {
      height: 100%;

      // TODO: Make a dark theme friendly version, preferably using MD colors.
      figcaption {
        transition: opacity 250ms;
        opacity: 0;
        z-index: 6;
        position: absolute;
        /*position: sticky;*/
        /*bottom: 0px;*/
        padding: 1mm;
        min-width: min-content;
        border-color: hsla(0, 0%, 10%, 1);
        color: hsla(0, 0%, 10%, 1);
        background: hsla(60, 100%, 96.7%, .95);
      }
    }
  }
</style>
