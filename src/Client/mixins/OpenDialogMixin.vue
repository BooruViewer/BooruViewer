<!--suppress UnnecessaryReturnStatementJS -->
<script>
  import { Component, Vue, namespace } from "nuxt-property-decorator"
  import { ui } from "~/store/ui"

  const Ui = namespace("ui")

  @Component
  export default class OpenDialogMixin extends Vue {

    @Ui.Mutation(ui.mutations.DialogOpen)
    __openDialog

    @Ui.Getter(ui.getters.DialogOpen)
    __isDialogOpen

    __toggleDialog(dialog, open) {
      if (!open)
        open = !this.isDialogOpen(dialog)

      this.__openDialog({ dialog, open })
    }

    isDialogOpen(dialog) {
      return this.__isDialogOpen(dialog)
    }

    openDialog(dialog) {
      return this.__toggleDialog(dialog, true)
    }

    closeDialog(dialog) {
      return this.__toggleDialog(dialog, false)
    }

  }
</script>
