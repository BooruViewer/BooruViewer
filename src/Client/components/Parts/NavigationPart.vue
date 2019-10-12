<script>
  import { Component, namespace, Vue } from "nuxt-property-decorator"
  import BooruSwitcherPart from "~/components/Parts/BooruSwitcherPart"
  import { ui } from "~/store/ui"

  const Ui = namespace("ui")

  @Component({
    components: { BooruSwitcherPart }
  })
  export default class NavigationPart extends Vue {

    @Ui.Getter(ui.getters.DrawerOpen)
    isDrawerOpen
    @Ui.Mutation(ui.mutations.DrawerOpen)
    setDrawerOpen

    get drawerOpen() {
      return this.isDrawerOpen
    }

    set drawerOpen(open) {
      this.setDrawerOpen(open)
    }

    @Ui.Getter(ui.getters.DrawerMini)
    isDrawerMini
    @Ui.Mutation(ui.mutations.DrawerMini)
    setDrawerMini

    get drawerMini() {
      return this.isDrawerMini
    }

    set drawerMini(mini) {
      this.setDrawerMini(mini)
    }

    toggleDrawerMini() {
      this.drawerMini = !this.drawerMini
      if (this.drawerMini && this.$refs.booruSelector)
        this.$refs.booruSelector.close()
    }

    openQuickSelector() {
      this.drawerMini = false
      if (this.$refs.booruSelector)
        this.$refs.booruSelector.open()
    }

    onDebug() {
      this.$store.dispatch("booru/refreshPosts")
    }

    render() {
      const drawerMiniIcon = this.isDrawerMini
          ? <v-icon>mdi-chevron-right</v-icon>
          : <v-icon>mdi-chevron-left</v-icon>
      return <v-navigation-drawer app
                                  clipped
                                  stateless
                                  mini-variant={this.drawerMini}
                                  v-model={this.drawerOpen}>

        <v-list-item onClick={this.toggleDrawerMini}>
          <v-list-item-action>
            {drawerMiniIcon}
          </v-list-item-action>
          <v-list-item-content>
            Shrink Navigation
          </v-list-item-content>
        </v-list-item>

        <v-divider/>

        <v-list-item onClick={this.openQuickSelector}>
          <v-list-item-action>BS</v-list-item-action>
          <v-list-item-content>
            <booru-switcher-part ref="booruSelector" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Settings
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list-item onClick={this.onDebug}>
          <v-list-item-action>
            DB
          </v-list-item-action>
          <v-list-item-content>
            Debug
          </v-list-item-content>
        </v-list-item>

      </v-navigation-drawer>
    }

  }
</script>

<style scoped>

</style>
