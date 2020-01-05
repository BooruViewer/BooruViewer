<script>
    import {Component, Prop, mixins, Vue} from "nuxt-property-decorator"
    import { HumanizeMixin } from "~/mixins";

    const dangerousTags = [
      "loli", "shota", "gore", "child", "rape", "toddler", "toddlercon", "lolicon", "shotacon",
    ]

    @Component({})
    export default class TagsPresenter extends mixins(HumanizeMixin) {

      @Prop(Array)
      tags
      @Prop(Boolean)
      isChipStyle

      isTagDangerous(tag) {
        return dangerousTags.includes(tag)
      }

      __renderTag(tagCount) {
        return (tag, index) => {

          const klass = {}
          klass[`tag-type-${tag.type.toLowerCase()}`] = true
          klass['tag-is-dangerous'] = this.isTagDangerous(tag.name)

          if (this.isChipStyle) {
            return <v-chip class={klass} color="rgb(42, 42, 42)" small>
              {this.HumanizeFunc(tag.name)}
            </v-chip>
          }

          const isLast = index === tagCount

          return <span>
            <a class={klass} style="border-radius: 5px" href={`#${tag.name}`}>
              {this.HumanizeFunc(tag.name)}
            </a>{(!isLast ? ", " : " ")}
          </span>
        }
      }

      render() {
        const tags = this.tags.map(this.__renderTag(this.tags.length - 1))

        return <div class={["tag-list", { chips: this.isChipStyle }]}>
          {tags}
        </div>
      }

    }
</script>

<style lang="scss">

</style>
