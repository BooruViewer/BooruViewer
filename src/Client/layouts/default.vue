<script>
  import NavigationPart from "~/components/Parts/NavigationPart"

  export default {
    components: { NavigationPart },
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        items: [
          {
            icon: 'mdi-apps',
            title: 'Welcome',
            to: '/',
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Inspire',
            to: '/inspire',
          },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Vuetify.js',
      }
    },
    methods: {
      stop(callback) {
        return (e) => {
          e.stopPropagation()
          callback()
        }
      },
    },
    render: function (h) {
      return <v-app>

        <navigation-part />

        <v-app-bar clipped-left fixed="" app>
          <v-app-bar-nav-icon onClick={this.stop(() => this.drawer = !this.drawer)}/>
          <v-btn icon onClick={this.stop(() => this.miniVariant = !this.miniVariant)}>
            <v-icon>mdi-{`chevron-${this.miniVariant ? 'right' : 'left'}`}</v-icon>
          </v-btn>
          <v-btn icon onClick={this.stop(() => this.clipped = !this.clipped)}>
            <v-icon>mdi-application</v-icon>
          </v-btn>
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
  }
</style>
