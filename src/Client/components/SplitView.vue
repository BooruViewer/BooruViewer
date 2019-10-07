<script>
  import { Vue, Component } from "nuxt-property-decorator"
  import _ from "lodash"

  @Component
  export default class SplitView extends Vue {

    onDoubleClick(e) {
      const { target: resizer } = e;
      if (!(resizer.className && resizer.className.match('dragger')))
        return;

      e.preventDefault();

      const leftPane = resizer.previousElementSibling;
      const rightPane = resizer.nextElementSibling;

      leftPane.style.width = rightPane.style.width = "50vw";

      this.$emit('resized', { leftWidth: '50vw', rightWidth: '50vw' })
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

      const { addEventListener, removeEventListener } = window;

      const resize2 = (inputPane, initialSize, offset = 0) => {
        const containerWidth = container.clientWidth;
        const paneWidth = initialSize + offset;

        // inputPane.style.width = paneWidth + 'px'
        inputPane.style.width = paneWidth / containerWidth * 100 + '%'
        return 100 - (paneWidth / containerWidth * 100)
      }

      const onMouseMove = ({ pageX }) => {
        let rest = resize2(rightPane, initialRightPaneWidth, -(pageX - initialPageX))
        leftPane.style.width = rest + '%'
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

    onTouchStart(e) {
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

      const { addEventListener, removeEventListener } = window;

      const resize2 = (inputPane, initialSize, offset = 0) => {
        const containerWidth = container.clientWidth;
        const paneWidth = initialSize + offset;

        // inputPane.style.width = paneWidth + 'px'
        inputPane.style.width = paneWidth / containerWidth * 100 + '%'
        return 100 - (paneWidth / containerWidth * 100)
      }

      const onTouchMove = ({ pageX }) => {
        let rest = resize2(rightPane, initialRightPaneWidth, -(pageX - initialPageX))
        leftPane.style.width = rest + '%'
      }

      const onTouchMoveT = _.throttle(onTouchMove)

      const onTouchEnd = () => {
        const leftWidth = leftPane.style.width
        const rightWidth = rightPane.style.width

        this.$emit('resized', { leftWidth, rightWidth })

        removeEventListener('touchmove', onMouseMoveT)
        removeEventListener('touchend', onMouseUp)
      }

      addEventListener('touchmove', onTouchMoveT)
      addEventListener('touchend', onTouchEnd)
    }

    render(h) {
      const defaultSlot = this.$slots.default ||
          <div class="dragger" ref="resizeEl" onDblclick={this.onDoubleClick} onMousedown={this.onMouseDown}
               onTouchstart={this.onTouchStart}>
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
  }

  .dragger {
    width: .5vw;

    margin: .25vw;
    padding: .5vh;

    cursor: col-resize;
  }
</style>
