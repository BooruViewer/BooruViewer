<script>
  import { Component, Watch, namespace, mixins } from "nuxt-property-decorator"
  import AuthenticatedAwareMixin from "~/mixins/AuthenticatedAwareMixin"
  import SearchTagsMixin from "~/mixins/SearchTagsMixin"
  import BooruSwitcherPart from "~/components/Parts/BooruSwitcherPart"
  import { ui } from "~/store/ui"
  import { booru } from "~/store/booru"
  import { SiteFeatures } from "~/assets/site-configs"

  const Ui = namespace("ui")
  const Booru = namespace("booru")
  const Route = namespace("route")

  @Component({
    components: { BooruSwitcherPart },
  })
  export default class NavigationPart extends mixins(AuthenticatedAwareMixin, SearchTagsMixin) {

    @Route.State(s => s.params.tags)
    Tags

    @Booru.Action(booru.RelatedTags)
    GetRelatedTags
    @Booru.Getter(booru.RelatedTags)
    RelatedTags

    @Booru.Action(booru.SavedSearches)
    GetSavedSearches
    @Booru.Getter(booru.SavedSearches)
    SavedSearches

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

    @Ui.Mutation(ui.mutations.DialogOpen)
    OpenDialog

    @Ui.Getter(ui.getters.TagSearchSelected)
    SearchedTags

    @Watch("SearchedTags")
    onSearchedTagsChanged(tags, previous) {
      const tagString = tags.map(t => t.name).join(" ")
      const previousTagString = previous.map(t => t.name).join(" ")
      if (tagString !== previousTagString)
        this.GetRelatedTags(tagString)
    }

    isRelatedTagsOpen = false
    isSavedSearchesOpen = false

    toggleDrawerMini() {
      this.drawerMini = !this.drawerMini
      if (this.drawerMini) {
        if (this.$refs.booruSelector)
          this.$refs.booruSelector.close()
        this.isRelatedTagsOpen = false
        this.isSavedSearchesOpen = false
      }
    }

    openQuickSelector() {
      if (this.drawerMini) {
        this.drawerMini = false

        const $unwatch = this.$watch("$refs.booruSelector.$refs.selector.isMenuActive", isActive => {
          if (isActive)
            return
          this.drawerMini = true
          $unwatch()
        })

      }
      if (this.$refs.booruSelector)
        this.$refs.booruSelector.open()
    }

    onDebug() {
      // this.$store.dispatch("booru/refreshPosts")
      this.OpenDialog({ dialog: "auth", open: true })
    }

    ensureDrawerIsntMini() {
      this.drawerMini = false
    }

    genRelatedTags() {
      if (this.RelatedTags.length === 0)
        return null

      // TODO: Add click handler to tags to search them
      // TODO: Humanize tag names
      const tags = this.RelatedTags.map(tag => {
        return <v-list-item dense>
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-title class={`tag-type-${tag.type.toLowerCase()}`}>{tag.name}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      })

      return <v-list-group v-model={this.isRelatedTagsOpen}>

        <template slot="activator">
          <v-list-item-action>RT</v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Related Tags</v-list-item-title>
          </v-list-item-content>
        </template>

        {tags}
      </v-list-group>
    }

    genSavedSearches() {
      if (!SiteFeatures[this.CurrentSite].hasSavedSearches)
        return null
      if (!this.IsAuthenticated(this.CurrentSite))
        return null

      const searches = this.SavedSearches.map(search => {
        return <v-list-item data-query={search.query} onClick={this.onSavedSearchClicked(search)} dense>
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-title class={`tag-type-general`}>{search.label}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      })

      return <v-list-group v-model={this.isSavedSearchesOpen}>

        <template slot="activator">
          <v-list-item-action>SS</v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Saved Searches</v-list-item-title>
          </v-list-item-content>
        </template>

        {searches}
      </v-list-group>
    }

    onSavedSearchClicked(tag) {
      return e => {
        this.SearchTags(tag.query)
      }
    }

    created() {
      this.GetSavedSearches();
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
            <booru-switcher-part ref="booruSelector"/>
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

        <v-divider/>

        {this.genRelatedTags()}

        {this.genSavedSearches()}

        <v-divider/>

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
