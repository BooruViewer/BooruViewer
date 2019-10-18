<script>
  import { Component, Vue } from "nuxt-property-decorator"
  import AuthDialog from "~/components/Dialogs/AuthDialog"

  @Component({
    components: { AuthDialog, }
  })
  export default class Dialogs extends Vue {

    render() {
      return [
        <auth-dialog />
      ]
    }

  }

</script>
