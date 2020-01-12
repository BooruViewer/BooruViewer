<script>
    import {Component, Watch, namespace, Vue} from "nuxt-property-decorator"
    import { BooruSwitcherPart } from "~/components";
    import {ui, booru} from "~/store"

    const UiNS = namespace("ui")
    const BooruNS = namespace("booru")
    const RouteNS = namespace("route")

    @Component({
      components: { BooruSwitcherPart }
    })
    export default class NavigationPart extends Vue {

      @RouteNS.State(s => s.params.tags)
      Tags

      @BooruNS.Action(booru.RelatedTags)
      GetRelatedTags
      @BooruNS.Getter(booru.RelatedTags)
      ReelatedTags

      @BooruNS.Action(booru.SavedSearches)
      GetSavedSearches
      @BooruNS.Getter(booru.SavedSearches)
      SavedSearches

      @UiNS.Getter(ui.DrawerOpen)
      isDrawerOpen
      @UiNS.Mutation(ui.DrawerOpen)
      setDrawerOpen

      get drawerOpen() {
        return this.isDrawerOpen
      }

      set drawerOpen(open) {
        this.setDrawerOpen(open)
      }

      @UiNS.Getter(ui.DrawerMini)
      isDrawerMini
      @UiNS.Mutation(ui.DrawerMini)
      setDrawerMini

      get drawerMini() {
        return this.isDrawerMini
      }

      set drawerMini(mini) {
        this.setDrawerMini(mini)
      }

      _isRelatedTagsOpen = false
      _isSavedSearchesOpen = false

      _toggleDrawerMini() {
        this.drawerMini = !this.drawerMini
        if (this.drawerMini) {
          if (this.$refs.booruSelector)
            this.$refs.booruSelector.close()
          this._isRelatedTagsOpen = false
          this._isSavedSearchesOpen = false
        }
      }

      _openBooruSelector() {
        if (this.drawerMini) {
          this.drawerMini = false

          const $unwatch = this.$watch("$refs.booruSelector.$refs.selector.isMenuActive", isActive => {
            if (isActive)
              return

            this.drawerMini = true
            $unwatch()
          })
        }
      }

      __renderMiniToggleItem() {
        const drawerMiniIcon = this.isDrawerMini
          ? <v-icon>mdi-chevron-right</v-icon>
          : <v-icon>mdi-chevron-left</v-icon>
        return <v-list-item onClick={this._toggleDrawerMini}>
          <v-list-item-action>
            {drawerMiniIcon}
          </v-list-item-action>
          <v-list-item-content>
            Shrink Navigation
          </v-list-item-content>
        </v-list-item>
      }

      __renderBooruSwitcherItem() {
        return <v-list-item onClick={this._openBooruSelector}>
          <v-list-item-action>BS</v-list-item-action>
          <v-list-item-content>
            <BooruSwitcherPart ref="booruSelector" />
          </v-list-item-content>
        </v-list-item>
      }

      __renderSettingsItem() { }

      __renderRelatedTags() { }

      __renderSavedSearches() { }

      __renderDebugItem() { }

      render() {
        return <v-navigation-drawer app clipped stateless mini-variant={this.drawerMini} v-model={this.drawerOpen}>
          {this.__renderMiniToggleItem()}
          <v-divider />
          {this.__renderBooruSwitcherItem()}
          {this.__renderSettingsItem()}
          <v-divider />
          {this.__renderRelatedTags()}
          {this.__renderSavedSearches()}
          <v-divider />
          {this.__renderDebugItem()}
        </v-navigation-drawer>
      }

      ___(e) {
        this.$store.dispatch("booru/fetchPosts")
      }

    }
</script>

<style lang="scss">

</style>
