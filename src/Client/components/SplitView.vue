<script>
  import { Vue, Component, Prop } from "nuxt-property-decorator"
  import _ from "lodash"

  @Component
  export default class SplitView extends Vue {

    @Prop(Number)
    minWidth

    @Prop(Number)
    maxWidth

    @Prop(String)
    defaultWidth

    onDoubleClick(e) {
      const { target: resizer } = e;
      if (!(resizer.className && resizer.className.match('dragger')))
        return;

      e.preventDefault();

      const leftPane = resizer.previousElementSibling;
      const rightPane = resizer.nextElementSibling;

      leftPane.style.width = rightPane.style.width = this.defaultWidth;

      this.$emit('resized', { leftWidth: this.defaultWidth, rightWidth: this.defaultWidth })
    }

    onMouseDown(e) {
      const { target: resizer, pageX: initialPageX, pageY: initialPageY } = e;
      if (!(resizer.className && resizer.className.match('dragger')))
        return;

      e.preventDefault()

      const container = this.$el;
      const leftPane = resizer.previousElementSibling
      const rightPane = resizer.nextElementSibling

      const {
        offsetWidth: initialLeftPaneWidth,
      } = leftPane
      const {
        offsetWidth: initialRightPaneWidth,
      } = rightPane

      const { min, max } = Math
      const { addEventListener, removeEventListener } = window;

      const resize2 = (inputPane, initialSize, offset = 0) => {
        const containerWidth = container.clientWidth;
        const paneWidth = initialSize + offset;

        const newWidth = max(this.minWidth, min(this.maxWidth, paneWidth / containerWidth * 100))
        const restWidth = max(this.minWidth, min(this.maxWidth, 100 - (paneWidth / containerWidth * 100)))

        // inputPane.style.width = paneWidth + 'px'
        inputPane.style.width = newWidth + '%'
        return restWidth + '%'
      }

      const onMouseMove = ({ pageX }) => {
        leftPane.style.width = resize2(rightPane, initialRightPaneWidth, -(pageX - initialPageX))
      }

      const onMouseMoveT = _.throttle(onMouseMove, 16)

      const onMouseUp = () => {
        const leftWidth = leftPane.style.width
        const rightWidth = rightPane.style.width

        this.$emit('resized', { leftWidth, rightWidth })

        removeEventListener('mousemove', onMouseMoveT)
        removeEventListener('mouseup', onMouseUp)
      }

      addEventListener('mousemove', onMouseMoveT)
      addEventListener('mouseup', onMouseUp)
    }

    render(h) {
      const defaultSlot = this.$slots.default ||
          <div class="dragger" ref="resizeEl" onDblclick={this.onDoubleClick} onMousedown={this.onMouseDown}>
            <v-divider vertical/>
          </div>

      return <div class="split-view-container">
        {this.$slots['left-content']}
        {defaultSlot}
        {this.$slots['right-content']}
      </div>
    }

  }
</script>

<style>
  .split-view-container {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .dragger {
    width: .5vw;

    margin: .25vw;
    padding: .5vh;

    cursor: col-resize;
  }
</style>
