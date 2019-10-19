<script>
  import { Component, Prop, mixins } from "nuxt-property-decorator"
  import HumanizeTagMixin from "~/mixins/HumanizeTagMixin"

  const dangerousTags = [
    "loli", "shota", "gore", "child", "rape", "toddler", "toddlercon", "lolicon", "shotacon",
  ]

  @Component
  export default class TagsPresenter extends mixins(HumanizeTagMixin) {

    @Prop(Array)
    tags

    @Prop({ type: Boolean, default: false})
    isChip

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
            {this.TagHumanizer(tag.name)}
          </v-chip>
        }

        return <span>
          <a class={klass} style="border-radius: 5px" href={`#${tag.name}`}>{this.TagHumanizer(tag.name)}</a>{(!isLast ? ", " : "")}
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
