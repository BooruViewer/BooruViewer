<script>
  import { Component, mixins, namespace } from "nuxt-property-decorator"
  import CurrentSiteAwareMixin from "~/mixins/CurrentSiteAwareMixin"
  import { auth } from "~/store/auth"

  const Auth = namespace("auth")

  @Component
  export default class AuthenticatedAwareMixin extends mixins(CurrentSiteAwareMixin) {

    @Auth.Getter(auth.Auth)
    IsAuthenticated

  }
</script>
