<!--suppress UnnecessaryReturnStatementJS -->
<script>
  import { Component, Vue, mixins } from "nuxt-property-decorator"
  import flow from "lodash/fp/flow"
  import map from "lodash/fp/map"
  import replace from "lodash/fp/replace"
  import split from "lodash/fp/split"
  import capitalize from "lodash/fp/capitalize"
  import join from "lodash/fp/join"

  @Component
  export default class SearchTagsMixin extends Vue {

    get TagHumanizer() {
      return flow(replace(/_/g, " "),
          replace(/\(/g, "( "),
          replace(/\//g, "/ "),
          split(" "),
          map(capitalize),
          join(" "),
          replace(/\/ /g, "/"),
          replace(/\( /g, "("))
    }

  }
</script>
