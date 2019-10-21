<script>
  import OpenDialogMixin from "~/mixins/OpenDialogMixin"
  import { Component, mixins, namespace } from "nuxt-property-decorator"
  import { auth } from "~/store/auth"

  const Auth = namespace("auth")

  @Component
  export default class SafeDanbooruSettingsPart extends mixins(OpenDialogMixin) {

    @Auth.Mutation(auth.WhichBooru)
    SetWhichBooru

    openAuthDialog() {
      // Should this be hard coded?
      // noinspection BadExpressionStatementJS
      this.SetWhichBooru("Safe Danbooru")
      this.openDialog("auth")
    }

    render() {
      return <v-container>
        <v-layout>
          <v-col>
            <v-btn onClick={this.openAuthDialog}>Authenticate</v-btn>
          </v-col>
        </v-layout>
      </v-container>
    }

  }
</script>
