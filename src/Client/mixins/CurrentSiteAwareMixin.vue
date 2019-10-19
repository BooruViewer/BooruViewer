<script>
  import { Component, Vue, mixins, namespace } from "nuxt-property-decorator"
  import { api } from "~/store/api"

  const Api = namespace("api")

  @Component
  export default class CurrentSiteAwareMixin extends Vue {

    @Api.Getter(api.getters.CurrentEndpoint)
    CurrentSite

  }
</script>
