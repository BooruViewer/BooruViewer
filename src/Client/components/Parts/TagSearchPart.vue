<script>
  import { Component, Watch, Vue, namespace, Getter } from "nuxt-property-decorator"
  import { booru } from "~/store/booru"
  import { ui } from "~/store/ui"
  import { debounce } from "lodash"

  const Ui = namespace("ui")
  const Booru = namespace("booru")
  const Route = namespace("route")

  @Component
  export default class TagSearchPart extends Vue {

    @Route.State(s => s.params.page)
    Page
    @Route.State(s => s.params.tags)
    Tags

    @Booru.Action(booru.actions.RefreshPosts)
    RefreshPosts

    @Ui.Getter(ui.getters.TagSearchSelected)
    SelectedTags
    @Ui.Mutation(ui.mutations.TagSearchSelected)
    SetSelectedTags

    @Ui.Mutation(ui.mutations.RemoveTagSearchSelectedItem)
    RemoveSelectedTag
    @Ui.Mutation(ui.mutations.AddTagSearchSelectedItem)
    AddSelectedTag

    get selectedTags() {
      return this.SelectedTags
    }

    set selectedTags(tags) {
      this.SetSelectedTags(tags)
    }

    @Booru.Getter(booru.getters.TagSearchResults)
    AutocompleteResults
    @Booru.Action(booru.actions.FetchAutocompleteResults)
    FetchAutocompleteResults
    @Booru.Action(booru.actions.ClearAutocompleteResults)
    ClearAutocompleteResults

    isDelimitorString = false
    listIdx = -1
    searchText = null

    @Watch("searchText")
    onSearchTextChanged = debounce(this._onSearchTextChanged, 500)

    _onSearchTextChanged() {
      this.FetchAutocompleteResults(this.searchText)
    }

    @Watch("AutocompleteResults")
    onAutocompleteResultsChanged(results) {
      if (results.length === 0)
        return

      if (this.searchText === null || this.searchText.trim() === "") {
        this.ClearAutocompleteResults()
      }
    }

    onSearchQueryChanged(e) {
      this.searchText = e
    }

    onKeyDown(e) {
      // Enter
      if (e.which === 13) {
        // TODO: Treat the searchText as a new tag, or select the currently selected menu item
        console.log('Enter key pressed', this.listIdx, this.searchText)
        e.stopPropagation()

        if (this.listIdx >= 0) {
          this.searchText = null
          this.doNavigate()
          return
        }

        if (this.searchText === null || this.searchText.trim() === "") {
          this.doNavigate()
          return
        }

        const text = this.searchText

        this.AddSelectedTag({
          name: text,
          type: "unknown",
          count: -1,
        })

        this.searchText = null
        this.doNavigate()
      }

      if (e.which === 32) {
        console.log('I hate spacebar.', this.searchText)
        this.isDelimitorString = true
      }

      // Backspace
      if (e.which === 8) {
        // TODO: If searchText is empty, remove the last tag from search and re-focus the input
      }
    }

    onPrependClicked(e) {
      this.doNavigate()
    }

    onSearchChanged(e) {
      let workingItem = e[e.length - 1]
      if (this.isDelimitorString) {
        this.RemoveSelectedTag(workingItem)
        this.AddSelectedTag({
          name: workingItem,
          type: "unknown",
          count: -1,
        })
      } else if (typeof workingItem === "string" || workingItem === undefined) {
        this.RemoveSelectedTag(workingItem)
      }

      this.doNavigate()
    }

    onListIndexChanged(e) {
      this.listIdx = e
    }

    closeChip(tag) {
      return () => {
        this.RemoveSelectedTag(tag)
        this.doNavigate()
      }
    }

    doNavigate() {
      // if (parseInt(this.Page) === 1) {
      //   this.RefreshPosts();
      // }

      // DO NOT NAVIGATE WITH STRINGS IN THE SELECTED TAGS
      if (this.selectedTags.find(t => typeof t === "string")) {
        console.error('[TagSearchPart] One of the Selected Tags is not structured properly.')
        return
      }

      if (this.selectedTags.length === 0) {
        if (this.Tags === "*" && parseInt(this.Page, 10) === 1) {
          this.RefreshPosts()
        } else {
          this.$router.push("/*/1")
        }
        return
      }

      const routeTags = this.selectedTags.map(t => t.name).join("+")
      if (routeTags === this.Tags && parseInt(this.Page, 10) === 1) {
        // this.RefreshPosts()
        return
      }

      this.$router.push({
        name: "tags-page",
        params: {
          tags: routeTags,
          page: 1,
        },
      })
    }

    render() {

      const highlightSearchResult = tag => {
        if (!tag && (!tag.name || !tag.type))
          return <span style="color: red">Error: Item is undefined.</span>

        const { name: text, type } = tag
        const typeClass = `tag-type-${type.toLowerCase()}`
        if (this.searchText === null)
          return <span class={typeClass}>{text}</span>

        const search = this.searchText.toLowerCase()

        const searchStartIdx = text.toLowerCase().indexOf(search)
        if (searchStartIdx < 0)
          return <span class={typeClass}>{text}</span>

        const start = text.slice(0, searchStartIdx)
        const highlight = text.slice(searchStartIdx, searchStartIdx + search.length)
        const rest = text.slice(searchStartIdx + search.length)

        return <span class={typeClass}>{start}<span class="highlighted">{highlight}</span>{rest}</span>
      }

      const chipColor = tag => {
        if (!tag || !tag.name)
          return

        const classes = []
        classes.push(`tag-type-${tag.type.toLowerCase()}`)

        const firstCh = tag.name.slice(0, 1)

        const isMetaChip = tag.name.indexOf(":") > 0
        const isModifierChip = firstCh === "-" || firstCh === "~"

        if (isMetaChip)
          classes.push("meta-chip")

        if (isModifierChip)
          classes.push("modifier-chip")

        const wildcardIdx = tag.name.indexOf("*")
        if (wildcardIdx > -1 && tag.name.slice(wildcardIdx - 1, 1) !== "\\" && !isModifierChip)
          classes.push("wildcard-chip")

        return classes.join(" ")
      }

      const slots = {
        item: (data) =>
            <v-list-item-content>
              <v-list-item-title>{highlightSearchResult(data.item)}</v-list-item-title>
            </v-list-item-content>,
        selection: (data) =>
            <v-chip
                input-value={data.selected}
                class={chipColor(data.item)}
                small
                close
                onClick={data.select}
                {...{ on: { 'click:close': this.closeChip(data.item) } }}>
              <span>{data.item.name || data.item}</span>
            </v-chip>,
      }

      const on = {
        'update:search-input': this.onSearchQueryChanged,
        'update:list-index': this.onListIndexChanged,
        'click:prepend': this.onPrependClicked,
        '!keydown': this.onKeyDown,
        'change': this.onSearchChanged,
      }

      return <v-combobox ref="search"
                         single-line
                         hide-details
                         clearable
                         dense
                         hide-no-data
                         hide-selected
                         multiple
                         no-filter
                         return-object

                         item-value="name"
                         item-text="name"

                         delimiters={[" "]}
                         v-model={this.selectedTags}
                         prepend-icon="mdi-magnify"
                         search-input={this.searchText}
                         items={this.AutocompleteResults}
                         scopedSlots={slots}
                         {...{ on }} />
    }

  }
</script>

<style lang="scss">

  $metaColor: #4527A0;
  $modifierColor: #26C6DA;
  $wildcardColor: #3f51b5;

  .meta-chip {
    background-color: $metaColor !important;
    border-color: $metaColor !important;
  }

  .modifier-chip {
    background-color: $modifierColor !important;
    border-color: $modifierColor !important;
  }

  .wildcard-chip {
    background-color: $wildcardColor !important;
    border-color: $wildcardColor !important;
  }

  .meta-chip.modifier-chip {
    // Previously was 135deg.
    background: linear-gradient(117.5deg, $modifierColor 38%, $metaColor 55%) !important;
    border-color: $metaColor !important;
  }

  .meta-chip.wildcard-chip {
    // Previously was 135deg.
    background: linear-gradient(117.5deg, $wildcardColor 38%, $metaColor 55%) !important;
    border-color: $metaColor !important;
  }

  $tag-general: #0073ff;
  $tag-artist: #A00;
  $tag-meta: #F80;
  $tag-copyright: #A0A;
  $tag-character: #0A0;

  @mixin tag-type($type) {
    .tag-type-#{$type} {
      color: var(--tag-color-#{$type}) !important;

      .highlighted {
        color: var(--tag-color-#{$type}-highlighted) !important;
      }
    }
  }

  @include tag-type(artist);
  @include tag-type(general);
  @include tag-type(meta);
  @include tag-type(copyright);
  @include tag-type(character);
</style>
