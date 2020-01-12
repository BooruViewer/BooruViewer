<script>
    import {Component, namespace, Vue} from "nuxt-property-decorator"

    const RouteNS = namespace("route")

    @Component({})
    export default class RouteParamsMixin extends Vue {

      @RouteNS.State(s => s.params.tags)
      Tags
      @RouteNS.State(s => s.params.page)
      _page

      get Page() {
        return parseInt(this._page, 10)
      }

    }
</script>

<style lang="scss">

</style>
