<script>
  export default {
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
        return ({ stopPropagation }) => {
          stopPropagation()
          callback()
        }
      }
    },
    render: function (h) {
      const navItems = this.items.map(item => {
        return <v-list-item to={item.to} router="" exact="">
          <v-list-item-action>
            <v-icon>{item.icon}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{item.title}</v-list-item-content>
        </v-list-item>
      })

      return <v-app>
        <v-navigation-drawer v-model={this.drawer} mini-variant={this.miniVariant} clipped={this.clipped} fixed app>
          <v-list>
            {navItems}
          </v-list>
        </v-navigation-drawer>
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
