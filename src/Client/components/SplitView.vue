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
    @Prop(String)
    defaultHeight

    @Prop(Boolean)
    horizontal

    isResizing

    _resizeVertical(inputPane, initialSize, offset = 0) {
      const { min, max } = Math
      const containerWidth = this.$el.clientWidth;
      const paneWidth = initialSize + offset;

      const newWidth = max(this.minWidth, min(this.maxWidth, paneWidth / containerWidth * 100))
      const restWidth = max(this.minWidth, min(this.maxWidth, 100 - (paneWidth / containerWidth * 100)))

      inputPane.style.width = newWidth + '%'
      return restWidth + '%'
    }

    _resizeHorizontal(inputPane, initialSize, offset = 0) {
      const { min, max } = Math
      const containerHeight = this.$el.clientHeight
      const paneHeight = initialSize + offset

      const newHeight = max(this.minWidth, min(this.maxWidth, paneHeight / containerHeight * 100))
      const restHeight = max(this.minWidth, min(this.maxWidth, 100 - (paneHeight / containerHeight * 100)))

      inputPane.style.height = newHeight + '%'
      return restHeight + '%'
    }

    onDoubleClick(e) {
      const { target: resizer } = e;
      if (!(resizer.className && resizer.className.match('dragger')))
        return;

      e.preventDefault();

      const leftPane = resizer.previousElementSibling;
      const rightPane = resizer.nextElementSibling;

      let val

      if (this.horizontal) {
        val = leftPane.style.height = rightPane.style.height = this.defaultHeight;
      } else {
        val = leftPane.style.width = rightPane.style.width = this.defaultWidth;
      }

      this.$emit('resized', { leftWidth: val, rightWidth: val })
    }

    onMouseDown(e) {
      const { target: resizer, pageX: initialPageX, pageY: initialPageY } = e;
      if (!(resizer.className && resizer.className.match('dragger')))
        return;
      if (resizer.parentElement !== this.$el)
        return

      e.preventDefault()

      const firstPane = resizer.previousElementSibling
      const lastPane = resizer.nextElementSibling

      const {
        offsetWidth: initialLeftPaneWidth,
        offsetHeight: initialFirstPaneHeight,
      } = firstPane
      const {
        offsetWidth: initialLastPaneWidth,
        offsetHeight: initialLastPaneHeight,
      } = lastPane

      const { addEventListener, removeEventListener } = window;

      const onMouseMove = ({ pageX, pageY }) => {
        if (this.horizontal) {
          firstPane.style.height = this._resizeHorizontal(lastPane, initialLastPaneHeight, -(pageY - initialPageY))
        } else {
          firstPane.style.width = this._resizeVertical(lastPane, initialLastPaneWidth, -(pageX - initialPageX))
        }
      }

      const onMouseUp = () => {
        const prop = this.horizontal ? "height" : "width"
        const firstSize = firstPane.style[prop]
        const lastSize = lastPane.style[prop]

        this.$emit('resized', { leftWidth: firstSize, rightWidth: lastSize })
        this.isResizing = false

        removeEventListener('mousemove', onMouseMoveT)
        removeEventListener('mouseup', onMouseUp)
      }

      const onMouseMoveT = _.throttle(onMouseMove, 16)

      this.isResizing = true

      addEventListener('mousemove', onMouseMoveT)
      addEventListener('mouseup', onMouseUp)
    }

    genDefaultDragger() {
      const on = {
        dblclick: this.onDoubleClick,
        mousedown: this.onMouseDown,
      }

      if (!this.horizontal)
        return <div class={['dragger', {
          vertical: !this.horizontal,
          horizontal: this.horizontal,
        }]} ref="resizeEl" {...{ on }}>
          <v-divider vertical/>
        </div>
      return <div class={['dragger', {
        vertical: !this.horizontal,
        horizontal: this.horizontal,
      }]} ref="resizeEl" {...{ on }}>
        <v-divider/>
      </div>
    }

    render(h) {
      const defaultSlot = this.$slots.default || this.genDefaultDragger()

      return <div class={['split-view-container', {
        isResizing: this.isResizing,
        vertical: !this.horizontal,
        horizontal: this.horizontal,
      }]}>
        {this.$slots['left-content']}
        {defaultSlot}
        {this.$slots['right-content']}
      </div>
    }

  }
</script>

<style lang="scss">
  .split-view-container {
    display: flex;
    height: 100%;

    .dragger {
      margin: .25vw;
      padding: .5vh;

      &.vertical {
        width: .5vw;
        cursor: col-resize;
      }

      &.horizontal {
        height: .5vh;
        cursor: row-resize;
      }
    }

    &.isResizing {
      user-select: none;
    }

    &.vertical {
      flex-direction: row;
    }

    &.horizontal {
      flex-direction: column;
    }
  }
</style>
