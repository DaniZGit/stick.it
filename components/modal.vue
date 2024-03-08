<template>
  <teleport to="body">
    <div
      v-if="isRevealed"
      class="fixed top-0 right-0 bottom-0 left-0 flex flex-col bg-black bg-opacity-70 z-50 overflow-y-auto"
      :class="backdropClass"
    >
      <div class="my-auto">
        <!-- Modal Body -->
        <div ref="modal" :class="modalClass" class="modal">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { useConfirmDialog } from "@vueuse/core";

  const { backdropClass, modalClass } = defineProps([
    "backdropClass",
    "modalClass",
  ]);

  const modal = ref(null);

  const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel } =
    useConfirmDialog();

  const { history, undo, redo } = useRefHistory(modal);

  // close modal on click outside
  onClickOutside(modal, (event) => {
    cancel();
  });

  // close modal on ESC key stroke
  onKeyStroke(["Escape"], (e: KeyboardEvent) => {
    e.preventDefault();

    cancel();
  });

  // Append global classes, that disable background scroll
  // Global classes are defined in assets/css/global.css
  onReveal((event) => {
    document.getElementsByTagName("body")[0].classList.add("modal-open");
    console.log("awdawd");
  });

  onCancel((event) => {
    document.getElementsByTagName("body")[0].classList.remove("modal-open");
  });

  defineExpose({
    isRevealed,
    reveal,
    cancel,
  });
</script>

<style scoped></style>
