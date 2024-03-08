<template>
  <teleport to="body" v-if="props.alert?.visible">
    <Message
      :severity="props.alert.severity"
      color="red"
      @close="props.alert.visible = false"
      class="w-1/3 mx-auto fixed bottom-0 left-0 right-0 z-50 border-2 border-red-500"
      icon="none"
      :pt="{
        wrapper: {
          class: 'justify-between',
        },
      }"
    >
      <div class="flex flex-col">
        <span>{{ props.alert.message }}</span>
      </div>
    </Message>
  </teleport>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const props = defineProps({
    alert: Object as PropType<ErrorAlert>,
  });
</script>

<style></style>
