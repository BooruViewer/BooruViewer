<script>
  import { Component, Prop, Vue } from "nuxt-property-decorator"

  @Component
  export default class VideoPresenter extends Vue {

    @Prop(Object)
    media

    @Prop(Object)
    mediaClickHandlers

    @Prop(String)
    previewUrl

    render() {
      return <div class="post-body">
        <div class="contentStack"
             style={{ 'max-width': this.media.size.width + 'px', 'max-height': this.media.size.height + 'px' }}>
          <video ref="player"
                 src={this.previewUrl}
                 controls
                 autoPlay
                 muted
                 loop
                 style={{
                   'max-width': '100%',
                   'max-height': '100%',
                   'width': this.media.size.width + 'px',
                   'height':'/*'+ this.media.size.height + 'px*/',
                 }}/>
        </div>
      </div>
    }

  }
</script>
