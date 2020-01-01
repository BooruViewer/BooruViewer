<script>
  import { Component, Vue } from "nuxt-property-decorator"

  @Component({

  })
  export default class DefaultLayout extends Vue {

    render() {
      return <v-app>

        <v-app-bar clipped-left fixed app dense>
          <v-app-bar-nav-icon />
          <v-toolbar-title>Booru Vieewer</v-toolbar-title>

          <v-spacer />
        </v-app-bar>

        <v-content>
          <v-container>
            <nuxt/>
          </v-container>
        </v-content>

      </v-app>
    }

  }
</script>

<style lang="scss">

  html {
    // Remove the horrible default scrollbar to the right.
    // This is needed because vuetify uses a poorly designed CSS reset.
    overflow-y: initial;
  }

  // Fixes CSS issue with Overlay Scrollbars
  .os-host {
    height: 100%;
  }

  // Extend the width of the contain to take advantage of the entire screen
  .container {
    max-width: 100vw !important;
    height: 100%;
  }

  .v-content {
    max-height: 100% !important;
  }

</style>
