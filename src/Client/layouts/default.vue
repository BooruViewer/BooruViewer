<script>
  import NavigationPart from "~/components/Parts/NavigationPart"
  import TagSearchPart from "~/components/Parts/TagSearchPart"

  export default {
    components: { NavigationPart, TagSearchPart },
    computed: {
      drawer: {
        get: function() {
          return this.$store.getters["ui/getDrawerOpen"]
        },
        set(open) {
          this.$store.commit("ui/setDrawerOpen", open)
        }
      }
    },
    methods: {
      toggleDrawer() {
        this.drawer = !this.drawer;
      },
    },
    render: function (h) {
      return <v-app>

        <navigation-part />

        <v-app-bar clipped-left fixed app dense>
          <v-app-bar-nav-icon onClick={this.toggleDrawer}/>
          <v-toolbar-title>Booru Viewer</v-toolbar-title>

          <v-spacer />

          <tag-search-part />
        </v-app-bar>

        <v-content>
          <v-container>
            <nuxt/>
          </v-container>
        </v-content>
      </v-app>
    },
  }
</script>

<style lang="scss">
  // Removes the horrible default scrolbar to the right
  // This needs to be done because of the unusual css reset vuetify users
  html {
    overflow-y: initial;
  }

  // Fixes the weird as bug because... reasons?
  .os-host {
    height: 100%;
  }

  // We want the content to extend the full width
  // This is a quick and dirty hack, i'm sure there is a proper way in vuetify.
  .container {
    max-width: 100% !important;
    height: 100%;
  }
</style>
