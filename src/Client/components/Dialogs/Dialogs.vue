<script>
  import { Component, Vue } from "nuxt-property-decorator"
  import AuthDialog from "~/components/Dialogs/AuthDialog"
  import SettingsDialog from "~/components/Dialogs/SettingsDialog"

  @Component({
    components: { AuthDialog, SettingsDialog },
  })
  export default class Dialogs extends Vue {

    render() {
      return <div>
        <auth-dialog/>
        <settings-dialog/>
      </div>
    }

  }

</script>
