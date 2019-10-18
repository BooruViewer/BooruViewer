<script>
  import { Component, Prop, Vue } from "nuxt-property-decorator"
  import flow from "lodash/fp/flow"
  import map from "lodash/fp/map"
  import replace from "lodash/fp/replace"
  import split from "lodash/fp/split"
  import capitalize from "lodash/fp/capitalize"
  import join from "lodash/fp/join"

  const dangerousTags = [
    "loli", "shota", "gore", "child", "rape", "toddler", "toddlercon", "lolicon", "shotacon",
  ]

  @Component
  export default class TagsPresenter extends Vue {

    @Prop(Array)
    tags

    @Prop({ type: Boolean, default: false})
    isChip

    get humanizeTag() {
      return flow(replace(/_/g, " "),
          replace(/\(/g, "( "),
          replace(/\//g, "/ "),
          split(" "),
          map(capitalize),
          join(" "),
          replace(/\/ /g, "/"),
          replace(/\( /g, "("))
    }

    isTagDangerous(tag) {
      return dangerousTags.includes(tag)
    }

    render() {
      const tagsCount = this.tags.length - 1
      const tags = this.tags.map((tag, idx) => {
        const klass = {}
        klass[`tag-type-${tag.type.toLowerCase()}`] = true
        klass['tag-is-dangerous'] = this.isTagDangerous(tag.name)

        const isLast = idx === tagsCount

        if (this.isChip) {
          return <v-chip class={klass} color="rgb(42,42,42)" small>
            {this.humanizeTag(tag.name)}
          </v-chip>
        }

        return <span>
          <a class={klass} style="border-radius: 5px" href={`#${tag.name}`}>{this.humanizeTag(tag.name)}</a>{(!isLast ? ", " : "")}
        </span>
      })

      return <div class="tag-list">
        {tags}
      </div>
    }
  }
</script>

<style scoped>

</style>
