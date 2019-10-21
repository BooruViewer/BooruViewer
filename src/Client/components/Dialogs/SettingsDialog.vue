<script>
  import OpenDialogMixin from "~/mixins/OpenDialogMixin"
  import BooruSwitcherPart from "~/components/Parts/BooruSwitcherPart"
  import * as SettingsComponents from "~/components/Parts/Settings/index.js"
  import { Component, Watch, mixins, namespace } from "nuxt-property-decorator"
  import { Sites } from "~/assets/site-configs"
  import { ui } from "~/store/ui"
  import { api } from "~/store/api"
  import { booru } from "~/store/booru"
  import { auth } from "~/store/auth"

  const Ui = namespace("ui")
  const Booru = namespace("booru")
  const Auth = namespace("auth")
  const Api = namespace("api")

  @Component({
    BooruSwitcherPart
  })
  export default class SettingsDialog extends mixins(OpenDialogMixin) {

    SettingsComponents = SettingsComponents

    get isVisible() {
      return this.isDialogOpen("settings")
    }

    set isVisible(v) {
      this.__toggleDialog("settings", v)
    }

    genGeneralSettingsTab() {
      return <v-tab-item>
        <v-container>
          <v-layout>
            <v-col>
              <BooruSwitcherPart/>
            </v-col>
          </v-layout>
        </v-container>
      </v-tab-item>
    }

    genBooruSettingsTab() {

      const tabs = Sites.map(site => {
        return <v-tab>
          {site}
        </v-tab>
      })
      const items = Sites.map(site => {
        const component = this.SettingsComponents[`${site.replace(/ /g, "")}SettingsPart`]
        return <v-tab-item>
          <component is={component} />
        </v-tab-item>
      })

      return <v-tab-item>
        <v-tabs>
          {tabs}
          {items}
        </v-tabs>
      </v-tab-item>
    }

    render() {

      return <v-dialog value={this.isVisible} max-width="50vw">
        <v-card>
          <v-card-title>Booru Viewer Settings</v-card-title>

          <v-divider/>

          <v-tabs vertical>
            <v-tab>General Settings</v-tab>
            {this.genGeneralSettingsTab()}

            <v-tab>Booru Settings</v-tab>
            {this.genBooruSettingsTab()}

          </v-tabs>
        </v-card>
      </v-dialog>
    }

  }

</script>
