<script>
  import { Component, Watch, Vue, namespace } from "nuxt-property-decorator"
  import { ui } from "~/store/ui"
  import { api } from "~/store/api"
  import { booru } from "~/store/booru"
  import { auth } from "~/store/auth"
  import { AuthDialogConfigs } from "~/assets/site-configs"

  const Ui = namespace("ui")
  const Booru = namespace("booru")
  const Auth = namespace("auth")
  const Api = namespace("api")

  @Component
  export default class AuthDialog extends Vue {

    @Ui.Getter(ui.getters.DialogOpen)
    IsDialogOpen

    @Ui.Mutation(ui.mutations.DialogOpen)
    SetDialogOpen

    @Api.Getter(api.getters.CurrentEndpoint)
    CurrentSite

    @Auth.Getter(auth.WhichBooru)
    AuthBooru

    @Booru.Action(booru.actions.RefreshPosts)
    RefreshPosts

    @Auth.Action(auth.Auth)
    AuthenticateUser

    formId = null
    formKey = null

    get isVisible() {
      return this.IsDialogOpen("auth")
    }

    set isVisible(v) {
      this.SetDialogOpen({ dialog: "auth", open: v })
    }

    get currentLayout() {
      return AuthDialogConfigs[this.CurrentSite]
    }

    closeDialog() {
      this.isVisible = false
    }

    async onLogin(e) {
      try {
        await this.AuthenticateUser({ id: this.formId, key: this.formKey, site: this.AuthBooru })
      } catch (crap) {
        console.error(crap)
        return
      }
      if (this.AuthBooru === this.CurrentSite)
        this.RefreshPosts()
      this.closeDialog()
    }

    render() {
      return <v-dialog v-model={this.isVisible} max-width="33vw">
        <v-card>
          <v-card-title class="headline" primary-title>{this.currentLayout.title}</v-card-title>

          <v-divider/>

          <v-form>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model={this.formId}
                                label={this.currentLayout.id}
                                hint={this.currentLayout.idHint}
                                required
                                persistent-hint
                                clearable/>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model={this.formKey}
                                label={this.currentLayout.key}
                                hint={this.currentLayout.keyHint}
                                required
                                persistent-hint
                                clearable/>
                </v-col>
              </v-row>
            </v-container>
          </v-form>

          <v-divider/>

          <v-card-actions>
            <v-spacer/>
            <v-btn text color="primary" onClick={this.onLogin}>Logjn</v-btn>
            <v-btn text color="error" onClick={this.closeDialog}>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    }

  }

</script>
