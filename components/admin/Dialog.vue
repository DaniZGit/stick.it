<template>
  <Dialog v-bind="attrs" :pt="preset">
    <template #container="{ closeCallback }">
      <div class="flex justify-between items-center border-b-2 px-2 py-2">
        <h1 class="text-lg font-bold">
          {{ attrs.header }}
        </h1>
        <Icon
          name="i-mdi:close-circle-outline"
          size="32"
          class="hover:cursor-pointer"
          @click="onClick(closeCallback)"
        />
      </div>
      <div class="overflow-y-auto">
        <slot />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import type { DialogPassThroughOptions } from "primevue/dialog";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits<{
    close: [];
  }>();

  const onClick = (closeCallback: Function) => {
    closeCallback();
    emit("close");
  };

  const preset: DialogPassThroughOptions = {
    mask: "bg-base-black bg-opacity-50 backdrop-blur-sm !z-[9900]",
    root: ({ props }) => ({
      class: ["!z-[9900] w-2/5 bg-base-white rounded-md max-h-[90dvh]"],
    }),
    content: "bg-base-white",
    footer: "bg-base-white",
  };
</script>
