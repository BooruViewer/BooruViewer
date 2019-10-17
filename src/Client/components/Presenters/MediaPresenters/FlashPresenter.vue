<script>
  import { Component, Prop, Vue } from "nuxt-property-decorator"

  @Component
  export default class FlashPresenter extends Vue {

    @Prop(Object)
    media

    @Prop(Object)
    mediaClickHandlers

    @Prop(String)
    previewUrl

    render() {
      return <div class="post-body">
        <div class="contentStack">
          <v-row justify="center">
            <object>
              <params name="movie" value={this.previewUrl}>
                <embed src={this.previewUrl} allowscriptaccess="never" width={this.media.size.width} height={this.media.size.height} style="max-width: 100%; max-height: 100%"/>
              </params>
            </object>
          </v-row>
        </div>
      </div>
    }
  }
</script>
